const fs = require('fs');
const days = JSON.parse(fs.readFileSync('src/data/days-content.json', 'utf8'));

days.forEach((d) => {
  ['reflection', 'reading_text'].forEach((field) => {
    const text = d[field];
    if (!text) return;
    const lines = text.split('\n');
    lines.forEach((l, idx) => {
      const trimmed = l.trim();
      if (/^[a-z]/.test(trimmed)) {
        // Is the previous line ending with a period or attribution?
        const prev = idx > 0 ? lines[idx - 1].trim() : '';
        if (prev.endsWith('.') || prev.endsWith('!') || prev.endsWith('?') || /^[—–-]/.test(prev)) {
          console.log(`D${d.day} [${field}] after "${prev.slice(-30)}": "${trimmed.slice(0, 40)}"`);
        }
      }
    });
  });
});
