const LEVEL_CAP = 50;

const xpForNextLevel = (level: number): number => {
  return Math.floor((Math.pow(level, 2) + level) * 5);
};

const xpRequirements: number[] = [];

for (let i = 1; i <= LEVEL_CAP; i++) {
  xpRequirements.push(xpForNextLevel(i));
}

export { xpRequirements, LEVEL_CAP };
