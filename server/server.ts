import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3001;

const users = new Map<string, { username: string; hexcode: string; status: 'online' | 'offline'; }>();
const userHistory: { id: string; username: string; hexcode: string; status: 'online' | 'offline'; }[] = [];

const emitUserCount = () => {
  io.emit('live-users-count', users.size);
};

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('get-live-users-count', () => {
    socket.emit('live-users-count', users.size);
  });

  socket.on('set-username', ({ username, hexcode }) => {
    users.set(socket.id, { username, hexcode, status: 'online' });
    userHistory.push({ id: socket.id, username, hexcode, status: 'online' });

    io.emit('user-connected', {
      type: 'connected',
      message: `has connected! 👋`,
      username: username,
      hexcode: hexcode
    });

    socket.emit('user-history', userHistory);
    socket.emit('live-users-count', users.size);
  });

  socket.on('get-user-history', () => {
    const userList = Array.from(users.values());
    socket.emit('user-history', userList);
  });

  socket.on('message', (message: string) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('message', {
        content: message,
        isServerMessage: false,
        username: user.username,
        hexcode: user.hexcode,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    const user = users.get(socket.id);

    if (user) {
      const userIndex = userHistory.findIndex(u => u.id === socket.id);
      if (userIndex !== -1) {
        userHistory[userIndex].status = 'offline';
      }

      socket.broadcast.emit('user-disconnected', {
        type: 'disconnected',
        message: `has disconnected... 🔴`,
        username: user.username,
        hexcode: user.hexcode
      });
      user.status = 'offline';
      users.delete(socket.id);
    }
    emitUserCount();
    io.emit('user-history', userHistory);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
