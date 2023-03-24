import fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'list.txt');
const file = fs.readFileSync(filePath, 'utf8');
const wordsArray = file.split('\n').filter((word) => word.trim() !== '');

export const blacklist = wordsArray;