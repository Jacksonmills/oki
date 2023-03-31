import { LEVELING_SYSTEM } from "../constants";
import { useEffect, useState } from "react";

function useLevelingSystem(initialXP = 0, initialLevel = 0) {
  const [level, setLevel] = useState(initialLevel);
  const [xp, setXp] = useState(initialXP);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const { MAX_LEVEL, XP_PER_LEVEL } = LEVELING_SYSTEM;
  const xpGainedForCurrentLevel = xp % XP_PER_LEVEL;
  const baseProgress = (xpGainedForCurrentLevel / XP_PER_LEVEL) * 100;

  const progress = isLevelingUp ? 100 : ((level === 6 && xp >= 100) || level === 7 ? 100 : baseProgress);

  const addXp = (xpToAdd: number) => {
    if (level === MAX_LEVEL) {
      return;
    }
    const newXp = xp + xpToAdd;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL);
    const levelChangedAndCanLevelUp = newLevel > level && newLevel < MAX_LEVEL;

    if (levelChangedAndCanLevelUp) {
      setIsLevelingUp(true);
      setTimeout(() => {
        setLevel(newLevel);
        setXp(newXp % XP_PER_LEVEL);
        setIsLevelingUp(false);
      }, 500);
    } else {
      setXp(newXp);
    }
  };

  const removeXp = (xpToRemove: number) => {
    const newXp = Math.max(xp - xpToRemove, 0);
    const newLevel = Math.floor(newXp / XP_PER_LEVEL);

    if (newLevel < level) {
      setIsLevelingUp(false);
      setLevel(newLevel);
    }
    setXp(newXp % XP_PER_LEVEL);
  };

  useEffect(() => {
    const newLevel = Math.floor(xp / XP_PER_LEVEL);
    if (newLevel > level && newLevel <= MAX_LEVEL) {
      setIsLevelingUp(true);
      setTimeout(() => {
        setIsLevelingUp(false);
        setLevel(newLevel);
      }, 1000);
    }
  }, [xp, level, MAX_LEVEL, XP_PER_LEVEL]);

  return { level, xp, progress, setXp, setLevel, isLevelingUp, addXp, removeXp };
}

export default useLevelingSystem;
