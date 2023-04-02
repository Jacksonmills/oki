import { Server } from "socket.io";
import { UserObj, UserHistory } from "../shared/types";
import xss from "xss";
import validateText from "./validateText";
import { MAX_LEVEL, XP_PER_LEVEL } from "../shared/levelingSystem";
import { execPath } from "process";

export function createSocketController(io: Server, users: Map<string, UserObj>, userHistory: UserHistory[]) {
  const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

  const removeUserFromHistory = (userId: string) => {
    const user = userHistory.find(user => user.id === userId);
    console.log('removing user from history', user?.username);
    userHistory = userHistory.filter(user => user.id !== userId);
  };

  io.on('connection', (socket) => {
    console.log(`[${new Date().toISOString()}] 🟡 connecting...`);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
      const user = users.get(socket.id);
      if (user) {
        user.roomId = roomId;
      }
    });

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', socket.id);
      const user = users.get(socket.id);
      if (user) {
        delete user.roomId;
      }
    });

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
      }
    });

    socket.on('set-username', ({ username, hexcode }) => {
      if (!validateText(username)) {
        socket.emit('username-invalid');
      } else {
        socket.emit('username-set');

        const newUser: UserObj = {
          username,
          hexcode,
          status: 'online',
          lastSeen: new Date(),
          xp: 0,
          level: 0,
          isLevelingUp: false,
        };

        users.set(socket.id, newUser);
        userHistory.push({
          id: socket.id,
          username,
          hexcode,
          status: 'online',
          lastSeen: new Date(),
          xp: 0,
          level: 0,
          isLevelingUp: false,
          roomId: newUser.roomId || undefined,
        });

        const user = users.get(socket.id);
        const userConnectedPayload = {
          type: 'connected',
          message: `has connected! 👋`,
          username: username,
          hexcode: hexcode
        };

        if (user && user.roomId) {
          socket.to(user.roomId).emit('user-connected', userConnectedPayload);
        } else {
          io.emit('user-connected', userConnectedPayload);
        }
        console.log(`[${new Date().toISOString()}] 🟢 ${username} connected!`);

        io.emit('user-history', userHistory);
        socket.emit('live-users-count', users.size);
      }
    });

    socket.on('message', (message: string, roomId?: string) => {
      const user = users.get(socket.id);

      const isValidMessage = validateText(message);

      if (isValidMessage && user) {
        const sanitizedMessage = xss(message, {
          whiteList: {},
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script'],
        });

        const messagePayload = {
          content: sanitizedMessage,
          isServerMessage: false,
          isEXMessage: false,
          username: user.username,
          hexcode: user.hexcode,
        };

        if (roomId) {
          socket.to(roomId).emit('message', messagePayload);
        } else {
          io.emit('message', messagePayload);
        }
      }
    });

    socket.on('ex-message', (message: string, roomId?: string) => {
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

        const messagePayload = {
          content: sanitizedMessage,
          isServerMessage: false,
          isEXMessage: true,
          username: user.username,
          hexcode: user.hexcode,
        };

        if (roomId) {
          io.to(roomId).emit('ex-message', messagePayload);
        } else {
          io.emit('ex-message', messagePayload);
        }
      }
    });

    socket.on('disconnect', () => {
      const user = users.get(socket.id);
      if (user) {
        const userIndex = userHistory.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
          userHistory[userIndex].status = 'offline';
          userHistory[userIndex].disconnectTime = new Date();
          userHistory[userIndex].roomId = user.roomId || undefined;
        }

        if (user.roomId) {
          socket.to(user.roomId).emit('user-disconnected', {
            type: 'disconnected',
            message: `has disconnected... 🔴`,
            username: user.username,
            hexcode: user.hexcode
          });
        } else {
          socket.broadcast.emit('user-disconnected', {
            type: 'disconnected',
            message: `has disconnected... 🔴`,
            username: user.username,
            hexcode: user.hexcode
          });
        }
        console.log(`[${new Date().toISOString()}] 🔴 ${user.username} disconnected.`);
        user.status = 'offline';
        users.delete(socket.id);

        const timeout = setTimeout(() => {
          removeUserFromHistory(socket.id);
          disconnectTimeouts.delete(socket.id);
          io.emit('user-history', userHistory);
        }, 60 * 60 * 1000);

        disconnectTimeouts.set(socket.id, timeout);
      }
      io.emit('user-history', userHistory);
      socket.emit('live-users-count', users.size);
    });

    socket.on('get-live-users-count', (roomId?: string) => {
      if (roomId) {
        const roomUserList = Array.from(users.values()).filter(user => user.roomId === roomId);
        socket.emit('live-users-count', roomUserList.length);
      } else {
        socket.emit('live-users-count', users.size);
      }
    });

    socket.on('get-user-history', (roomId?: string) => {
      if (roomId) {
        const roomUserList = Array.from(users.values()).filter(user => user.roomId === roomId);
        socket.emit('user-history', roomUserList);
      } else {
        const userList = Array.from(users.values());
        socket.emit('user-history', userList);
      }
    });
  });
}