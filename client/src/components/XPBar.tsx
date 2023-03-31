import React, { useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useLevelingContext } from '../LevelingContext';
import { LevelColors, getLevelColors } from '../utils/getLevelColors';
import { hexToRGB } from '../utils/hexToRGB';

const XPBar = () => {
  const { xp, level, progress, isLevelingUp } = useLevelingContext();

  const levelColors = useMemo(() => {
    return getLevelColors(level);
  }, [level]);

  return (
    <Wrapper>
      <Crown levelColors={levelColors}>
        <Level>{level}</Level>
      </Crown>
      <Bar progress={progress} levelColors={levelColors} level={level}>
        <Progress progress={progress} levelColors={levelColors} isLevelingUp={isLevelingUp} />
      </Bar>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 100px;
  background-color: #17171c;
  padding: 8px;
  border-radius: 50px;

  &:before {
    content: '';
    position: absolute;
    z-index: 0;
    top: -3px;
    left: -1px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #17171c;
  }
`;

const Bar = styled.div<{
  progress: number;
  levelColors: LevelColors;
  level: number;
}>`
  ${({ levelColors }) => {
    const rgbColor = hexToRGB(levelColors.background);
    return css`
      --color: ${rgbColor};
    `;
  }}
  position: relative;
  margin-left: 14px;
  width: 20vw;
  background-color: #000000;
  border-radius: 50px;
  ${({ progress, level }) => {
    if (progress > 90 || (progress > 90 && level === 7)) {
      return css`
        animation: pulse 1s infinite;
      `;
    }
  }}

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(var(--color), 0.4);
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

const Progress = styled.div<{
  progress: number;
  levelColors: LevelColors;
  isLevelingUp: boolean;
}>`
  position: relative;
  background: ${({ levelColors }) => levelColors.background};
  background-repeat: no-repeat;
  border-right: ${({ progress, isLevelingUp }) => (progress === 100 || isLevelingUp ? 'auto' : 'none')};
  border-top-right-radius: ${({ progress, isLevelingUp }) => (progress === 100 || isLevelingUp ? '50px' : '0')};
  border-bottom-right-radius: ${({ progress, isLevelingUp }) => (progress === 100 || isLevelingUp ? '50px' : '0')};
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
  background-color: ${({ levelColors }) => levelColors.background};
`;

export default XPBar;