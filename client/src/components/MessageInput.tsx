import { useState, useEffect } from 'react';
import { socket } from '../utils/socket';
import styled from 'styled-components';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('message', input);
    setInput('');
  };

  const handleEmojiClick = () => {
    socket.emit('message', nextEmoji);
    setNextEmoji(getRandomEmoji());
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <EmojiButton type="button" onClick={handleEmojiClick}>
        {nextEmoji}
      </EmojiButton>
      <MessageTextInput
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <SendButton type="submit">Send</SendButton>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  display: flex;
  width: 100vw;
`;

const EmojiButton = styled.button`
  border-radius: 50%;
  padding: 1rem;
  margin-right: 6px;
`;

const MessageTextInput = styled.input`
  margin: 0 auto;
  flex-basis: 100%;
  border: 1px solid transparent;
  border-right: none;
  border-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0.6em 1.2em;
  font-size: 1em;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

const SendButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
`;

export default MessageInput;
