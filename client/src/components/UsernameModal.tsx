import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import TextInput from './TextInput';
import ColorSwatchPicker from './ColorSwatchPicker';

type UsernameModalProps = {
  onSubmit: (username: string, hexcode: string) => void,
  userColors: string[],
};

const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit, userColors }) => {
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
          buttonText='Join'
          value={username}
          onChange={setUsername}
          onClick={handleSubmit}
          placeholder='Type a username...'
        />
        <ColorHeading>Pick a color!</ColorHeading>
        <ColorSwatchPicker
          userColors={userColors}
          onSelect={setHexcode}
          currentHexcode={hexcode}
        />
      </Form>
    </Modal>
  );
};

const Form = styled.form`
  background-color: #333333;
  color: #ffffff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  > * {
    margin: 0;
  }
`;

const Heading = styled.h2`
  text-align: center;
`;

const ColorHeading = styled.h3`
  text-align: center;
`;

export default UsernameModal;