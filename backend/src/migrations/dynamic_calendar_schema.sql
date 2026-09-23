-- ============================================================================
-- Single Canonical Migration: Dynamic, Role-Aware Calendar System
-- File: backend/src/migrations/dynamic_calendar_schema.sql
-- Database: MySQL (InnoDB, UTF8MB4)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Table: calendar_event_types
-- Stores dynamic event categories with role-based access control & UI styling
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_event_types (
  id VARCHAR(36) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'event',
  default_duration_minutes INT DEFAULT 30,
  color VARCHAR(7) DEFAULT '#6366f1',
  allowed_create_roles JSON NOT NULL,
  allowed_write_roles JSON NOT NULL,
  notification_target_roles JSON NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_calendar_event_type_label (label),
  INDEX idx_calendar_event_type_active (is_active),
  INDEX idx_calendar_event_type_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table: calendar_role_configs
-- Stores per-role calendar workstations, working hours, and type visibility
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_role_configs (
  id VARCHAR(36) PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  calendar_title VARCHAR(100) DEFAULT 'Calendar',
  default_view ENUM('day','week','month','agenda') DEFAULT 'month',
  work_start_time TIME DEFAULT '09:00:00',
  work_end_time TIME DEFAULT '18:00:00',
  show_others_events BOOLEAN DEFAULT true,
  event_type_visibility JSON DEFAULT NULL,
  quick_create_types JSON DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_calendar_role_config_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table: recurring_rules
-- Stores recurrence patterns (DAILY, WEEKLY, MONTHLY, YEARLY) linked to base events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recurring_rules (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL,
  frequency ENUM('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
  `interval` INT DEFAULT 1,
  days_of_week JSON DEFAULT NULL,
  day_of_month INT DEFAULT NULL,
  month_of_year INT DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  max_occurrences INT DEFAULT NULL,
  instance_count INT DEFAULT 0,
  next_occurrence DATE DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_recurring_rules_event (event_id),
  INDEX idx_recurring_rules_freq (frequency),
  INDEX idx_recurring_rules_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Alter Table: calendar_events
-- Ensure event_type is VARCHAR(50) and all dynamic recurrence/role fields exist
-- ----------------------------------------------------------------------------
ALTER TABLE calendar_events MODIFY COLUMN event_type VARCHAR(50) NOT NULL DEFAULT 'MEETING';

SET @dbname = DATABASE();
SET @tablename = 'calendar_events';

-- event_type_id
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'event_type_id') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN event_type_id VARCHAR(36) DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- status
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'status') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN status ENUM(\'scheduled\',\'completed\',\'cancelled\',\'postponed\') DEFAULT \'scheduled\''
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- priority
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'priority') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN priority ENUM(\'low\',\'medium\',\'high\',\'urgent\') DEFAULT \'medium\''
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- tags
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'tags') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN tags JSON DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- recurrence_rule
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'recurrence_rule') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN recurrence_rule JSON DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- recurrence_end_date
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'recurrence_end_date') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN recurrence_end_date DATE DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- recurrence_instance_count
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'recurrence_instance_count') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN recurrence_instance_count INT DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- index_key
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'index_key') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN index_key VARCHAR(100) DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- parent_event_id
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'parent_event_id') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN parent_event_id VARCHAR(36) DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- cancelled_instance_dates
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'cancelled_instance_dates') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN cancelled_instance_dates JSON DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- tenant_id
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'tenant_id') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN tenant_id VARCHAR(36) DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- role
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'role') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN role VARCHAR(50) DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- metadata
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'metadata') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD COLUMN metadata JSON DEFAULT NULL'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Indexes for fast query performance
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_events_event_type_id') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD INDEX idx_events_event_type_id (event_type_id)'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_events_parent_id') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD INDEX idx_events_parent_id (parent_event_id)'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_events_role') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD INDEX idx_events_role (role)'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_events_status') > 0,
  'SELECT 1',
  'ALTER TABLE calendar_events ADD INDEX idx_events_status (status)'
));
PREPARE stmt FROM @preparedStatement; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- 5. Seed Default 12 Event Types
-- ----------------------------------------------------------------------------
INSERT INTO calendar_event_types (id, label, description, icon, default_duration_minutes, color, allowed_create_roles, allowed_write_roles, notification_target_roles, is_active, sort_order)
VALUES 
('evt_interview', 'Interview', 'Candidate recruitment and hiring interviews', 'bi-person-video', 45, '#3b82f6', '["HR","PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["HR","PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["HR","PROJECT_MANAGER"]', true, 1),
('evt_class', 'Class', 'Live academic lecture or training session', 'bi-mortarboard', 60, '#10b981', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","STUDENT"]', true, 2),
('evt_quiz', 'Quiz', 'Examination or assessment session', 'bi-question-diamond', 30, '#8b5cf6', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","STUDENT"]', true, 3),
('evt_meeting', 'Meeting', 'General team meeting or client consultation', 'bi-people', 30, '#06b6d4', '["HR","PROJECT_MANAGER","EMPLOYEE","INTERN","ADMIN","SUPER_ADMIN","FINANCE","SALES","RECEPTION","TUTOR","STUDENT"]', '["HR","PROJECT_MANAGER","EMPLOYEE","INTERN","ADMIN","SUPER_ADMIN"]', '["SELF","CREATOR_ROLE"]', true, 4),
('evt_training', 'Training', 'Employee or intern skill workshop', 'bi-journal-code', 90, '#f59e0b', '["HR","ADMIN","SUPER_ADMIN"]', '["HR","ADMIN","SUPER_ADMIN"]', '["HR","EMPLOYEE","INTERN"]', true, 5),
('evt_milestone', 'Milestone', 'Project milestone or delivery deadline', 'bi-flag', 0, '#ec4899', '["PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["PROJECT_MANAGER","EMPLOYEE"]', true, 6),
('evt_payment', 'Payment', 'Invoice due date or salary disbursement', 'bi-cash-coin', 0, '#14b8a6', '["FINANCE","ADMIN","SUPER_ADMIN"]', '["FINANCE","ADMIN","SUPER_ADMIN"]', '["FINANCE","ADMIN"]', true, 7),
('evt_call', 'Sales Call', 'Prospective client pitch or follow-up call', 'bi-telephone', 30, '#f97316', '["SALES","ADMIN","SUPER_ADMIN"]', '["SALES","ADMIN","SUPER_ADMIN"]', '["SALES"]', true, 8),
('evt_appointment', 'Appointment', 'Front-desk or visitor appointment', 'bi-calendar-check', 30, '#64748b', '["RECEPTION","ADMIN","SUPER_ADMIN"]', '["RECEPTION","ADMIN","SUPER_ADMIN"]', '["RECEPTION"]', true, 9),
('evt_leave', 'Leave', 'Staff approved leave or time-off', 'bi-calendar-x', 0, '#ef4444', '["EMPLOYEE","INTERN","HR","ADMIN","SUPER_ADMIN"]', '["HR","ADMIN","SUPER_ADMIN"]', '["HR","EMPLOYEE","INTERN"]', true, 10),
('evt_deadline', 'Deadline', 'Task or assignment submission deadline', 'bi-clock-history', 0, '#dc2626', '["ALL"]', '["ALL"]', '["SELF"]', true, 11),
('evt_holiday', 'Holiday', 'Official company holiday or public day off', 'bi-sun', 0, '#eab308', '["ADMIN","HR","SUPER_ADMIN"]', '["ADMIN","HR","SUPER_ADMIN"]', '["ALL"]', true, 12)
ON DUPLICATE KEY UPDATE 
  label = VALUES(label),
  description = VALUES(description),
  icon = VALUES(icon),
  default_duration_minutes = VALUES(default_duration_minutes),
  color = VALUES(color),
  allowed_create_roles = VALUES(allowed_create_roles),
  allowed_write_roles = VALUES(allowed_write_roles),
  notification_target_roles = VALUES(notification_target_roles),
  is_active = VALUES(is_active),
  sort_order = VALUES(sort_order);

-- ----------------------------------------------------------------------------
-- 6. Seed Default 13 Role Configurations
-- ----------------------------------------------------------------------------
INSERT INTO calendar_role_configs (id, role, calendar_title, default_view, work_start_time, work_end_time, show_others_events, event_type_visibility, quick_create_types, is_active)
VALUES
('cfg_super_admin', 'SUPER_ADMIN', 'Master Operations Calendar', 'month', '09:00:00', '18:00:00', true, '[]', '["evt_meeting","evt_holiday","evt_training"]', true),
('cfg_admin', 'ADMIN', 'Executive Operations Calendar', 'month', '09:00:00', '18:00:00', true, '[]', '["evt_meeting","evt_holiday","evt_training"]', true),
('cfg_hr', 'HR', 'HR & People Operations Calendar', 'month', '09:00:00', '18:00:00', true, '["evt_interview","evt_leave","evt_training","evt_holiday","evt_meeting"]', '["evt_interview","evt_leave","evt_training"]', true),
('cfg_tutor', 'TUTOR', 'Academic & Class Schedule', 'week', '09:00:00', '18:00:00', true, '["evt_class","evt_quiz","evt_meeting","evt_holiday"]', '["evt_class","evt_quiz"]', true),
('cfg_student', 'STUDENT', 'My Learning Schedule', 'month', '09:00:00', '18:00:00', false, '["evt_class","evt_quiz","evt_deadline","evt_holiday"]', '["evt_deadline"]', true),
('cfg_employee', 'EMPLOYEE', 'Employee Work Schedule', 'month', '09:00:00', '18:00:00', true, '["evt_meeting","evt_training","evt_milestone","evt_leave","evt_holiday"]', '["evt_meeting","evt_leave"]', true),
('cfg_intern', 'INTERN', 'Intern Training & Tasks', 'week', '09:00:00', '18:00:00', true, '["evt_meeting","evt_training","evt_deadline","evt_leave","evt_holiday"]', '["evt_meeting","evt_leave"]', true),
('cfg_pm', 'PROJECT_MANAGER', 'Project Delivery & Milestones', 'month', '09:00:00', '18:00:00', true, '["evt_milestone","evt_meeting","evt_interview","evt_deadline","evt_holiday"]', '["evt_milestone","evt_meeting"]', true),
('cfg_finance', 'FINANCE', 'Finance & Billing Calendar', 'month', '09:00:00', '18:00:00', true, '["evt_payment","evt_meeting","evt_holiday"]', '["evt_payment","evt_meeting"]', true),
('cfg_sales', 'SALES', 'Sales & Pitch Pipeline', 'day', '09:00:00', '18:00:00', true, '["evt_call","evt_meeting","evt_holiday"]', '["evt_call","evt_meeting"]', true),
('cfg_reception', 'RECEPTION', 'Front Desk & Visitors', 'day', '09:00:00', '18:00:00', true, '["evt_appointment","evt_meeting","evt_interview","evt_holiday"]', '["evt_appointment"]', true),
('cfg_vendor', 'VENDOR', 'Vendor Schedule', 'month', '09:00:00', '18:00:00', false, '["evt_meeting","evt_payment"]', '["evt_meeting"]', true),
('cfg_client', 'CLIENT', 'Client Milestones & Reviews', 'month', '09:00:00', '18:00:00', false, '["evt_milestone","evt_meeting"]', '["evt_meeting"]', true)
ON DUPLICATE KEY UPDATE
  calendar_title = VALUES(calendar_title),
  default_view = VALUES(default_view),
  work_start_time = VALUES(work_start_time),
  work_end_time = VALUES(work_end_time),
  show_others_events = VALUES(show_others_events),
  event_type_visibility = VALUES(event_type_visibility),
  quick_create_types = VALUES(quick_create_types),
  is_active = VALUES(is_active);
