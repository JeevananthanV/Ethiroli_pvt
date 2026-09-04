import fs from 'fs';
import path from 'path';
import pool from './database.js';

async function migrate() {
  console.log('Starting migrations...');
  const schemaPath = path.join(process.cwd(), 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  const queries = schemaSql
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0);

  for (const query of queries) {
    try {
      await pool.query(query); // Use pool.query instead of pool.execute
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
        console.error(`Error executing query: ${query.slice(0, 100)}...`, err.message);
      }
    }
  }

  console.log('Migrations completed successfully.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
