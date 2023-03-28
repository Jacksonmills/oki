import React from 'react';
import styled from 'styled-components';
import Username from './Username';
import Modal from './Modal';
import { X } from 'react-feather';
import Dropdown from './Dropdown';
import { useUserContext } from '../UserContext';

type UserModalProps = {
  onClose: () => void;
};

export const UserModal = ({ onClose }: UserModalProps) => {
  const { onlineUsers, offlineUsers } = useUserContext();

  return (
    <Modal onClose={onClose}>
      <Title>
        User History
        <CloseButton onClick={onClose}>
          <X />
        </CloseButton>
      </Title>
      <Dropdown title={`Online Users (${onlineUsers.length})`} defaultOpen>
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
      </Dropdown>
      {offlineUsers.length > 0 && (
        <Dropdown title={`Offline Users (${offlineUsers.length})`} defaultOpen>
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
        </Dropdown>
      )}
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
