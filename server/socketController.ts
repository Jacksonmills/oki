import { Server } from "socket.io";
import { UserObj, UserHistory } from "../shared/types";
import xss from "xss";
import validateText from "./validateText";
import { MAX_LEVEL, XP_PER_LEVEL } from "../shared/levelingSystem";

export function createSocketController(io: Server, users: Map<string, UserObj>, userHistory: Map<string, UserHistory>) {
  const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

  const getUsersInRoom = (roomId: string) => {
    return Array.from(userHistory.values()).filter((user) => user.roomId === roomId);
  };

  const updateUserHistoryXPAndLevel = (userId: string, newXp: number, newLevel: number) => {
    const userHistoryEntry = userHistory.get(userId);
    if (userHistoryEntry) {
      userHistoryEntry.xp = newXp;
      userHistoryEntry.level = newLevel;
    }
  };

  const removeUserFromHistory = (userId: string) => {
    const user = userHistory.get(userId);
    console.log('removing user from history', user?.username, userId);
    userHistory.delete(userId);
  };

  io.on('connection', (socket) => {
    console.log(`[${new Date().toISOString()}] 🟡 connecting...`);

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

        updateUserHistoryXPAndLevel(socket.id, user.xp, user.level);
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

        updateUserHistoryXPAndLevel(socket.id, user.xp, user.level);
      }
    });

    socket.on('set-username', ({
      username,
      hexcode,
      roomId = 'public'
    }: {
      username: string;
      hexcode: string;
      roomId: string;
    }) => {
      if (!validateText(username)) {
        socket.emit('username-invalid');
      } else {
        socket.emit('username-set');

        const newUser: UserObj = {
          id: socket.id,
          username,
          hexcode,
          status: 'online',
          lastSeen: new Date(),
          xp: 0,
          level: 0,
          isLevelingUp: false,
          roomId: roomId,
        };

        users.set(socket.id, newUser);
        userHistory.set(socket.id, newUser);

        socket.join(roomId);

        const userConnectedPayload = {
          type: 'connected',
          message: `has connected! 👋`,
          username: username,
          hexcode: hexcode,
          roomId: roomId,
        };

        socket.to(roomId).emit('user-joined', userConnectedPayload);
        io.to(roomId).emit('user-connected', userConnectedPayload);

        console.log(`[${new Date().toISOString()}] 🟢 ${username} connected!`);
        const userHistoryObj = Object.fromEntries(userHistory.entries());
        io.emit('user-history', userHistoryObj);

        // emit the current users in roomId to the room they are in
        const usersInRoom = Array.from(userHistory.values()).filter((user) => user.roomId === roomId);
        socket.to(roomId).emit('live-users-count', usersInRoom.length);
      }
    });

    socket.on('message', (message: string, roomId: string) => {
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
          roomId: roomId,
        };

        io.in(roomId).emit('message', messagePayload);
      }
    });

    socket.on('ex-message', (message: string, roomId: string) => {
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
          roomId: roomId,
        };

        io.in(roomId).emit('ex-message', messagePayload);
      }
    });

    socket.on('disconnect', () => {
      const userHistoryEntry = userHistory.get(socket.id);
      if (userHistoryEntry) {
        userHistoryEntry.status = 'offline';
        userHistoryEntry.disconnectTime = new Date();

        const roomId = userHistoryEntry.roomId;

        socket.leave(roomId);

        const userDisconnectedPayload = {
          type: 'disconnected',
          message: `has disconnected... 🔴`,
          username: userHistoryEntry.username,
          hexcode: userHistoryEntry.hexcode,
          roomId: roomId,
        };

        socket.to(roomId).emit('user-left', userDisconnectedPayload);
        socket.to(roomId).emit('user-disconnected', userDisconnectedPayload);

        console.log(`[${new Date().toISOString()}] 🔴 ${userHistoryEntry.username} disconnected.`);
        users.delete(socket.id);

        const timeout = setTimeout(() => {
          removeUserFromHistory(socket.id);
          disconnectTimeouts.delete(socket.id);
          const userHistoryObj = Object.fromEntries(userHistory.entries());
          io.emit('user-history', userHistoryObj);
        }, 60 * 60 * 1000);

        disconnectTimeouts.set(socket.id, timeout);
      }

      const userHistoryObj = Object.fromEntries(userHistory.entries());
      io.emit('user-history', userHistoryObj);

      const usersInRoom = Array.from(userHistory.values()).filter((user) => user.roomId === userHistoryEntry?.roomId);
      socket.emit('live-users-count', usersInRoom.length);
    });

    socket.on('check-room-exists', (roomId: string, callback: (arg0: number) => number) => {
      const roomUsers = getUsersInRoom(roomId);
      callback(roomUsers.length);
    });

    socket.on('get-live-users-count', (roomId: string) => {
      const roomUserList = roomId
        ? Array.from(userHistory.values()).filter(user => user.roomId === roomId)
        : Array.from(userHistory.values());
      socket.to(roomId).emit('live-users-count', roomUserList.length);
    });

    socket.on('get-user-history', (roomId: string) => {
      const roomUsersMap = new Map([...userHistory.entries()].filter(([userId, user]) => user.roomId === roomId));
      const roomUserHistoryObj = Object.fromEntries(roomUsersMap.entries());
      socket.to(roomId).emit('user-history', roomUserHistoryObj);
    });
  });
}