import { Server } from "socket.io";
import { UserObj, UserHistory } from "../shared/types";
import { validate } from "uuid";
import { blacklist } from "./blacklist";
import xss from "xss";

export function createSocketController(io: Server, users: Map<string, UserObj>, userHistory: UserHistory[]) {
  const emitUserCount = () => {
    io.emit('live-users-count', users.size);
  };

  const validateMessage = (message: string) => {
    const lowerCaseMessage = message.toLowerCase();

    const isBlacklisted = blacklist.some(item => lowerCaseMessage.includes(item.toLowerCase()));

    return !isBlacklisted;
  };

  io.on('connection', (socket) => {

    socket.on('get-live-users-count', () => {
      socket.emit('live-users-count', users.size);
    });

    // change username of a user that already is connected
    // socket.on('change-username', ({ username, hexcode }) => {
    //   // write this with comments please
    //   const user = users.get(socket.id); // get the user from the users map
    //   if (user) { // if the user exists
    //     const userIndex = userHistory.findIndex(u => u.id === socket.id); // find the user in the userHistory array
    //     if (userIndex !== -1) { // if the user exists in the userHistory array
    //       userHistory[userIndex].username = username; // change the username in the userHistory array
    //       userHistory[userIndex].hexcode = hexcode; // change the hexcode in the userHistory array
    //     }
    //     user.username = username; // change the username in the users map
    //     user.hexcode = hexcode; // change the hexcode in the users map
    //     io.emit('user-history', userHistory); // emit the userHistory array to all users
    //     io.emit('user-changed-username', { // emit the new username and hexcode to all users
    //       username: username,
    //       hexcode: hexcode
    //     });
    //   }
    // });

    socket.on('set-username', ({ username, hexcode }) => {
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

      const isValidMessage = validateMessage(message);

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