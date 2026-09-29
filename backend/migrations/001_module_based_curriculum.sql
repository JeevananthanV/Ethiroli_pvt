-- ============================================
-- Ethiroli LMS - Module-Based Curriculum Migration
-- Migration: 001_module_based_curriculum
-- ============================================

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
-- End of migration
-- ============================================
