import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import XPBar from './XPBar';
import { socket } from '../utils/socket';
import { useLevelingContext } from '../LevelingContext';
import useLevelingSystem from '../hooks/use-leveling-system';
import { Send } from 'react-feather';
import { useMessageContext } from '../MessageContext';
import { useUserContext } from '../UserContext';
import { useParams } from 'react-router-dom';

type MessageInputProps = {
  className?: string;
};

const emojis = ['🎉', '🎊', '🎈', '🎭', '🎤', '🎥', '🍿', '🎮', '🕹️', '👾', '🎲', '🃏', '🀄', '😂', '🤣', '😍', '🤔', '😢', '😠', '😎', '🤯', '👍', '👎', '🙌', '🤝', '👏', '👊', '✌️', '👋'];
export const MESSAGE_INPUT_HEIGHT = '86px';

const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

const MessageInput: React.ForwardRefRenderFunction<HTMLInputElement, MessageInputProps> = (
  { className },
  forwardRef,
) => {
  const { roomId } = useParams<{ roomId: string; }>();
  const { userHistory } = useUserContext();
  const { addMessage } = useMessageContext();
  const { xp, level, addXp, removeXp } = useLevelingContext();
  const [input, setInput] = useState('');
  const [nextEmoji, setNextEmoji] = useState(getRandomEmoji());
  const isNoob = (cost: number) => xp < cost && level === 0;

  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardRef, () => inputRef.current as HTMLInputElement, []);

  useEffect(() => {
    setNextEmoji(getRandomEmoji());
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    const xpGain = 1;
    e.preventDefault();
    if (input === '') return;
    if (input.startsWith('/ex ')) {
      const xpCost = 5;
      if (isNoob(xpCost)) return;
      socket.emit('ex-message', input, roomId);
      setInput('');
      socket.emit('remove-xp', xpCost);
      removeXp(xpCost);
    } else {
      socket.emit('message', input, roomId);
      setInput('');
      socket.emit('add-xp', xpGain);
      addXp(xpGain);
    }
    inputRef.current?.focus();
  };

  const handleEmojiClick = () => {
    const xpCost = 1;
    if (isNoob(xpCost)) return;
    socket.emit('message', nextEmoji, roomId);
    socket.emit('remove-xp', xpCost);
    removeXp(xpCost);
    setNextEmoji(getRandomEmoji());
    inputRef.current?.focus();
  };

  return (
    <Wrapper className={className}>
      <Form onSubmit={handleSubmit}>
        <EmojiButton type="button" onClick={handleEmojiClick} disabled={isNoob(1)}>
          {nextEmoji}
        </EmojiButton>
        <XPBar />
        <TextInput
          buttonContent={<Send />}
          value={input}
          onChange={setInput}
          placeholder='Type a message...'
          forwardRef={inputRef}
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

export default React.forwardRef(MessageInput);
