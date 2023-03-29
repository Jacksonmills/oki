import React, { useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useLevelingContext } from '@/LevelingContext';
import { LevelColors, getLevelColors } from '@/utils/getLevelColors';

const XPBar = () => {
  const { level, progress, isLevelingUp } = useLevelingContext();

  const levelColors = useMemo(() => {
    return getLevelColors(level);
  }, [level]);

  return (
    <Wrapper>
      <Crown levelColors={levelColors}>
        <Level>{level}</Level>
      </Crown>
      <Bar progress={progress} isLevelingUp={isLevelingUp}>
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

const Bar = styled.div<{
  progress: number;
  isLevelingUp: boolean;
}>`
  position: relative;
  margin-left: 6px;
  width: 20vw;
  background-color: #000000;
  border-radius: 50px;
  ${({ progress, isLevelingUp }) => {
    if (progress > 90 || isLevelingUp) {
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
    left: calc(50% - 1px);
    width: 2px;
    height: 8px;
    background-color: black;
  }
`;

const Progress = styled.div<{ progress: number; levelColors: LevelColors; isLevelingUp: boolean; }>`
  background: ${({ levelColors }) => levelColors.background};
  background-repeat: no-repeat;
  border: 1px solid ${({ levelColors }) => levelColors.border};
  border-right: ${({ progress, isLevelingUp }) => (progress === 100 || isLevelingUp ? 'auto' : 'none')};
  border-radius: ${({ progress, isLevelingUp }) => (progress === 100 || isLevelingUp ? '50px' : '0')};
  height: 8px;
  width: ${({ progress, isLevelingUp }) => (isLevelingUp ? '100%' : `${progress}%`)};
  transition: width 0.5s ease;
`;


const Level = styled.div`
  position: relative;
  top: -1px;
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