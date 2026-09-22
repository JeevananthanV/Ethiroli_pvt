import 'dotenv/config';
import pool from './src/config/database.js';

async function run() {
  const [cols] = await pool.query('DESCRIBE sessions');
  const colNames = cols.map(c => c.Field);
  console.log('sessions cols:', colNames);
  if (!colNames.includes('portal_slug')) {
    console.log('Adding portal_slug to sessions table...');
    await pool.query("ALTER TABLE sessions ADD COLUMN portal_slug VARCHAR(50) DEFAULT 'app' AFTER token");
    console.log('Added portal_slug successfully.');
  }

  // Also check tenant_users
  const [tables] = await pool.query("SHOW TABLES LIKE 'tenant_users'");
  console.log('tenant_users table exists:', tables.length > 0);
  if (tables.length === 0) {
    console.log('Creating tenant_users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenant_users (
        id VARCHAR(36) PRIMARY KEY,
        tenant_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        tenant_role VARCHAR(50) DEFAULT 'MEMBER',
        is_primary BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_tenant (user_id, tenant_id)
      )
    `);
    console.log('Created tenant_users table.');
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
