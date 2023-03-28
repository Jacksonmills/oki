import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "./utils/socket";

interface UserContextState {
  xp: number;
  level: number;
}

const UserContext = createContext<UserContextState>({ xp: 0, level: 1 });

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode; }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    socket.on("update-xp", (newXp: number) => {
      setXp(newXp);
    });

    socket.on("update-level", (newLevel: number) => {
      setLevel(newLevel);
    });

    return () => {
      socket.off("update-xp");
      socket.off("update-level");
    };
  }, [socket]);

  return (
    <UserContext.Provider value={{ xp, level }}>{children}</UserContext.Provider>
  );
}
