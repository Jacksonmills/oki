import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useUserContext } from '@/UserContext';
import { COLORS } from '@/constants';
import { XP_PER_LEVEL } from '@shared/levelingSystem';
import { colorContrast } from '@/utils/colorContrast';

type LevelColors = {
  background: string;
  border: string;
  text: string;
};

const XPBar = () => {
  const { xp, level } = useUserContext();
  const xpGainedForCurrentLevel = xp % XP_PER_LEVEL;
  const targetProgress = (xpGainedForCurrentLevel / XP_PER_LEVEL) * 100;

  const [progress, setProgress] = useState(targetProgress);
  const [levelUp, setLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);

  const levelColors = useMemo(() => {
    switch (true) {
      case level === 1:
        return {
          background: '#63ff1b',
          border: '#336e18',
          text: colorContrast('#63ff1b'),
        };
      case level === 2:
        return {
          background: '#f60b0b',
          border: '#ffffff',
          text: colorContrast('#f60b0b'),
        };
      case level === 3:
        return {
          background: '#ebca10',
          border: '#ab801a',
          text: colorContrast('#ebca10'),
        };
      case level === 4:
        return {
          background: '#ee11ee',
          border: '#ffffff',
          text: colorContrast('#ee11ee'),
        };
      case level === 5:
        return {
          background: '#ff8000',
          border: '#ffffff',
          text: colorContrast('#ff8000'),
        };
      case level === 6:
        return {
          background: '#0c45ef',
          border: '#ffffff',
          text: colorContrast('#0c45ef'),
        };
      default:
        return {
          background: '#ddfe09',
          border: '#09e5fe',
          text: colorContrast('#ddfe09'),
        };
    }
  }, [level]);

  useEffect(() => {
    if (level === 7 && prevLevel === 7 && targetProgress === 0) {
      setProgress(100);
      return;
    }
    if (targetProgress > 90) {
      setLevelUp(true);
      setProgress(100);
    } else {
      setProgress(targetProgress);
    }
  }, [targetProgress]);

  useEffect(() => {
    if (levelUp) {
      setTimeout(() => {
        setLevelUp(false);
        setProgress(0);
      }, 5000);
    }
  }, [levelUp]);

  useEffect(() => {
    setPrevLevel(level);
  }, [level]);

  return (
    <Wrapper>
      <Crown levelColors={levelColors}>
        <Level>{level}</Level>
      </Crown>
      <Bar progress={progress}>
        <Progress progress={progress} levelColors={levelColors} />
      </Bar>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 4px;
  left: 100px;
  background-color: #17171c;
  padding: 8px;
  border-radius: 50px;
`;

const Bar = styled.div<{ progress: number; }>`
  position: relative;
  margin-left: 6px;
  width: 20vw;
  background-color: #000000;
  border-radius: 50px;
  ${({ progress }) => {
    if (progress > 90) {
      return css`
        animation: pulse 1s infinite;
      `;
    }
    return '';
  }}

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(9, 229, 254, 0.5);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    // half way through the progress bar
    left: 50%;
    width: 1px;
    height: 8px;
    background-color: black;
  }
`;

const Progress = styled.div<{ progress: number; levelColors: LevelColors; }>`
  background: ${({ levelColors }) => levelColors.background};
  background-repeat: no-repeat;
  border: 1px solid ${({ levelColors }) => levelColors.border};
  border-right: ${({ progress }) => (progress === 100 ? 'auto' : 'none')};
  height: 8px;
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.5s ease;
`;


const Level = styled.div`
`;

const Crown = styled.div<{ levelColors: LevelColors; }>`
  position: absolute;
  z-index: 1;
  left: 4px;
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  color: ${({ levelColors }) => levelColors.text};
  font-weight: bold;
  border-radius: 50%;
  border: 1px solid ${({ levelColors }) => levelColors.border};
  background-color: ${({ levelColors }) => levelColors.background};
`;

export default XPBar;