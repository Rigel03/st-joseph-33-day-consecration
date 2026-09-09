const fs = require('fs');

function isSentenceEnding(text) {
  if (!text) return false;
  const trimmed = text.trim();
  // Attribution line
  if (/^[—–-]\s*[A-Z]/.test(trimmed)) return true;
  // Ends with period, exclamation, question mark, ellipsis, or footnote digit after punct, or quotes
  return /[.!?…][\d\s]*["'”’]?$/.test(trimmed) || /["'”’]$/.test(trimmed);
}

function isAttribution(text) {
  if (!text) return false;
  const trimmed = text.trim();
  return /^[—–-]\s*[A-Z]/.test(trimmed);
}

function cleanAndStructureText(rawText) {
  if (!rawText) return '';

  // 1. Replace GAP markers and stray OCR characters
  let text = rawText.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );

  // 2. Normalize carriage returns
  text = text.replace(/\r\n/g, '\n');

  // 3. Split into lines
  const rawLines = text.split('\n');

  // 4. Group lines into coherent units
  // First pass: line-by-line assembly fixing broken wraps and page breaks
  const units = [];
  let currentBuffer = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      // Empty line encountered.
      // Is this a real paragraph break?
      if (currentBuffer.length === 0) continue;

      const currentText = currentBuffer.join(' ').trim();
      
      // Look ahead to find the next non-empty line
      let nextLine = '';
      for (let j = i + 1; j < rawLines.length; j++) {
        if (rawLines[j].trim()) {
          nextLine = rawLines[j].trim();
          break;
        }
      }

      // Check if currentText is NOT ending a sentence, or nextLine starts with lowercase
      const endsSentence = isSentenceEnding(currentText);
      const nextIsLowercase = /^[a-z]/.test(nextLine);

      if (!endsSentence || nextIsLowercase) {
        // FALSE BREAK! Continue accumulating into currentBuffer
        continue;
      } else {
        // REAL BREAK: flush currentBuffer as a unit
        units.push(currentBuffer.join(' ').trim());
        currentBuffer = [];
      }
      continue;
    }

    if (line === '[[EDITORIAL_NOTE]]') {
      if (currentBuffer.length > 0) {
        units.push(currentBuffer.join(' ').trim());
        currentBuffer = [];
      }
      units.push('[[EDITORIAL_NOTE]]');
      continue;
    }

    // Check if line is an attribution line: e.g. "— St. John Paul II"
    if (isAttribution(line)) {
      if (currentBuffer.length > 0) {
        // The preceding buffer was the quote!
        const quoteText = currentBuffer.join(' ').trim();
        units.push(`> ${quoteText}\n> ${line}`);
        currentBuffer = [];
      } else if (units.length > 0) {
        // Attach attribution to previous unit if it wasn't already an attribution
        const lastUnit = units[units.length - 1];
        if (!lastUnit.includes(line)) {
          units[units.length - 1] = `> ${lastUnit.replace(/^>\s*/, '')}\n> ${line}`;
        }
      }
      continue;
    }

    // Check if line starts with a quote attribution for Eucharistic prayers or stanzas
    currentBuffer.push(line);
  }

  if (currentBuffer.length > 0) {
    units.push(currentBuffer.join(' ').trim());
  }

  // 5. Return joined paragraphs
  return units.filter(Boolean).join('\n\n');
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const d22 = days.find(d => d.day === 22);
const cleaned = cleanAndStructureText(d22.reading_text);

console.log('--- TEST ON DAY 22 READING ---');
const paras = cleaned.split('\n\n');
console.log('Total paras in Day 22:', paras.length);

paras.forEach((p, idx) => {
  if (p.includes('Bishop Cule') || p.includes('Roman Canon') || p.includes('Eucharistic Prayer')) {
    console.log(`\n[Para ${idx}] (${p.length} chars):\n${p}`);
  }
});
