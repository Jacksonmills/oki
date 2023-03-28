import React from 'react';
import styled from 'styled-components';
import { useUserContext } from '../UserContext';

const XPBar = () => {
  const { xp, level } = useUserContext();
  const XPPerLevel = 10;
  const xpGainedForCurrentLevel = xp % XPPerLevel;
  const progress = (xpGainedForCurrentLevel / XPPerLevel) * 100;

  return (
    <Wrapper>
      <Crown level={level}>
        <Level>{level}</Level>
      </Crown>
      <Bar>
        <Progress progress={progress} />
      </Bar>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 6px;
  left: 100px;
  background-color: #17171c;
  padding: 6px;
  border-radius: 50px;
`;

const Bar = styled.div`
  margin-left: 5px;
  width: 200px;
  background-color: #000000;
  border-radius: 50px;
`;

const Progress = styled.div<{ progress: number; }>`
  background-color: #4c7aaf;
  border: 1px solid #000000;
  height: 4px;
  border-radius: 50px;
  width: ${({ progress }) => `${progress}%`};
`;

const Level = styled.div`
  font-size: 6px;
`;

const Crown = styled.div<{ level: number; }>`
  position: absolute;
  left: 2px;
  display: flex;
  width: 10px;
  height: 10px;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: bold;
  border-radius: 50%;
  border: 1px solid black;
  ${({ level }) => {
    switch (true) {
      case level < 10:
        return 'background-color: #B08D57';
      case level < 20:
        return 'background-color: #C0C0C0';
      case level < 30:
        return 'background-color: #FFD700';
      case level < 40:
        return 'background-color: #E5E4E2';
      case level < 50:
        return 'background: linear-gradient(to bottom, #E6E6E6, #FFFFFF);';
      default:
        return 'background-color: gray';
    }
  }}
`;

export default XPBar;