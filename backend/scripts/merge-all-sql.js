import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..');
const migrationsDir = path.join(baseDir, 'migrations');
const srcMigrationsDir = path.join(baseDir, 'src', 'migrations');
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

// 1. Read base schema.sql
const baseSchema = fs.readFileSync(targetFile, 'utf8');
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

// 4. Ensure user_credentials table is explicitly included
output.push('-- ============================================================================');
output.push('-- SECTION: User Credentials & Security');
output.push('-- ============================================================================');
output.push(`CREATE TABLE IF NOT EXISTS user_credentials (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
output.push('');

output.push('SET FOREIGN_KEY_CHECKS = 1;');
output.push('');

const finalSql = output.join('\n');
fs.writeFileSync(targetFile, finalSql, 'utf8');
console.log(`Generated unified schema.sql (${finalSql.length} bytes, ${finalSql.split('\n').length} lines)`);
