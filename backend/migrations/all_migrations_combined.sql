-- ============================================================
-- Ethiroli LMS - All Migrations Combined (001-010)
-- Applied in order: 001 → 010
-- ============================================================


-- ---------------------------------------------------------------------
-- 001_module_based_curriculum.sql
-- Module-based curriculum foundation: technology_modules, module_topics,
-- course_modules, programs, program_modules, lessons.technology_module_id
-- ---------------------------------------------------------------------

-- Table 1: technology_modules (master registry of all curriculum modules)
CREATE TABLE IF NOT EXISTS technology_modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration_hours INT NOT NULL,
    description TEXT,
    topics JSON NULL,
    technologies JSON NULL,
    practicals JSON NULL,
    projects JSON NULL,
    prerequisites JSON NULL,
    learning_outcomes JSON NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_category_level (category, level)
);

-- Table 2: module_topics (individual topics within each module)
CREATE TABLE IF NOT EXISTS module_topics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    module_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic_order INT NOT NULL,
    estimated_hours DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES technology_modules(id) ON DELETE CASCADE,
    INDEX idx_module_order (module_id, topic_order)
);

-- Table 3: course_modules (modules associated with courses)
CREATE TABLE IF NOT EXISTS course_modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    module_id CHAR(36) NOT NULL,
    module_order INT NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    custom_duration_days DECIMAL(5,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES technology_modules(id) ON DELETE CASCADE,
    INDEX idx_course_order (course_id, module_order)
);

-- Table 4: programs (curriculum programs)
CREATE TABLE IF NOT EXISTS programs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    tracks JSON NULL,
    final_project VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
);

-- Table 5: program_modules (modules associated with programs)
CREATE TABLE IF NOT EXISTS program_modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    program_id CHAR(36) NOT NULL,
    module_id CHAR(36) NOT NULL,
    module_order INT NOT NULL,
    allocated_days INT NOT NULL,
    start_day INT DEFAULT NULL,
    end_day INT DEFAULT NULL,
    is_core BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES technology_modules(id) ON DELETE CASCADE,
    INDEX idx_program_order (program_id, module_order)
);

-- Table 6: Add technology_module_id column to lessons table
-- NOTE: one-time ALTER - MySQL 8.0 does not support `ADD COLUMN IF NOT EXISTS`.
-- The companion apply script (backend/scripts/apply-module-curriculum.js) guards
-- this operation so it can be re-run safely.
ALTER TABLE lessons ADD COLUMN technology_module_id CHAR(36) NULL;

-- Index on lessons technology_module_id for quick lookups
-- NOTE: MySQL 8.0 does not support `CREATE INDEX IF NOT EXISTS`
-- (MariaDB-only syntax). The companion apply script guards against
-- duplicate index errors on re-run.
CREATE INDEX idx_lessons_technology_module ON lessons (technology_module_id);

-- ============================================
-- End of migration 001
-- ============================================


-- ---------------------------------------------------------------------
-- 002_forum_course_id_nullable.sql
-- Makes forum_posts.course_id optional so students/tutors can create threads
-- without being forced to pick a course up front.
-- ---------------------------------------------------------------------

ALTER TABLE forum_posts MODIFY COLUMN course_id CHAR(36) NULL;


-- ============================================
-- End of migration 002
-- ============================================


-- ---------------------------------------------------------------------
-- 003_tutor_course_assignment.sql
-- Tutor Course Assignment Support
-- Supports many-to-many tutor-assigned courses for students
-- ---------------------------------------------------------------------

USE ethiroli;

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS assigned_by_tutor_id CHAR(36) NULL AFTER course_id,
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMP NULL DEFAULT NULL AFTER status,
  ADD COLUMN IF NOT EXISTS notes TEXT NULL AFTER completed_at;


-- ============================================
-- End of migration 003
-- ============================================


-- ---------------------------------------------------------------------
-- 004_lms_course_modules_progress.sql
-- LMS COURSE MODULES, LESSON PROGRESS & COMPLETION
-- Closes the gaps that kept the LMS from working end-to-end:
--   1. lesson_blocks  - interactive lesson content (video/markdown/code/resource)
--   2. lesson_progress - per-student, per-lesson completion tracking
--   3. modules.description / modules.duration_minutes - richer course modules
--   4. assignment_submissions.graded_by - grading audit trail
--   5. Seed badges used by the completion/gamification pipeline
-- ---------------------------------------------------------------------

-- 1. Lesson content blocks -------------------------------------
CREATE TABLE IF NOT EXISTS lesson_blocks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    lesson_id CHAR(36) NOT NULL,
    block_type ENUM('VIDEO', 'MARKDOWN', 'CODE_PLAYGROUND', 'QUIZ_EMBED', 'RESOURCE_DOWNLOAD', 'CALLOUT') NOT NULL,
    block_order INT NOT NULL DEFAULT 1,
    content_payload JSON NOT NULL,
    is_interactive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_order (lesson_id, block_order)
);

-- 2. Granular lesson progress ----------------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    enrollment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    lesson_id CHAR(36) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
    seconds_watched INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_lesson (student_id, lesson_id),
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_student (student_id)
);

-- 3. Course module metadata ------------------------------------
ALTER TABLE modules ADD COLUMN description TEXT NULL;
ALTER TABLE modules ADD COLUMN duration_minutes INT NULL;

-- 4. Assignment grading audit trail ----------------------------
ALTER TABLE assignment_submissions ADD COLUMN graded_by CHAR(36) NULL;

