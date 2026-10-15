-- ============================================================================
-- 020_video_reviews_table.sql
-- Review & Approval Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_reviews (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  task_id CHAR(36) NOT NULL,
  reviewer VARCHAR(36) NOT NULL,  -- Team leader or PM
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  overall_rating DECIMAL(3,2) DEFAULT 0,  -- 1.00 to 5.00 scale
  comments TEXT,
  approve TINYINT(1) DEFAULT 0,
  reject TINYINT(1) DEFAULT 0,
  required_revisions INT DEFAULT 0,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  INDEX idx_task_id (task_id),
  INDEX idx_reviewer (reviewer)
);