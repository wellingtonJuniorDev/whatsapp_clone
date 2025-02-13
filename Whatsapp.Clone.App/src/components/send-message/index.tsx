import { Grid, OutlinedInput } from "@mui/material";
import { IUserChat } from "../../interfaces/IUserChat";
import { Send } from "@mui/icons-material";
import React, { useState } from "react";
import { useHttp } from "../../hooks/useHttp";
import { IChatRequestViewModel, ITypingUser } from "../../interfaces/IChat";
import { SignalRContext } from "../../router";
import { useAuth } from "../../hooks/useAuth";

interface IProps {
  selectedUser: IUserChat | null;
}

export const SendMessage = ({ selectedUser }: IProps) => {
  const { user } = useAuth();
  const [text, setText] = useState<string>("");
  const [sendRequest, loading] = useHttp({
    url: "chats",
    method: "POST",
  });

  if (!selectedUser) return null;

  const sendMessage = async () => {
    if (loading || text.trim().length === 0) return;

    const message: IChatRequestViewModel = {
      message: text,
      receiverId: selectedUser.id,
    };
    await sendRequest({ payload: message });

    setText("");
  };

  const handleTyping = async (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      await sendMessage();
      return;
    }
    const typing: ITypingUser = {
      senderId: user.id,
      receiverId: selectedUser.id,
    };
    SignalRContext.invoke("TypingUser", typing);
  };

  return (
    <Grid
      container
      spacing={2}
      padding={2}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        pt: 1,
      }}
    >
      <Grid item sm={11.5} xs={11}>
        <OutlinedInput
          id="send-message"
          type="search"
          size="small"
          placeholder="Digite uma mensagem"
          autoComplete="off"
          fullWidth
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleTyping}
        />
      </Grid>

      <Grid item sm={0.5} xs={1}>
        <Send
          sx={{ color: "text.primary", cursor: "pointer" }}
          onClick={sendMessage}
        />
      </Grid>
    </Grid>
  );
};
