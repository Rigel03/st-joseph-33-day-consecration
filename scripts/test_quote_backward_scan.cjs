const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

// Test isolating quote from preceding narrative in Day 22
const d22 = days.find(d => d.day === 22);
const lines = d22.reading_text.split('\n').map(l => l.trim()).filter(Boolean);

const attrIdx = lines.findIndex(l => l.includes('Eucharistic Prayer I (The Roman Canon)'));
console.log('Attribution at line', attrIdx, ':', lines[attrIdx]);

// Look backwards
let quoteStart = attrIdx - 1;
while (quoteStart > 0) {
  const prevLine = lines[quoteStart - 1];
  // If prevLine ends a complete sentence (period, question, exclamation) AND the current line starts capital
  if (/[.!?…]["'”’]?$/.test(prevLine)) {
    break;
  }
  quoteStart--;
}

console.log('Quote starts at line', quoteStart, ':', lines[quoteStart]);
console.log('Preceding line was:', lines[quoteStart - 1]);
console.log('Quote lines count:', attrIdx - quoteStart);
console.log('Quote snippet:\n' + lines.slice(quoteStart, attrIdx).join('\n'));
