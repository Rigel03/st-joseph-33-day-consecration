const fs = require('fs');

function cleanGapAndArtifacts(text) {
  if (!text) return '';
  return text.replace(/\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu, '\n\n[[EDITORIAL_NOTE: Small-caps motto omitted in source scan]]\n\n');
}

const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));
const cleanedD1 = cleanGapAndArtifacts(days[0].reflection);
console.log('--- DAY 1 SAMPLE ---');
console.log(cleanedD1.slice(0, 700));
