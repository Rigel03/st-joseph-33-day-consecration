const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

let quotes = [];
days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    
    // Find patterns like:
    // Quote followed by attribution: "— St. ..." or "— Blessed ..." or "- Eucharistic..."
    const re = /([^\n]+(?:\n[^\n]+){0,10}?)\n\s*([—–-]\s*[A-Z][^\n]+)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      quotes.push({
        day: d.day,
        field,
        attribution: m[2].trim(),
        snippet: m[1].trim().slice(-100)
      });
    }
  });
});

console.log('Detected quote blocks with attributions:', quotes.length);
console.log('Sample 10 quotes with attributions:');
quotes.slice(0, 10).forEach((q) => {
  console.log(`D${q.day} [${q.field}]: ...${q.snippet} ==> ${q.attribution}`);
});
