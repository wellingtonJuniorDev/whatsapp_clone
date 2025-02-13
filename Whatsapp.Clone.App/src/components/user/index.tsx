import { Box } from "@mui/material";
import { UserAvatar } from "../user-avatar";
import { IUserChat } from "../../interfaces/IUserChat";
import { delay, truncate } from "lodash";
import { SignalRContext } from "../../router";
import { ITypingUser } from "../../interfaces/IChat";
import { useEffect, useState } from "react";

interface IProps {
  selected: boolean;
  user: IUserChat;
  onSelected: () => void;
}

export const User = ({ selected, user, onSelected }: IProps) => {
  const [isTyping, setTyping] = useState<boolean>(false);

  SignalRContext.useSignalREffect(
    "TypingUser",
    (model: ITypingUser) => {
      if (model.senderId === user.id) {
        setTyping(true);
      }
    },
    []
  );

  useEffect(() => {
    if (isTyping) {
      delay(() => setTyping(false), 1000);
    }
  }, [isTyping]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "calc(100% - 1em)",
        margin: "0 0.5em 0.2em",
        cursor: "pointer",
        backgroundColor: selected ? "background.paper" : "",
      }}
      onClick={onSelected}
    >
      <UserAvatar name={user.name} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderTop: "1px solid #bdbdbd",
          borderBottom: "1px solid #bdbdbd",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "0.8em",
          }}
        >
          <Box component="span">{user.name}</Box>
          <Box sx={{ fontSize: "small" }} component="span">
            {user.date}
          </Box>
        </Box>

        <Box>
          {isTyping ? (
            <Box
              sx={{ fontSize: "small", fontWeight: "bold" }}
              component="span"
            >
              {user.name} está digitando...
            </Box>
          ) : (
            <Box sx={{ fontSize: "small" }} component="span">
              {truncate(user.last, { length: 30, omission: "..." })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
