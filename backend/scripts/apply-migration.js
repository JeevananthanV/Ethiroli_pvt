/**
 * Generic, idempotent SQL migration runner.
 *
 * It applies, in order: backend/migrations/*.sql then backend/src/migrations/*.sql
 * (the legacy folder was never wired into a runner, so feature tables such as
 * sales_deals, project_milestones, timesheets, financial_budgets and
 * course_completions were missing from live databases).
 *
 * Usage (from repo root or backend/):
 *   node backend/scripts/apply-migration.js              # run every *.sql migration in order
 *   node backend/scripts/apply-migration.js 005          # run 005*.sql
 *   node backend/scripts/apply-migration.js 004_lms.sql  # run a specific file
 *
 * MySQL 8.0 has no `ADD COLUMN IF NOT EXISTS` / `ADD INDEX IF NOT EXISTS`, so
 * those statements are guarded with information_schema look-ups before being
 * executed. Everything else (`CREATE TABLE IF NOT EXISTS`, `INSERT ... ON
 * DUPLICATE KEY UPDATE`) is natively idempotent and is run as-is.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'migrations');
// Legacy location: these were never wired into a runner, so several feature
// tables (sales / pm / reception / finance / operations / analytics) were
// missing from live databases. Both directories are applied in order.
const LEGACY_MIGRATIONS_DIR = path.resolve(__dirname, '..', 'src', 'migrations');
const MIGRATIONS_DIRS = [MIGRATIONS_DIR, LEGACY_MIGRATIONS_DIR];

/**
 * Files that live in the migration folders but are not MySQL DDL.
 * `002_analytics_tables.sql` is a ClickHouse schema (CODEC/MATERIALIZED VIEW/TTL)
 * for the telemetry warehouse and would break the relational runner.
 */
const NON_MYSQL_MIGRATIONS = new Set(['002_analytics_tables.sql']);

const ENV_PATH = path.resolve(__dirname, '..', '.env');

/** Load backend/.env when present so the runner works without exported vars. */
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return;
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

function dbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Admin@123',
    database: process.env.DB_NAME || 'ethiroli'
  };
}

/** Strip `--` line comments and split on statement terminators. */
export function splitStatements(sql) {
  return sql
    .split(';')
    .map((statement) => statement
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n')
      .trim())
    .filter((statement) => statement.length > 0);
}

async function columnExists(conn, tableName, columnName) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return rows[0].n > 0;
}

async function indexExists(conn, tableName, indexName) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS n FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [tableName, indexName]
  );
  return rows[0].n > 0;
}

/** Execute one statement, applying MySQL 8.0 guards where needed. */
async function runStatement(conn, statement) {
  // MySQL 8.0 has no `ADD COLUMN IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS`,
  // so drop those clauses and let the information_schema guards below decide.
  const stmt = statement
    .replace(/(ADD\s+COLUMN\s+)IF\s+NOT\s+EXISTS\s+/gi, '$1')
    .replace(/(CREATE\s+(?:UNIQUE\s+)?INDEX\s+)IF\s+NOT\s+EXISTS\s+/gi, '$1');

  const alterMatch = stmt.match(/^ALTER\s+TABLE\s+`?(\w+)`?\s+ADD\s+COLUMN\s+`?(\w+)`?/i);
  if (alterMatch) {
    const [, tableName] = alterMatch;
    // One statement may add several columns - split it so a partially-existing
    // table still gets the ones that are missing.
    const matches = [...stmt.matchAll(/ADD\s+COLUMN\s+`?(\w+)`?/gi)];
    if (matches.length > 1) {
      let appliedAny = false;
      for (let i = 0; i < matches.length; i += 1) {
        const column = matches[i][1];
        const start = matches[i].index;
        const end = i + 1 < matches.length ? matches[i + 1].index : stmt.length;
        const definition = stmt
          .slice(start, end)
          .replace(/^\s*ADD\s+COLUMN\s+/i, '')
          .replace(/,\s*$/, '')
          .trim();
        if (await columnExists(conn, tableName, column)) {
          console.log(`  SKIP  ${tableName}.${column} (already exists)`);
          continue;
        }
        await conn.query(`ALTER TABLE \`${tableName}\` ADD COLUMN ${definition}`);
        console.log(`  OK    ${tableName}.${column} (column added)`);
        appliedAny = true;
      }
      return appliedAny ? 'applied' : 'skipped';
    }
    if (await columnExists(conn, tableName, alterMatch[2])) {
      console.log(`  SKIP  ${tableName}.${alterMatch[2]} (already exists)`);
      return 'skipped';
    }
    await conn.query(stmt);
    console.log(`  OK    ${tableName}.${alterMatch[2]} (column added)`);
    return 'applied';
  }

  const indexMatch = stmt.match(/^CREATE\s+INDEX\s+`?(\w+)`?\s+ON\s+`?(\w+)`?/i);
  if (indexMatch) {
    const [, indexName, tableName] = indexMatch;
    if (await indexExists(conn, tableName, indexName)) {
      console.log(`  SKIP  ${tableName}.${indexName} (index already exists)`);
      return 'skipped';
    }
    await conn.query(stmt);
    console.log(`  OK    ${tableName}.${indexName} (index added)`);
    return 'applied';
  }

  try {
    await conn.query(stmt);
  } catch (err) {
    // Re-running an already-applied migration must be a no-op, not a failure:
    // duplicate keys / indexes / foreign keys mean "already there".
    const benignCodes = ['ER_DUP_ENTRY', 'ER_DUP_KEYNAME', 'ER_DUP_FKNAME', 'ER_FK_DUP_NAME'];
    const benignErrnos = [1062, 1061, 1826, 1827];
    if (benignCodes.includes(err.code) || benignErrnos.includes(err.errno)) {
      console.log(`  SKIP  ${stmt.split('\n')[0].slice(0, 70)} (${err.code})`);
      return 'skipped';
    }
    throw err;
  }
  console.log(`  OK    ${stmt.split('\n')[0].slice(0, 70)}`);
  return 'applied';
}

