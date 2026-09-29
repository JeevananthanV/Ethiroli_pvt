/**
 * Read-only LMS database audit.
 *
 * Verifies that every table/column the LMS controllers depend on actually
 * exists in the connected database, and prints row counts for the core
 * content tables. Never writes.
 *
 * Usage: node scripts/audit-lms-db.cjs
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const get = (k, d = '') => (env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1] ?? d).trim();
const DB_NAME = get('DB_NAME', 'ethiroli');

const wantTables = [
  'modules', 'lessons', 'lesson_blocks', 'lesson_progress', 'assignments',
  'assignment_submissions', 'certificates', 'user_badges', 'badges',
  'enrollments', 'courses', 'quizzes', 'quiz_attempts', 'quiz_questions',
  'question_bank', 'question_options', 'doubts', 'forum_posts',
  'forum_replies', 'mindmap_nodes', 'student_projects', 'attendance',
  'batches', 'batch_students', 'live_quiz_sessions'
];

const colChecks = [
  ['modules', 'description'],
  ['modules', 'duration_minutes'],
  ['assignment_submissions', 'graded_by'],
  ['enrollments', 'progress_percentage'],
  ['certificates', 'certificate_number'],
  ['lesson_progress', 'is_completed']
];

async function main() {
  const conn = await mysql.createConnection({
    host: get('DB_HOST', 'localhost'),
    port: Number(get('DB_PORT', '3306')),
    user: get('DB_USER', 'root'),
    password: get('DB_PASSWORD', ''),
    database: DB_NAME
  });

  const problems = [];
  const log = [];

  try {
    const [tables] = await conn.query(
      'SELECT table_name AS t FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
      [DB_NAME]
    );
    const present = new Set(tables.map((r) => r.t));
    log.push(`TABLES (${present.size}): ${[...present].join(', ')}`);

    for (const t of wantTables) {
      if (!present.has(t)) {
        problems.push(`MISSING TABLE: ${t}`);
        continue;
      }
      const [rows] = await conn.query(`SELECT COUNT(*) AS n FROM \`${t}\``);
      log.push(`count ${t} = ${rows[0].n}`);
    }

    for (const [t, c] of colChecks) {
      if (!present.has(t)) {
        problems.push(`MISSING COLUMN: ${t}.${c} (table absent)`);
        continue;
      }
      const [rows] = await conn.query(
        'SELECT COUNT(*) AS n FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ?',
        [DB_NAME, t, c]
      );
      const ok = rows[0].n > 0;
      if (!ok) problems.push(`MISSING COLUMN: ${t}.${c}`);
      log.push(`column ${t}.${c} exists=${ok}`);
    }

    try {
      const [badges] = await conn.query('SELECT name FROM badges ORDER BY name');
      log.push(`badges: ${badges.map((b) => b.name).join(', ') || '(none)'}`);
    } catch (e) {
      problems.push(`badges unreadable: ${e.message}`);
    }

    try {
      const [courses] = await conn.query('SELECT COUNT(*) AS n FROM courses');
      log.push(`courses = ${courses[0].n}`);
    } catch (e) {
      problems.push(`courses unreadable: ${e.message}`);
    }

    try {
      const [owners] = await conn.query(
        `SELECT u.role, u.full_name, COUNT(*) AS n
           FROM mindmap_nodes m JOIN users u ON u.id = m.user_id
          GROUP BY u.id, u.role, u.full_name ORDER BY n DESC`
      );
      log.push(`mindmap node owners: ${owners.map((o) => `${o.full_name}(${o.role})=${o.n}`).join(', ') || '(none)'}`);
    } catch (e) {
      problems.push(`mindmap owners unreadable: ${e.message}`);
    }
  } finally {
    await conn.end();
  }

  console.log(log.join('\n'));
  console.log('\n--- PROBLEMS ---');
  console.log(problems.length ? problems.join('\n') : 'none');
}

main().catch((err) => {
  console.error('AUDIT_FAILED:', err.message);
  process.exit(1);
});
