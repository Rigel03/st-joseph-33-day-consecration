const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

let falseBreaks = [];
days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    const re = /([^\n]+)\n\s*\n([^\n]+)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const prev = m[1].trim();
      const next = m[2].trim();
      // Check if prev doesn't end in sentence terminator or next starts with lowercase
      const prevEndsPunct = /[.!?…:\"'”’\d]$/.test(prev) || /—\s*[^\n]+$/.test(prev);
      const nextStartsLower = /^[a-z]/.test(next);
      if (!prevEndsPunct || nextStartsLower) {
        falseBreaks.push({
          day: d.day,
          field,
          prevEnd: prev.slice(-40),
          nextStart: next.slice(0, 40)
        });
      }
    }
  });
});

console.log('Detected false paragraph breaks:', falseBreaks.length);
console.log('Sample 15 false breaks:');
falseBreaks.slice(0, 15).forEach((b) => {
  console.log(`D${b.day} [${b.field}]: ...${b.prevEnd} <BREAK> ${b.nextStart}...`);
});
