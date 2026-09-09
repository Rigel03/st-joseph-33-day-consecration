// scripts/merge_days.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { daysPart1 } from './data_days_part1.js';
import { daysPart2 } from './data_days_part2.js';
import { daysPart3 } from './data_days_part3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data');

const allDays = [...daysPart1, ...daysPart2, ...daysPart3];

console.log(`Merging ${allDays.length} days into days.json...`);

fs.writeFileSync(path.join(dataDir, 'days.json'), JSON.stringify(allDays, null, 2));
console.log('Successfully wrote src/data/days.json');
