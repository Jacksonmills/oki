import React, { useState } from 'react';
import styled from 'styled-components';
import Logo2 from './components/Logo2';
import Button from './components/Button';
import Modal from './components/Modal';
import TextInput from './components/TextInput';
import { useNavigate } from 'react-router-dom';
import { socket } from './utils/socket';
import Error from './components/Error';

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
    <Wrapper>
      <Content>
        <Heading><Logo2 />OKI</Heading>
        <Actions>
          <Button onClick={() => setShowCreateModal(!showCreateModal)}>Create Room</Button>
          <Button onClick={() => setShowJoinModal(!showJoinModal)}>Join Room</Button>
        </Actions>
      </Content>

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(!showCreateModal)}>
          <h1>Create a room</h1>
          <form onSubmit={handleCreateRoomSubmit}>
            <TextInput
              placeholder="Enter a room name"
              buttonContent="Create"
              value={roomNameToCreate}
              onChange={setRoomNameToCreate}
            />
          </form>
        </Modal>
      )}
      {showJoinModal && (
        <Modal onClose={() => setShowJoinModal(!showJoinModal)}>
          <h1>Join a room</h1>
          <JoinActions>
            <a href="/room/public">Join public chat</a>
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
        </Modal>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-items: center;
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
