const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../../data/courses/eth-fs-45-phase1.json');
let content = fs.readFileSync(target, 'utf8');

const search = "PR is closed (merged or abandoned)'\n        },";
const replace = 'PR is closed (merged or abandoned)"\n        },';

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync(target, content, 'utf8');
  console.log('Successfully fixed eth-fs-45-phase1.json');
} else {
  console.log('Search pattern not found in eth-fs-45-phase1.json');
}

try {
  JSON.parse(content.replace(/^\uFEFF/, ''));
  console.log('eth-fs-45-phase1.json is 100% valid JSON!');
} catch (e) {
  console.error('Validation error:', e.message);
}
