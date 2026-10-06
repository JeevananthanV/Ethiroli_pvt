-- 014: self-service password recovery request
--
-- The existing `password_change_requests` table (migration 012) backs the
-- approval workflow, but every route that reached it sat behind `authenticate`
-- on /v1/employee/*, which made it unusable from the sign-in screen: a locked
---out employee cannot authenticate, so they could never raise a request.
--
-- This table backs the PUBLIC half of the flow:
--   1. An employee who cannot sign in submits email + employee_code on the login
--      screen. A row lands here, and the approval request that HR/Admin reviews
--      is raised against their real user_id.
--   2. An ADMIN / SUPER_ADMIN / HR approves it (the existing reviewer queue).
--   3. The employee returns to the login screen and sets a new password against
--      the approved, unexpired, unused grant.
--
-- No password and no password hash is ever stored in this table. It holds only
-- the recovery attempt itself, so that a flood of guesses against
-- email + employee_code can be rate-limited and audited.

CREATE TABLE IF NOT EXISTS password_recovery_requests (
    id                CHAR(36)      NOT NULL DEFAULT (UUID()),
    -- Denormalised so an audit survives the employee record being changed.
    email_hash        CHAR(64)      NOT NULL,
    employee_code     VARCHAR(50)   NOT NULL,
    user_id           CHAR(36)      DEFAULT NULL,
    reason            VARCHAR(500)  DEFAULT NULL,
    status            ENUM('PENDING','APPROVED','REJECTED','COMPLETED','EXPIRED')
                                      NOT NULL DEFAULT 'PENDING',
    requested_ip      VARCHAR(64)   DEFAULT NULL,
    requested_at      TIMESTAMP(6)  NULL DEFAULT CURRENT_TIMESTAMP(6),
    resolved_at       DATETIME(6)   DEFAULT NULL,
    created_at        TIMESTAMP(6)  NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        TIMESTAMP(6)  NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_prr_status (status),
    KEY idx_prr_email_hash (email_hash),
    KEY idx_prr_user (user_id),
    CONSTRAINT fk_prr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);
