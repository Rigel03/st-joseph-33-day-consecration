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

  const blocks = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    if (line === '[[EDITORIAL_NOTE]]') {
      blocks.push({ type: 'editorial', text: '[[EDITORIAL_NOTE]]' });
      i++;
      continue;
    }

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

    // Look ahead to see if an attribution line occurs within the next 25 lines
    let foundAttrIdx = -1;
    for (let k = i + 1; k < Math.min(rawLines.length, i + 25); k++) {
      if (isAttributionLine(rawLines[k])) {
        foundAttrIdx = k;
        break;
      }
      if (rawLines[k] === '[[EDITORIAL_NOTE]]') break;
    }

    if (foundAttrIdx !== -1) {
      // Attribution found ahead. Find where the quote begins.
      let quoteStartIdx = foundAttrIdx - 1;
      while (quoteStartIdx > i) {
        const prevL = rawLines[quoteStartIdx - 1];
        if (prevL.endsWith(':') || isSentenceEnding(prevL) || isAttributionLine(prevL)) {
          break;
        }
        quoteStartIdx--;
      }

      // Everything from i up to quoteStartIdx is preceding narrative prose
      if (quoteStartIdx > i) {
        const narrativeLines = rawLines.slice(i, quoteStartIdx);
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

      // Quote lines from quoteStartIdx to foundAttrIdx - 1
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

    // Regular prose paragraph accumulation
    let currentPara = [];
    while (i < rawLines.length) {
      const pLine = rawLines[i];
      if (pLine === '[[EDITORIAL_NOTE]]') break;

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

// Generate src/data/days.json
const inputDaysPath = path.join(__dirname, '../src/data/days-content.json');
const outputDaysPath = path.join(__dirname, '../src/data/days.json');

const days = JSON.parse(fs.readFileSync(inputDaysPath, 'utf8'));

// Ensure Day 4 & Day 31 are split properly
const d4 = days.find(d => d.day === 4);
const d31 = days.find(d => d.day === 31);
if (d31.reading_text && d31.reading_text.includes('Privileges of Devotion to St. Joseph')) {
  const parts = d31.reading_text.split('Privileges of Devotion to St. Joseph');
  d31.reading_text = parts[0].trim();
  d4.reading_title = 'Privileges of Devotion to St. Joseph';
  d4.reading_text = parts[1].trim();
  fs.writeFileSync(inputDaysPath, JSON.stringify(days, null, 2), 'utf8');
}

let totalQuoteBlocks = 0;
let totalProseBlocks = 0;

const cleanedDays = days.map((d) => {
  const formattedReflection = formatContent(d.reflection);
  const formattedReading = d.reading_text ? formatContent(d.reading_text) : null;

  formattedReflection.split('\n\n').forEach(p => {
    if (p.startsWith('>')) totalQuoteBlocks++;
    else if (p !== '[[EDITORIAL_NOTE]]') totalProseBlocks++;
  });
  if (formattedReading) {
    formattedReading.split('\n\n').forEach(p => {
      if (p.startsWith('>')) totalQuoteBlocks++;
      else if (p !== '[[EDITORIAL_NOTE]]') totalProseBlocks++;
    });
  }

  const litanyIncluded = (d.closing_actions || []).some(a => a.toLowerCase().includes('litany'));
  const hasVeni = (d.closing_actions || []).some(a => a.toLowerCase().includes('veni'));
  const hasActOfConsecration = (d.closing_actions || []).some(a => a.toLowerCase().includes('consecration'));

  const additionalPrayers = [];
  if (hasVeni) additionalPrayers.push('veni-sancte-spiritus');
  if (hasActOfConsecration) additionalPrayers.push('calloway-long');

  return {
    day: d.day,
    title: d.title,
    theme: d.title,
    epigraph: d.epigraph || '',
    epigraph_attribution: d.epigraph_attribution || '',
    scripture_or_quote: d.epigraph ? {
      quote: d.epigraph,
      author: d.epigraph_attribution || 'Holy Tradition'
    } : undefined,
    reflection: formattedReflection,
    closing_actions: d.closing_actions || [],
    reading_title: d.reading_title || null,
    reading_text: formattedReading,
    reading: d.reading_title ? {
      title: d.reading_title,
      content: formattedReading || ''
    } : null,
    prayer: {
      title: `Day ${d.day} Prayers & Devotional Practices`,
      instruction: (d.closing_actions && d.closing_actions.length > 0)
        ? d.closing_actions.join(' • ')
        : 'Pray the Litany of St. Joseph',
      litany_included: litanyIncluded,
      additional_prayers: additionalPrayers
    }
  };
});

fs.writeFileSync(outputDaysPath, JSON.stringify(cleanedDays, null, 2), 'utf8');
console.log('Successfully generated cleaned, structured src/data/days.json!');
console.log(`Total quotes segregated: ${totalQuoteBlocks}`);
console.log(`Total prose paragraphs: ${totalProseBlocks}`);
