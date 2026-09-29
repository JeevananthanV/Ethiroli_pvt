-- ================================================================
-- 004: LMS COURSE MODULES, LESSON PROGRESS & COMPLETION
-- Database: ethiroli
--
-- Closes the gaps that kept the LMS from working end-to-end:
--   1. lesson_blocks  - interactive lesson content (video/markdown/code/resource)
--   2. lesson_progress - per-student, per-lesson completion tracking
--   3. modules.description / modules.duration_minutes - richer course modules
--   4. assignment_submissions.graded_by - grading audit trail
--   5. Seed badges used by the completion/gamification pipeline
--
-- Apply with:  node backend/scripts/apply-lms-progress-migration.js
-- All statements are idempotent and safe to re-run.
-- ================================================================

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
