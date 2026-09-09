const fs = require('fs');

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

console.log('Test "about St.":', endsWithAbbreviation('about St.'));
console.log('Test "intercession of St.":', endsWithAbbreviation('intercession of St.'));
console.log('Test "Lk 2:52.":', endsWithAbbreviation('Lk 2:52.'));
console.log('Test "with Jesus.":', endsWithAbbreviation('with Jesus.'));
