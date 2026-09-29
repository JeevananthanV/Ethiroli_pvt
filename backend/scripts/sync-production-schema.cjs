const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const prodDumpPath = path.join(baseDir, 'u629721489_ethiroli_Db.sql');
const targetSchemaPath = path.join(baseDir, 'schema.sql');

const prodSql = fs.readFileSync(prodDumpPath, 'utf8');

const output = [];

output.push('-- ============================================================================');
output.push('-- Ethiroli Complete Database Schema & Seed Data');
output.push(`-- Synchronized with Production Database Dump on: ${new Date().toISOString()}`);
output.push('-- Compatible with Hostinger MySQL 8.0, MariaDB 10/11, LiteSpeed, phpMyAdmin & Node.js');
output.push('-- ============================================================================');
output.push('');
output.push('SET FOREIGN_KEY_CHECKS = 0;');
output.push('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
output.push('SET time_zone = "+00:00";');
output.push('');

// Extract table bodies from prod dump (ignoring views that were exported with temporary table wrappers)
const tableBlocks = [];
const tableRegex = /CREATE TABLE `([^`]+)` \(([\s\S]*?)\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;/gi;
let match;
while ((match = tableRegex.exec(prodSql)) !== null) {
  const tableName = match[1];
  let body = match[2];
  if (tableName.startsWith('vw_')) continue; // handled in views section
  tableBlocks.push({ tableName, body });
}

console.log(`Extracted ${tableBlocks.length} tables from production dump.`);

// Extract PRIMARY KEYS, INDEXES, AUTO_INCREMENTS, and CONSTRAINTS
const pkMap = new Map();
const keyMap = new Map();
const fkMap = new Map();
const autoIncMap = new Map();

// Match ALTER TABLE `tablename` ADD PRIMARY KEY (`col`);
const pkRegex = /ALTER TABLE `([^`]+)`\s+ADD PRIMARY KEY \(([^)]+)\);/gi;
while ((match = pkRegex.exec(prodSql)) !== null) {
  pkMap.set(match[1], match[2]);
}

// Match ALTER TABLE `tablename` ADD KEY / UNIQUE KEY
const alterBlockRegex = /ALTER TABLE `([^`]+)`([\s\S]*?);/gi;
while ((match = alterBlockRegex.exec(prodSql)) !== null) {
  const tableName = match[1];
  const block = match[2];
  
  // Extract individual ADD KEY / UNIQUE
  const keyMatches = [...block.matchAll(/ADD (?:UNIQUE )?KEY `[^`]+` \([^)]+\)/gi)];
  if (keyMatches.length > 0) {
    if (!keyMap.has(tableName)) keyMap.set(tableName, []);
    for (const km of keyMatches) {
      keyMap.get(tableName).push(km[0].replace(/^ADD\s+/i, ''));
    }
  }

  // Extract constraints
  const fkMatches = [...block.matchAll(/ADD CONSTRAINT `[^`]+` FOREIGN KEY \([^)]+\) REFERENCES `[^`]+` \([^)]+\)(?: ON DELETE [A-Z ]+)?(?: ON UPDATE [A-Z ]+)?/gi)];
  if (fkMatches.length > 0) {
    if (!fkMap.has(tableName)) fkMap.set(tableName, []);
    for (const fm of fkMatches) {
      fkMap.get(tableName).push(fm[0].replace(/^ADD CONSTRAINT `[^`]+`\s+/i, 'CONSTRAINT ').replace(/`/g, ''));
    }
  }

  // Extract AUTO_INCREMENT
  const autoIncMatch = block.match(/MODIFY `([^`]+)` [^;]*AUTO_INCREMENT/i);
  if (autoIncMatch) {
    autoIncMap.set(tableName, autoIncMatch[1]);
  }
}

output.push('-- ============================================================================');
output.push('-- SECTION 1: Production Tables (1-to-1 Aligned)');
output.push('-- ============================================================================');
output.push('');

for (const { tableName, body } of tableBlocks) {
  output.push(`-- Table: ${tableName}`);
  output.push(`CREATE TABLE IF NOT EXISTS \`${tableName}\` (`);
  
  const lines = body
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => l.replace(/,+$/, '').trim()) // Strip existing trailing comma
    .filter(Boolean);

  const formattedCols = lines.map(l => {
    // If this column is auto-increment
    if (autoIncMap.get(tableName) && l.startsWith(`\`${autoIncMap.get(tableName)}\``)) {
      if (!l.includes('AUTO_INCREMENT')) {
        l = l.replace(/(int\(\d+\)|bigint\(\d+\))\s+NOT NULL/i, '$1 NOT NULL AUTO_INCREMENT');
      }
    }
    // Replace MariaDB uuid() with standard (UUID())
    l = l.replace(/DEFAULT\s+uuid\(\)/gi, 'DEFAULT (UUID())');
    return `  ${l}`;
  });

  // Add PRIMARY KEY if not inline
  if (pkMap.has(tableName)) {
    formattedCols.push(`  PRIMARY KEY (${pkMap.get(tableName)})`);
  }

  // Add Keys/Indexes
  if (keyMap.has(tableName)) {
    for (const k of keyMap.get(tableName)) {
      formattedCols.push(`  ${k}`);
    }
  }

  // Add Foreign Keys
  if (fkMap.has(tableName)) {
    for (const fk of fkMap.get(tableName)) {
      formattedCols.push(`  ${fk}`);
    }
  }

  output.push(formattedCols.join(',\n'));
  output.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
  output.push('');
}

