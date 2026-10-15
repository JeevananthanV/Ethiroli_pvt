-- ============================================================================
-- 019_video_work_logs_table.sql
-- Daily Work Log & Time Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_work_logs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  task_id CHAR(36) NOT NULL,
  editor VARCHAR(36) NOT NULL,
  log_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  actual_hours DECIMAL(5,2) DEFAULT 0,
  task_completed TINYINT(1) DEFAULT 0,
  blockers JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_task_id (task_id),
  INDEX idx_editor (editor),
  INDEX idx_log_date (log_date)
);