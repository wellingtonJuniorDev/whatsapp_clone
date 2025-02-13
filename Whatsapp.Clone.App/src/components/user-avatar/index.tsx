import { Avatar, Box } from "@mui/material";

interface IProps {
  name: string;
}

export const UserAvatar = ({ name }: IProps) => {
  const stringAvatar = () => {
    const avatarName = name.includes(' ')
      ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
      : name.substring(0, 2);

    return {
      children: avatarName,
    };
  };

  return (
    <Box sx={{ padding: "0.5em" }}>
      <Avatar style={{ width: "49px", height: "49px" }} {...stringAvatar()} />
    </Box>
  );
};
