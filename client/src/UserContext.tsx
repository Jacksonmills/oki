import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "./utils/socket";
import { useMessageContext } from "./MessageContext";
import { UserHistory, UserObj } from "./types";
import { useLevelingContext } from "./LevelingContext";

interface UserContextState {
  onlineUsers: Map<string, UserHistory>;
  offlineUsers: Map<string, UserHistory>;
  userCount: number;
  currentRoomId: string;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string>>;
  userHistory: Map<string, UserHistory>;
}

const UserContext = createContext<UserContextState>({
  onlineUsers: new Map(),
  offlineUsers: new Map(),
  userCount: 0,
  currentRoomId: "public",
  setCurrentRoomId: () => { },
  userHistory: new Map(),
});

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode; }) {
  const { addMessage } = useMessageContext();
  const [onlineUsers, setOnlineUsers] = useState<Map<string, UserHistory>>(new Map());
  const [offlineUsers, setOfflineUsers] = useState<Map<string, UserHistory>>(new Map());
  const [userCount, setUserCount] = useState(onlineUsers.size);
  const [currentRoomId, setCurrentRoomId] = useState("public");
  const [userHistory, setUserHistory] = useState<Map<string, UserHistory>>(new Map());

  useEffect(() => {
    setUserCount(onlineUsers.size);
  }, [onlineUsers]);

  useEffect(() => {
    const handleUserConnectionEvent = (
      eventType: 'connected' | 'disconnected',
      data: {
        message: string,
        username: string,
        hexcode: string;
        roomId: string;
        xp?: number;
        level?: number;
      }
    ) => {
      const now = new Date();
      addMessage({
        content: data.message,
        isServerMessage: true,
        isEXMessage: false,
        type: eventType,
        username: data.username,
        hexcode: data.hexcode,
        roomId: data.roomId,
      });
      setUserHistory((prevUserHistory) => {
        const updatedUserHistory = new Map(prevUserHistory);
        const user = updatedUserHistory.get(data.username);
        if (user) {
          updatedUserHistory.set(data.username, {
            ...user,
            status: eventType === "connected" ? "online" : "offline",
            lastSeen: now,
            xp: data.xp !== undefined ? data.xp : user.xp,
            level: data.level !== undefined ? data.level : user.level,
          });
        }
        return updatedUserHistory;
      });
    };

    const handleConnection = (data: { message: string, username: string, hexcode: string; roomId: string; }) => {
      handleUserConnectionEvent('connected', data);
    };

    const handleDisconnection = (data: { message: string, username: string, hexcode: string; roomId: string; }) => {
      handleUserConnectionEvent('disconnected', data);
    };

    const handleUserHistory = (userHistoryObj: Record<string, UserHistory>) => {
      const userHistory = new Map<string, UserHistory>(
        Object.entries(userHistoryObj).map(([key, value]) => [
          key,
          {
            ...value,
            lastSeen: new Date(value.lastSeen),
            disconnectTime: value.disconnectTime ? new Date(value.disconnectTime) : undefined
          }
        ])
      );

      const updatedUserHistory = new Map<string, UserHistory>(userHistory);

      const online = new Map<string, UserHistory>();
      const offline = new Map<string, UserHistory>();

      for (const [username, user] of updatedUserHistory.entries()) {
        if (user.status === "online") {
          online.set(username, user);
        } else {
          offline.set(username, user);
        }
      };

      setUserHistory(updatedUserHistory);
      setOnlineUsers(online);
      setOfflineUsers(offline);
    };

    socket.on("user-history", handleUserHistory);
    socket.on('user-connected', (data) => handleConnection({ ...data, type: "connected" }));
    socket.on('user-disconnected', (data) => handleDisconnection({ ...data, type: "disconnected" }));
    return () => {
      socket.off("user-history", handleUserHistory);
      socket.off('user-connected', handleConnection);
      socket.off('user-disconnected', handleDisconnection);
    };
  }, [socket]);

  return (
    <UserContext.Provider
      value={{
        onlineUsers,
        offlineUsers,
        userCount,
        currentRoomId,
        setCurrentRoomId,
        userHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
