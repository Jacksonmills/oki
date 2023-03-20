import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { initializeSocketController } from './socketController';
import { UserObj, UserHistory } from '../shared/types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://oki.herokuapp.com/' : '*',
  },
});

const PORT = process.env.PORT || 3001;

const users = new Map<string, UserObj>();
const userHistory: UserHistory[] = [];

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

initializeSocketController(io, users, userHistory);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
