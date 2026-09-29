const fs = require('fs');
const path = require('path');

const prodPath = path.join(__dirname, '..', 'u629721489_ethiroli_Db.sql');
const schemaPath = path.join(__dirname, '..', 'schema.sql');

const prodSql = fs.readFileSync(prodPath, 'utf8');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Parse tables from prod dump
// In phpMyAdmin MariaDB dump:
// CREATE TABLE `tablename` (
//   `col1` ...
//   `col2` ...
// ) ENGINE=...
function parseProdDump(sql) {
  const tableRegex = /CREATE TABLE `([^`]+)` \(([\s\S]*?)\) ENGINE=InnoDB/gi;
  const tables = new Map();
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const columns = [];
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const colMatch = line.match(/^`([^`]+)`\s+([^,]+)/);
      if (colMatch) {
        columns.push({
          name: colMatch[1],
          typeDef: colMatch[2].replace(/,$/, '').trim()
        });
      }
    }
    tables.set(tableName, { body, columns });
  }

  // Parse inserts
  const insertRegex = /INSERT INTO `([^`]+)` \(([^)]+)\) VALUES([\s\S]*?);/gi;
  const inserts = new Map();
  while ((match = insertRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const cols = match[2];
    const values = match[3];
    inserts.set(tableName, { cols, values: values.trim() });
  }

  return { tables, inserts };
}

function parseSchemaSql(sql) {
  const tableRegex = /CREATE TABLE (?:IF NOT EXISTS\s+)?`?([a-zA-Z0-9_]+)`?\s*\(([\s\S]*?)\)(?: ENGINE=InnoDB|\s*;|\n\n)/gi;
  const tables = new Map();
  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const body = match[2];
    const columns = [];
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const colMatch = line.match(/^`?([a-zA-Z0-9_]+)`?\s+([A-Za-z0-9_().,'"\s-]+)/);
      if (colMatch && !['FOREIGN', 'PRIMARY', 'UNIQUE', 'INDEX', 'KEY', 'CONSTRAINT', 'CHECK'].includes(colMatch[1].toUpperCase())) {
        columns.push({
          name: colMatch[1],
          typeDef: colMatch[2].replace(/,$/, '').trim()
        });
      }
    }
    tables.set(tableName, { body, columns });
  }
  return { tables };
}

const prodParsed = parseProdDump(prodSql);
const schemaParsed = parseSchemaSql(schemaSql);

console.log('=== COMPARISON SUMMARY ===');
console.log(`Production Tables: ${prodParsed.tables.size}`);
console.log(`Schema Tables:     ${schemaParsed.tables.size}`);
console.log(`Production Seeded: ${prodParsed.inserts.size} tables with data`);

// Check table differences
const prodTableNames = [...prodParsed.tables.keys()];
const schemaTableNames = [...schemaParsed.tables.keys()];

const inProdNotSchema = prodTableNames.filter(t => !schemaParsed.tables.has(t));
const inSchemaNotProd = schemaTableNames.filter(t => !prodParsed.tables.has(t));

console.log('\n--- In Production Dump only:');
console.log(inProdNotSchema);

console.log('\n--- In schema.sql only (App-level / Migrations to be applied):');
console.log(inSchemaNotProd);

// Check column differences for common tables
console.log('\n--- Column Differences in Common Tables:');
let colDiffCount = 0;
for (const [tName, tData] of prodParsed.tables.entries()) {
  if (!schemaParsed.tables.has(tName)) continue;
  const sData = schemaParsed.tables.get(tName);
  const prodColNames = tData.columns.map(c => c.name);
  const schemaColNames = new Set(sData.columns.map(c => c.name.toLowerCase()));

  const missingInSchema = prodColNames.filter(c => !schemaColNames.has(c.toLowerCase()));
  if (missingInSchema.length > 0) {
    colDiffCount++;
    console.log(`Table ${tName}: missing in schema ->`, missingInSchema);
  }
}
if (colDiffCount === 0) {
  console.log('All common table column names are aligned!');
}

console.log('\n--- Data Tables in Production:');
for (const [tName, data] of prodParsed.inserts.entries()) {
  console.log(`- ${tName} (${data.values.split('\n').length} row records)`);
}
