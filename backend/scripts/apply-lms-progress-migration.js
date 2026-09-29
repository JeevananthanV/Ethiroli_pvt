/**
 * Apply the LMS course-modules/progress migration
 * (backend/migrations/004_lms_course_modules_progress.sql) to the live database.
 *
 * This is a thin, backwards-compatible wrapper around the shared runner in
 * scripts/apply-migration.js - which loads backend/.env, guards MySQL 8.0
 * ALTER/CREATE INDEX statements and runs every migration idempotently.
 *
 * Usage (from repo root or backend/):
 *   node backend/scripts/apply-lms-progress-migration.js
 *   node backend/scripts/apply-migration.js 004   # equivalent
 *
 * After applying, verify the schema with:
 *   node backend/scripts/audit-lms-db.cjs
 */
import { runMigration } from './apply-migration.js';

runMigration('004').catch((err) => {
  console.error('Migration apply failed:', err.message);
  process.exit(1);
});
