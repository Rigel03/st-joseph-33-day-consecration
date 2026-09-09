const fs = require('fs');
const path = require('path');

const daysPath = path.join(__dirname, '../src/data/days-content.json');
const outputDaysPath = path.join(__dirname, '../src/data/days.json');

const days = JSON.parse(fs.readFileSync(daysPath, 'utf8'));

function cleanAndReconstruct(text) {
  if (!text) return '';

  let processed = text.replace(
    /\[\[GAP:[^\]]+\]\](\s*["'“”’\sA-Za-z0-9,.-]{0,30}?[.!?])?/gu,
    '\n\n[[EDITORIAL_NOTE]]\n\n'
  );

  const rawChunks = processed.split(/\n\s*\n/);
  const formattedParagraphs = [];

  for (const chunk of rawChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if (trimmed === '[[EDITORIAL_NOTE]]') {
      formattedParagraphs.push('[[EDITORIAL_NOTE]]');
      continue;
    }

    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

    let joined = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('—') || line.startsWith('–') || line.startsWith('- ')) {
        joined += '\n' + line;
      } else {
        joined += (joined.length > 0 && !joined.endsWith('\n') ? ' ' : '') + line;
      }
    }
    formattedParagraphs.push(joined);
  }

  return formattedParagraphs.join('\n\n');
}

// Build unified 33-day array
const unifiedDays = days.map((d) => {
  const cleanReflection = cleanAndReconstruct(d.reflection);
  const cleanReadingText = d.reading_text ? cleanAndReconstruct(d.reading_text) : null;

  const litanyIncluded = (d.closing_actions || []).some(a => a.toLowerCase().includes('litany'));
  const hasVeni = (d.closing_actions || []).some(a => a.toLowerCase().includes('veni'));
  const hasActOfConsecration = (d.closing_actions || []).some(a => a.toLowerCase().includes('consecration'));

  const additionalPrayers = [];
  if (hasVeni) additionalPrayers.push('veni-sancte-spiritus');
  if (hasActOfConsecration) additionalPrayers.push('calloway-long');

  return {
    day: d.day,
    title: d.title,
    theme: d.title,
    epigraph: d.epigraph || '',
    epigraph_attribution: d.epigraph_attribution || '',
    scripture_or_quote: d.epigraph ? {
      quote: d.epigraph,
      author: d.epigraph_attribution || 'Holy Tradition'
    } : undefined,
    reflection: cleanReflection,
    closing_actions: d.closing_actions || [],
    reading_title: d.reading_title || null,
    reading_text: cleanReadingText,
    reading: d.reading_title ? {
      title: d.reading_title,
      content: cleanReadingText || ''
    } : null,
    prayer: {
      title: `Day ${d.day} Prayers & Devotional Practices`,
      instruction: (d.closing_actions && d.closing_actions.length > 0)
        ? d.closing_actions.join(' • ')
        : 'Pray the Litany of St. Joseph',
      litany_included: litanyIncluded,
      additional_prayers: additionalPrayers
    }
  };
});

fs.writeFileSync(outputDaysPath, JSON.stringify(unifiedDays, null, 2), 'utf8');
console.log('Successfully generated complete src/data/days.json with 33 full days!');
