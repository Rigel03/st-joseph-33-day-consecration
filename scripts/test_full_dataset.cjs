const fs = require('fs');

function cleanAndReconstruct(text) {
  if (!text) return '';

  let processed = text.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );

  const rawChunks = processed.split(/\n\s*\n/);
  const formattedParagraphs = [];

  for (const chunk of rawChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if (trimmed === '[[EDITORIAL_NOTE]]') {
      formattedParagraphs.push('[[EDITORIAL_NOTE]]');
      continue;
    }

    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

    // If chunk contains an attribution line like "— St. John Paul II"
    // keep attribution on its own line
    let joined = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('—') || line.startsWith('–') || line.startsWith('- ')) {
        joined += '\n' + line;
      } else {
        joined += (joined.length > 0 && !joined.endsWith('\n') ? ' ' : '') + line;
      }
    }
    formattedParagraphs.push(joined);
  }

  return formattedParagraphs.join('\n\n');
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

let totalReflectionParas = 0;
let totalReadingParas = 0;

days.forEach((d) => {
  const refCleaned = cleanAndReconstruct(d.reflection);
  const refParas = refCleaned.split('\n\n');
  totalReflectionParas += refParas.length;

  if (d.reading_text) {
    const readCleaned = cleanAndReconstruct(d.reading_text);
    const readParas = readCleaned.split('\n\n');
    totalReadingParas += readParas.length;
  }
});

console.log('Processed all 33 days successfully!');
console.log('Total reflection paragraphs:', totalReflectionParas);
console.log('Total reading paragraphs:', totalReadingParas);
