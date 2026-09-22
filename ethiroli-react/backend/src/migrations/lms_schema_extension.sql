-- ==========================================================
-- LMS SCHEMA EXTENSION (Tables 86-88)
-- ==========================================================

USE ethiroli;

-- Table 86: batches
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

-- Table 87: batch_students
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

-- Table 88: doubts
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
