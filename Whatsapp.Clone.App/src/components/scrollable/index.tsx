import { Box } from "@mui/material";
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useCallback,
} from "react";

export interface ScrollMethods {
  scrollToBottom: () => void;
}

interface IProps {
  onScrollUp: () => void;
  children: React.ReactNode;
}

export const Scrollable = forwardRef<ScrollMethods, IProps>(
  ({ onScrollUp, children }: IProps, ref) => {
    const internalRef = useRef<HTMLElement>(null);

    const scrollToBottom = () => {
      const scrollableDiv = internalRef.current;
      if (scrollableDiv) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    const handleScroll = useCallback(() => {
      const scrollableDiv = internalRef.current;
      if (!scrollableDiv || scrollableDiv.scrollTop !== 0) return;

      scrollableDiv.scrollTop = 1;
      onScrollUp();
    }, [onScrollUp]);

    useEffect(() => {
      const scrollableDiv = internalRef.current;
      if (scrollableDiv) {
        scrollableDiv.addEventListener("scroll", handleScroll);
        return () => {
          scrollableDiv.removeEventListener("scroll", handleScroll);
        };
      }
    }, [handleScroll]);

    return (
      <Box
        ref={internalRef}
        className="scroll"
        style={{ height: "100%", overflowY: "auto", padding: "0 1em" }}
      >
        {children}
      </Box>
    );
  }
);
