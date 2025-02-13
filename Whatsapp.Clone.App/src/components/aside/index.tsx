import { Search } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Typography,
} from "@mui/material";
import { MenuChat } from "../menu-chat";
import { User } from "../user";
import { useNavigate } from "react-router-dom";
import { IUserChat } from "../../interfaces/IUserChat";
import { useHttp } from "../../hooks/useHttp";
import { useEffect, useRef, useState } from "react";
import { SignalRContext } from "../../router";
import { IChatViewModel } from "../../interfaces/IChat";

interface IProps {
  selected: IUserChat | null;
  onSelected: (user: IUserChat | null) => void;
}

export const Aside = ({ selected, onSelected }: IProps) => {
  const navigate = useNavigate();
  const firstRender = useRef<boolean>(false);
  const [users, setUsers] = useState<IUserChat[]>([]);

  const [sendRequest] = useHttp<IUserChat[]>({
    url: "users",
  });

  useEffect(() => {
    const getUsers = async () => {
      const response = await sendRequest();
      setUsers(response);
    };
    if (!firstRender.current) {
      getUsers();
      firstRender.current = true;
    }
  }, [sendRequest]);

  SignalRContext.useSignalREffect(
    "ReceiveMessage",
    (newMessage: IChatViewModel) => {
      const newUsers = users.map((user) => {
        if (
          newMessage.senderId === user.id ||
          newMessage.receiverId === user.id
        ) {
          user.last = newMessage.message;
          user.date = newMessage.time;
        }
        return user;
      });

      setUsers(newUsers);
    },
    []
  );

  SignalRContext.useSignalREffect(
    "RegisterUser",
    (newUser: IUserChat) => setUsers([...users, newUser]),
    []
  );

  return (
    <Box>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h1" sx={{ fontSize: "1.5em", fontWeight: "bold" }}>
          Chats
        </Typography>
        <MenuChat onSelectedOption={() => onSelected(null)} />
      </Toolbar>

      <OutlinedInput
        id="outlined-adornment-password"
        type="search"
        size="small"
        placeholder="Pesquisar"
        startAdornment={
          <InputAdornment position="start">
            <IconButton aria-label="search" onClick={() => {}} edge="start">
              <Search />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          width: "calc(100% - 1em)",
          margin: "0 0.5em 1em",
        }}
      />

      {users.map((user) => (
        <User
          key={user.id}
          user={user}
          selected={selected === user}
          onSelected={() => {
            onSelected(user);
            navigate(`chat/${user.id}`);
          }}
        />
      ))}
    </Box>
  );
};
