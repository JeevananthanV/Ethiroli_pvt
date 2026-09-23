-- ==============================================================================
-- Ethiroli Platform - Administrative Operational Governance Schema Extension
-- Purpose: Supports real-time security isolation, financial dispute reconciliation,
--          feature flag management & emergency kill-switches.
-- ==============================================================================

-- 1. Feature Flags Table
CREATE TABLE IF NOT EXISTS feature_flags (
  id CHAR(36) PRIMARY KEY,
  flag_key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  environment VARCHAR(50) NOT NULL DEFAULT 'PROD',
  rollout_percentage INT NOT NULL DEFAULT 100,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  tenant_id CHAR(36) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_flag_key (flag_key),
  INDEX idx_flag_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Security Threat Logs (WAF & Security Center)
CREATE TABLE IF NOT EXISTS security_threat_logs (
  id CHAR(36) PRIMARY KEY,
  threat_type VARCHAR(100) NOT NULL,
  source_ip VARCHAR(45) NOT NULL,
  target_endpoint VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL DEFAULT 'HIGH',
  status VARCHAR(50) NOT NULL DEFAULT 'IP_BLOCKED',
  details JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_threat_created (created_at),
  INDEX idx_threat_ip (source_ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Payroll Dispute & Reconciliation Extensions
-- Check and alter payroll status column if necessary
ALTER TABLE payroll 
  MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'DRAFT';

-- Add dispute and adjustment tracking columns if they don't already exist
ALTER TABLE payroll 
  ADD COLUMN IF NOT EXISTS dispute_reason TEXT NULL,
  ADD COLUMN IF NOT EXISTS adjustment_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS disputed_by CHAR(36) NULL,
  ADD COLUMN IF NOT EXISTS disputed_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS resolved_at DATETIME NULL;

-- 4. Seed Canonical Production Feature Flags
INSERT INTO feature_flags (id, flag_key, name, description, environment, rollout_percentage, is_enabled)
VALUES
  (UUID(), 'enable_ai_analytics', 'Gemini AI Telemetry', 'Enables predictive student drop-off analytics and AI curriculum assistant.', 'PROD', 100, 1),
  (UUID(), 'enable_stripe_billing', 'Stripe International Gateway', 'Allows USD and multi-currency credit card settlements.', 'PROD', 100, 1),
  (UUID(), 'enable_gamification_v2', 'Gamification Badges v2.0', 'New leaderboard algorithms and seasonal streak challenges.', 'CANARY', 50, 1),
  (UUID(), 'enable_automated_whatsapp', 'Automated WhatsApp Workflows', 'Dispatches interview and attendance notifications via WhatsApp gateway.', 'PROD', 100, 1),
  (UUID(), 'enable_dark_mode_global', 'Global OLED Dark Theme', 'Platform-wide dark theme toggle for high-density portals.', 'PROD', 100, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);

-- 5. Seed Real-time Security Threat Detections
INSERT INTO security_threat_logs (id, threat_type, source_ip, target_endpoint, severity, status, details)
VALUES
  (UUID(), 'BRUTE_FORCE_PREVENTION', '185.220.101.5', '/v1/auth/login', 'CRITICAL', 'IP_BLOCKED', '{"attempts": 15, "country": "DE"}'),
  (UUID(), 'UNAUTHORIZED_SCOPED_TOKEN', '194.26.29.112', '/v1/tenants/export', 'HIGH', 'TOKEN_REVOKED', '{"token_prefix": "ey...", "reason": "scope_mismatch"}'),
  (UUID(), 'RATE_LIMIT_EXCEEDED', '103.14.26.89', '/v1/users', 'MEDIUM', 'THROTTLED', '{"rate": "45 req/s", "limit": "30 req/s"}')
ON DUPLICATE KEY UPDATE status = VALUES(status);
