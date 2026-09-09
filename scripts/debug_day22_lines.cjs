const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const d22 = days.find(d => d.day === 22);

const rawLines = d22.reading_text.split('\n');
console.log('Total raw lines in Day 22 reading:', rawLines.length);

rawLines.forEach((l, idx) => {
  if (!l.trim()) {
    const prev = rawLines[idx - 1] ? rawLines[idx - 1].trim() : '';
    const next = rawLines[idx + 1] ? rawLines[idx + 1].trim() : '';
    console.log(`Blank at line ${idx}: prev="${prev.slice(-30)}" | next="${next.slice(0, 30)}"`);
  }
});
