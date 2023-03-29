import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import XPBar from './XPBar';
import { socket } from '@/utils/socket';
import { useUserContext } from '@/UserContext';

const emojis = ['🎉', '🎊', '🎈', '🎭', '🎤', '🎥', '🍿', '🎮', '🕹️', '👾', '🎲', '🃏', '🀄', '😂', '🤣', '😍', '🤔', '😢', '😠', '😎', '🤯', '👍', '👎', '🙌', '🤝', '👏', '👊', '✌️', '👋'];
export const MESSAGE_INPUT_HEIGHT = '86px';

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

const MessageInput: React.FC = ({ className, forwardRef }: { className?: string; forwardRef?: React.Ref<HTMLInputElement>; }) => {
  const { xp, level } = useUserContext();
  const [input, setInput] = useState('');
  const [nextEmoji, setNextEmoji] = useState(getRandomEmoji());
  const isNoob = (cost: number) => xp < cost && level === 1;

  useEffect(() => {
    setNextEmoji(getRandomEmoji());
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    const splitInput = input.split(' ');
    const xpGain = splitInput.length;
    e.preventDefault();
    if (input === '') return;
    if (input.startsWith('/ex ')) {
      const xpCost = 5;
      if (isNoob(xpCost)) return;
      socket.emit('ex-message', input);
      setInput('');
      socket.emit('remove-xp', xpCost);
    } else {
      socket.emit('message', input);
      setInput('');
      socket.emit('add-xp', xpGain);
    }
  };

  const handleEmojiClick = () => {
    const xpCost = 1;
    if (isNoob(xpCost)) return;
    socket.emit('message', nextEmoji);
    socket.emit('remove-xp', xpCost);
    setNextEmoji(getRandomEmoji());
  };

  return (
    <Wrapper className={className}>
      <Form onSubmit={handleSubmit}>
        <EmojiButton type="button" onClick={handleEmojiClick} disabled={isNoob(1)}>
          {nextEmoji}
        </EmojiButton>
        <XPBar />
        <TextInput
          buttonText='Send'
          value={input}
          onChange={setInput}
          onClick={handleSubmit}
          placeholder='Type a message...'
          forwardRef={forwardRef ? forwardRef : null}
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
`;

export default MessageInput;
