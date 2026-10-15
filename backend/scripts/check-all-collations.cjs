const fs = require('fs');
const path = require('path');

const dump = fs.readFileSync(path.join(__dirname, '..', 'u629721489_ethiroli_Db (1).sql'), 'utf8');

const regex = /CREATE TABLE `([a-zA-Z0-9_]+)`[\s\S]*?ENGINE=InnoDB[^\n;]*(?:COLLATE=([a-zA-Z0-9_]+))?/gi;
let m;
const collations = {};
while ((m = regex.exec(dump)) !== null) {
  const tbl = m[1];
  const col = m[2] || 'DEFAULT_SERVER_COLLATION';
  if (!collations[col]) collations[col] = [];
  collations[col].push(tbl);
}

for (const [col, tbls] of Object.entries(collations)) {
  console.log(`Collation: ${col} (${tbls.length} tables)`);
  if (tbls.length < 20) {
    console.log('  Tables:', tbls.join(', '));
  }
}
