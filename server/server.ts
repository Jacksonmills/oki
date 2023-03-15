import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3001;

const generateRandomUsername = () => `User${Math.floor(Math.random() * 10000)}`;

const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  const username = generateRandomUsername();
  socket.broadcast.emit('user-connected', `${username} has connected`);

  socket.on('message', (message: string) => {
    io.emit('message', `${username}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
