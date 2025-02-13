import { Box, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { UserAvatar } from "../user-avatar";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UserAvatar name={user.name} />
      <Typography color="text.primary">Nome: {user.name}</Typography>
      <Typography color="text.primary">Email: {user.email}</Typography>
    </Box>
  );
};
