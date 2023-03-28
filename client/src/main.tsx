import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserProvider } from './UserContext';
import { MessageProvider } from './MessageContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MessageProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </MessageProvider>
  </React.StrictMode>,
);
