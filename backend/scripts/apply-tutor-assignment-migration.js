/**
 * Apply the Tutor Course Assignment migration
 * to the live `ethiroli` database in an idempotent, MySQL 8.0-safe way.
 *
 * Usage:
 *   node backend/scripts/apply-tutor-assignment-migration.js
 */
import mysql from 'mysql2/promise';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin@123',
  database: process.env.DB_NAME || 'ethiroli',
};

async function columnExists(conn, tableName, columnName) {
  const [rows] = await conn.execute(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return rows.length > 0;
}

async function indexExists(conn, tableName, indexName) {
  const [rows] = await conn.execute(
    `SELECT INDEX_NAME FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [tableName, indexName]
  );
  return rows.length > 0;
}

async function foreignKeyExists(conn, tableName, constraintName) {
  const [rows] = await conn.execute(
    `SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
    [tableName, constraintName]
  );
  return rows.length > 0;
}

async function main() {
  const conn = await mysql.createConnection(DB_CONFIG);
  console.log(`Connected to ${DB_CONFIG.database} on ${DB_CONFIG.host}:${DB_CONFIG.port}`);

  try {
    // 1. Column: assigned_by_tutor_id
    if (await columnExists(conn, 'enrollments', 'assigned_by_tutor_id')) {
      console.log('[1/5] Column enrollments.assigned_by_tutor_id already exists.');
    } else {
      console.log('[1/5] Adding column enrollments.assigned_by_tutor_id...');
      await conn.query('ALTER TABLE enrollments ADD COLUMN assigned_by_tutor_id CHAR(36) NULL AFTER course_id');
      console.log('      Added assigned_by_tutor_id column.');
    }

    // 2. Column: due_date
    if (await columnExists(conn, 'enrollments', 'due_date')) {
      console.log('[2/5] Column enrollments.due_date already exists.');
    } else {
      console.log('[2/5] Adding column enrollments.due_date...');
      await conn.query('ALTER TABLE enrollments ADD COLUMN due_date TIMESTAMP NULL DEFAULT NULL AFTER status');
      console.log('      Added due_date column.');
    }

    // 3. Column: notes
    if (await columnExists(conn, 'enrollments', 'notes')) {
      console.log('[3/5] Column enrollments.notes already exists.');
    } else {
      console.log('[3/5] Adding column enrollments.notes...');
      await conn.query('ALTER TABLE enrollments ADD COLUMN notes TEXT NULL AFTER completed_at');
      console.log('      Added notes column.');
    }

    // 4. Index: idx_enrollment_tutor
    if (await indexExists(conn, 'enrollments', 'idx_enrollment_tutor')) {
      console.log('[4/5] Index idx_enrollment_tutor already exists.');
    } else {
      console.log('[4/5] Creating index idx_enrollment_tutor...');
      await conn.query('CREATE INDEX idx_enrollment_tutor ON enrollments(assigned_by_tutor_id)');
      console.log('      Created idx_enrollment_tutor.');
    }

    // 5. Foreign Key: fk_enrollments_tutor
    if (await foreignKeyExists(conn, 'enrollments', 'fk_enrollments_tutor')) {
      console.log('[5/5] Foreign key fk_enrollments_tutor already exists.');
    } else {
      console.log('[5/5] Creating foreign key fk_enrollments_tutor...');
      try {
        await conn.query(
          'ALTER TABLE enrollments ADD CONSTRAINT fk_enrollments_tutor FOREIGN KEY (assigned_by_tutor_id) REFERENCES users(id) ON DELETE SET NULL'
        );
        console.log('      Created foreign key fk_enrollments_tutor.');
      } catch (err) {
        console.warn('      Could not add foreign key constraint (may already exist under different name):', err.message);
      }
    }

    console.log('\nMigration completed successfully.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
