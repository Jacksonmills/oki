import { User } from 'react-feather';
import styled from 'styled-components';

type LiveUsersProps = {
  count: number;
};

const LiveUsers = ({ count }: LiveUsersProps) => {
  return (
    <>
      {count !== 0 && (
        <LiveUsersWrapper>
          <StyledUser /> {count}
        </LiveUsersWrapper>
      )}
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