const fs = require('fs');

function isSentenceEndingPunct(text) {
  if (!text) return false;
  const t = text.trim();
  // Checks for . ! ? … followed by optional footnote numbers, and optional closing quotes
  return /[.!?…][\d\s]*["'”’]?$/.test(t) || /["'”’]$/.test(t);
}

function isAttributionLine(text) {
  if (!text) return false;
  const t = text.trim();
  return /^[—–-]\s*[A-Z]/.test(t);
}

function parseTextToBlocks(rawText) {
  if (!rawText) return [];

  // Step 1: Clean GAP markers and stray OCR characters
  let text = rawText.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );

  text = text.replace(/\r\n/g, '\n');

  // Step 2: Split into raw lines
  const rawLines = text.split('\n');

  // Step 3: Stitch broken lines across page breaks (false breaks)
  // We assemble raw lines into normalized raw segments
  const segments = [];
  let currentSegment = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      if (currentSegment.length === 0) continue;

      // Check if currentSegment can break here
      const lastLine = currentSegment[currentSegment.length - 1];
      
      // Look ahead for the next non-empty line
      let nextLine = '';
      for (let j = i + 1; j < rawLines.length; j++) {
        if (rawLines[j].trim()) {
          nextLine = rawLines[j].trim();
          break;
        }
      }

      const endsPunct = isSentenceEndingPunct(lastLine) || isAttributionLine(lastLine);
      const nextStartsLower = /^[a-z]/.test(nextLine);

      if (!endsPunct || nextStartsLower) {
        // False break! Keep accumulating
        continue;
      } else {
        // Legitimate boundary
        segments.push(currentSegment);
        currentSegment = [];
      }
      continue;
    }

    if (line === '[[EDITORIAL_NOTE]]') {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
      segments.push(['[[EDITORIAL_NOTE]]']);
      continue;
    }

    // Also check if line itself is an attribution: "— St. ..."
    if (isAttributionLine(line)) {
      currentSegment.push(line);
      segments.push(currentSegment);
      currentSegment = [];
      continue;
    }

    currentSegment.push(line);
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  // Step 4: Process each segment into formatted blocks (prose, blockquote, or editorial)
  // Within a segment, lines that end with short punctuation or are quotes can be further structured
  const blocks = [];

  for (const segLines of segments) {
    if (segLines.length === 1 && segLines[0] === '[[EDITORIAL_NOTE]]') {
      blocks.push({ type: 'editorial', content: '[[EDITORIAL_NOTE]]' });
      continue;
    }

    // Check if segment ends with an attribution line:
    const lastLine = segLines[segLines.length - 1];
    const hasAttribution = isAttributionLine(lastLine);

    if (hasAttribution) {
      // Everything in this segment before the last line is the quote!
      const quoteLines = segLines.slice(0, -1);
      const attribution = lastLine;

      // If quote lines look like a poem or prayer (e.g. Eucharistic prayer stanzas)
      // or standard prose quote
      const quoteText = quoteLines.join('\n');
      blocks.push({
        type: 'quote',
        text: quoteText,
        attribution: attribution
      });
      continue;
    }

    // Check if segment is introduced by "writes:" or "states:" and has an indented block
    // Let's inspect sub-paragraphs within the segment:
    // A sub-paragraph ends when a line ends with punctuation AND line length < 58, OR followed by a quote
    let subParaLines = [];
    for (let k = 0; k < segLines.length; k++) {
      const l = segLines[k];
      subParaLines.push(l);

      const nextL = k + 1 < segLines.length ? segLines[k + 1] : '';
      const endsPunct = isSentenceEndingPunct(l);
      const isShortLine = l.length < 58;
      const nextStartsCap = /^[A-Z“"']/.test(nextL);

      // If line ends sentence and is short and next line starts with capital -> end of sub-paragraph!
      if (endsPunct && isShortLine && nextStartsCap && k < segLines.length - 1) {
        const joined = subParaLines.join(' ');
        // Check if this sub-paragraph is an introduced quote or regular prose
        blocks.push({ type: 'prose', text: joined });
        subParaLines = [];
      }
    }

    if (subParaLines.length > 0) {
      const joined = subParaLines.join(' ');
      blocks.push({ type: 'prose', text: joined });
    }
  }

  return blocks;
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const d22 = days.find(d => d.day === 22);
const blocks = parseTextToBlocks(d22.reading_text);

console.log(`--- DAY 22 PARSED BLOCKS (${blocks.length} blocks) ---`);
blocks.forEach((b, i) => {
  if (b.type === 'quote') {
    console.log(`\n[BLOCK ${i} - QUOTE]:\nText: "${b.text.replace(/\n/g, ' / ')}"\nAttr: "${b.attribution}"`);
  } else if (b.type === 'editorial') {
    console.log(`\n[BLOCK ${i} - EDITORIAL]`);
  } else {
    console.log(`\n[BLOCK ${i} - PROSE (${b.text.length} chars)]:\n${b.text.slice(0, 100)}... [ends with: "${b.text.slice(-30)}"]`);
  }
});
