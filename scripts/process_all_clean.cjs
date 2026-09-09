const fs = require('fs');
const path = require('path');

const ABBREVIATIONS = new Set([
  'st', 'fr', 'sr', 'br', 'dr', 'mr', 'mrs', 'ms', 'rev',
  'gen', 'ex', 'mt', 'mk', 'lk', 'jn', 'ps', 'cor', 'rom',
  'gal', 'eph', 'phil', 'col', 'thess', 'tim', 'tit', 'heb',
  'pet', 'vol', 'p', 'pp', 'cf', 'vs', 'no', 'nos'
]);

function endsWithAbbreviation(text) {
  if (!text) return false;
  const match = text.trim().match(/\b([a-zA-Z]+)\.$/);
  if (match) {
    const word = match[1].toLowerCase();
    return ABBREVIATIONS.has(word);
  }
  return false;
}

function isSentenceEnding(text) {
  if (!text) return false;
  const t = text.trim();
  if (endsWithAbbreviation(t)) return false;
  return /[.!?…][\d\s]*["'”’]?$/.test(t) || /["'”’]$/.test(t);
}

function isAttributionLine(text) {
  if (!text) return false;
  const t = text.trim();
  return /^[—–-]\s*[A-Z]/.test(t);
}

function parseTextIntoStructuredBlocks(rawText) {
  if (!rawText) return [];

  // 1. Clean GAP markers and stray OCR characters
  let text = rawText.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );
  text = text.replace(/\r\n/g, '\n');

  const rawLines = text.split('\n');

  // 2. Stitch broken wraps and false page breaks
  const cleanLines = [];
  let buffer = '';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    if (line === '[[EDITORIAL_NOTE]]') {
      if (buffer) {
        cleanLines.push(buffer);
        buffer = '';
      }
      cleanLines.push('[[EDITORIAL_NOTE]]');
      continue;
    }

    if (isAttributionLine(line)) {
      if (buffer) {
        cleanLines.push(buffer);
        buffer = '';
      }
      cleanLines.push(line);
      continue;
    }

    if (buffer) {
      const bufferEndsPunct = isSentenceEnding(buffer) || buffer.endsWith(':');
      const lineStartsLower = /^[a-z]/.test(line);

      if (!bufferEndsPunct || lineStartsLower) {
        buffer += ' ' + line;
      } else {
        cleanLines.push(buffer);
        buffer = line;
      }
    } else {
      buffer = line;
    }
  }

  if (buffer) {
    cleanLines.push(buffer);
  }

  // 3. Convert cleanLines into structured blocks
  const blocks = [];
  for (let i = 0; i < cleanLines.length; i++) {
    const line = cleanLines[i];

    if (line === '[[EDITORIAL_NOTE]]') {
      blocks.push({ type: 'editorial', text: '[[EDITORIAL_NOTE]]' });
      continue;
    }

    if (isAttributionLine(line)) {
      if (blocks.length > 0 && blocks[blocks.length - 1].type === 'prose') {
        const prev = blocks.pop();
        blocks.push({
          type: 'quote',
          text: prev.text,
          attribution: line
        });
      } else {
        blocks.push({ type: 'prose', text: line });
      }
      continue;
    }

    // Check if line is an introduced quotation (e.g. starts after a colon)
    blocks.push({ type: 'prose', text: line });
  }

  return blocks;
}

// Convert blocks into markdown formatted text for backward compatibility,
// where quote blocks are formatted as:
// > [Quote text]
// > [Attribution]
function blocksToMarkdown(blocks) {
  return blocks.map(b => {
    if (b.type === 'editorial') {
      return '[[EDITORIAL_NOTE]]';
    }
    if (b.type === 'quote') {
      return `> ${b.text}\n> ${b.attribution}`;
    }
    return b.text;
  }).join('\n\n');
}

const days = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/days-content.json'), 'utf8'));

let totalQuotes = 0;
let totalProse = 0;
let totalEditorials = 0;
let suspiciousStarts = [];

days.forEach(d => {
  ['reflection', 'reading_text'].forEach(field => {
    const text = d[field];
    if (!text) return;
    const blocks = parseTextIntoStructuredBlocks(text);
    blocks.forEach(b => {
      if (b.type === 'quote') totalQuotes++;
      else if (b.type === 'editorial') totalEditorials++;
      else {
        totalProse++;
        if (/^[a-z]/.test(b.text)) {
          suspiciousStarts.push({ day: d.day, field, text: b.text.slice(0, 40) });
        }
      }
    });
  });
});

console.log('--- STATS ACROSS ALL 33 DAYS ---');
console.log('Total Quotes:', totalQuotes);
console.log('Total Prose Paragraphs:', totalProse);
console.log('Total Editorial Notes:', totalEditorials);
console.log('Suspicious lowercase block starts:', suspiciousStarts.length);
if (suspiciousStarts.length > 0) {
  console.log(suspiciousStarts);
}
