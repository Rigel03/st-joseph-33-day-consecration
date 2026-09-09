const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

let samples = [];
days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    const lines = text.split('\n').map(l => l.trim());
    for (let i = 0; i < lines.length; i++) {
      if (/^[—–-]\s*[A-Z]/.test(lines[i])) {
        // Look backwards to see where the quote begins
        const quoteLines = [];
        let j = i - 1;
        while (j >= 0 && lines[j]) {
          quoteLines.unshift(lines[j]);
          // If the line ends with a colon (e.g. "He writes:") or we hit a previous quote attribution, stop
          if (lines[j].endsWith(':') || /^[—–-]\s*[A-Z]/.test(lines[j])) break;
          // In the raw text, was there a blank line before this quote line?
          j--;
        }
        samples.push({
          day: d.day,
          field,
          attr: lines[i],
          quoteLines: quoteLines.slice(-4),
          totalLines: quoteLines.length,
          precedingLine: j >= 0 ? lines[j] : 'START'
        });
      }
    }
  });
});

console.log('Total quotes with attributions:', samples.length);
console.log('Sample 10 quotes with preceding boundaries:');
samples.slice(0, 10).forEach(s => {
  console.log(`D${s.day} [${s.field}] ${s.attr} (len ${s.totalLines} lines):`);
  console.log(`   Preceded by: "${s.precedingLine}"`);
  console.log(`   Quote snippet: "${s.quoteLines.join(' / ').slice(0, 80)}"`);
});
