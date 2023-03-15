import { io } from 'socket.io-client';

const isDevelopment = process.env.NODE_ENV === 'development';
const serverURL = isDevelopment ? 'http://localhost:3001' : window.location.origin;

export const socket = io(serverURL);
