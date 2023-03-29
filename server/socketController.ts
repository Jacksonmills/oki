import { Server } from "socket.io";
import { UserObj, UserHistory } from "../shared/types";
import xss from "xss";
import validateText from "./validateText";
import { MAX_LEVEL, XP_PER_LEVEL } from "../shared/levelingSystem";

export function createSocketController(io: Server, users: Map<string, UserObj>, userHistory: UserHistory[]) {
  const emitUserCount = () => {
    io.emit('live-users-count', users.size);
  };

  const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

  const removeUserFromHistory = (userId: string) => {
    console.log('removing user from history', userId);
    userHistory = userHistory.filter(user => user.id !== userId);
  };

  io.on('connection', (socket) => {
    socket.on('add-xp', (xpToAdd: number) => {
      const user = users.get(socket.id);
      if (user) {
        // if user level is max and user xp is max, don't add xp
        if (user.level === MAX_LEVEL && user.xp === XP_PER_LEVEL * MAX_LEVEL) { // this is the max xp which calculates to 1000
          return;
        }
        user.xp += xpToAdd;
        const newLevel = Math.floor(user.xp / XP_PER_LEVEL) + 1;
        const levelChangedAndCanLevelUp = newLevel !== user.level && newLevel <= MAX_LEVEL;

        socket.emit('update-xp', user.xp);

        if (levelChangedAndCanLevelUp) {
          user.level = newLevel;
          socket.emit('update-level', user.level);
        }

        const userIndex = userHistory.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
          userHistory[userIndex].xp = user.xp;
          userHistory[userIndex].level = user.level;
        }
      }
    });

    socket.on('get-live-users-count', () => {
      socket.emit('live-users-count', users.size);
    });

    socket.on('set-username', ({ username, hexcode }) => {
      if (!validateText(username)) {
        socket.emit('username-invalid');
      } else {
        socket.emit('username-set');

        users.set(socket.id, {
          username,
          hexcode,
          status: 'online',
          lastSeen: new Date(),
          xp: 0,
          level: 1
        });
        userHistory.push({
          id: socket.id,
          username,
          hexcode,
          status: 'online',
          lastSeen: new Date(),
          xp: 0,
          level: 1
        });

        io.emit('user-connected', {
          type: 'connected',
          message: `has connected! 👋`,
          username: username,
          hexcode: hexcode
        });

        io.emit('user-history', userHistory);
        socket.emit('live-users-count', users.size);
      }
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

        const timeout = setTimeout(() => {
          removeUserFromHistory(socket.id);
          disconnectTimeouts.delete(socket.id);
          io.emit('user-history', userHistory);
        }, 60 * 60 * 1000);

        disconnectTimeouts.set(socket.id, timeout);
      }
      emitUserCount();
      io.emit('user-history', userHistory);
    });
  });
}