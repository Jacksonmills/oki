import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './UserContext';
import { MessageProvider } from './MessageContext';
import GlobalStyles from './components/GlobalStyles';
import { LevelingProvider } from './LevelingContext';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';

function RoomPage() {
  const { roomId } = useParams();
  if (roomId === undefined) return <div>Room not found</div>;
  return <ChatRoom roomId={roomId} />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MessageProvider>
      <UserProvider>
        <LevelingProvider>
          <GlobalStyles />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/room">
                <Route path="" element={<Navigate to="/room/public" replace={true} />} />
                <Route path=":roomId" element={<RoomPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LevelingProvider>
      </UserProvider>
    </MessageProvider>
  </React.StrictMode>,
);
