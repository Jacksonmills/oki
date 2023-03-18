import { Server } from "socket.io";
import { User, UserHistory } from "../shared/types";

export function initializeSocketController(io: Server, users: Map<string, User>, userHistory: UserHistory[]) {
  const emitUserCount = () => {
    io.emit('live-users-count', users.size);
  };

  io.on('connection', (socket) => {

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

      io.emit('user-history', userHistory);
      socket.emit('live-users-count', users.size);
    });
    const user = users.get(socket.id);
    console.log(`[${new Date().toISOString()}] ${user} connected`);

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
      const user = users.get(socket.id);
      console.log(`[${new Date().toISOString()}] ${user} disconnected`);

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
}