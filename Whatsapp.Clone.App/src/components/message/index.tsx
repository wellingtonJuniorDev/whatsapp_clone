import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../hooks/useAuth";
import { IChatViewModel } from "../../interfaces/IChat";

interface IProps {
  chatMessage: IChatViewModel;
}

export const Message = ({ chatMessage }: IProps) => {
  const { message, senderId, time } = chatMessage;
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: senderId === user.id ? "flex-end" : "flex-start",
        position: "relative",
        mb: 0.5,
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          padding: "10px",
          bgcolor: senderId === user.id ? "primary.main" : "background.paper",
          color: "text.primary",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="body1" sx={{ cursor: "pointer" }}>
          {message}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ mt: 0.5, color: "gray" }}>
        {time}
      </Typography>
    </Box>
  );
};
