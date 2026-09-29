/**
 * Apply the Module-Based Curriculum migration (backend/migrations/001_module_based_curriculum.sql)
 * to the live `ethiroli` database in an idempotent, MySQL 8.0-safe way.
 *
 * Why this script exists:
 *  - MySQL 8.0 does not support `CREATE INDEX IF NOT EXISTS` or
 *    `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (MariaDB-only syntax).
 *  - This runner checks what already exists (tables / column / index) and only
 *    executes the statements that are still missing, so it can be re-run safely.
 *
 * Usage (from repo root or backend/):
 *   node backend/scripts/apply-module-curriculum.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin@123',
  database: process.env.DB_NAME || 'ethiroli',
};

const MIGRATION_PATH = path.resolve(__dirname, '..', 'migrations', '001_module_based_curriculum.sql');

async function tableExists(conn, tableName) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [tableName]
  );
  return rows[0].n > 0;
}

async function columnExists(conn, tableName, columnName) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return rows[0].n > 0;
}

async function indexExists(conn, tableName, indexName) {
  const [rows] = await conn.query(`SHOW INDEX FROM \`${tableName}\``);
  return rows.some((r) => r.Key_name === indexName);
}

async function main() {
  if (!fs.existsSync(MIGRATION_PATH)) {
    console.error(`Migration file not found: ${MIGRATION_PATH}`);
    process.exit(1);
  }

  const conn = await mysql.createConnection({ ...DB_CONFIG, multipleStatements: true });
  console.log(`Connected to ${DB_CONFIG.database} on ${DB_CONFIG.host}:${DB_CONFIG.port}`);
  console.log(`Reading migration: ${MIGRATION_PATH}`);

  try {
    // 1. Tables + index definitions inside CREATE TABLE - run the file but only
    //    the CREATE TABLE IF NOT EXISTS statements are safe to run directly.
    //    We execute the full file first; MySQL 8 will fail fast if the guarded
    //    statements below already exist, so we split the file instead:
    //    - Part A: everything up to (not including) the lessons ALTER.
    //    - Part B: lessons.technology_module_id column + index (guarded).
    const sql = fs.readFileSync(MIGRATION_PATH, 'utf8');

    const alterMarker = '-- Table 6: Add technology_module_id column to lessons table';
    const alterIndex = sql.indexOf(alterMarker);
    if (alterIndex < 0) {
      throw new Error(`Could not locate Table 6 marker in migration file`);
    }

    const partA = sql.substring(0, alterIndex);
    const partB = sql.substring(alterIndex);

    // --- Part A: CREATE TABLE IF NOT EXISTS blocks (native, idempotent) ---
    console.log('\n[1/3] Creating curriculum tables (technology_modules, module_topics, course_modules, programs, program_modules)...');
    await conn.query(partA);
    console.log('      Tables ensured.');

    // --- Part B1: lessons.technology_module_id column (guarded) ---
    const hasColumn = await columnExists(conn, 'lessons', 'technology_module_id');
    if (!hasColumn) {
      console.log('[2/3] Adding lessons.technology_module_id column...');
      await conn.query('ALTER TABLE lessons ADD COLUMN technology_module_id CHAR(36) NULL');
      console.log('      Column added.');
    } else {
      console.log('[2/3] lessons.technology_module_id column already exists - skipped.');
    }

    // --- Part B2: lessons.technology_module_id index (guarded) ---
    const hasIndex = await indexExists(conn, 'lessons', 'idx_lessons_technology_module');
    if (!hasIndex) {
      console.log('[3/3] Creating index idx_lessons_technology_module...');
      await conn.query('CREATE INDEX idx_lessons_technology_module ON lessons (technology_module_id)');
      console.log('      Index created.');
    } else {
      console.log('[3/3] Index idx_lessons_technology_module already exists - skipped.');
    }

    // --- Verification ---
    const expectedTables = ['technology_modules', 'module_topics', 'course_modules', 'programs', 'program_modules'];
    console.log('\nVerification:');
    let ok = true;
    for (const t of expectedTables) {
      const exists = await tableExists(conn, t);
      ok = ok && exists;
      console.log(`  ${exists ? 'OK  ' : 'MISS'} ${t}`);
    }
    ok = ok && (await columnExists(conn, 'lessons', 'technology_module_id')) && (await indexExists(conn, 'lessons', 'idx_lessons_technology_module'));
    console.log(`  ${(await columnExists(conn, 'lessons', 'technology_module_id')) ? 'OK  ' : 'MISS'} lessons.technology_module_id column`);
    console.log(`  ${(await indexExists(conn, 'lessons', 'idx_lessons_technology_module')) ? 'OK  ' : 'MISS'} idx_lessons_technology_module index`);

    if (!ok) {
      console.error('\nMigration apply FAILED - one or more objects missing.');
      process.exit(1);
    }
    console.log('\nMigration applied successfully.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Migration apply failed:', err.message);
  process.exit(1);
});