import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "@/utils/socket";
import { useMessageContext } from "@/MessageContext";
import { UserHistory, UserObj } from "@/types";

interface UserContextState {
  xp: number;
  level: number;
  onlineUsers: UserObj[];
  offlineUsers: UserObj[];
  userCount: number;
  userHistory: UserHistory[];
}

const UserContext = createContext<UserContextState>({
  xp: 0,
  level: 1,
  onlineUsers: [],
  offlineUsers: [],
  userCount: 0,
  userHistory: []
});

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode; }) {
  const { addMessage } = useMessageContext();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [onlineUsers, setOnlineUsers] = useState<UserObj[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<UserObj[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [userHistory, setUserHistory] = useState<UserHistory[]>([]);

  useEffect(() => {
    const handleUserConnectionEvent = (eventType: 'connected' | 'disconnected', data: { message: string, username: string, hexcode: string; }) => {
      const now = new Date();
      addMessage({
        content: data.message,
        isServerMessage: true,
        isEXMessage: false,
        type: eventType,
        username: data.username,
        hexcode: data.hexcode
      });
      setUserHistory((prevUserHistory) => {
        return prevUserHistory.map((user) => {
          if (user.username === data.username) {
            return { ...user, status: eventType === 'connected' ? 'online' : 'offline', lastSeen: now };
          }
          return user;
        });
      });
      socket.emit('get-live-users-count');
    };

    const handleConnection = (data: { message: string, username: string, hexcode: string; }) => {
      handleUserConnectionEvent('connected', data);
    };

    const handleDisconnection = (data: { message: string, username: string, hexcode: string; }) => {
      handleUserConnectionEvent('disconnected', data);
    };

    const handleUserHistory = (userHistory: UserHistory[]) => {
      const now = new Date();
      const updatedUserHistory = userHistory.map(user => ({
        ...user,
        lastSeen: user.lastSeen ? new Date(user.lastSeen) : now,
        disconnectTime: user.disconnectTime ? new Date(user.disconnectTime) : undefined
      }));
      setUserHistory(updatedUserHistory);

      const online = updatedUserHistory.filter(user => user.status === "online");
      const offline = updatedUserHistory.filter(user => user.status === "offline");

      setOnlineUsers(online);
      setOfflineUsers(offline);
    };

    const updateXP = (newXp: number) => {
      setXp(newXp);
    };

    const updateLevel = (newLevel: number) => {
      setLevel(newLevel);
    };

    socket.emit('get-live-users-count');

    socket.on('live-users-count', setUserCount);
    socket.on("update-xp", updateXP);
    socket.on("update-level", updateLevel);
    socket.on("user-history", handleUserHistory);
    socket.on('user-connected', (data) => handleConnection({ ...data, type: "connected" }));
    socket.on('user-disconnected', (data) => handleDisconnection({ ...data, type: "disconnected" }));

    return () => {
      socket.off('live-users-count', setUserCount);
      socket.off("update-xp", updateXP);
      socket.off("update-level", updateLevel);
      socket.off("user-history", handleUserHistory);
      socket.off('user-connected', handleConnection);
      socket.off('user-disconnected', handleDisconnection);
    };
  }, [socket]);

  return (
    <UserContext.Provider
      value={{
        xp,
        level,
        onlineUsers,
        offlineUsers,
        userCount,
        userHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
