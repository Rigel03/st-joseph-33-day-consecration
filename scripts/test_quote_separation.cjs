const fs = require('fs');

function isSentenceEnding(text) {
  if (!text) return false;
  const t = text.trim();
  return /[.!?…][\d\s]*["'”’]?$/.test(t) || /["'”’]$/.test(t);
}

function isAttributionLine(text) {
  if (!text) return false;
  const t = text.trim();
  return /^[—–-]\s*[A-Z]/.test(t);
}

function structureText(rawText) {
  if (!rawText) return [];

  // Clean GAP markers
  let text = rawText.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );
  text = text.replace(/\r\n/g, '\n');

  const rawLines = text.split('\n');

  // Step 1: Pre-process lines to ensure attributions and false-breaks are handled
  // We want to identify quote blocks.
  // A quote block ends at an attribution line: `— Author`
  // Where does it start?
  // Let's first collect all lines, but if an attribution line occurs:
  // We look backwards to find where the quote started.

  // Let's first clean up FALSE linebreaks:
  // A linebreak between line A and line B is a FALSE break if:
  // line A does not end with sentence-ending punctuation (or attribution)
  // OR line B starts with lowercase letter.
  // BUT: if line B is an attribution line (starts with —), it is NOT a false break.
  // AND: if line A ends with a colon `:`, line B is the quote (real break).
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

    // If buffer exists, should line be merged into buffer?
    if (buffer) {
      const bufferEndsPunct = isSentenceEnding(buffer) || buffer.endsWith(':');
      const lineStartsLower = /^[a-z]/.test(line);

      // In poetry/prayers, lines might be short and end with comma, but have stanzas:
      // e.g. "In communion with those whose memory we venerate,"
      // If buffer is part of a prayer stanza (has comma or short line)
      if (!bufferEndsPunct || lineStartsLower) {
        // FALSE BREAK: merge into buffer
        buffer += ' ' + line;
        continue;
      } else {
        // Legitimate line break
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

  // Step 2: Now cleanLines has sentences / paragraphs and attribution lines.
  // Group them into blocks:
  const blocks = [];
  for (let i = 0; i < cleanLines.length; i++) {
    const line = cleanLines[i];

    if (line === '[[EDITORIAL_NOTE]]') {
      blocks.push({ type: 'editorial', text: line });
      continue;
    }

    if (isAttributionLine(line)) {
      // The previous block was the quote!
      if (blocks.length > 0 && blocks[blocks.length - 1].type === 'prose') {
        const prev = blocks.pop();
        blocks.push({
          type: 'quote',
          text: prev.text,
          attribution: line
        });
      } else {
        blocks.push({ type: 'attribution', text: line });
      }
      continue;
    }

    // Check if previous line ended with a colon: "He writes:" or "She states:"
    // If so, this line is an introduced quote!
    if (i > 0 && cleanLines[i - 1].endsWith(':')) {
      // If the next line or line after is an attribution, it's a quote block
      // Or even without attribution, an introduced quote should be distinct
    }

    blocks.push({ type: 'prose', text: line });
  }

  return blocks;
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const d22 = days.find(d => d.day === 22);
const blocks = structureText(d22.reading_text);

console.log(`--- DAY 22 PARSED BLOCKS: ${blocks.length} ---`);
blocks.forEach((b, i) => {
  if (b.type === 'quote') {
    console.log(`[${i}] QUOTE: "${b.text.slice(0, 60)}..." ${b.attribution}`);
  } else if (b.type === 'editorial') {
    console.log(`[${i}] EDITORIAL`);
  } else {
    console.log(`[${i}] PROSE (${b.text.length}c): "${b.text.slice(0, 60)}..." [ends: "${b.text.slice(-25)}"]`);
  }
});
