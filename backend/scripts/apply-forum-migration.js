/**
 * Apply the Forum migration (backend/migrations/002_forum_course_id_nullable.sql)
 * to the live `ethiroli` database in an idempotent, MySQL 8.0-safe way.
 *
 * Usage (from repo root or backend/):
 *   node backend/scripts/apply-forum-migration.js
 */
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin@123',
  database: process.env.DB_NAME || 'ethiroli',
};

async function columnIsNullable(conn, tableName, columnName) {
  const [rows] = await conn.execute(
    `SELECT IS_NULLABLE FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return rows.length > 0 && rows[0].IS_NULLABLE === 'YES';
}

async function main() {
  const conn = await mysql.createConnection({ ...DB_CONFIG, multipleStatements: true });
  console.log(`Connected to ${DB_CONFIG.database} on ${DB_CONFIG.host}:${DB_CONFIG.port}`);
  console.log(`Reading migration: ${path.join(__dirname, '..', 'migrations', '002_forum_course_id_nullable.sql')}`);

  try {
    const isNullable = await columnIsNullable(conn, 'forum_posts', 'course_id');
    if (isNullable) {
      console.log('[1/1] forum_posts.course_id is already NULL-able - skipped.');
    } else {
      console.log('[1/1] Making forum_posts.course_id NULL-able...');
      await conn.query('ALTER TABLE forum_posts MODIFY COLUMN course_id CHAR(36) NULL');
      console.log('      Column altered.');
    }

    const nowNullable = await columnIsNullable(conn, 'forum_posts', 'course_id');
    console.log(`Verification: forum_posts.course_id NULL-able: ${nowNullable ? 'OK' : 'FAILED'}`);
    if (!nowNullable) {
      console.error('\nMigration apply FAILED - forum_posts.course_id is still NOT NULL.');
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