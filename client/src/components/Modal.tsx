import React, { ElementType, MouseEvent } from 'react';
import styled from 'styled-components';

type ModalProps = {
  children: React.ReactNode,
  onClose?: () => void,
  as?: ElementType,
};

const Modal = ({ children, onClose, as }: ModalProps) => {
  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (onClose) onClose();
  };

  return (
    <Overlay onClick={handleClickOutside}>
      <Wrapper as={as} onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation()}>
        {children}
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
  cursor: pointer;
`;

const Wrapper = styled.div<{
  as?: ElementType;
}>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #333333;
  color: #ffffff;
  border-radius: 4px;
  cursor: initial;
  
  padding: 12px;
  width: 80vw;
  @media (min-width: 768px) {
    padding: 22px;
    width: 48vw;
  }

  > * {
    margin: 0;
  }
`;

export default Modal;