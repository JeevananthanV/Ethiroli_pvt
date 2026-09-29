import pool from '../src/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connection = await pool.getConnection();
  try {
    console.log('🔄 Executing Migration 005: Hierarchical RBAC and User Credentials...');
    
    // 1. Create user_credentials table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_credentials (
        user_id CHAR(36) PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        password_algo VARCHAR(30) NOT NULL DEFAULT 'BCRYPT',
        password_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        failed_login_attempts INT NOT NULL DEFAULT 0,
        lockout_until TIMESTAMP NULL DEFAULT NULL,
        requires_password_change BOOLEAN NOT NULL DEFAULT FALSE,
        password_history JSON NULL,
        two_factor_secret VARCHAR(255) NULL DEFAULT NULL,
        two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Table user_credentials ensured.');

    // 2. Populate user_credentials from users table for existing accounts
    const [result] = await connection.query(`
      INSERT INTO user_credentials (user_id, password_hash, password_algo, password_history, requires_password_change)
      SELECT 
        u.id, 
        u.password_hash, 
        'BCRYPT', 
        JSON_ARRAY(u.password_hash),
        FALSE
      FROM users u
      ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash);
    `);
    console.log(`✅ user_credentials populated / synchronized. Affected rows: ${result.affectedRows}`);

    // 3. Ensure role hierarchy ranks and newly defined hierarchy roles exist
    await connection.query(`
      INSERT INTO roles (id, code, name, description, security_rank, is_system_role) VALUES
        ('role-hr-superadmin', 'HR_SUPERADMIN', 'HR Super Administrator', 'Executive HR officer with platform-wide staff clearance', 90, 1),
        ('role-senior-tutor',  'SENIOR_TUTOR',  'Senior Lead Instructor', 'Senior academic staff leading tutor team and curriculum', 45, 1)
      ON DUPLICATE KEY UPDATE 
        security_rank = VALUES(security_rank),
        name = VALUES(name),
        description = VALUES(description);
    `);

    // 4. Update standard roles security_rank
    await connection.query(`UPDATE roles SET security_rank = 100 WHERE code = 'SUPER_ADMIN'`);
    await connection.query(`UPDATE roles SET security_rank = 80 WHERE code = 'ADMIN'`);
    await connection.query(`UPDATE roles SET security_rank = 60 WHERE code = 'HR'`);
    await connection.query(`UPDATE roles SET security_rank = 40 WHERE code = 'TUTOR'`);
    await connection.query(`UPDATE roles SET security_rank = 20 WHERE code = 'EMPLOYEE'`);
    await connection.query(`UPDATE roles SET security_rank = 10 WHERE code = 'STUDENT'`);
    console.log('✅ Role security ranks updated successfully.');

    // 5. Query verification
    const [roles] = await connection.query(`SELECT code, name, security_rank FROM roles ORDER BY security_rank DESC`);
    console.log('📋 Current Roles & Security Ranks:');
    console.table(roles);

    const [credCount] = await connection.query(`SELECT COUNT(*) as count FROM user_credentials`);
    console.log(`📋 Total records in user_credentials: ${credCount[0].count}`);

    console.log('🎉 Migration 005 completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

runMigration();
