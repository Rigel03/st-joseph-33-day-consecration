const fs = require('fs');

function formatReflection(text) {
  if (!text) return [];
  
  // Replace [[GAP...]] with clean placeholder marker
  let cleaned = text.replace(/\[\[GAP:[^\]]+\]\](\s*“?[A-Z\s\n]+”?\s*([.!?]|(?=[A-Z])))?/g, '\n\n[[EDITORIAL_GAP]]\n\n');
  
  // Normalize paragraph line endings
  // In the raw extracted reflection, lines have single \n. Paragraph ends typically on [.!?:] or quotes or before a quote
  // Let's split by lines first
  const lines = cleaned.split('\n');
  const paragraphs = [];
  let currentPara = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (currentPara.length > 0) {
        paragraphs.push(currentPara.join(' '));
        currentPara = [];
      }
      continue;
    }

    if (line === '[[EDITORIAL_GAP]]') {
      if (currentPara.length > 0) {
        paragraphs.push(currentPara.join(' '));
        currentPara = [];
      }
      paragraphs.push(line);
      continue;
    }

    currentPara.push(line);
  }

  if (currentPara.length > 0) {
    paragraphs.push(currentPara.join(' '));
  }

  return paragraphs;
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const paras = formatReflection(days[0].reflection);
console.log('Day 1 paras count:', paras.length);
paras.forEach((p, i) => {
  console.log(`Para ${i} [${p.slice(0, 40)}...]`);
});