-- 5. Gamification badges ---------------------------------------
-- `badges.name` is UNIQUE, so ON DUPLICATE KEY UPDATE keeps re-runs a no-op.
INSERT INTO badges (id, name, description, icon, criteria) VALUES
  ('b3f1a000000000000000000000000001', 'Course Completed', 'Finished every lesson in a course from start to finish.', 'workspace_premium', '{"type":"COURSE_COMPLETION","courses":1}'),
  ('b3f1a000000000000000000000000002', 'First Lesson', 'Completed your very first lesson.', 'flag', '{"type":"LESSON_COMPLETION","lessons":1}'),
  ('b3f1a000000000000000000000000003', 'Module Master', 'Completed five course modules.', 'menu_book', '{"type":"MODULE_COMPLETION","modules":5}'),
  ('b3f1a000000000000000000000000004', 'Quiz Whiz', 'Scored 100% on a published quiz.', 'quiz', '{"type":"QUIZ_PASS","score":100}'),
  ('b3f1a000000000000000000000000005', 'Assignment Pro', 'Scored 90% or better on a graded assignment.', 'assignment_turned_in', '{"type":"ASSIGNMENT_GRADE","score":90}')
ON DUPLICATE KEY UPDATE name = VALUES(name);


-- ============================================
-- End of migration 004
-- ============================================


-- ---------------------------------------------------------------------
-- 005_forum_category_and_votes.sql
-- Forum Categories & Post Voting
-- The forum UI exposes a Category selector and an Upvote button, but
-- forum_posts has no category column and no votes table exists, so both
-- silently did nothing (the vote call 404'd). This migration adds:
--   1. forum_posts.category   - selectable, filterable thread category
--   2. forum_post_votes       - one upvote per user per post
-- ---------------------------------------------------------------------

-- 1. Thread category ------------------------------------------
ALTER TABLE forum_posts ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'general';
CREATE INDEX idx_forum_category ON forum_posts (category);

-- 2. One vote per user per post -------------------------------
CREATE TABLE IF NOT EXISTS forum_post_votes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    vote TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_post_user (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================
-- End of migration 005
-- ============================================


-- ---------------------------------------------------------------------
-- 006_course_completions.sql
-- MySQL counterpart of the ClickHouse analytics table of the same name.
-- `services/completionService.js` writes a row here whenever a learner finishes
-- a course (INSERT ... ON DUPLICATE KEY UPDATE), so the relational database
-- needs the table even though the warehouse copy lives in
-- src/migrations/002_analytics_tables.sql (ClickHouse only).
-- ---------------------------------------------------------------------

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


-- ============================================
-- End of migration 006
-- ============================================


-- ---------------------------------------------------------------------
-- 007_lead_crm_columns.sql
-- Lead/Crm columns on the leads table
-- The baseline `leads` table only has the encrypted catch-all `name` column -
-- sales endpoints join on first_name / last_name / company_name and fail.
-- ---------------------------------------------------------------------

ALTER TABLE leads
  ADD COLUMN first_name VARCHAR(255) NULL AFTER name,
  ADD COLUMN last_name VARCHAR(255) NULL AFTER first_name,
  ADD COLUMN company_name VARCHAR(255) NULL AFTER last_name;

CREATE INDEX idx_leads_company ON leads (company_name);


-- ============================================
-- End of migration 007
-- ============================================


-- ---------------------------------------------------------------------
-- 008_contact_inquiries.sql
-- Contact Inquiries tables
-- The baseline schema defines these tables, but they were never applied
-- to this live database. `operationsController` and `receptionController`
-- query `contact_inquiries`, so the endpoint would return 500 until restored.
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_inquiries (
    inquiry_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    inquiry_source ENUM('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','OTHER') DEFAULT 'WEBSITE',
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_is_resolved (is_resolved),
    INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS contact_inquiry_attachments (
    attachment_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    inquiry_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES contact_inquiries(inquiry_id) ON DELETE CASCADE,
    INDEX idx_inquiry (inquiry_id)
);


-- ============================================
-- End of migration 008
-- ============================================


-- ---------------------------------------------------------------------
-- 009_course_extra_fields.sql
-- Course extra fields for employee-portal and reception
-- The employee-portal / reception queries expect `courses.category`,
-- `courses.level` and `courses.thumbnail_url`. These columns never existed
-- on the baseline table, so every call to `/v1/employee/courses`,
-- `/v1/reception/...` and similar endpoints returned 500.
-- ---------------------------------------------------------------------

ALTER TABLE courses
  ADD COLUMN category VARCHAR(50) NULL AFTER description,
  ADD COLUMN level VARCHAR(20) NULL AFTER category,
  ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER level;

CREATE INDEX idx_courses_category ON courses (category);


-- ============================================
-- End of migration 009
-- ============================================


-- ---------------------------------------------------------------------
-- 010_approval_chain_name.sql
-- Approval chain name column
-- `/v1/employee/approvals` selects `ac.name` from approval_chains, but the
-- baseline table has no such column. Adding it (nullable) restores the
-- endpoint without changing any upstream code.
-- ---------------------------------------------------------------------

ALTER TABLE approval_chains
  ADD COLUMN name VARCHAR(255) NULL AFTER approval_condition;

CREATE INDEX idx_approval_chains_name ON approval_chains (name);


-- ============================================
-- End of migration 010
-- ============================================

-- ============================================================
-- All migrations 001-010 applied successfully.
-- Verify with:  SELECT * FROM information_schema.tables WHERE table_schema = 'ethiroli';
-- ============================================================