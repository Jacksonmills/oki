import { useEffect, useState } from 'react';
import MessageList, { MessageListProps } from './components/MessageList';
import MessageInput from './components/MessageInput';
import { socket } from './utils/socket';
import styled from 'styled-components';
import UsernameModal from './components/UsernameModal';

type MessageObject = {
  content: string;
  isServerMessage: boolean;
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

    const handleConnectedEvent = (message: string) => {
      addMessage({ content: message, isServerMessage: true });
    };

    const handleUserMessageEvent = (message: MessageObject) => {
      addMessage(message);
    };

    socket.on('user-connected', handleConnectedEvent);
    socket.on('message', handleUserMessageEvent);

    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      socket.off('user-connected', handleConnectedEvent);
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
