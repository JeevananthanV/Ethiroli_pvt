-- ==========================================================
-- PROJECT MANAGEMENT DASHBOARD EXTENSION (Tables 91-94)
-- ==========================================================

USE ethiroli;

-- Table 91: project_milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    target_date DATE NOT NULL,
    completed_date DATE DEFAULT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'DELAYED') DEFAULT 'PENDING',
    deliverable_url VARCHAR(500) DEFAULT NULL,
    budget_allocated DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    INDEX idx_project_status (project_id, status),
    INDEX idx_target_date (target_date)
);

-- Table 92: project_sprints
CREATE TABLE IF NOT EXISTS project_sprints (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    sprint_number INT NOT NULL,
    sprint_name VARCHAR(100) NOT NULL,
    goal TEXT DEFAULT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING',
    target_velocity INT DEFAULT 0,
    actual_velocity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_proj_sprint (project_id, sprint_number),
    INDEX idx_proj_sprint_status (project_id, status)
);

-- Table 93: project_files
CREATE TABLE IF NOT EXISTS project_files (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    uploaded_by CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type VARCHAR(100) DEFAULT 'application/octet-stream',
    version VARCHAR(20) DEFAULT '1.0',
    category ENUM('SPECIFICATION', 'DESIGN_ASSET', 'DELIVERABLE', 'CONTRACT', 'MEETING_RECORDING', 'OTHER') DEFAULT 'SPECIFICATION',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_cat (project_id, category)
);

-- Table 94: project_expenses
CREATE TABLE IF NOT EXISTS project_expenses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    logged_by CHAR(36) NOT NULL,
    category ENUM('CLOUD_INFRA', 'SOFTWARE_LICENSE', 'HARDWARE', 'CONTRACTOR_FEE', 'TRAVEL', 'MISC') NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500) DEFAULT NULL,
    is_billable BOOLEAN DEFAULT TRUE,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'BILLED') DEFAULT 'PENDING',
    approved_by CHAR(36) DEFAULT NULL,
    approved_at DATETIME DEFAULT NULL,
    invoice_id CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (logged_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    INDEX idx_proj_expense (project_id, status),
    INDEX idx_expense_date (expense_date)
);

-- Tasks table linkage for Sprints and Milestones
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS project_id CHAR(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sprint_id CHAR(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS milestone_id CHAR(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(4,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(4,1) DEFAULT 0.0;
