-- ============================================================================
-- 004_impersonation_sessions.sql
-- Member-aware role switching / impersonation tracking for admin & super-admin
-- ============================================================================

-- 1. Track who initiated the impersonation and the origin session token so an
--    admin/super-admin can return to their own session with stop-impersonation.
ALTER TABLE sessions
  ADD COLUMN impersonated_by CHAR(36) NULL AFTER ip_address,
  ADD COLUMN impersonation_origin_token VARCHAR(255) NULL AFTER impersonated_by;

-- 2. Make sure deleting/removing the impersonator cascades safely (keeps history).
ALTER TABLE sessions
  ADD CONSTRAINT fk_sessions_impersonated_by FOREIGN KEY (impersonated_by) REFERENCES users(id) ON DELETE SET NULL;

-- 3. Index for quickly listing all active impersonation sessions.
CREATE INDEX idx_sessions_impersonated_by ON sessions (impersonated_by);