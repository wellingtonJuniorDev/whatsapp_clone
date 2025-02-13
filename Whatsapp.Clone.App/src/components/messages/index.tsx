import { Message } from "../message";
import { useCallback, useEffect, useRef, useState } from "react";
import { SignalRContext } from "../../router";
import { IChatViewModel } from "../../interfaces/IChat";
import { delay, groupBy, isEqual, uniqBy } from "lodash";
import { MessageGroup } from "./message-group";
import { MessageWrapper } from "./styles";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useHttp } from "../../hooks/useHttp";
import { IPagination, ISearch } from "../../interfaces/IPagination";
import { Scrollable, ScrollMethods } from "../scrollable";

interface IUserFilter {
  userId: string;
  search: ISearch;
}

const defaultSearch: ISearch = {
  pageNumber: 0,
  pageSize: 15,
  hasNext: true,
};

export const Messages = () => {
  const { userId: selectedUserId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState<IChatViewModel[]>([]);
  const [loadedUsers, setLoadedUsers] = useState<IUserFilter[]>([]);

  const firstUserRendered = useRef<string>("");
  const scrollableRef = useRef<ScrollMethods>(null);
  const scrollToBottom = () => scrollableRef?.current?.scrollToBottom();

  SignalRContext.useSignalREffect(
    "ReceiveMessage",
    (newMessage: IChatViewModel) => {
      setMessages([...messages, newMessage]);
      delay(scrollToBottom, 100);
    },
    []
  );

  const [sendRequest, loading] = useHttp<IPagination<IChatViewModel>>({
    method: "GET",
    url: `chats/${selectedUserId}`,
  });

  const messageGroups = groupBy(
    messages.filter(
      (msg) =>
        `${msg.senderId}-${msg.receiverId}` ===
          `${selectedUserId}-${user.id}` ||
        `${msg.receiverId}-${msg.senderId}` === `${selectedUserId}-${user.id}`
    ),
    "date"
  );

  const updateMessages = useCallback(
    (pagination: IPagination<IChatViewModel>, scrollDown: boolean = true) => {
      const newMessages = uniqBy(pagination.itens.concat(messages), "id");

      if (!isEqual(newMessages, messages)) {
        setMessages(newMessages);
        const newLoadedUsers = [
          ...loadedUsers.filter((p) => p.userId !== selectedUserId),
          {
            userId: selectedUserId as string,
            search: {
              pageNumber: pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              hasNext: pagination.hasNext,
            },
          },
        ];
        setLoadedUsers(newLoadedUsers);
        if (scrollDown) delay(scrollToBottom, 100);
      }
    },
    [messages, selectedUserId, loadedUsers]
  );

  const getMoreMessages = useCallback(async () => {
    const currentFilter = loadedUsers.find((l) => l.userId === selectedUserId);
    if (!currentFilter?.search.hasNext) return;

    const result = await sendRequest({ params: currentFilter.search });
    updateMessages(result, false);
  }, [selectedUserId, loadedUsers, sendRequest, updateMessages]);

  useEffect(() => {
    const searchMessages = async () => {
      if (
        !selectedUserId ||
        loading ||
        loadedUsers.some((l) => l.userId === selectedUserId) ||
        firstUserRendered.current === selectedUserId
      ) {
        return;
      }

      if (Object.keys(messageGroups).length === 0) {
        firstUserRendered.current = selectedUserId;

        const result = await sendRequest({ params: defaultSearch });
        updateMessages(result);
      }
    };

    searchMessages();
  }, [
    selectedUserId,
    messageGroups,
    sendRequest,
    loading,
    loadedUsers,
    updateMessages,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedUserId]);

  return (
    <Scrollable onScrollUp={getMoreMessages} ref={scrollableRef}>
      {Object.keys(messageGroups).map((date, index) => (
        <MessageWrapper key={`${date}-${index}`}>
          <MessageGroup date={date} />

          {messageGroups[date].map((msg) => (
            <Message key={msg.id} chatMessage={msg} />
          ))}
        </MessageWrapper>
      ))}
    </Scrollable>
  );
};
