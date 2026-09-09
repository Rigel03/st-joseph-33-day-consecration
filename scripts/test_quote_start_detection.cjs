const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

function isSentenceEnding(text) {
  if (!text) return false;
  const t = text.trim();
  // Attribution line is also ending
  if (/^[—–-]\s*[A-Z]/.test(t)) return true;
  return /[.!?…][\d\s]*["'”’]?$/.test(t) || /["'”’]$/.test(t);
}

let extractedQuotes = [];

days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      if (/^[—–-]\s*[A-Z]/.test(lines[i])) {
        // Walk backwards from i - 1
        let quoteStart = i - 1;
        while (quoteStart > 0) {
          const prev = lines[quoteStart - 1];
          // If prev line ended a sentence or was colon or was previous attribution, STOP
          if (prev.endsWith(':') || isSentenceEnding(prev)) {
            break;
          }
          quoteStart--;
        }
        const quoteLines = lines.slice(quoteStart, i);
        extractedQuotes.push({
          day: d.day,
          field,
          attr: lines[i],
          lineCount: quoteLines.length,
          quote: quoteLines.join(' ')
        });
      }
    }
  });
});

console.log('Total quotes extracted:', extractedQuotes.length);
console.log('Sample 15 extracted quotes:');
extractedQuotes.slice(0, 15).forEach((q) => {
  console.log(`D${q.day} [${q.field}] (${q.lineCount} lines): "${q.quote.slice(0, 70)}..." ${q.attr}`);
});

// Check if any quote is suspiciously long (e.g. > 15 lines)
const longQuotes = extractedQuotes.filter(q => q.lineCount > 15);
console.log('Quotes with > 15 lines:', longQuotes.length);
if (longQuotes.length > 0) {
  longQuotes.forEach(l => console.log(`Long quote D${l.day} [${l.field}] (${l.lineCount} lines): ${l.attr}`));
}
