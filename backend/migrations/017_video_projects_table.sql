-- ============================================================================
-- 017_video_projects_table.sql
-- Video Project Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_projects (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  project_type ENUM('Marketing', 'Training', 'Onboarding', 'Social Media', 'Corporate', 'Event') NOT NULL DEFAULT 'Marketing',
  description TEXT,
  status ENUM('Active', 'On Hold', 'Completed', 'Cancelled') DEFAULT 'Active',
  assigned_editor VARCHAR(36),
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes for performance and queries
  INDEX idx_assigned_editor (assigned_editor),
  INDEX idx_status (status),
  INDEX idx_project_type (project_type),

  -- Foreign key to link to users table (editor)
  CONSTRAINT fk_video_editor FOREIGN KEY (assigned_editor) REFERENCES users(id) ON DELETE SET NULL
);