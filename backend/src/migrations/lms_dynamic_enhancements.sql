-- ==========================================================
-- LMS DYNAMIC & INTERACTIVE ENHANCEMENTS MIGRATION
-- Database: ethiroli_db
-- ==========================================================

-- 1. Ensure Batches Table Exists
CREATE TABLE IF NOT EXISTS batches (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    tutor_id CHAR(36) NOT NULL,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_capacity INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_course (course_id),
    INDEX idx_tutor (tutor_id),
    INDEX idx_code (batch_code)
);

-- 2. Ensure Batch Students Table Exists
CREATE TABLE IF NOT EXISTS batch_students (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    batch_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_batch_student (batch_id, student_id),
    INDEX idx_batch (batch_id),
    INDEX idx_student (student_id)
);

-- 3. Ensure Doubts Management Table Exists
CREATE TABLE IF NOT EXISTS doubts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    lesson_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    code_snippet TEXT DEFAULT NULL,
    screenshot_url VARCHAR(500) DEFAULT NULL,
    status ENUM('OPEN', 'IN_REVIEW', 'RESOLVED') DEFAULT 'OPEN',
    assigned_tutor_id CHAR(36) DEFAULT NULL,
    resolution_notes TEXT DEFAULT NULL,
    resolved_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_tutor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_course_status (course_id, status),
    INDEX idx_student (student_id),
    INDEX idx_tutor (assigned_tutor_id)
);

-- 4. Question Bank (Validated Master Questions)
CREATE TABLE IF NOT EXISTS question_bank (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) DEFAULT NULL,
    module_id CHAR(36) DEFAULT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    question_type ENUM('MCQ', 'MULTI_SELECT', 'TRUE_FALSE', 'CODE_OUTPUT') NOT NULL DEFAULT 'MCQ',
    question_text TEXT NOT NULL,
    code_snippet TEXT DEFAULT NULL,
    explanation TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_topic_diff (topic, difficulty),
    INDEX idx_course (course_id)
);

-- 5. Question Options (Validated Server-Only Answer Key)
CREATE TABLE IF NOT EXISTS question_options (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question_id CHAR(36) NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
    INDEX idx_question (question_id)
);

-- 6. Quiz Questions Mapping (Association between Quiz and Question Bank)
CREATE TABLE IF NOT EXISTS quiz_questions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quiz_id CHAR(36) NOT NULL,
    question_id CHAR(36) NOT NULL,
    points INT DEFAULT 1,
    question_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
    UNIQUE KEY unique_quiz_question (quiz_id, question_id),
    INDEX idx_quiz_order (quiz_id, question_order)
);

-- 7. Lesson Blocks (Polymorphic Interactive Content Components)
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

-- 8. Granular Lesson Progress Tracking
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