/** Resolve a CLI argument (number, filename or absolute path) to a file path. */
function resolveMigration(target) {
  const direct = MIGRATIONS_DIRS
    .map((dir) => [path.resolve(dir, target), path.resolve(dir, `${target}.sql`), path.resolve(process.cwd(), target)])
    .flat()
    .find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  if (direct) {
    if (NON_MYSQL_MIGRATIONS.has(path.basename(direct))) {
      throw new Error(`${path.basename(direct)} is a ClickHouse schema, not MySQL - it is never applied here.`);
    }
    return direct;
  }

  const prefix = /^\d+/.test(target) ? target.split('_')[0] : null;
  if (prefix) {
    for (const dir of MIGRATIONS_DIRS) {
      const byNumber = fs.readdirSync(dir).find((f) => f.startsWith(`${prefix}_`) && f.endsWith('.sql'));
      if (byNumber) return path.resolve(dir, byNumber);
    }
  }

  return null;
}

function listMigrations() {
  return MIGRATIONS_DIRS.flatMap((dir) =>
    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.sql') && !NON_MYSQL_MIGRATIONS.has(f))
      .sort()
      .map((f) => path.resolve(dir, f))
  );
}

/**
 * Apply one migration file (or every migration when `target` is omitted).
 * Returns { applied, skipped }.
 */
export async function runMigration(target) {
  loadEnv();

  let files;
  if (target) {
    const file = resolveMigration(target);
    if (!file) {
      throw new Error(`Migration not found: ${target} (looked in ${MIGRATIONS_DIRS.join(', ')})`);
    }
    files = [file];
  } else {
    files = listMigrations();
    if (files.length === 0) throw new Error(`No .sql migrations in ${MIGRATIONS_DIR}`);
  }

  const config = dbConfig();
  const conn = await mysql.createConnection({ ...config, multipleStatements: false });
  console.log(`Connected to ${config.database} on ${config.host}:${config.port}`);

  let applied = 0;
  let skipped = 0;

  try {
    for (const file of files) {
      console.log(`\nReading migration: ${file}`);
      const statements = splitStatements(fs.readFileSync(file, 'utf8'));
      for (const statement of statements) {
        const result = await runStatement(conn, statement);
        if (result === 'applied') applied += 1;
        else skipped += 1;
      }
    }
  } finally {
    await conn.end();
  }

  console.log(`\nDone. (${applied} applied, ${skipped} skipped)`);
  return { applied, skipped };
}

// Only run when executed directly, not when imported for runMigration().
const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  runMigration(process.argv[2]).catch((err) => {
    console.error('Migration apply failed:', err.message);
    process.exit(1);
  });
}
