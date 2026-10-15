-- ============================================================================
-- 021_video_revisions_table.sql
-- Version History & Revisions
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_revisions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  task_id CHAR(36) NOT NULL,
  version_number INT DEFAULT 1,
  previous_version INT DEFAULT 0,
  video_url TEXT NOT NULL,  -- URL to video file
  revision_notes TEXT,
  revised_by VARCHAR(36),  -- Editor who made changes
  revised_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by VARCHAR(36),  -- Team leader approval
  approved_at TIMESTAMP NULL,
  status ENUM('Pending Approval', 'Approved', 'Rejected') DEFAULT 'Pending Approval',
  INDEX idx_task_id (task_id),
  INDEX idx_version (version_number)
);