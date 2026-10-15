-- ============================================================================
-- 022_video_deliveries_table.sql
-- Task Deliveries & Payment
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_deliveries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  task_id CHAR(36) NOT NULL,
  delivered_by VARCHAR(36),  -- Editor who delivered
  delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  client_approved TINYINT(1) DEFAULT 0,
  client_comments TEXT,
  payment_amount DECIMAL(10,2),
  payment_status ENUM('Unpaid', 'Paid', 'Pending Invoice') DEFAULT 'Unpaid',
  delivery_notes TEXT,
  INDEX idx_task_id (task_id)
);