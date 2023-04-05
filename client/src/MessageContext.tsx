import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "./utils/socket";
import { MessageObj } from "./types";
import { useParams } from "react-router-dom";

const MessageContext = createContext<{
  messages: Map<string, MessageObj[]>;
  roomMessages: MessageObj[];
  addMessage: (message: MessageObj) => void;
}>({
  messages: new Map(),
  roomMessages: [],
  addMessage: () => { },
});

export function useMessageContext() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }: { children: React.ReactNode; }) {
  const { roomId } = useParams<{ roomId: string; }>();
  const [messages, setMessages] = useState<Map<string, MessageObj[]>>(new Map());
  const [roomMessages, setRoomMessages] = useState<MessageObj[]>([]);

  const addMessage = (message: MessageObj) => {
    console.log('message received', message);
    setMessages((prevMessages) => {
      const updatedMessages = new Map(prevMessages);

      const roomMessages = updatedMessages.get(roomId!) || [];
      updatedMessages.set(roomId!, [...roomMessages, message]);

      return updatedMessages;
    });
  };

  useEffect(() => {
    const currentRoomMessages = messages.get(roomId!) || [];
    setRoomMessages(currentRoomMessages);
  }, [messages, roomId]);

  useEffect(() => {
    socket.on('message', addMessage);
    socket.on('ex-message', addMessage);
    return () => {
      socket.off('message', addMessage);
      socket.off('ex-message', addMessage);
    };
  }, [socket]);

  return (
    <MessageContext.Provider value={{ messages, roomMessages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
}
