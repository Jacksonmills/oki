import { useEffect, useState } from 'react';
import MessageList, { MessageListProps } from './components/MessageList';
import MessageInput from './components/MessageInput';
import { socket } from './utils/socket';
import styled from 'styled-components';
import UsernameModal from './components/UsernameModal';
import LiveUsers from './components/LiveUsers';

export type ServerMessageTypeUnion = 'connected' | 'disconnected';

type MessageObject = {
  content: string;
  isServerMessage: boolean;
  type: ServerMessageTypeUnion;
  username?: string;
  hexcode?: string;
};

type UserHistoryObject = {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
};

const App = () => {
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [showModal, setShowModal] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [userHistory, setUserHistory] = useState<UserHistoryObject[]>([]);

  useEffect(() => {
    const addMessage = (message: MessageObject) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleConnectionEvent = (data: { type: ServerMessageTypeUnion; message: string, username: string, hexcode: string; }) => {
      addMessage({
        content: data.message,
        isServerMessage: true,
        type: data.type,
        username: data.username,
        hexcode: data.hexcode
      });
      socket.emit('get-live-users-count');
    };

    socket.emit('get-live-users-count');

    socket.on('user-history', setUserHistory);
    socket.on('user-connected', (data) => handleConnectionEvent({ ...data, type: "connected" }));
    socket.on('user-disconnected', (data) => handleConnectionEvent({ ...data, type: "disconnected" }));
    socket.on('message', addMessage);
    socket.on('live-users-count', setUserCount);

    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      socket.off('user-history', setUserHistory);
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('message', addMessage);
      socket.off('live-users-count', setUserCount);
    };
  }, []);


  const handleModalSubmit = (username: string, hexcode: string) => {
    socket.emit('set-username', { username, hexcode });
    setShowModal(false);
  };

  return (
    <Wrapper>
      {showModal && (<UsernameModal onSubmit={handleModalSubmit} />)}
      <LiveUsers
        count={userCount}
        userHistory={userHistory}
        showUserModal={showUserModal}
        onToggleModal={() => setShowUserModal(!showUserModal)}
      />
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
