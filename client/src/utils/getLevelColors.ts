import { colorContrast } from '../utils/colorContrast';

export type LevelColors = {
  background: string;
  border: string;
  text: string;
};

export function getLevelColors(level: number): LevelColors {
  switch (level) {
    case 0:
      return {
        background: '#bababa',
        border: '#6e6e6e',
        text: colorContrast('#bababa'),
      };
    case 1:
      return {
        background: '#63ff1b',
        border: '#336e18',
        text: colorContrast('#63ff1b'),
      };
    case 2:
      return {
        background: '#f60b0b',
        border: '#ffffff',
        text: colorContrast('#f60b0b'),
      };
    case 3:
      return {
        background: '#ebca10',
        border: '#ab801a',
        text: colorContrast('#ebca10'),
      };
    case 4:
      return {
        background: '#ee11ee',
        border: '#ffffff',
        text: colorContrast('#ee11ee'),
      };
    case 5:
      return {
        background: '#ff8000',
        border: '#ffffff',
        text: colorContrast('#ff8000'),
      };
    case 6:
      return {
        background: '#0c45ef',
        border: '#ffffff',
        text: colorContrast('#0c45ef'),
      };
    case 7:
      return {
        background: '#ddfe09',
        border: '#09e5fe',
        text: colorContrast('#ddfe09'),
      };
    default:
      return {
        background: '#ffffff',
        border: '#000000',
        text: colorContrast('#ffffff'),
      };
  }
}
