import { createContext, useContext, useEffect, useState } from "react";
import { MessageObject } from "./App";
import { socket } from "./utils/socket";

const MessageContext = createContext<{
  messages: MessageObject[];
  addMessage: (message: MessageObject) => void;
}>({
  messages: [],
  addMessage: () => { },
});

export function useMessageContext() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }: { children: React.ReactNode; }) {
  const [messages, setMessages] = useState<MessageObject[]>([]);

  const addMessage = (message: MessageObject) => {
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
