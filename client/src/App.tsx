import { useEffect, useState } from 'react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { socket } from './utils/socket';
import styled from 'styled-components';

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
    <Wrapper>
      <MessageList messages={messages} />
      <MessageInput />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100vh;
  overflow: hidden;
`;

export default App;
