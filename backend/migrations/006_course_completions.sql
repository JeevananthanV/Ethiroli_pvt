-- ============================================================================
-- 006_course_completions.sql
--
-- MySQL counterpart of the ClickHouse analytics table of the same name.
-- `services/completionService.js` writes a row here whenever a learner finishes
-- a course (INSERT ... ON DUPLICATE KEY UPDATE), so the relational database
-- needs the table even though the warehouse copy lives in
-- src/migrations/002_analytics_tables.sql (ClickHouse only).
-- ============================================================================

CREATE TABLE IF NOT EXISTS course_completions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  enrollment_id VARCHAR(191) NOT NULL,
  student_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  completed_at DATETIME NOT NULL,
  certificate_number VARCHAR(100) DEFAULT NULL,
  issue_date DATE DEFAULT NULL,
  expiry_date DATE DEFAULT NULL,
  pdf_url VARCHAR(500) DEFAULT NULL,
  qr_code_url VARCHAR(500) DEFAULT NULL,
  status ENUM('PENDING', 'ISSUED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_course_completions_enrollment (enrollment_id),
  INDEX idx_completions_student (student_id),
  INDEX idx_completions_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
