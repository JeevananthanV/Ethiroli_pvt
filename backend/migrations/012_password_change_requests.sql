-- 012: employee password-change request workflow
--
-- An employee must not be able to change their own password on request alone.
-- They raise a request, an ADMIN / SUPER_ADMIN / HR (the same role set the
-- existing user reset-password route already uses) reviews it, and only an
-- approved, unexpired, unused grant lets that employee set a new password.
--
-- The grant is stored as a boolean-style authorisation window rather than a
-- delivered token: the employee's own authenticated session plus an approved,
-- unexpired, unused row for their user id is the authorisation. No password and
-- no password hash is ever stored in this table.

CREATE TABLE IF NOT EXISTS password_change_requests (
    id                CHAR(36)      NOT NULL DEFAULT (UUID()),
    user_id           CHAR(36)      NOT NULL,
    reason            VARCHAR(500)  DEFAULT NULL,
    status            ENUM('PENDING','APPROVED','REJECTED','COMPLETED','EXPIRED') NOT NULL DEFAULT 'PENDING',
    -- Fractional seconds: with whole-second timestamps two requests raised in the
    -- same second made "most recent request" ambiguous.
    requested_at      TIMESTAMP(6)  NULL DEFAULT CURRENT_TIMESTAMP(6),
    reviewed_by       CHAR(36)      DEFAULT NULL,
    reviewed_at       DATETIME(6)   DEFAULT NULL,
    review_note       VARCHAR(500)  DEFAULT NULL,
    grant_expires_at  DATETIME(6)   DEFAULT NULL,
    grant_used_at     DATETIME(6)   DEFAULT NULL,
    completed_at      DATETIME(6)   DEFAULT NULL,
    created_at        TIMESTAMP(6)  NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        TIMESTAMP(6)  NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_pcr_user (user_id),
    KEY idx_pcr_status (status),
    CONSTRAINT fk_pcr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
