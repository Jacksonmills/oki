import { useEffect, useState } from 'react';
import MessageList, { MessageListProps } from './components/MessageList';
import MessageInput from './components/MessageInput';
import styled from 'styled-components';
import UsernameModal from './components/UsernameModal';
import LiveUsers from './components/LiveUsers';
import Logo from './components/Logo';
import { socket } from './utils/socket';

export type ServerMessageTypeUnion = 'connected' | 'disconnected';

type MessageObject = {
  content: string;
  isServerMessage: boolean;
  type: ServerMessageTypeUnion;
  username?: string;
  hexcode?: string;
};

export interface UserObj {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  disconnectTime?: Date;
}

export interface UserHistory extends UserObj {
  id: string;
}

const App = () => {
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [showModal, setShowModal] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [userHistory, setUserHistory] = useState<UserHistory[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const addMessage = (message: MessageObject) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserConnectionEvent = (eventType: 'connected' | 'disconnected', data: { message: string, username: string, hexcode: string; }) => {
      const now = new Date();
      addMessage({
        content: data.message,
        isServerMessage: true,
        type: eventType,
        username: data.username,
        hexcode: data.hexcode
      });
      setUserHistory((prevUserHistory) => {
        return prevUserHistory.map((user) => {
          if (user.username === data.username) {
            return { ...user, status: eventType === 'connected' ? 'online' : 'offline', lastSeen: now };
          }
          return user;
        });
      });
      socket.emit('get-live-users-count');
    };

    const handleConnection = (data: { message: string, username: string, hexcode: string; }) => {
      handleUserConnectionEvent('connected', data);
    };

    const handleDisconnection = (data: { message: string, username: string, hexcode: string; }) => {
      handleUserConnectionEvent('disconnected', data);
    };

    const handleUserHistory = (userHistory: UserHistory[]) => {
      const now = new Date();
      const updatedUserHistory = userHistory.map(user => ({
        ...user,
        lastSeen: user.lastSeen ? new Date(user.lastSeen) : now,
        disconnectTime: user.disconnectTime ? new Date(user.disconnectTime) : undefined
      }));
      setUserHistory(updatedUserHistory);
    };

    socket.emit('get-live-users-count');

    socket.on('user-history', handleUserHistory);
    socket.on('user-connected', (data) => handleConnection({ ...data, type: "connected" }));
    socket.on('user-disconnected', (data) => handleDisconnection({ ...data, type: "disconnected" }));
    socket.on('message', addMessage);
    socket.on('live-users-count', setUserCount);

    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      socket.off('user-history', handleUserHistory);
      socket.off('user-connected', handleConnection);
      socket.off('user-disconnected', handleDisconnection);
      socket.off('message', addMessage);
      socket.off('live-users-count', setUserCount);
    };
  }, []);


  const handleModalSubmit = (username: string, hexcode: string) => {
    console.log('submitting modal', username, hexcode);
    socket.emit('set-username', { username, hexcode });
    socket.once('username-set', () => {
      setShowModal(false);
    });
    socket.once('username-invalid', () => {
      setErrorMessage('Invalid username. Please choose a different username.');
    });
  };

  const getOnlineUserColors = () => {
    return userHistory
      .filter((user) => user.status === 'online')
      .map((user) => user.hexcode);
  };

  return (
    <Wrapper>
      <Header>
        <HeaderContent>
          <LogoWrapper>
            <StyledLogo />
            <LogoText>Oki</LogoText>
          </LogoWrapper>
          <LiveUsers
            count={userCount}
            userHistory={userHistory}
            showUserModal={showUserModal}
            onToggleModal={() => setShowUserModal(!showUserModal)}
          />
        </HeaderContent>
      </Header>
      <StyledMessageList messages={messages} />
      <StyledMessageInput />

      {showModal && (
        <UsernameModal
          onSubmit={handleModalSubmit}
          userColors={getOnlineUserColors()}
          errorMessage={errorMessage}
        />
      )}
    </Wrapper>
  );
};

const StyledLogo = styled(Logo)`
  width: 1em;
  height: 1em;
`;
const LogoText = styled.h1`
  display: none;
  font-size: 18px;
  color: #fff;
  margin: 0;

  @media (min-width: 768px) {
    display: inline-flex;
  }
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Header = styled.header`
  width: 100%;
`;

const StyledMessageList = styled(MessageList)``;
const StyledMessageInput = styled(MessageInput)`
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  ${Header}, ${StyledMessageInput} {
    flex-shrink: 0;
  }
  ${StyledMessageList} {
    flex-grow: 1;
    overflow-y: auto;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #2b2a33;
  padding: 8px 12px;
`;

export default App;
