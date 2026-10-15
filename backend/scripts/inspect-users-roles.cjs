const fs = require('fs');
const path = require('path');

const dump = fs.readFileSync(path.join(__dirname, '..', 'u629721489_ethiroli_Db (1).sql'), 'utf8');
const lines = dump.split('\n');
let lastTable = '';
for (const line of lines) {
  const m = line.match(/CREATE TABLE [`"]([^`"]+)[`"]/);
  if (m) lastTable = m[1];
  if (line.includes('utf8mb4_uca1400_ai_ci')) {
    console.log('Table with utf8mb4_uca1400_ai_ci:', lastTable);
  }
}
