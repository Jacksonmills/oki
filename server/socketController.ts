import { Server } from "socket.io";
import { UserObj, UserHistory } from "../shared/types";
import xss from "xss";
import validateText from "./validateText";

export function createSocketController(io: Server, users: Map<string, UserObj>, userHistory: UserHistory[]) {
  const emitUserCount = () => {
    io.emit('live-users-count', users.size);
  };

  io.on('connection', (socket) => {
    socket.on('add-xp', (xpToAdd: number) => {
      const user = users.get(socket.id);
      if (user) {
        user.xp += xpToAdd; // add xp
        const newLevel = Math.floor(user.xp / 10) + 1; // 100 xp per level
        const levelChanged = newLevel !== user.level; // check if level changed

        socket.emit('update-xp', user.xp); // emit xp update

        if (levelChanged) {
          user.level = newLevel; // set new level
          socket.emit('update-level', user.level); // emit level update
        }

        const userIndex = userHistory.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
          userHistory[userIndex].xp = user.xp; // update xp in user history
          userHistory[userIndex].level = user.level; // update level in user history
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
      }
      emitUserCount();
      io.emit('user-history', userHistory);
    });
  });
}