-- ==========================================================
-- HRMS ARCHITECTURAL ENHANCEMENTS (Tables 79-82 + Alterations)
-- ==========================================================

USE ethiroli;

-- Alter Table 9 (attendance): upgrade total_hours calculation from integer hours to 2-decimal fractional hours
-- Uncomment/run if attendance table is already present with integer TIMESTAMPDIFF
-- ALTER TABLE attendance MODIFY COLUMN total_hours DECIMAL(5,2) GENERATED ALWAYS AS (ROUND(TIMESTAMPDIFF(SECOND, check_in_time, check_out_time) / 3600.0, 2)) STORED;

-- Table 79: leave_balances
CREATE TABLE IF NOT EXISTS leave_balances (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    leave_type ENUM('CASUAL','SICK','EARNED') NOT NULL,
    financial_year VARCHAR(10) NOT NULL,
    total_credited DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    consumed DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    balance DECIMAL(4,1) GENERATED ALWAYS AS (total_credited - consumed) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_year_type (user_id, financial_year, leave_type),
    INDEX idx_user (user_id),
    INDEX idx_fin_year (financial_year)
);

-- Table 80: employee_documents
CREATE TABLE IF NOT EXISTS employee_documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    document_type ENUM('RESUME', 'OFFER_LETTER', 'APPOINTMENT_LETTER', 'NDA', 'ID_PROOF', 'DEGREE_CERTIFICATE', 'EXPERIENCE_LETTER', 'PAYSLIP', 'OTHER') NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    verified_by CHAR(36) DEFAULT NULL,
    verified_at DATETIME DEFAULT NULL,
    uploaded_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_type (document_type),
    INDEX idx_status (status)
);

-- Table 81: exit_requests
CREATE TABLE IF NOT EXISTS exit_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    resignation_date DATE NOT NULL,
    requested_last_day DATE NOT NULL,
    approved_last_day DATE DEFAULT NULL,
    reason TEXT NOT NULL,
    notice_period_days INT DEFAULT 30,
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'COMPLETED') DEFAULT 'SUBMITTED',
    exit_interview_notes TEXT DEFAULT NULL,
    approved_by CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status)
);

-- Table 82: offboarding_checklists
CREATE TABLE IF NOT EXISTS offboarding_checklists (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    exit_request_id CHAR(36) NOT NULL,
    department ENUM('IT', 'HR', 'FINANCE', 'OPERATIONS', 'ADMIN') NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    cleared_by CHAR(36) DEFAULT NULL,
    cleared_at DATETIME DEFAULT NULL,
    remarks TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exit_request_id) REFERENCES exit_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (cleared_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_exit_request (exit_request_id),
    INDEX idx_cleared (is_cleared)
);
