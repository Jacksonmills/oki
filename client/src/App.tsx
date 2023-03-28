import { useEffect, useState } from 'react';
import MessageList, { MessageListProps } from './components/MessageList';
import MessageInput from './components/MessageInput';
import styled from 'styled-components';
import UsernameModal from './components/UsernameModal';
import LiveUsers from './components/LiveUsers';
import Logo from './components/Logo';
import { socket } from './utils/socket';
import { useUserContext } from './UserContext';
import { useMessageContext } from './MessageContext';

export type ServerMessageTypeUnion = 'connected' | 'disconnected';

export type MessageObject = {
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
  const { messages } = useMessageContext();
  const { userCount, userHistory } = useUserContext();
  const [showModal, setShowModal] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
