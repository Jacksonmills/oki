import React, { useState } from 'react';
import styled from 'styled-components';

type UsernameModalProps = {
  onSubmit: (username: string, hexcode: string) => void,
};

const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [hexcode, setHexcode] = useState('#ff0006');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, hexcode);
  };

  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <h2>Welcome! Enjoy the fun! 😄</h2>
        <input
          type="text"
          placeholder="Temporary name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="color"
          value={hexcode}
          onChange={(e) => setHexcode(e.target.value)}
        />
        <button type="submit">Submit</button>
      </Form>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.929);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  background-color: #333333;
  color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default UsernameModal;