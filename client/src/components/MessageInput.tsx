import { useState, useEffect } from 'react';
import { socket } from '../utils/socket';

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
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={handleEmojiClick}>
        {nextEmoji}
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
