const fs = require('fs');
const p = 'J:/eithiroli/ethiroli_react/scripts/generate-eth-web-30-json.js';
let c = fs.readFileSync(p, 'utf8');
let lines = c.split(/\r?\n/);

const idx1 = lines.findIndex(l => l.includes('// Check for file sections'));
if (idx1 === -1) { console.error('Block not found'); process.exit(1); }

const newBlockLines = [
  '      // Check for file sections',
  "      if (line.startsWith('**File ') && line.includes(':**')) {",
  "        const parts = line.split(':**');",
  '        if (parts.length === 2) {',
  "          const prefix = parts[0].substring(3); // Remove '**'",
  '          const content = parts[1].trim();',
  "          requirements.push(`${prefix}: ${content}`);",
  '          continue;',
  '        }',
  '      }'
];
lines.splice(idx1, 3, ...newBlockLines);

const idx2 = lines.findIndex(l => l.trim() === 'while (i < lines.length) {');
if (idx2 === -1) { console.error('While loop not found'); process.exit(1); }
lines.splice(idx2, 0, '  const maxLines = 2000; // Safety guard');
lines[idx2 + 1] = '  while (i < lines.length && (i - startIdx) < maxLines) {';

fs.writeFileSync(p, lines.join('\r\n'));
console.log('Updated');
