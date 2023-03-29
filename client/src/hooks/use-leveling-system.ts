import { LEVELING_SYSTEM } from "@/constants";
import { useEffect, useState } from "react";

function useLevelingSystem(initialXP = 0, initialLevel = 0) {
  const [level, setLevel] = useState(initialLevel);
  const [xp, setXp] = useState(initialXP);
  const xpPerLevel = LEVELING_SYSTEM.XP_PER_LEVEL;
  const xpGainedForCurrentLevel = xp % xpPerLevel;
  const baseProgress = (xpGainedForCurrentLevel / xpPerLevel) * 100;
  const progress = (level === 6 && xp >= 100) || level === 7 ? 100 : baseProgress;

  useEffect(() => {
    const newLevel = Math.floor(xp / xpPerLevel);
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [xp, xpPerLevel, level]);

  return { level, xp, progress, setXp, setLevel };
}

export default useLevelingSystem;
