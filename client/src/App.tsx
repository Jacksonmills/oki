import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useUserContext } from './UserContext';
import { socket } from './utils/socket';
import LiveUsers from './components/LiveUsers';
import UsernameModal from './components/UsernameModal';
import Logo2 from './components/Logo2';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const App = () => {
  const { userCount, userHistory } = useUserContext();
  const [showModal, setShowModal] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  return (
    <Wrapper>
      <Header>
        <HeaderContent>
          <LogoWrapper>
            <StyledLogo />
            <LogoText>OKI</LogoText>
          </LogoWrapper>
          <LiveUsers
            count={userCount}
            userHistory={userHistory}
            showUserModal={showUserModal}
            onToggleModal={() => setShowUserModal(!showUserModal)}
          />
        </HeaderContent>
      </Header>
      <StyledMessageList />
      <StyledMessageInput forwardRef={inputRef} />

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

const StyledLogo = styled(Logo2)`
  width: 1em;
  height: 1em;
`;
const LogoText = styled.h1`
  display: none;
  font-size: 18px;
  color: #fff;
  margin: 0;
  font-family: 'gridular';

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
const StyledMessageInput = styled(MessageInput) <{ forwardRef: React.Ref<HTMLInputElement>; }>``;

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
