-- ==========================================================
-- OPERATIONS SUITE SCHEMA EXTENSION (Tables 89-90)
-- ==========================================================

USE ethiroli;

-- Table 89: visitor_logs (Reception / Front Desk)
CREATE TABLE IF NOT EXISTS visitor_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    company VARCHAR(255) DEFAULT NULL,
    purpose VARCHAR(255) NOT NULL,
    person_to_meet CHAR(36) DEFAULT NULL,
    person_to_meet_name VARCHAR(255) DEFAULT NULL,
    badge_number VARCHAR(50) DEFAULT NULL,
    check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time DATETIME DEFAULT NULL,
    status ENUM('CHECKED_IN', 'CHECKED_OUT', 'EXPECTED') DEFAULT 'CHECKED_IN',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (person_to_meet) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_check_in (check_in_time)
);

-- Table 90: timesheets (Project Manager & Team Timesheet Tracking)
CREATE TABLE IF NOT EXISTS timesheets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    project_id CHAR(36) DEFAULT NULL,
    task_id CHAR(36) DEFAULT NULL,
    work_date DATE NOT NULL,
    hours_spent DECIMAL(4,2) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') DEFAULT 'SUBMITTED',
    approved_by CHAR(36) DEFAULT NULL,
    approved_at DATETIME DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_date (user_id, work_date),
    INDEX idx_project (project_id),
    INDEX idx_status (status)
);
