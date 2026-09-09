const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

let introQuotes = [];
days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    const re = /(writes|states|wrote|said|stated|recounts):\s*\n+([^\n]+)/gi;
    let m;
    while ((m = re.exec(text)) !== null) {
      introQuotes.push({
        day: d.day,
        field,
        intro: m[1],
        following: m[2].trim().slice(0, 60)
      });
    }
  });
});

console.log('Detected quotes introduced by writes/states/said:', introQuotes.length);
console.log('Sample 10:');
introQuotes.slice(0, 10).forEach(q => console.log(`D${q.day} [${q.field}]: ${q.intro}: "${q.following}"`));
