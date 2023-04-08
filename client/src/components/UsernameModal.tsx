import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import TextInput from './TextInput';
import ColorSwatchPicker from './ColorSwatchPicker';
import Error from './Error';
import { COLORS } from '../constants';

type UsernameModalProps = {
  onSubmit: (username: string, hexcode: string) => void,
  errorMessage: string | null;
};

const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit, errorMessage }) => {
  const [username, setUsername] = useState('');
  const [hexcode, setHexcode] = useState('#ff0006');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '') return;
    onSubmit(username, hexcode);
  };

  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <Heading>Welcome! Enjoy the fun! 😄</Heading>
        <TextInput
          buttonContent='Join'
          value={username}
          onChange={setUsername}
          onClick={handleSubmit}
          placeholder='Type a username...'
        />
        {errorMessage && (<Error>{errorMessage}</Error>)}
        <ColorHeading>Pick a color!</ColorHeading>
        <ColorSwatchPicker
          onSelect={setHexcode}
          currentHexcode={hexcode}
        />
      </Form>
    </Modal>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  > * {
    margin: 0;
  }
`;

const Heading = styled.h2`
  text-align: center;
  font-size: ${26 / 16}rem;
`;

const ColorHeading = styled.h3`
  text-align: center;
  font-size: ${22 / 16}rem;
`;

export default UsernameModal;