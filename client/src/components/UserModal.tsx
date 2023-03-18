import { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Username from './Username';
import Modal from './Modal';
import { X } from 'react-feather';

export type UserObj = {
  username: string;
  hexcode: string;
  status: 'online' | 'offline';
  lastSeen: Date;
};

type UserModalProps = {
  users: UserObj[];
  onClose: () => void;
};

export const UserModal = ({ users, onClose }: UserModalProps) => {
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const filterOfflineUsers = () => {
      const now = new Date();
      let oneHour = 60 * 60 * 1000;

      const updatedUsers: UserObj[] = users.reduce((acc: UserObj[], user: UserObj) => {
        const timeDifference = now.getTime() - user.lastSeen.getTime();
        if (
          user.status !== 'offline' ||
          (user.lastSeen && timeDifference < oneHour)
        ) {
          acc.push(user);
        }
        return acc;
      }, []);

      setFilteredUsers(updatedUsers);
    };

    filterOfflineUsers();
    const timer = setInterval(() => {
      filterOfflineUsers();
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [users]);

  const onlineUsers = filteredUsers.filter(user => user.status === 'online');
  const offlineUsers = filteredUsers.filter(user => user.status === 'offline');

  return (
    <Modal onClose={onClose}>
      <Title>
        User History
        <CloseButton onClick={onClose}>
          <X />
        </CloseButton>
      </Title>
      <UserList>
        {onlineUsers.map((user, index) => (
          <User key={index} status={user.status}>
            <Username hexcode={user.hexcode}>{user.username}</Username>
            <Status>
              <Dot status={user.status} />{user.status}
            </Status>
          </User>
        ))}
      </UserList>
      <UserList>
        {offlineUsers.map((user, index) => (
          <User key={index} status={user.status}>
            <Username hexcode={user.hexcode}>{user.username}</Username>
            <Status>
              <Dot status={user.status} />{user.status}
            </Status>
          </User>
        ))}
      </UserList>
    </Modal>
  );
};

const Title = styled.h2`
  margin: 0;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const User = styled.li<{ status: 'online' | 'offline'; }>`
  display: flex;
  align-items: baseline;
  gap: 8px;
  background-color: #17171c;
  border-radius: 0.25rem;
  padding: 10px;
`;

const Dot = styled.div<{ status: 'online' | 'offline'; }>`
  background-color: ${(props) => (props.status === 'online' ? 'green' : 'red')};
  border-radius: 50%;
  width: 10px;
  height: 10px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 6px;
  aspect-ratio: 1 / 1;
  padding: 0.25rem;
  width: 1em;
  height: 1em;
`;

export default UserModal;
