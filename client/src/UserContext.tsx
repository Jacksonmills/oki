import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "./utils/socket";
import { UserObj } from "./App";

interface UserContextState {
  xp: number;
  level: number;
  onlineUsers: UserObj[];
  offlineUsers: UserObj[];
}

const UserContext = createContext<UserContextState>({
  xp: 0,
  level: 1,
  onlineUsers: [],
  offlineUsers: [],
});

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode; }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [onlineUsers, setOnlineUsers] = useState<UserObj[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<UserObj[]>([]);

  useEffect(() => {
    socket.on("update-xp", (newXp: number) => {
      setXp(newXp);
    });

    socket.on("update-level", (newLevel: number) => {
      setLevel(newLevel);
    });

    socket.on("user-history", (users: UserObj[]) => {
      const online = users.filter(user => user.status === "online");
      const offline = users.filter(user => user.status === "offline");

      setOnlineUsers(online);
      setOfflineUsers(offline);
    });

    return () => {
      socket.off("update-xp");
      socket.off("update-level");
      socket.off("user-history");
    };
  }, [socket]);

  return (
    <UserContext.Provider value={{ xp, level, onlineUsers, offlineUsers }}>
      {children}
    </UserContext.Provider>
  );
}
