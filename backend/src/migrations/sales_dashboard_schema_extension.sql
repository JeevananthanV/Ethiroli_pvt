-- ==========================================================
-- SALES MANAGEMENT EXTENSIONS (Tables 98-102)
-- ==========================================================

-- Table 98: sales_deals
CREATE TABLE IF NOT EXISTS sales_deals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    client_id CHAR(36) DEFAULT NULL,
    lead_id CHAR(36) DEFAULT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(50) DEFAULT NULL,
    deal_value DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    stage ENUM('QUALIFICATION', 'DISCOVERY', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST') DEFAULT 'QUALIFICATION',
    probability INT DEFAULT 20,
    expected_close_date DATE NOT NULL,
    actual_close_date DATE DEFAULT NULL,
    loss_reason VARCHAR(255) DEFAULT NULL,
    owner_id CHAR(36) NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_deal_stage (stage),
    INDEX idx_deal_owner (owner_id),
    INDEX idx_close_date (expected_close_date)
);

-- Table 99: sales_proposals
CREATE TABLE IF NOT EXISTS sales_proposals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proposal_number VARCHAR(50) UNIQUE NOT NULL,
    deal_id CHAR(36) DEFAULT NULL,
    client_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    valid_until DATE NOT NULL,
    status ENUM('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED') DEFAULT 'DRAFT',
    deliverables JSON DEFAULT NULL,
    pdf_url VARCHAR(500) DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES sales_deals(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prop_status (status),
    INDEX idx_prop_deal (deal_id)
);

-- Table 100: sales_activities
CREATE TABLE IF NOT EXISTS sales_activities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    activity_type ENUM('CALL', 'MEETING', 'DEMO', 'EMAIL', 'FOLLOW_UP', 'NOTE') NOT NULL,
    lead_id CHAR(36) DEFAULT NULL,
    deal_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    outcome ENUM('CONNECTED', 'BUSY', 'NO_ANSWER', 'MEETING_BOOKED', 'COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
    duration_minutes INT DEFAULT 15,
    scheduled_at DATETIME NOT NULL,
    completed_at DATETIME DEFAULT NULL,
    meeting_link VARCHAR(500) DEFAULT NULL,
    performed_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (deal_id) REFERENCES sales_deals(id) ON DELETE SET NULL,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_act_user (performed_by, scheduled_at),
    INDEX idx_act_deal (deal_id)
);

-- Table 101: sales_targets
CREATE TABLE IF NOT EXISTS sales_targets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    fiscal_year VARCHAR(10) NOT NULL,
    period_type ENUM('MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    period_label VARCHAR(50) NOT NULL,
    target_revenue DECIMAL(12,2) NOT NULL,
    achieved_revenue DECIMAL(12,2) DEFAULT 0.00,
    deals_target INT DEFAULT 5,
    deals_won INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rep_target (user_id, fiscal_year, period_label),
    INDEX idx_target_user (user_id)
);

-- Table 102: customer_handovers
CREATE TABLE IF NOT EXISTS customer_handovers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    deal_id CHAR(36) NOT NULL,
    client_id CHAR(36) NOT NULL,
    handover_to ENUM('PROJECT_MANAGER', 'ACADEMIC_COORDINATOR', 'OPERATIONS') NOT NULL,
    assigned_person_id CHAR(36) DEFAULT NULL,
    scope_summary TEXT NOT NULL,
    kickoff_date DATE NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'ONBOARDED') DEFAULT 'PENDING',
    handover_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES sales_deals(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_person_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (handover_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_handover_status (status)
);
