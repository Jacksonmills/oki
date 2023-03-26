import { Server } from "socket.io";
import { UserObj, UserHistory } from "../shared/types";
import xss from "xss";
import validateText from "./validateText";
import { Socket } from "socket.io";

export function createSocketController(io: Server, users: Map<string, UserObj>, userHistory: UserHistory[]) {
  const emitUserCount = () => {
    io.emit('live-users-count', users.size);
  };

  const isUsernameTaken = (username: string) => {
    return userHistory.some(user => user.username.toLowerCase() === username.toLowerCase());
  };

  const doesSavedSocketIdMatchUser = (savedSocketId: string, username: string): boolean => {
    const user = userHistory.find(user => user.id === savedSocketId);
    return !!user && user.username.toLowerCase() === username.toLowerCase();
  };

  io.on('connection', (socket: Socket) => {
    let savedSocketId = socket.handshake.headers.socketid as string;

    if (savedSocketId && doesSavedSocketIdMatchUser(savedSocketId, '')) {
      const user = userHistory.find(user => user.id === savedSocketId);
      if (user) {
        savedSocketId = user.id;
        user.status = 'online';
        user.lastSeen = new Date();
        users.set(savedSocketId, user);
        socket.emit('username-set');
        io.emit('user-history', userHistory);
        io.emit('user-connected', {
          type: 'reconnected',
          message: `has reconnected! 👋`,
          username: user.username,
          hexcode: user.hexcode
        });

        console.log(`[${new Date().toISOString()}] a user reconnected (savedSocketId: ${savedSocketId})`);
        return;
      }
    }

    socket.on('get-live-users-count', () => {
      socket.emit('live-users-count', users.size);
    });

    socket.on('set-username', ({ username, hexcode }) => {
      if (!validateText(username)) {
        socket.emit('username-invalid');
        return;
      };

      if (isUsernameTaken(username)) {
        socket.emit('username-taken');
        return;
      };

      if (doesSavedSocketIdMatchUser(savedSocketId, username)) {
        console.log("hello");
        const user = userHistory.find(user => user.id === savedSocketId);
        if (user) {
          user.status = 'online';
          user.lastSeen = new Date();
          users.set(savedSocketId, user);
          socket.emit('username-set');
          io.emit('user-history', userHistory);
          io.emit('user-connected', {
            type: 'reconnected',
            message: `has reconnected! 👋`,
            username: user.username,
            hexcode: user.hexcode
          });
          return;
        }
      }

      socket.emit('username-set');

      users.set(socket.id, { username, hexcode, status: 'online', lastSeen: new Date() });
      userHistory.push({ id: socket.id, username, hexcode, status: 'online', lastSeen: new Date() });

      io.emit('user-connected', {
        type: 'connected',
        message: `has connected! 👋`,
        username: username,
        hexcode: hexcode
      });

      io.emit('user-history', userHistory);
      socket.emit('live-users-count', users.size);
    });

    console.log(`[${new Date().toISOString()}] a user connected`);

    socket.on('get-user-history', () => {
      const userList = Array.from(users.values());
      socket.emit('user-history', userList);
    });

    socket.on('message', (message: string) => {
      const user = users.get(socket.id);

      const isValidMessage = validateText(message);

      if (isValidMessage && user) {
        const sanitizedMessage = xss(message, {
          whiteList: {},
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script'],
        });

        io.emit('message', {
          content: sanitizedMessage,
          isServerMessage: false,
          username: user.username,
          hexcode: user.hexcode,
        });
      }
    });

    socket.on('disconnect', () => {
      const user = users.get(socket.id);
      console.log(`[${new Date().toISOString()}] a user disconnected`);

      if (user) {
        const userIndex = userHistory.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
          userHistory[userIndex].status = 'offline';
          userHistory[userIndex].disconnectTime = new Date();
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