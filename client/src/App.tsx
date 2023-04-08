import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from './components/Logo';
import Button from './components/Button';
import Modal from './components/Modal';
import TextInput from './components/TextInput';
import { useNavigate } from 'react-router-dom';
import { socket } from './utils/socket';
import Error from './components/Error';
import Layout from './components/Layout';
import VisuallyHidden from './components/VisuallyHidden';
import { Users } from 'react-feather';
import { createPortal } from 'react-dom';

const App = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomNameToCreate, setRoomNameToCreate] = useState('');
  const [roomNameToJoin, setRoomNameToJoin] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateRoomSubmit = () => {
    navigate(`/room/${roomNameToCreate}`);
  };

  const handleJoinRoomSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    socket.emit('check-room-exists', roomNameToJoin, (userCount: number) => {
      if (userCount > 0 || roomNameToJoin === 'public') {
        navigate(`/room/${roomNameToJoin}`);
      }
      if (userCount <= 0) {
        setJoinError('Room does not exist');
      }
    });
  };

  return (
    <Layout>
      <Wrapper>
        <Content>
          <Hero>
            <Heading><Logo />OKI</Heading>
            <p>Anonymous, temporary, Twitch-like chat experiences for live events.</p>
          </Hero>
          <Actions>
            <Button onClick={() => setShowCreateModal(!showCreateModal)}>Create Room</Button>
            <Button onClick={() => setShowJoinModal(!showJoinModal)}>Join Room</Button>
          </Actions>
        </Content>

        {showCreateModal && createPortal(
          <Modal onClose={() => setShowCreateModal(!showCreateModal)}>
            <ModalTitle>Create a room</ModalTitle>
            <form onSubmit={handleCreateRoomSubmit}>
              <TextInput
                placeholder="Enter a room name"
                buttonContent="Create"
                value={roomNameToCreate}
                onChange={setRoomNameToCreate}
              />
            </form>
          </Modal>,
          document.body
        )}
        {showJoinModal && createPortal(
          <Modal onClose={() => setShowJoinModal(!showJoinModal)}>
            <ModalTitle>Join a room</ModalTitle>
            <JoinActions>
              <PublicRoomLink as="a" href="/room/public">
                Join public chatroom
                <Users />
              </PublicRoomLink>
              <form onSubmit={handleJoinRoomSubmit}>
                <TextInput
                  placeholder="Enter room name to join"
                  buttonContent="Join"
                  value={roomNameToJoin}
                  onChange={setRoomNameToJoin}
                />
                {joinError && <Error>{joinError}</Error>}
              </form>
            </JoinActions>
          </Modal>,
          document.body
        )}
      </Wrapper>
    </Layout>
  );
};

const ModalTitle = styled.h2`
  text-align: center;
  font-size: ${26 / 16}rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const JoinActions = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
`;

const PublicRoomLink = styled(Button)`
  gap: 12px;
  border-radius: 8px;
  text-decoration: none;

  svg {
    width: 1em;
    height: 1em;
  }
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    text-align: center;
  }
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: ${44 / 16}rem;

  svg {
    width: 2em;
    height: 2em;
  }
`;

export default App;
