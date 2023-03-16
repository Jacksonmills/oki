import { useState, useEffect } from 'react';
import { socket } from '../utils/socket';
import styled from 'styled-components';
import TextInput from './TextInput';

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣'];

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [nextEmoji, setNextEmoji] = useState(getRandomEmoji());

  useEffect(() => {
    setNextEmoji(getRandomEmoji());
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (input === '') return;
    socket.emit('message', input);
    setInput('');
  };

  const handleEmojiClick = () => {
    socket.emit('message', nextEmoji);
    setNextEmoji(getRandomEmoji());
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <EmojiButton type="button" onClick={handleEmojiClick}>
          {nextEmoji}
        </EmojiButton>
        <TextInput
          buttonText='Send'
          value={input}
          onChange={setInput}
          onClick={handleSubmit}
          placeholder='Type a message...'
        />
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-basis: 100%;
  padding: 12px;
`;

const EmojiButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 6px;
  aspect-ratio: 1 / 1;
`;

const MessageTextInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  padding-left: 1.2em;
  font-size: ${16 / 16}rem;

  &:hover, &:focus, &:focus-visible {
    border: none;
    outline: none;
  }
`;

const SendButton = styled.button`
  border-radius: 6px;
  background-color: #17171c;
  color: white;
  transition: all 250ms ease;

  &[disabled] {
    background-color: #383846;
    color: grey;
    cursor: not-allowed;

    &:hover, &:focus, &:focus-visible {
      border-color: transparent;
      outline: none;
    }
  }
`;

const MessageInputWrapper = styled.div`
  display: flex;
  flex-basis: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.5em;
  font-size: 1em;
  transition: border-color 0.25s;
  background-color: #2b2a33;

  &:hover {
    border-color: #646cff;
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  &:hover, &:focus, &:focus-visible {
    ${MessageTextInput} {
      border: none;
      outline: none;
    }
  }
`;

export default MessageInput;
