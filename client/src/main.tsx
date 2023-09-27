import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './UserContext';
import { MessageProvider } from './MessageContext';
import GlobalStyles from './components/GlobalStyles';
import { LevelingProvider } from './LevelingContext';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';

function RoomPage() {
  const { roomId } = useParams();
  if (roomId === undefined) return <div>Room not found</div>;
  return <ChatRoom roomId={roomId} />;
}

const Root = () => {
  return (
    <React.StrictMode>
      <MessageProvider>
        <UserProvider>
          <LevelingProvider>
            <GlobalStyles />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/room">
                  <Route path=":roomId" element={<RoomPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </LevelingProvider>
        </UserProvider>
      </MessageProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
