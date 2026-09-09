const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

let results = [];

days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      if (/^[—–-]\s*[A-Z]/.test(lines[i])) {
        // scan backwards
        let j = i - 1;
        let foundColon = false;
        let hitPreviousAttr = false;
        while (j >= 0) {
          if (/^[—–-]\s*[A-Z]/.test(lines[j])) {
            hitPreviousAttr = true;
            j++;
            break;
          }
          if (lines[j].endsWith(':')) {
            foundColon = true;
            j++;
            break;
          }
          // If we see an obvious paragraph boundary or footnote number at end of line
          j--;
        }
        if (j < 0) j = 0;
        results.push({
          day: d.day,
          field,
          attr: lines[i],
          quoteLines: i - j,
          foundColon,
          hitPreviousAttr
        });
      }
    }
  });
});

console.log('Total quotes analyzed:', results.length);
const withColon = results.filter(r => r.foundColon).length;
const withPrevAttr = results.filter(r => r.hitPreviousAttr).length;
const others = results.filter(r => !r.foundColon && !r.hitPreviousAttr);
console.log('Quotes preceded by colon:', withColon);
console.log('Quotes preceded by previous attribution:', withPrevAttr);
console.log('Others:', others.length);
console.log('Sample 10 others:');
others.slice(0, 10).forEach(o => {
  console.log(`D${o.day} [${o.field}] ${o.attr} (${o.quoteLines} lines)`);
});
