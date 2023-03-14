import { useEffect, useState } from 'react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { socket } from './utils/socket';

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleEvent = (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('user-connected', handleEvent);
    socket.on('message', handleEvent);

    // Cleanup function to remove event listeners when the component is unmounted
    return () => {
      socket.off('user-connected', handleEvent);
      socket.off('message', handleEvent);
    };
  }, []);


  return (
    <div>
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
};

export default App;
