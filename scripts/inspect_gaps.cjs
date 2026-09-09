const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

days.forEach((d) => {
  const text = d.reflection;
  const re = /\[\[GAP:[^\]]+\]\]([^\n]*\n?){0,5}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const after = text.slice(m.index + m[0].indexOf(']]') + 2, m.index + m[0].indexOf(']]') + 50);
    console.log(`D${d.day}: ${JSON.stringify(after.replace(/\n/g, '\\n'))}`);
  }
});
