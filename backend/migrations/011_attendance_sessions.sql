-- ==========================================================
-- 011_attendance_sessions.sql
-- Multi-session (punch in/out) employee attendance.
--
-- Why this exists
-- ---------------
-- The `attendance` table is a per-DAY summary with a UNIQUE(user_id, date)
-- key, so it can hold only ONE check_in_time / check_out_time pair per day.
-- Its `total_hours` column is a STORED GENERATED column computed as
-- (check_out_time - check_in_time), i.e. first-in -> last-out. That wrongly
-- counts an un-punched break/lunch window as worked time.
--
--   09:00 in  13:00 out  14:00 in  18:00 out
--   generated total_hours = 9h  (should be 8h, 13:00-14:00 was a break)
--
-- To support several work sessions per day we add a child table that stores
-- each punch pair as its own row. Daily worked time is then the SUM of the
-- individual session durations, so breaks between sessions are excluded.
--
-- The legacy `attendance` row is preserved and kept in sync as the day-level
-- summary (first check-in / last check-out) so existing HR reports and
-- attendance listings continue to work unchanged.
-- ==========================================================

-- One row per work session (a punch-in / punch-out pair).
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    work_date DATE NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME DEFAULT NULL,
    worked_minutes INT GENERATED ALWAYS AS (
        IFNULL(TIMESTAMPDIFF(MINUTE, check_in_time, check_out_time), 0)
    ) STORED,
    status ENUM('ACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_user_date (user_id, work_date),
    INDEX idx_sessions_user_status (user_id, status)
);

-- "At most one ACTIVE session per user" is enforced in the application layer
-- (AttendanceSession.startSession checks for an open session inside a
-- transaction and the employee portal controller re-checks before insert).
-- A DB-level unique constraint was attempted via a generated active-marker
-- column, but MySQL refuses to index a stored generated column that depends
-- on a column participating in a foreign key, so it is not portable here.

-- True worked time for the day (sum of all completed/active session minutes).
-- 0 means "no sessions yet" so the legacy generated total_hours stays
-- authoritative for rows that predate this feature.
ALTER TABLE attendance ADD COLUMN worked_minutes INT NOT NULL DEFAULT 0;

-- Number of sessions recorded for the day (0 for pre-existing rows).
ALTER TABLE attendance ADD COLUMN session_count INT NOT NULL DEFAULT 0;
