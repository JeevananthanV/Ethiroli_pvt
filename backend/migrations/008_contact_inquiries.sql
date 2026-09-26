-- ============================================================================
-- 008_contact_inquiries.sql
--
-- The baseline `schema.sql` defines these tables, but they were never applied
-- to this live database (the migration that introduced them was dropped before
-- a runner was wired up). `operationsController` and `receptionController`
-- query `contact_inquiries`, so the endpoint would return 500 until restored.
-- ============================================================================

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


