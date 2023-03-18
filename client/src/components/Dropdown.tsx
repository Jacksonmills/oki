import React, { useState } from 'react';
import { ChevronDown } from 'react-feather';
import styled from 'styled-components';

type DropdownProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const Dropdown = ({ title, children, defaultOpen = false }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <DropdownWrapper>
      <DropdownTitle onClick={() => setIsOpen(!isOpen)}>
        {title}
        <AnimatedChevron
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </DropdownTitle>
      <DropdownContent isOpen={isOpen}>
        <InnerWrapper>{children}</InnerWrapper>
      </DropdownContent>
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  margin-bottom: 1rem;
`;

const InnerWrapper = styled.div`
  max-height: 20vh;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

const DropdownTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin: 0;
  padding: 0.5rem;
  background-color: #17171c;
  border-radius: 0.25rem;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const DropdownContent = styled.div<{
  isOpen: boolean,
}>`
  max-height: ${({ isOpen }) => (isOpen ? '20vh' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  overflow: hidden;
  padding: 0.5rem;
  border: 4px solid #17171c;
  border-top: none;
  border-radius: 0.25rem;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

const AnimatedChevron = styled(ChevronDown)`
  transition: transform 300ms ease;
`;

export default Dropdown;
