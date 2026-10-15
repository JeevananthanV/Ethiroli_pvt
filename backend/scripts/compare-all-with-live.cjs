const fs = require('fs');
const path = require('path');

const liveDumpPath = path.join(__dirname, '..', 'u629721489_ethiroli_Db (1).sql');
const liveDump = fs.readFileSync(liveDumpPath, 'utf8');

// 1. Get all tables in live dump
const liveTableMatches = [...liveDump.matchAll(/CREATE TABLE `([a-zA-Z0-9_]+)`/gi)];
const liveTables = new Map();
liveTableMatches.forEach(m => {
  const tbl = m[1];
  const start = m.index;
  const end = liveDump.indexOf(';', start);
  const ddl = liveDump.slice(start, end + 1);
  const collMatch = ddl.match(/COLLATE=([a-zA-Z0-9_]+)/i);
  const colLines = ddl.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('`'))
    .map(l => {
      const colM = l.match(/^`([a-zA-Z0-9_]+)`\s+([^,\n]+)/);
      return colM ? { name: colM[1], type: colM[2] } : null;
    })
    .filter(Boolean);
  liveTables.set(tbl, {
    collation: collMatch ? collMatch[1] : 'DEFAULT',
    columns: colLines,
    ddl
  });
});

console.log(`Live Dump contains ${liveTables.size} tables.`);

// Check collations in live dump
const collationGroups = {};
for (const [tbl, data] of liveTables.entries()) {
  if (!collationGroups[data.collation]) collationGroups[data.collation] = [];
  collationGroups[data.collation].push(tbl);
}
console.log('\n--- Live Collation Groups ---');
for (const [col, tbls] of Object.entries(collationGroups)) {
  console.log(`${col}: ${tbls.length} tables`);
  if (tbls.length < 10) console.log('   Tables:', tbls.join(', '));
}

// 2. Scan all sql files in backend/migrations, backend/src/migrations, backend/schema.sql
const sqlDirs = [
  path.join(__dirname, '..'),
  path.join(__dirname, '..', 'migrations'),
  path.join(__dirname, '..', 'src', 'migrations')
];

const scannedTables = new Map();
const alterColumns = [];

for (const dir of sqlDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql') && !f.includes('u629721489') && !f.includes('live_production_update') && !f.includes('seed-all-roles-live') && !f.includes('seed-interns-live'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');

    // Find CREATE TABLE
    const createMatches = [...content.matchAll(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`?([a-zA-Z0-9_]+)`?\s*\(([\s\S]*?)\)(?:[^;]*);/gi)];
    for (const cm of createMatches) {
      const tName = cm[1];
      if (!scannedTables.has(tName)) {
        scannedTables.set(tName, { file: f, body: cm[2], full: cm[0] });
      }
    }

    // Find ALTER TABLE ADD COLUMN
    const alterMatches = [...content.matchAll(/ALTER TABLE\s+`?([a-zA-Z0-9_]+)`?\s+ADD\s+(?:COLUMN\s+)?(?:IF NOT EXISTS\s+)?`?([a-zA-Z0-9_]+)`?\s+([^;,\n]+)/gi)];
    for (const am of alterMatches) {
      alterColumns.push({ file: f, table: am[1], column: am[2], def: am[3].trim() });
    }
  }
}

console.log(`\nTotal unique tables defined in repo SQL files: ${scannedTables.size}`);

// Missing tables on live
const missingTables = [];
for (const [tName, tInfo] of scannedTables.entries()) {
  if (!liveTables.has(tName)) {
    missingTables.push({ table: tName, file: tInfo.file });
  }
}
console.log(`\n--- Tables in repo but MISSING on live (${missingTables.length}) ---`);
missingTables.forEach(t => console.log(`  - ${t.table} (from ${t.file})`));

// Missing columns in existing live tables
console.log('\n--- Checking ALTER TABLE columns against live ---');
const missingAlterCols = [];
for (const alt of alterColumns) {
  if (liveTables.has(alt.table)) {
    const liveColNames = liveTables.get(alt.table).columns.map(c => c.name.toLowerCase());
    if (!liveColNames.includes(alt.column.toLowerCase())) {
      missingAlterCols.push(alt);
    }
  }
}
console.log(`Missing ALTER columns on existing live tables (${missingAlterCols.length}):`);
missingAlterCols.forEach(c => console.log(`  - ${c.table}.${c.column} (from ${c.file})`));
