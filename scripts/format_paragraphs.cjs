const fs = require('fs');

function cleanAndReconstruct(text) {
  if (!text) return '';

  // 1. Replace GAP markers and stray OCR characters with clean EDITORIAL placeholder
  let processed = text.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );

  // 2. Normalize line breaks:
  // If the text already has double newlines, treat each chunk.
  // Within a chunk, join wrapped lines with a single space.
  const rawChunks = processed.split(/\n\s*\n/);
  const formattedParagraphs = [];

  for (const chunk of rawChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if (trimmed === '[[EDITORIAL_NOTE]]') {
      formattedParagraphs.push('[[EDITORIAL_NOTE]]');
      continue;
    }

    // Check if chunk is a quote attribution (starts with '—' or is short quote)
    // Or if it's lines of a poem/prayer (like Veni Sancte or numbered lists)
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

    // If it looks like a list or stanza (short lines, or starts with - or number or —)
    const isStanzaOrList = lines.length > 1 && lines.every(l => l.length < 50 || l.startsWith('—') || /^\d+\./.test(l));

    if (isStanzaOrList) {
      formattedParagraphs.push(lines.join('\n'));
    } else {
      // Normal prose paragraph: join lines with space
      // But preserve quotes starting with '— ' as separate line if on their own line
      let joined = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('—') || line.startsWith('- ')) {
          joined += '\n' + line;
        } else {
          joined += (joined.length > 0 && !joined.endsWith('\n') ? ' ' : '') + line;
        }
      }
      formattedParagraphs.push(joined);
    }
  }

  return formattedParagraphs.join('\n\n');
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

console.log('--- DAY 1 PROCESSED ---');
const d1Processed = cleanAndReconstruct(days[0].reflection);
const d1Paras = d1Processed.split('\n\n');
console.log('Paragraph count:', d1Paras.length);
d1Paras.forEach((p, idx) => {
  console.log(`[P${idx}] (${p.length} chars): ${p.slice(0, 70)}...`);
});
