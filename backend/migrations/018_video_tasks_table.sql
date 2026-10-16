-- ============================================================================
-- 018_video_tasks_table.sql
-- Video Task Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_tasks (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  project_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  video_type ENUM('Instagram Reel', 'YouTube Video', 'Corporate Video', 'Webinar', 'Product Demo', 'Presentation') NOT NULL,
  assigned_editor CHAR(36) NULL,
  status ENUM('Assigned', 'Editing', 'Internal Review', 'Client Review', 'Revision', 'Approved', 'Delivered') DEFAULT 'Assigned',
  priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  estimated_hours DECIMAL(5,2) DEFAULT 2.00,
  actual_hours DECIMAL(5,2) DEFAULT 0,
  start_date DATE,
  deadline DATE,
  submitted_date TIMESTAMP NULL,
  source_files JSON,
  preview_video_url TEXT,
  final_video_url TEXT,
  revision_count INT DEFAULT 0,
  approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes for performance and queries
  INDEX idx_project_id (project_id),
  INDEX idx_assigned_editor (assigned_editor),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_deadline (deadline),

  -- Foreign keys
  CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES video_projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_editor FOREIGN KEY (assigned_editor) REFERENCES users(id) ON DELETE SET NULL
);