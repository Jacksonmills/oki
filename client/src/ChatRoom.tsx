import React, { useEffect, useRef, useState } from 'react';
import { socket } from './utils/socket';
import styled from 'styled-components';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import Logo from './components/Logo';
import UsernameModal from './components/UsernameModal';
import LiveUsers from './components/LiveUsers';
import Layout from './components/Layout';

type ChatRoomProps = {
  roomId: string;
};

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [showModal, setShowModal] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleModalSubmit = (username: string, hexcode: string) => {
    socket.emit('set-username', { username, hexcode, roomId });
    socket.once('username-set', () => {
      setShowModal(false);
    });
    socket.once('username-invalid', () => {
      setErrorMessage('Invalid username. Please choose a different username.');
    });
  };

  useEffect(() => {
    if (!showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);
  return (
    <Wrapper>
      <Layout>
        <StyledMessageList />
        <StyledMessageInput ref={inputRef} />

        {showModal && (
          <UsernameModal
            onSubmit={handleModalSubmit}
            errorMessage={errorMessage}
          />
        )}
      </Layout>
    </Wrapper>
  );
};



const StyledMessageList = styled(MessageList)``;
const StyledMessageInput = styled(MessageInput) <{
  ref: React.RefObject<HTMLInputElement>;
}>``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default ChatRoom;
