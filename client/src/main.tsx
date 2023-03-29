import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './UserContext';
import { MessageProvider } from './MessageContext';
import GlobalStyles from './components/GlobalStyles';
import { LevelingProvider } from './LevelingContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MessageProvider>
      <UserProvider>
        <LevelingProvider>
          <GlobalStyles />
          <App />
        </LevelingProvider>
      </UserProvider>
    </MessageProvider>
  </React.StrictMode>,
);
