import { createContext, useContext, useEffect, useState } from 'react';
import { LEVELING_SYSTEM } from './constants';
import { socket } from './utils/socket';
import useLevelingSystem from './hooks/use-leveling-system';

const LevelingContext = createContext<{
  level: number;
  xp: number;
  progress: number;
}>({
  level: 0,
  xp: 0,
  progress: 0,
});

export function useLevelingContext() {
  return useContext(LevelingContext);
}

export function LevelingProvider({ children }: { children: React.ReactNode; }) {
  const { xp, level, progress, setXp, setLevel } = useLevelingSystem();

  useEffect(() => {
    socket.on("update-xp", setXp);
    socket.on("update-level", setLevel);

    return () => {
      socket.off("update-xp", setXp);
      socket.off("update-level", setLevel);
    };
  }, []);

  return (
    <LevelingContext.Provider value={{ level, xp, progress }}>
      {children}
    </LevelingContext.Provider>
  );
}
