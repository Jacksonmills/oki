import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import LiveUsers from './LiveUsers';
import { useParams } from 'react-router-dom';
import Button from './Button';

const Header = () => {
  const { roomId } = useParams<{ roomId: string; }>();
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <Wrapper>
      <HeaderContent>
        <LogoWrapper>
          <StyledLogo />
          <LogoText>
            {roomId ? `OKI Room: ${roomId}` : 'OKI'}
          </LogoText>
        </LogoWrapper>
        <LiveUsers
          showUserModal={showUserModal}
          onToggleModal={() => setShowUserModal(!showUserModal)}
        />
      </HeaderContent>
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
  user-select: none;

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

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #2b2a33;
  padding: 8px 12px;
`;

export default Header;