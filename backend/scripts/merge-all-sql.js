import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..');
const migrationsDir = path.join(baseDir, 'migrations');
const srcMigrationsDir = path.join(baseDir, 'src', 'migrations');
const baseSchemaFile = path.join(baseDir, 'src', 'config', 'base_schema.sql');
const targetFile = path.join(baseDir, 'schema.sql');

function sanitizeSql(sql) {
  let cleaned = sql
    .replace(/^CREATE DATABASE.*?;/gim, '')
    .replace(/^USE .*?;/gim, '')
    // Fix MySQL Error 1362: Updating of NEW row is not allowed in after trigger
    .replace(/CREATE\s+TRIGGER\s+(\w+)\s+AFTER\s+UPDATE\s+ON/gi, 'DROP TRIGGER IF EXISTS $1;\nCREATE TRIGGER $1 BEFORE UPDATE ON')
    .replace(/CREATE\s+TRIGGER\s+IF\s+NOT\s+EXISTS\s+(\w+)\s+AFTER\s+UPDATE\s+ON/gi, 'DROP TRIGGER IF EXISTS $1;\nCREATE TRIGGER $1 BEFORE UPDATE ON');
  return cleaned.trim();
}

const output = [];
output.push('-- ============================================================================');
output.push('-- Ethiroli Complete All-in-One Database Schema');
output.push(`-- Generated on: ${new Date().toISOString()}`);
output.push('-- Compatible with Hostinger MySQL, LiteSpeed & phpMyAdmin');
output.push('-- ============================================================================');
output.push('');
output.push('SET FOREIGN_KEY_CHECKS = 0;');
output.push('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
output.push('SET time_zone = "+00:00";');
output.push('');

// 1. Read base schema
let baseSchema = fs.readFileSync(baseSchemaFile, 'utf8');

// Ensure Table 1b: user_credentials exists right in core base tables
const userCredsDefinition = `
-- Table 1b: user_credentials (Separate credential store with bcrypt/security policies)
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
`;

if (!baseSchema.includes('CREATE TABLE IF NOT EXISTS user_credentials')) {
  baseSchema = baseSchema.replace(
    /(-- Table 2:\s*sessions)/i,
    `${userCredsDefinition}\n$1`
  );
}

output.push('-- ============================================================================');
output.push('-- SECTION 1: Core Base Schema');
output.push('-- ============================================================================');
output.push(sanitizeSql(baseSchema));
output.push('');

// 2. Read backend/migrations/*.sql
if (fs.existsSync(migrationsDir)) {
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    output.push('-- ============================================================================');
    output.push(`-- SECTION: backend/migrations/${f}`);
    output.push('-- ============================================================================');
    const content = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
    output.push(sanitizeSql(content));
    output.push('');
  }
}

// 3. Read backend/src/migrations/*.sql (skip 002_analytics_tables.sql ClickHouse)
if (fs.existsSync(srcMigrationsDir)) {
  const files = fs.readdirSync(srcMigrationsDir).filter(f => f.endsWith('.sql') && f !== '002_analytics_tables.sql').sort();
  for (const f of files) {
    output.push('-- ============================================================================');
    output.push(`-- SECTION: backend/src/migrations/${f}`);
    output.push('-- ============================================================================');
    const content = fs.readFileSync(path.join(srcMigrationsDir, f), 'utf8');
    output.push(sanitizeSql(content));
    output.push('');
  }
}

// 4. Administrator and Super Administrator Seed Credentials
output.push('-- ============================================================================');
output.push('-- SECTION: Administrator & Super Admin Credentials Seed');
output.push('-- Default password for both accounts: Admin@123');
output.push('-- ============================================================================');
output.push(`
-- 1. Ensure System Roles Exist
INSERT INTO roles (id, code, name, description, security_rank, is_system_role) 
VALUES
  ('role-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'Global root platform administrator with full clearance', 100, 1),
  ('role-admin', 'ADMIN', 'Administrator', 'Platform operations and tenant manager', 80, 1)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  security_rank = VALUES(security_rank);

-- 2. Ensure Super Admin and Admin Users Exist in users table
INSERT INTO users (id, email, password_hash, full_name, role, is_active)
VALUES 
(
  '368f5c88-12cd-11ed-861d-0242ac120002',
  'admin@ethiroli.com',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'Super Administrator',
  'SUPER_ADMIN',
  1
),
(
  '479f6d99-23de-22fe-972e-0353bd230003',
  'admin@ethiroli.net',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'System Administrator',
  'ADMIN',
  1
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash),
  is_active = 1;

-- 3. Populate user_credentials table
INSERT INTO user_credentials (
  user_id,
  password_hash,
  password_algo,
  failed_login_attempts,
  lockout_until,
  requires_password_change,
  two_factor_enabled
)
VALUES 
(
  '368f5c88-12cd-11ed-861d-0242ac120002',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'BCRYPT',
  0,
  NULL,
  0,
  0
),
(
  '479f6d99-23de-22fe-972e-0353bd230003',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'BCRYPT',
  0,
  NULL,
  0,
  0
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0;

-- 4. Assign Roles in user_roles table
INSERT INTO user_roles (id, user_id, role_id, assigned_by)
VALUES
  ('ur-super-admin-01', '368f5c88-12cd-11ed-861d-0242ac120002', 'role-super-admin', 'SYSTEM'),
  ('ur-admin-01', '479f6d99-23de-22fe-972e-0353bd230003', 'role-admin', 'SYSTEM')
ON DUPLICATE KEY UPDATE 
  role_id = VALUES(role_id);
`);
output.push('');

output.push('SET FOREIGN_KEY_CHECKS = 1;');
output.push('');

const finalSql = output.join('\n');
fs.writeFileSync(targetFile, finalSql, 'utf8');
console.log(`Generated unified schema.sql (${finalSql.length} bytes, ${finalSql.split('\n').length} lines)`);
