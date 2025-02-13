import { Box, Typography } from "@mui/material";

interface IProps {
  date: string;
}

export const MessageGroup = ({ date }: IProps) => (
  <Box
    borderRadius={2}
    display="flex"
    alignSelf="center"
    sx={{
      color: "text.primary",
      backgroundColor: "background.paper",
      width: "fit-content",
      padding: "6px 12px",
    }}
  >
    <Typography variant="body2">{date}</Typography>
  </Box>
);
