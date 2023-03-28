import { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import XPBar from './XPBar';
import { socket } from '../utils/socket';
import { useUserContext } from '../UserContext';

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣'];
export const MESSAGE_INPUT_HEIGHT = '86px';

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

const MessageInput: React.FC = ({ className }: { className?: string; }) => {
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
    socket.emit('add-xp', 1);
  };

  const handleEmojiClick = () => {
    socket.emit('message', nextEmoji);
    socket.emit('add-xp', 1);
    setNextEmoji(getRandomEmoji());
  };

  return (
    <Wrapper className={className}>
      <Form onSubmit={handleSubmit}>
        <EmojiButton type="button" onClick={handleEmojiClick}>
          {nextEmoji}
        </EmojiButton>
        <XPBar />
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
  position: fixed;
  bottom: 0;
  background-color: #242424;
`;

const Form = styled.form`
  display: flex;
  flex-basis: 100%;
  padding: 12px;
`;

const EmojiButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 6px;
  aspect-ratio: 1 / 1;
`;

export default MessageInput;
