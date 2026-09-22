-- Migration: Integrations Schema Extension (Brevo Daily Quota & Incoming Webhook Logs)

CREATE TABLE IF NOT EXISTS email_daily_quota (
  quota_date DATE PRIMARY KEY,
  emails_sent INT DEFAULT 0,
  max_limit INT DEFAULT 300,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incoming_webhook_logs (
  id CHAR(36) PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  event VARCHAR(100) NULL,
  payload JSON NULL,
  status VARCHAR(20) DEFAULT 'PROCESSED',
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
