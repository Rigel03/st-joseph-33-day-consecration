function getMatches(content, highlights) {
  const matches = [];

  for (const h of highlights) {
    if (!h.text || !h.text.trim()) continue;
    const target = h.text.trim();
    let idx = content.indexOf(target);
    while (idx !== -1) {
      matches.push({
        start: idx,
        end: idx + target.length,
        highlight: h
      });
      idx = content.indexOf(target, idx + 1);
    }
  }

  // Sort by start index
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // Filter out overlaps
  const nonOverlapping = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  const parts = [];
  let lastIdx = 0;
  for (const m of nonOverlapping) {
    if (m.start > lastIdx) {
      parts.push({ type: 'text', value: content.slice(lastIdx, m.start) });
    }
    parts.push({
      type: 'mark',
      color: m.highlight.color,
      value: content.slice(m.start, m.end)
    });
    lastIdx = m.end;
  }
  if (lastIdx < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIdx) });
  }

  return parts;
}

const sample = "Saint Joseph is our spiritual father. He protected the Holy Family and he will protect us too.";
const sampleHighlights = [
  { id: '1', text: 'spiritual father', color: 'gold' },
  { id: '2', text: 'Holy Family', color: 'rose' }
];

const parts = getMatches(sample, sampleHighlights);
console.log('Result parts:');
console.log(JSON.stringify(parts, null, 2));