// 2. Add App-specific Security & Enhanced Tables
output.push('-- ============================================================================');
output.push('-- SECTION 2: Security, RBAC & Extended Application Tables');
output.push('-- ============================================================================');
output.push(`
-- Table: user_credentials
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

-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id VARCHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  tenant_id VARCHAR(36) NULL,
  assigned_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_role_tenant (user_id, role_id, tenant_id),
  INDEX idx_ur_user (user_id),
  INDEX idx_ur_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: webhook_subscriptions
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tenant_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  events JSON NOT NULL,
  secret VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_delivery_at DATETIME DEFAULT NULL,
  last_delivery_status INT DEFAULT NULL,
  failure_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_webhook_tenant (tenant_id),
  INDEX idx_webhook_user (user_id),
  INDEX idx_webhook_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: application_status_history
CREATE TABLE IF NOT EXISTS application_status_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id CHAR(36) NOT NULL,
  status_id INT NOT NULL,
  changed_by CHAR(36) DEFAULT NULL,
  change_notes TEXT DEFAULT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES application_statuses(status_id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ash_application (application_id),
  INDEX idx_ash_status (status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: policy_rules
CREATE TABLE IF NOT EXISTS policy_rules (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NULL,
  role_id VARCHAR(36) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  effect ENUM('ALLOW', 'DENY') NOT NULL DEFAULT 'ALLOW',
  conditions JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_pr_role_resource (role_id, resource),
  INDEX idx_pr_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: break_glass_events
CREATE TABLE IF NOT EXISTS break_glass_events (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NULL,
  user_id CHAR(36) NOT NULL,
  elevated_role_id VARCHAR(36) NOT NULL,
  justification TEXT NOT NULL,
  approved_by CHAR(36) NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  revoked_by CHAR(36) NULL,
  status ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'REVOKED') NOT NULL DEFAULT 'PENDING',
  metadata JSON NULL,
  CONSTRAINT fk_bg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bg_role FOREIGN KEY (elevated_role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_bg_status (status),
  INDEX idx_bg_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: calendar_event_types
CREATE TABLE IF NOT EXISTS calendar_event_types (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'calendar',
  allowed_roles JSON NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_event_type_tenant_code (tenant_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: calendar_role_configs
CREATE TABLE IF NOT EXISTS calendar_role_configs (
  id VARCHAR(36) PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  tenant_id VARCHAR(36) DEFAULT NULL,
  visible_event_types JSON NOT NULL,
  can_create_event_types JSON NOT NULL,
  default_view ENUM('day','week','month','agenda') NOT NULL DEFAULT 'month',
  work_start_time TIME NOT NULL DEFAULT '09:00:00',
  work_end_time TIME NOT NULL DEFAULT '18:00:00',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_role_config_tenant (role, tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: recurring_rules
CREATE TABLE IF NOT EXISTS recurring_rules (
  id VARCHAR(36) PRIMARY KEY,
  frequency ENUM('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
  interval_val INT NOT NULL DEFAULT 1,
  by_day JSON DEFAULT NULL,
  by_month_day JSON DEFAULT NULL,
  count INT DEFAULT NULL,
  until_date DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: email_daily_quota
CREATE TABLE IF NOT EXISTS email_daily_quota (
  date_key DATE PRIMARY KEY,
  send_count INT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: incoming_webhook_logs
CREATE TABLE IF NOT EXISTS incoming_webhook_logs (
  id VARCHAR(36) PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  payload_json JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PROCESSED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: question_bank
CREATE TABLE IF NOT EXISTS question_bank (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  module_id CHAR(36) NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER') NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  difficulty ENUM('EASY','MEDIUM','HARD') NOT NULL DEFAULT 'MEDIUM',
  points DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  explanation TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_qb_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: question_options
CREATE TABLE IF NOT EXISTS question_options (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  question_id CHAR(36) NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
  INDEX idx_qo_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  quiz_id CHAR(36) NOT NULL,
  question_id CHAR(36) NOT NULL,
  question_order INT NOT NULL DEFAULT 0,
  points_override DECIMAL(5,2) NULL,
  PRIMARY KEY (quiz_id, question_id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);
output.push('');

// 3. Views
output.push('-- ============================================================================');
output.push('-- SECTION 3: Views');
output.push('-- ============================================================================');
output.push(`
CREATE OR REPLACE VIEW vw_active_job_postings AS
SELECT 
    jp.id AS job_id,
    jp.tenant_id,
    jp.title,
    jp.department_id,
    d.department_name,
    jp.category_id,
    jc.category_name,
    jp.job_type_id,
    jt.type_name AS job_type,
    jp.location,
    jp.is_remote,
    jp.experience_level,
    jp.min_salary,
    jp.max_salary,
    jp.currency,
    jp.created_at,
    jp.expires_at,
    COUNT(a.id) AS total_applications
FROM job_postings jp
LEFT JOIN departments d ON jp.department_id = d.department_id
LEFT JOIN job_categories jc ON jp.category_id = jc.category_id
LEFT JOIN job_types jt ON jp.job_type_id = jt.job_type_id
LEFT JOIN applications a ON jp.id = a.job_id
WHERE jp.status = 'ACTIVE' AND (jp.expires_at IS NULL OR jp.expires_at > NOW())
GROUP BY jp.id;
`);
output.push('');

// 4. Triggers (Safely using BEFORE UPDATE)
output.push('-- ============================================================================');
output.push('-- SECTION 4: Triggers');
output.push('-- ============================================================================');
const triggerRegex = /CREATE TRIGGER `([^`]+)` BEFORE UPDATE ON `([^`]+)` FOR EACH ROW SET NEW\.updated_at = CURRENT_TIMESTAMP/gi;
const triggerList = [];
while ((match = triggerRegex.exec(prodSql)) !== null) {
  triggerList.push({ name: match[1], table: match[2] });
}
for (const trg of triggerList) {
  output.push(`DROP TRIGGER IF EXISTS \`${trg.name}\`;`);
  output.push(`CREATE TRIGGER \`${trg.name}\` BEFORE UPDATE ON \`${trg.table}\``);
  output.push(`FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;`);
  output.push('');
}

// 5. Seed Data
output.push('-- ============================================================================');
output.push('-- SECTION 5: Master Seed Data');
output.push('-- ============================================================================');

// Extract inserts from prodSql
const insertRegex = /INSERT INTO `([^`]+)` \(([^)]+)\) VALUES([\s\S]*?);/gi;
while ((match = insertRegex.exec(prodSql)) !== null) {
  const tableName = match[1];
  const cols = match[2];
  const values = match[3].trim();
  output.push(`-- Seed Data for: ${tableName}`);
  output.push(`INSERT INTO \`${tableName}\` (${cols}) VALUES`);
  output.push(`${values}`);
  output.push('ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;');
  output.push('');
}

// Ensure Super Admin and System Admin passwords & user_credentials & user_roles
output.push(`
-- Administrator & Super Admin Credentials (Password: Admin@123)
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
  role = VALUES(role),
  is_active = 1;

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
fs.writeFileSync(targetSchemaPath, finalSql, 'utf8');
console.log(`Generated perfectly synchronized schema.sql (${finalSql.length} bytes, ${finalSql.split('\n').length} lines)`);
