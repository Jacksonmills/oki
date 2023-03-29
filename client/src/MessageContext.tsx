import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { MessageObj } from "@/types";

const MessageContext = createContext<{
  messages: MessageObj[];
  addMessage: (message: MessageObj) => void;
}>({
  messages: [],
  addMessage: () => { },
});

export function useMessageContext() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }: { children: React.ReactNode; }) {
  const [messages, setMessages] = useState<MessageObj[]>([]);

  const addMessage = (message: MessageObj) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    socket.on('message', addMessage);
    return () => {
      socket.off('message', addMessage);
    };
  }, [socket]);

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
}
