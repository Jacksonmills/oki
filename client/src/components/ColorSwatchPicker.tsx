// ColorSwatchPicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Edit, Edit2, Edit3 } from 'react-feather';
import styled from 'styled-components';

type ColorSwatchPickerProps = {
  userColors: string[];
  onSelect: (color: string) => void;
  currentHexcode: string;
};

const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  userColors,
  onSelect,
  currentHexcode
}) => {
  const [colors, setColors] = useState<string[]>([]);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const generateUniqueColors = () => {
      const newColors: string[] = [];

      while (newColors.length < 3) {
        const color = getRandomColor();

        if (
          !newColors.includes(color) &&
          !userColors.includes(color)
        ) {
          newColors.push(color);
        }
      }

      return newColors;
    };

    const uniqueColors = generateUniqueColors();
    setColors([...uniqueColors, 'picker']);
    onSelect(uniqueColors[0]);
  }, [userColors, onSelect]);

  const handleColorSelect = (color: string) => {
    onSelect(color);
  };

  const openColorPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <SwatchContainer>
      {colors.map((color, index) => (
        <Swatch
          key={index}
          color={color === 'picker' ? currentHexcode : color}
          selected={
            (color === 'picker' && !colors.slice(0, 3).includes(currentHexcode)) ||
            (color !== 'picker' && color === currentHexcode)
          }
          onClick={() => {
            if (color === 'picker') {
              openColorPicker();
            } else {
              handleColorSelect(color);
            }
          }}
        >
          {color === 'picker' && (
            <Edit />
          )}
        </Swatch>
      ))}
      <input
        ref={colorInputRef}
        type="color"
        value={currentHexcode}
        style={{ display: 'none' }}
        onChange={(e) => handleColorSelect(e.target.value)}
      />
    </SwatchContainer>
  );
};

const SwatchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 12px;
`;

const Swatch = styled.div<{ color: string; selected: boolean; }>`
  max-width: 64px;
  max-height: 64px;
  min-width: 36px;
  min-height: 36px;
  width: 100%;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  background-color: ${({ color }) => color};
  cursor: pointer;
  ${({ selected }) => (
    selected &&
    `
      outline: 2px solid white;
      outline-offset: 4px;
    `
  )}

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    stroke: ${({ color }) => color && getContrastColor(color)};
    width: 22px;
    height: 22px;
  }
`;

export default ColorSwatchPicker;
