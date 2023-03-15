import { MouseEvent } from 'react';
import { User } from 'react-feather';
import styled from 'styled-components';
import { UserModal } from './UserModal';

type LiveUsersProps = {
  count: number;
  userHistory: { username: string; hexcode: string; status: 'online' | 'offline'; }[];
  onToggleModal: () => void;
  showUserModal: boolean;
};

const LiveUsers = ({ count, userHistory, showUserModal, onToggleModal }: LiveUsersProps) => {
  return (
    <>
      {count !== 0 && (
        <LiveUsersWrapper onClick={onToggleModal}>
          <StyledUser /> {count}
        </LiveUsersWrapper>
      )}
      {showUserModal && <UserModal users={userHistory} onClose={onToggleModal} />}
    </>
  );
};

const StyledUser = styled(User)`
  width: ${18 / 16}rem;
  height: ${18 / 16}rem;
`;
const LiveUsersWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: #171717;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  color: red;
  font-weight: bold;
  font-size: 1rem;
`;

export default LiveUsers;
