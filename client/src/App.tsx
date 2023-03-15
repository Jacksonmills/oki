import { useEffect, useState } from 'react';
import MessageList, { MessageListProps } from './components/MessageList';
import MessageInput from './components/MessageInput';
import { socket } from './utils/socket';
import styled from 'styled-components';
import UsernameModal from './components/UsernameModal';

export type ServerMessageTypeUnion = 'connected' | 'disconnected';

type MessageObject = {
  content: string;
  isServerMessage: boolean;
  type: ServerMessageTypeUnion;
  username?: string;
  hexcode?: string;
};

const App = () => {
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const addMessage = (message: MessageObject) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
    };

    const handleConnectionEvent = (data: { type: ServerMessageTypeUnion; message: string, username: string, hexcode: string; }) => {
      addMessage({
        content: data.message,
        isServerMessage: true,
        type: data.type,
        username: data.username,
        hexcode: data.hexcode
      });
    };

    const handleUserMessageEvent = (message: MessageObject) => {
      addMessage(message);
    };

    socket.on('user-connected', (data) => handleConnectionEvent({ ...data, type: "connected" }));
    socket.on('user-disconnected', (data) => handleConnectionEvent({ ...data, type: "disconnected" }));
    socket.on('message', handleUserMessageEvent);

    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('message', handleUserMessageEvent);
    };
  }, []);

  const handleModalSubmit = (username: string, hexcode: string) => {
    socket.emit('set-username', { username, hexcode });
    setShowModal(false);
  };

  return (
    <Wrapper>
      {showModal && (<UsernameModal onSubmit={handleModalSubmit} />)}
      <MessageList messages={messages} />
      <MessageInput />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100vh;
  overflow: hidden;
`;

export default App;
