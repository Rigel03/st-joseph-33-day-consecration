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
  // Terminal punctuation: . ! ? … followed by optional footnote numbers and closing quotes
  return /[.!?…][\d\s]*["'”’]?$/.test(t) || /["'”’]$/.test(t);
}

function isAttributionLine(text) {
  if (!text) return false;
  const t = text.trim();
  return /^[—–-]\s*[A-Z]/.test(t);
}

function cleanRawString(rawText) {
  if (!rawText) return '';

  let text = rawText;

  // Fix OCR drops & anomalies
  text = text.replace(/\bave you ever read such a statement\b/g, 'Have you ever read such a statement');
  text = text.replace(/\n\s*th\s*\n\s*I take refuge in thy arms/g, '\nI take refuge in thy arms');
  text = text.replace(/at least the 16 century/g, 'at least the 16th century');

  // Clean GAP markers
  text = text.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );

  return text.replace(/\r\n/g, '\n');
}

function formatContent(rawText) {
  if (!rawText) return '';

  const text = cleanRawString(rawText);
  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Pass 1: Identify quote attribution indices and scan backwards to isolate quotes
  const blocks = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    if (line === '[[EDITORIAL_NOTE]]') {
      blocks.push({ type: 'editorial', text: '[[EDITORIAL_NOTE]]' });
      i++;
      continue;
    }

    // Check if a line ahead is an attribution line
    // E.g. rawLines[k] is attribution
    // Let's see if line itself is attribution (shouldn't happen alone, but handle safely)
    if (isAttributionLine(line)) {
      if (blocks.length > 0 && blocks[blocks.length - 1].type === 'prose') {
        const last = blocks.pop();
        blocks.push({
          type: 'quote',
          lines: [last.text],
          attribution: line
        });
      }
      i++;
      continue;
    }

    // Look ahead to see if an attribution line occurs within the next 20 lines without an empty sentence break
    let foundAttrIdx = -1;
    for (let k = i + 1; k < Math.min(rawLines.length, i + 25); k++) {
      if (isAttributionLine(rawLines[k])) {
        foundAttrIdx = k;
        break;
      }
      if (rawLines[k] === '[[EDITORIAL_NOTE]]') break;
    }

    if (foundAttrIdx !== -1) {
      // Attribution found at foundAttrIdx!
      // Where does the quote start?
      // Walk backwards from foundAttrIdx - 1
      let quoteStartIdx = foundAttrIdx - 1;
      while (quoteStartIdx > i) {
        const prevL = rawLines[quoteStartIdx - 1];
        if (prevL.endsWith(':') || isSentenceEnding(prevL) || isAttributionLine(prevL)) {
          break;
        }
        quoteStartIdx--;
      }

      // Everything from i up to quoteStartIdx is preceding narrative prose!
      if (quoteStartIdx > i) {
        // Collect narrative lines
        const narrativeLines = rawLines.slice(i, quoteStartIdx);
        // Assemble narrative lines, healing false breaks
        let currentPara = [];
        for (let m = 0; m < narrativeLines.length; m++) {
          const nLine = narrativeLines[m];
          currentPara.push(nLine);
          const endsPunct = isSentenceEnding(nLine);
          const isShort = nLine.length < 58;
          const nextLine = m + 1 < narrativeLines.length ? narrativeLines[m + 1] : '';
          const nextStartsCap = /^[A-Z“"']/.test(nextLine) && !/^[a-z]/.test(nextLine);

          if (endsPunct && isShort && nextStartsCap) {
            blocks.push({ type: 'prose', text: currentPara.join(' ').replace(/\s+/g, ' ') });
            currentPara = [];
          }
        }
        if (currentPara.length > 0) {
          blocks.push({ type: 'prose', text: currentPara.join(' ').replace(/\s+/g, ' ') });
        }
      }

      // Now collect the quote lines from quoteStartIdx to foundAttrIdx - 1
      const qLines = rawLines.slice(quoteStartIdx, foundAttrIdx);
      const attribution = rawLines[foundAttrIdx];

      blocks.push({
        type: 'quote',
        lines: qLines,
        attribution: attribution
      });

      i = foundAttrIdx + 1;
      continue;
    }

    // No attribution ahead. Regular prose paragraph accumulation:
    let currentPara = [];
    while (i < rawLines.length) {
      const pLine = rawLines[i];
      if (pLine === '[[EDITORIAL_NOTE]]') break;

      // If upcoming line has an attribution soon, break so next iteration catches it
      let hasAttrNear = false;
      for (let k = i; k < Math.min(rawLines.length, i + 5); k++) {
        if (isAttributionLine(rawLines[k])) {
          hasAttrNear = true;
          break;
        }
      }
      if (hasAttrNear) break;

      currentPara.push(pLine);
      i++;

      const endsPunct = isSentenceEnding(pLine);
      const isShort = pLine.length < 58;
      const nextLine = i < rawLines.length ? rawLines[i] : '';
      const nextStartsCap = /^[A-Z“"']/.test(nextLine) && !/^[a-z]/.test(nextLine);

      if (endsPunct && isShort && nextStartsCap) {
        break;
      }
    }

    if (currentPara.length > 0) {
      blocks.push({ type: 'prose', text: currentPara.join(' ').replace(/\s+/g, ' ') });
    }
  }

  // Convert blocks to markdown string with > for quotes and \n\n between paragraphs
  return blocks.map(b => {
    if (b.type === 'editorial') return '[[EDITORIAL_NOTE]]';
    if (b.type === 'quote') {
      const isVerse = b.lines.length > 2 && b.lines.every(l => l.length < 60 || l.endsWith(',') || l.endsWith(';'));
      if (isVerse) {
        const quoteFormatted = b.lines.map(l => `> ${l}`).join('\n');
        return `${quoteFormatted}\n> ${b.attribution}`;
      } else {
        const joined = b.lines.join(' ').replace(/\s+/g, ' ');
        return `> ${joined}\n> ${b.attribution}`;
      }
    }
    return b.text;
  }).join('\n\n');
}

// Test Day 22
const days = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/days-content.json'), 'utf8'));
const d22 = days.find(d => d.day === 22);
const formatted = formatContent(d22.reading_text);

console.log('--- FORMATTED DAY 22 READING ---');
const paras = formatted.split('\n\n');
console.log('Total paras:', paras.length);
paras.forEach((p, idx) => {
  if (p.startsWith('>')) {
    console.log(`\n[P${idx} QUOTE]:\n${p}`);
  } else {
    console.log(`\n[P${idx} PROSE (${p.length}c)]: ${p.slice(0, 70)}...`);
  }
});
