const fs = require('fs');
const path = require('path');

const prodSql = fs.readFileSync(path.join(__dirname, '..', 'u629721489_ethiroli_Db.sql'), 'utf8');
const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');

function getTableNamesFromProd(sql) {
  const matches = [...sql.matchAll(/CREATE TABLE `([a-zA-Z0-9_]+)`/gi)];
  return matches.map(m => m[1]);
}

function getTableNamesFromSchema(sql) {
  const matches = [...sql.matchAll(/CREATE TABLE (?:IF NOT EXISTS\s+)?`?([a-zA-Z0-9_]+)`?/gi)];
  return [...new Set(matches.map(m => m[1]))];
}

const prodTables = getTableNamesFromProd(prodSql);
const schemaTables = getTableNamesFromSchema(schemaSql);

console.log('=== TABLE COUNT ===');
console.log('Production Tables Count:', prodTables.length);
console.log('Schema Tables Count:', schemaTables.length);

const prodSet = new Set(prodTables);
const schemaSet = new Set(schemaTables);

const missingInSchema = prodTables.filter(t => !schemaSet.has(t));
const missingInProd = schemaTables.filter(t => !prodSet.has(t));

console.log('\n=== TABLES MISSING IN SCHEMA.SQL (Present in Prod):', missingInSchema.length);
console.log(missingInSchema);

console.log('\n=== TABLES MISSING IN PROD DUMP (Present in schema.sql):', missingInProd.length);
console.log(missingInProd);

// Check columns in prod vs schema
function extractTableColumnsFromProd(sql, tableName) {
  const tableBlockRegex = new RegExp(`CREATE TABLE \`${tableName}\` \\(([\\s\\S]*?)\\) ENGINE=`, 'i');
  const match = sql.match(tableBlockRegex);
  if (!match) return [];
  const body = match[1];
  const colLines = body.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('`'));
  return colLines.map(l => {
    const colNameMatch = l.match(/^`([a-zA-Z0-9_]+)`/);
    return colNameMatch ? colNameMatch[1] : null;
  }).filter(Boolean);
}

console.log('\n=== CHECKING COMMON TABLES FOR COLUMN DIFFERENCES ===');
const commonTables = prodTables.filter(t => schemaSet.has(t));
const diffs = [];

for (const t of commonTables) {
  const prodCols = extractTableColumnsFromProd(prodSql, t);
  // Look for columns in schema.sql for table t
  const schemaRegex = new RegExp(`CREATE TABLE (?:IF NOT EXISTS\\s+)?\`?${t}\`?\\s*\\(([\\s\\S]*?)\\)(?:\\s*ENGINE|;|\n\n)`, 'i');
  const match = schemaSql.match(schemaRegex);
  if (!match) continue;
  const body = match[1];
  const schemaColMatches = [...body.matchAll(/([a-zA-Z0-9_]+)\s+(?:VARCHAR|CHAR|INT|TINYINT|BIGINT|TEXT|LONGTEXT|MEDIUMTEXT|DATETIME|TIMESTAMP|DATE|TIME|ENUM|JSON|BOOLEAN|DECIMAL|FLOAT|DOUBLE)/gi)];
  const schemaCols = new Set(schemaColMatches.map(m => m[1].toLowerCase()));

  const missingColsInSchema = prodCols.filter(c => !schemaCols.has(c.toLowerCase()));
  if (missingColsInSchema.length > 0) {
    diffs.push({ table: t, missingColsInSchema });
  }
}

console.log('\n=== COLUMNS IN PROD BUT NOT IN BASE CREATE TABLE IN SCHEMA:', diffs.length);
console.log(JSON.stringify(diffs, null, 2));

// Check data inserts in prod
const insertMatches = [...prodSql.matchAll(/INSERT INTO `([a-zA-Z0-9_]+)`/gi)];
const prodInserts = [...new Set(insertMatches.map(m => m[1]))];
console.log('\n=== TABLES WITH DATA IN PROD DUMP (' + prodInserts.length + '):', prodInserts);
