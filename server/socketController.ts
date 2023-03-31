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
        if (user.level === MAX_LEVEL) {
          return;
        }
        user.xp += xpToAdd;
        const newLevel = Math.floor(user.xp / XP_PER_LEVEL);
        const levelChangedAndCanLevelUp = newLevel > user.level && newLevel <= MAX_LEVEL;

        if (newLevel === MAX_LEVEL) {
          user.xp = XP_PER_LEVEL * MAX_LEVEL;
        } else {
          socket.emit('update-xp', user.xp);
        }

        if (levelChangedAndCanLevelUp) {
          if (!user.isLevelingUp) {
            user.isLevelingUp = true;
            setTimeout(() => {
              user.level = newLevel;
              socket.emit('update-level', user.level);
              user.isLevelingUp = false;
            }, 500);
          }
        }

        const userIndex = userHistory.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
          userHistory[userIndex].xp = user.xp;
          userHistory[userIndex].level = user.level;
        }
        console.log('SERVER:', 'xp:', user.xp, 'level:', user.level);
      }
    });

    socket.on('remove-xp', (xpToRemove: number) => {
      const user = users.get(socket.id);
      if (user) {
        const newXp = Math.max(user.xp - xpToRemove, 0);
        const newLevel = Math.floor(newXp / XP_PER_LEVEL);
        const levelChangedAndCanLevelDown = newLevel < user.level;

        user.xp = newXp;
        socket.emit('update-xp', user.xp);

        if (levelChangedAndCanLevelDown) {
          user.level = newLevel;
          socket.emit('update-level', user.level);
        }

        const userIndex = userHistory.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
          userHistory[userIndex].xp = user.xp;
          userHistory[userIndex].level = user.level;
        }
        console.log('REMOVE: user xp updated', user.xp, 'user level', user.level);
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
          level: 0,
          isLevelingUp: false,
        });
        userHistory.push({
          id: socket.id,
          username,
          hexcode,
          status: 'online',
          lastSeen: new Date(),
          xp: 0,
          level: 0,
          isLevelingUp: false,
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
          isEXMessage: false,
          username: user.username,
          hexcode: user.hexcode,
        });
      }
    });

    socket.on('ex-message', (message: string) => {
      const user = users.get(socket.id);

      const isExMessage = message.startsWith('/ex');
      const trimmedMessage = message.replace('/ex', '').trim();
      const isValidMessage = validateText(trimmedMessage);

      if (isValidMessage && user && isExMessage) {
        const sanitizedMessage = xss(trimmedMessage, {
          whiteList: {},
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script'],
        });

        io.emit('ex-message', {
          content: sanitizedMessage,
          isServerMessage: false,
          isEXMessage: true,
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