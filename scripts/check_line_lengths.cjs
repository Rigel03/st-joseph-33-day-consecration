const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const d22 = days.find(d => d.day === 22);

const lines = d22.reading_text.split('\n');
console.log('--- LINE LENGTHS OF PUNCTUATION LINES IN DAY 22 ---');
lines.forEach((line, i) => {
  const trimmed = line.trim();
  const endsPunct = /[.!?…][\d]*["'”’]?$/.test(trimmed);
  if (endsPunct) {
    console.log(`L${i} (len ${trimmed.length}): "${trimmed}"`);
  }
});
