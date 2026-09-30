const fs = require('fs');
const md = fs.readFileSync('docs/ETH-WEB-30.md', 'utf-8');
const lines = md.split(/\r?\n/);
console.error('Total lines:', lines.length);
function parseTask(startIdx) {
  const requirements = [];
  let description = '';
  let i = startIdx + 1;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '---' || line.startsWith('###')) break;
    if (line) {
      const dm = line.match(/^\*\*Deliverable:\*\*\s*(.+)/);
      if (dm) { description = dm[1]; continue; }
      const bm = line.match(/^\*\*Bonus:\*\*\s*(.+)/);
      if (bm) { requirements.push('Bonus: ' + bm[1]); continue; }
      const nm = line.match(/^(\d+)\.\s+(.+)/);
      if (nm) { requirements.push(nm[2].trim()); continue; }
      const fm = line.match(/^\*\*(File \d+|[A-Z][a-z]+ \d+:|Step \d+:)\*\*\s*(.+)/);
      if (fm) { requirements.push(fm[1].replace('**:', '') + ': ' + fm[3].trim()); continue; }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        requirements.push(line.substring(2).trim()); continue;
      }
      if (line.length > 10) { requirements.push(line); }
    }
    i++;
  }
  if (!description && requirements.length > 0) description = requirements.shift();
  if (!description) description = 'Complete the practical task';
  const seen = new Set();
  const uniqueReqs = requirements.filter(req => {
    if (seen.has(req)) return false;
    seen.add(req);
    return true;
  });
  return { description, requirements: uniqueReqs };
}
const taskStarts = [];
for (let i = 0; i < lines.length; i++) {
  if (/^### \u{1F9EA} DAY \d+ TASK/.test(lines[i].trim())) taskStarts.push(i);
}
console.error('Found task starts:', taskStarts.length);
taskStarts.forEach((idx, idx2) => {
  console.error('Processing task start at line', idx);
  const start = Date.now();
  const result = parseTask(idx);
  const elapsed = Date.now() - start;
  console.error('  -> took', elapsed, 'ms, description length', (result.description||'').length, 'requirements count', result.requirements.length);
  if (elapsed > 5000) {
    console.error('  -> SLOW!');
  }
});
