-- ============================================================================
-- 005_hierarchical_rbac_credentials.sql
-- Hierarchical RBAC, User Credentials Separation, and Password History Tracking
-- ============================================================================

USE ethiroli;

-- 1. Create user_credentials table if not exists
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

-- 2. Populate user_credentials for existing users from users.password_hash
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

-- 3. Ensure roles table has explicit ranks and hierarchy codes
INSERT INTO roles (id, code, name, description, security_rank, is_system_role) VALUES
  ('role-hr-superadmin', 'HR_SUPERADMIN', 'HR Super Administrator', 'Executive HR officer with platform-wide staff clearance', 90, 1),
  ('role-senior-tutor',  'SENIOR_TUTOR',  'Senior Lead Instructor', 'Senior academic staff leading tutor team and curriculum', 45, 1)
ON DUPLICATE KEY UPDATE 
  security_rank = VALUES(security_rank),
  name = VALUES(name),
  description = VALUES(description);

-- 4. Update HR rank to 60 and Tutor rank to 40 if needed
UPDATE roles SET security_rank = 60 WHERE code = 'HR';
UPDATE roles SET security_rank = 40 WHERE code = 'TUTOR';
