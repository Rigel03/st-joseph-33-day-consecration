const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

// Test on Day 1 Reflection and Day 3 Reading
[0, 2, 21].forEach((dayIdx) => {
  const d = days[dayIdx];
  console.log(`\n=================== DAY ${d.day}: ${d.title} ===================`);
  
  const text = d.reading_text || d.reflection;
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const endsPunct = /[.!?…][\d]*["'”’]?$/.test(trimmed);
    if (endsPunct && trimmed.length < 58) {
      console.log(`L${i} (len ${trimmed.length}): "${trimmed}"`);
    }
  });
});
