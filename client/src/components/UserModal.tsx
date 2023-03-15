import { MouseEvent } from 'react';
import styled from 'styled-components';
import Username from './Username';

type UserModalProps = {
  users: { username: string; hexcode: string; status: 'online' | 'offline'; }[];
  onClose: () => void;
};

export const UserModal = ({ users, onClose }: UserModalProps) => {
  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <Overlay onClick={handleClickOutside}>
      <Wrapper onClick={(event) => event.stopPropagation()}>
        <Title>User History</Title>
        <UserList>
          {users.map((user, index) => (
            <User key={index} status={user.status}>
              <Username hexcode={user.hexcode}>{user.username}</Username>
              <Status status={user.status}>{user.status}</Status>
            </User>
          ))}
        </UserList>
      </Wrapper>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.94);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Wrapper = styled.div`
  background-color: #333333;
  color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  width: 300px;
`;

const Title = styled.h2`
  margin: 0;
  margin-bottom: 10px;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const User = styled.li<{ status: 'online' | 'offline'; }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Status = styled.span<{ status: 'online' | 'offline'; }>`
  background-color: ${(props) => (props.status === 'online' ? 'green' : 'red')};
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin-left: 8px;
`;

export default UserModal;
