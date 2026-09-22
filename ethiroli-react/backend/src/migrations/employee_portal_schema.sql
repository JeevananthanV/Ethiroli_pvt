-- ==========================================================
-- EMPLOYEE PORTAL SCHEMA ENHANCEMENTS (Tables 83-85)
-- ==========================================================

USE ethiroli;

-- Table 83: support_tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_number VARCHAR(30) UNIQUE NOT NULL,
    user_id CHAR(36) NOT NULL,
    category ENUM('IT_SUPPORT', 'HR_QUERY', 'PAYROLL_ISSUE', 'FACILITIES', 'ADMIN') NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment_url VARCHAR(500) DEFAULT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    assigned_to CHAR(36) DEFAULT NULL,
    resolved_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_status (user_id, status),
    INDEX idx_category (category)
);

-- Table 84: project_members
CREATE TABLE IF NOT EXISTS project_members (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    project_role ENUM('LEAD', 'MEMBER', 'CONTRIBUTOR', 'REVIEWER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_user (project_id, user_id),
    INDEX idx_user_projects (user_id)
);

-- Table 85: messages
CREATE TABLE IF NOT EXISTS messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    sender_id CHAR(36) NOT NULL,
    recipient_id CHAR(36) NULL,
    channel_name VARCHAR(100) NULL,
    message_content TEXT NOT NULL,
    attachment_url VARCHAR(500) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_convo (sender_id, recipient_id, created_at),
    INDEX idx_channel (channel_name, created_at)
);
