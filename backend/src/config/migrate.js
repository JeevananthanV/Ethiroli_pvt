import fs from 'fs';
import path from 'path';
import pool from './database.js';
import logger from './logger.js';

async function migrate() {
  logger.info('Starting database migrations...');

  const schemaPath = path.join(process.cwd(), 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    logger.warn('schema.sql not found, skipping migrations.');
    return;
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Strip `--` comment lines *inside* each statement before filtering.
  // schema.sql prefixes every table with a `-- Table N: ...` comment, so
  // filtering on the raw chunk (`s.startsWith('--')`) used to discard the
  // entire statement. Comments are removed per line instead.
  const statements = schemaSql
    .split(';')
    .map(statement => statement
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .trim())
    .filter(s => s.length > 0);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      await pool.query(statement);
      successCount++;
    } catch (err) {
      const normalizedMessage = err.message.toLowerCase();

      if (
        normalizedMessage.includes('already exists') ||
        normalizedMessage.includes('duplicate') ||
        normalizedMessage.includes('duplicate entry')
      ) {
        skipCount++;
      } else {
        errorCount++;
        logger.error('Migration statement failed', {
          statement: statement.slice(0, 200),
          error: err.message
        });
      }
    }
  }

  logger.info('Migrations completed', {
    successCount,
    skipCount,
    errorCount
  });

  if (errorCount > 0) {
    logger.warn(`${errorCount} migration(s) encountered errors. Review logs.`);
  }
}

migrate().catch((err) => {
  logger.error('Migration process failed', { error: err.message });
  process.exit(1);
});
