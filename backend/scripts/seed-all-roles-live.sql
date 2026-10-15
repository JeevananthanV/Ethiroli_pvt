-- ============================================================================
-- ETHIROLI PLATFORM - MASTER PRODUCTION MIGRATION & REPAIR SCRIPT
-- Target Database: u629721489_ethiroli_Db (Hostinger MariaDB 11.8+)
-- Generated: 2026-10-15T10:34:04.124Z
-- Scope: Missing Tables (14) + Missing Columns (20) + Indexes + Seeds & Credentials
-- Safe & Idempotent: Can be run repeatedly without data loss or duplicate keys.
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================================
-- PART 0: COLLATION HARMONIZATION (FIX FOR MYSQL ERROR 150)
-- Harmonize roles and permissions to utf8mb4_unicode_ci to match users table
-- ============================================================================
ALTER TABLE `roles` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `permissions` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `role_permissions` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================================
-- PART 1: DDL - ENSURE MISSING TABLES EXIST
-- ============================================================================

-- 1. Table: user_credentials
CREATE TABLE IF NOT EXISTS `user_credentials` (
  `user_id` char(36) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_algo` varchar(30) NOT NULL DEFAULT 'BCRYPT',
  `password_updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0,
  `lockout_until` timestamp NULL DEFAULT NULL,
  `requires_password_change` tinyint(1) NOT NULL DEFAULT 0,
  `password_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_uc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: attendance_sessions (Multi-session attendance & breaks)
CREATE TABLE IF NOT EXISTS `attendance_sessions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `work_date` date NOT NULL,
  `check_in_time` datetime NOT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `worked_minutes` int(11) GENERATED ALWAYS AS (ifnull(timestampdiff(MINUTE,`check_in_time`,`check_out_time`),0)) STORED,
  `status` enum('ACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sessions_user_date` (`user_id`,`work_date`),
  KEY `idx_sessions_user_status` (`user_id`,`status`),
  CONSTRAINT `fk_att_sess_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: password_change_requests (Staff authenticated password change request queue)
CREATE TABLE IF NOT EXISTS `password_change_requests` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `reason` varchar(500) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `requested_at` timestamp(6) NULL DEFAULT current_timestamp(6),
  `reviewed_by` char(36) DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `review_note` varchar(500) DEFAULT NULL,
  `grant_expires_at` datetime(6) DEFAULT NULL,
  `grant_used_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `idx_pcr_user` (`user_id`),
  KEY `idx_pcr_status` (`status`),
  CONSTRAINT `fk_pcr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: password_recovery_requests (Public unauthenticated self-service recovery queue)
CREATE TABLE IF NOT EXISTS `password_recovery_requests` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email_hash` char(64) NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `reason` varchar(500) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `requested_ip` varchar(64) DEFAULT NULL,
  `requested_at` timestamp(6) NULL DEFAULT current_timestamp(6),
  `resolved_at` datetime(6) DEFAULT NULL,
  `created_at` timestamp(6) NULL DEFAULT current_timestamp(6),
  `updated_at` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `idx_prr_status` (`status`),
  KEY `idx_prr_email_hash` (`email_hash`),
  KEY `idx_prr_user` (`user_id`),
  CONSTRAINT `fk_prr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: user_roles (Enterprise RBAC multi-tenant role assignments)
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` varchar(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) DEFAULT NULL,
  `assigned_by` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role_tenant` (`user_id`,`role_id`,`tenant_id`),
  KEY `idx_ur_user` (`user_id`),
  KEY `idx_ur_tenant` (`tenant_id`),
  KEY `fk_ur_role` (`role_id`),
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: policy_rules (ABAC Contextual Rules / Policy Predicates)
CREATE TABLE IF NOT EXISTS `policy_rules` (
  `id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  `permission_code` varchar(100) NOT NULL,
  `predicate_expression` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`predicate_expression`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pr_role_perm` (`role_id`,`permission_code`),
  CONSTRAINT `fk_pr_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: break_glass_events (Emergency Elevated Privilege Audits)
CREATE TABLE IF NOT EXISTS `break_glass_events` (
  `id` varchar(36) NOT NULL,
  `initiator_user_id` char(36) NOT NULL,
  `approver_user_id` char(36) DEFAULT NULL,
  `reason` text NOT NULL,
  `incident_ticket_id` varchar(100) NOT NULL,
  `status` enum('PENDING','ACTIVE','REVOKED','EXPIRED') DEFAULT 'PENDING',
  `activated_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_bg_initiator` (`initiator_user_id`),
  CONSTRAINT `fk_bg_initiator` FOREIGN KEY (`initiator_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: calendar_event_types (Dynamic Event Types & Access Control)
CREATE TABLE IF NOT EXISTS `calendar_event_types` (
  `id` varchar(36) NOT NULL,
  `label` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'event',
  `default_duration_minutes` int(11) DEFAULT 30,
  `color` varchar(7) DEFAULT '#6366f1',
  `allowed_create_roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`allowed_create_roles`)),
  `allowed_write_roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`allowed_write_roles`)),
  `notification_target_roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`notification_target_roles`)),
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_calendar_event_type_label` (`label`),
  KEY `idx_calendar_event_type_active` (`is_active`),
  KEY `idx_calendar_event_type_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: calendar_role_configs (Role-specific Calendar Views & Schedules)
CREATE TABLE IF NOT EXISTS `calendar_role_configs` (
  `id` varchar(36) NOT NULL,
  `role` varchar(50) NOT NULL,
  `calendar_title` varchar(100) DEFAULT 'Calendar',
  `default_view` enum('day','week','month','agenda') DEFAULT 'month',
  `work_start_time` time DEFAULT '09:00:00',
  `work_end_time` time DEFAULT '18:00:00',
  `show_others_events` tinyint(1) DEFAULT 1,
  `event_type_visibility` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`event_type_visibility`)),
  `quick_create_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`quick_create_types`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_calendar_role_config_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: recurring_rules (Recurrence Patterns for Calendar Events)
CREATE TABLE IF NOT EXISTS `recurring_rules` (
  `id` varchar(36) NOT NULL,
  `event_id` varchar(36) NOT NULL,
  `frequency` enum('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
  `interval` int(11) DEFAULT 1,
  `days_of_week` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`days_of_week`)),
  `day_of_month` int(11) DEFAULT NULL,
  `month_of_year` int(11) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `max_occurrences` int(11) DEFAULT NULL,
  `instance_count` int(11) DEFAULT 0,
  `next_occurrence` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_recurring_rules_event` (`event_id`),
  KEY `idx_recurring_rules_freq` (`frequency`),
  KEY `idx_recurring_rules_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: email_daily_quota (Brevo / Transactional Email Daily Quota Tracking)
CREATE TABLE IF NOT EXISTS `email_daily_quota` (
  `quota_date` date NOT NULL,
  `emails_sent` int(11) DEFAULT 0,
  `max_limit` int(11) DEFAULT 300,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`quota_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table: incoming_webhook_logs (External Webhook Audit Trail)
CREATE TABLE IF NOT EXISTS `incoming_webhook_logs` (
  `id` char(36) NOT NULL,
  `source` varchar(50) NOT NULL,
  `event` varchar(100) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `status` varchar(20) DEFAULT 'PROCESSED',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Table: question_bank (Master Curated Examination Questions)
CREATE TABLE IF NOT EXISTS `question_bank` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) DEFAULT NULL,
  `module_id` char(36) DEFAULT NULL,
  `topic` varchar(100) NOT NULL,
  `difficulty` enum('EASY','MEDIUM','HARD') DEFAULT 'MEDIUM',
  `question_type` enum('MCQ','MULTI_SELECT','TRUE_FALSE','CODE_OUTPUT') NOT NULL DEFAULT 'MCQ',
  `question_text` text NOT NULL,
  `code_snippet` text DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_topic_diff` (`topic`,`difficulty`),
  KEY `idx_course` (`course_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `fk_qb_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_qb_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Table: question_options (Server-side Answer Keys)
CREATE TABLE IF NOT EXISTS `question_options` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `question_id` char(36) NOT NULL,
  `option_text` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_question` (`question_id`),
  CONSTRAINT `fk_qo_question` FOREIGN KEY (`question_id`) REFERENCES `question_bank` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Table: quiz_questions (Quiz and Question Bank Mapping)
CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `quiz_id` char(36) NOT NULL,
  `question_id` char(36) NOT NULL,
  `points` int(11) DEFAULT 1,
  `question_order` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_quiz_question` (`quiz_id`,`question_id`),
  KEY `idx_quiz_order` (`quiz_id`,`question_order`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `fk_qq_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_qq_question` FOREIGN KEY (`question_id`) REFERENCES `question_bank` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Table: sales_commissions (BDA Sales Commission Management)
CREATE TABLE IF NOT EXISTS `sales_commissions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `deal_id` char(36) NOT NULL,
  `bda_user_id` char(36) NOT NULL,
  `eligible_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 10.00,
  `commission_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` enum('Pending Approval','Approved','Payable','Paid','Rejected') NOT NULL DEFAULT 'Pending Approval',
  `approved_by` char(36) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_deal_commission` (`deal_id`),
  KEY `idx_bda_user_id` (`bda_user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PART 2: DDL - ADD MISSING COLUMNS TO EXISTING TABLES (ADD COLUMN IF NOT EXISTS)
-- ============================================================================

-- A. Table: interns
ALTER TABLE `interns`
  ADD COLUMN IF NOT EXISTS `project_target` VARCHAR(255) DEFAULT 'Full Stack Development',
  ADD COLUMN IF NOT EXISTS `progress` INT DEFAULT 10;

-- B. Table: attendance
ALTER TABLE `attendance`
  ADD COLUMN IF NOT EXISTS `work_mode` ENUM('REMOTE', 'OFFICE') NULL DEFAULT NULL AFTER `status`,
  ADD COLUMN IF NOT EXISTS `worked_minutes` INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `session_count` INT NOT NULL DEFAULT 0;

-- C. Table: employees
ALTER TABLE `employees`
  ADD COLUMN IF NOT EXISTS `uan` VARCHAR(20) NULL DEFAULT NULL AFTER `pf_number`;

-- D. Table: leaves
ALTER TABLE `leaves`
  ADD COLUMN IF NOT EXISTS `review_note` VARCHAR(500) NULL DEFAULT NULL AFTER `approval_chain_step`;

-- E. Table: sessions
ALTER TABLE `sessions`
  ADD COLUMN IF NOT EXISTS `impersonated_by` CHAR(36) NULL AFTER `ip_address`,
  ADD COLUMN IF NOT EXISTS `impersonation_origin_token` VARCHAR(255) NULL AFTER `impersonated_by`;

-- F. Table: calendar_events
ALTER TABLE `calendar_events`
  MODIFY COLUMN `event_type` VARCHAR(50) NOT NULL DEFAULT 'MEETING',
  ADD COLUMN IF NOT EXISTS `event_type_id` VARCHAR(36) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `status` ENUM('scheduled','completed','cancelled','postponed') DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS `priority` ENUM('low','medium','high','urgent') DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS `tags` JSON DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `recurrence_rule` JSON DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `recurrence_end_date` DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `recurrence_instance_count` INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `index_key` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `parent_event_id` VARCHAR(36) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `cancelled_instance_dates` JSON DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `tenant_id` VARCHAR(36) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `role` VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `metadata` JSON DEFAULT NULL;

-- G. Table: sales_deals
ALTER TABLE `sales_deals`
  ADD COLUMN IF NOT EXISTS `linked_deal_id` CHAR(36) NULL;

-- ============================================================================
-- PART 3: INDEXES - ADD PERFORMANCE & LOOKUP INDEXES
-- ============================================================================

ALTER TABLE `calendar_events`
  ADD INDEX IF NOT EXISTS `idx_events_event_type_id` (`event_type_id`),
  ADD INDEX IF NOT EXISTS `idx_events_parent_id` (`parent_event_id`),
  ADD INDEX IF NOT EXISTS `idx_events_role` (`role`),
  ADD INDEX IF NOT EXISTS `idx_events_status` (`status`);

ALTER TABLE `sessions`
  ADD INDEX IF NOT EXISTS `idx_sessions_impersonated_by` (`impersonated_by`);

ALTER TABLE `sales_deals`
  ADD INDEX IF NOT EXISTS `idx_sales_deals_linked_deal` (`linked_deal_id`);

-- ============================================================================
-- PART 4: DATA - CALENDAR TYPES & ROLE CONFIGURATIONS
-- ============================================================================

INSERT INTO `calendar_event_types` (`id`, `label`, `description`, `icon`, `default_duration_minutes`, `color`, `allowed_create_roles`, `allowed_write_roles`, `notification_target_roles`, `is_active`, `sort_order`)
VALUES 
('evt_interview', 'Interview', 'Candidate recruitment and hiring interviews', 'bi-person-video', 45, '#3b82f6', '["HR","PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["HR","PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["HR","PROJECT_MANAGER"]', 1, 1),
('evt_class', 'Class', 'Live academic lecture or training session', 'bi-mortarboard', 60, '#10b981', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","STUDENT"]', 1, 2),
('evt_quiz', 'Quiz', 'Examination or assessment session', 'bi-question-diamond', 30, '#8b5cf6', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","ADMIN","SUPER_ADMIN"]', '["TUTOR","STUDENT"]', 1, 3),
('evt_meeting', 'Meeting', 'General team meeting or client consultation', 'bi-people', 30, '#06b6d4', '["HR","PROJECT_MANAGER","EMPLOYEE","INTERN","ADMIN","SUPER_ADMIN","FINANCE","SALES","RECEPTION","TUTOR","STUDENT"]', '["HR","PROJECT_MANAGER","EMPLOYEE","INTERN","ADMIN","SUPER_ADMIN"]', '["SELF","CREATOR_ROLE"]', 1, 4),
('evt_training', 'Training', 'Employee or intern skill workshop', 'bi-journal-code', 90, '#f59e0b', '["HR","ADMIN","SUPER_ADMIN"]', '["HR","ADMIN","SUPER_ADMIN"]', '["HR","EMPLOYEE","INTERN"]', 1, 5),
('evt_milestone', 'Milestone', 'Project milestone or delivery deadline', 'bi-flag', 0, '#ec4899', '["PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]', '["PROJECT_MANAGER","EMPLOYEE"]', 1, 6),
('evt_payment', 'Payment', 'Invoice due date or salary disbursement', 'bi-cash-coin', 0, '#14b8a6', '["FINANCE","ADMIN","SUPER_ADMIN"]', '["FINANCE","ADMIN","SUPER_ADMIN"]', '["FINANCE","ADMIN"]', 1, 7),
('evt_call', 'Sales Call', 'Prospective client pitch or follow-up call', 'bi-telephone', 30, '#f97316', '["SALES","ADMIN","SUPER_ADMIN"]', '["SALES","ADMIN","SUPER_ADMIN"]', '["SALES"]', 1, 8),
('evt_appointment', 'Appointment', 'Front-desk or visitor appointment', 'bi-calendar-check', 30, '#64748b', '["RECEPTION","ADMIN","SUPER_ADMIN"]', '["RECEPTION","ADMIN","SUPER_ADMIN"]', '["RECEPTION"]', 1, 9),
('evt_leave', 'Leave', 'Staff approved leave or time-off', 'bi-calendar-x', 0, '#ef4444', '["EMPLOYEE","INTERN","HR","ADMIN","SUPER_ADMIN"]', '["HR","ADMIN","SUPER_ADMIN"]', '["HR","EMPLOYEE","INTERN"]', 1, 10),
('evt_deadline', 'Deadline', 'Task or assignment submission deadline', 'bi-clock-history', 0, '#dc2626', '["ALL"]', '["ALL"]', '["SELF"]', 1, 11),
('evt_holiday', 'Holiday', 'Official company holiday or public day off', 'bi-sun', 0, '#eab308', '["ADMIN","HR","SUPER_ADMIN"]', '["ADMIN","HR","SUPER_ADMIN"]', '["ALL"]', 1, 12)
ON DUPLICATE KEY UPDATE 
  `label` = VALUES(`label`),
  `description` = VALUES(`description`),
  `icon` = VALUES(`icon`),
  `default_duration_minutes` = VALUES(`default_duration_minutes`),
  `color` = VALUES(`color`),
  `allowed_create_roles` = VALUES(`allowed_create_roles`),
  `allowed_write_roles` = VALUES(`allowed_write_roles`),
  `notification_target_roles` = VALUES(`notification_target_roles`),
  `is_active` = VALUES(`is_active`),
  `sort_order` = VALUES(`sort_order`);

INSERT INTO `calendar_role_configs` (`id`, `role`, `calendar_title`, `default_view`, `work_start_time`, `work_end_time`, `show_others_events`, `event_type_visibility`, `quick_create_types`, `is_active`)
VALUES
('cfg_super_admin', 'SUPER_ADMIN', 'Master Operations Calendar', 'month', '09:00:00', '18:00:00', 1, '[]', '["evt_meeting","evt_holiday","evt_training"]', 1),
('cfg_admin', 'ADMIN', 'Executive Operations Calendar', 'month', '09:00:00', '18:00:00', 1, '[]', '["evt_meeting","evt_holiday","evt_training"]', 1),
('cfg_hr', 'HR', 'HR & People Operations Calendar', 'month', '09:00:00', '18:00:00', 1, '["evt_interview","evt_leave","evt_training","evt_holiday","evt_meeting"]', '["evt_interview","evt_leave","evt_training"]', 1),
('cfg_tutor', 'TUTOR', 'Academic & Class Schedule', 'week', '09:00:00', '18:00:00', 1, '["evt_class","evt_quiz","evt_meeting","evt_holiday"]', '["evt_class","evt_quiz"]', 1),
('cfg_student', 'STUDENT', 'My Learning Schedule', 'month', '09:00:00', '18:00:00', 0, '["evt_class","evt_quiz","evt_deadline","evt_holiday"]', '["evt_deadline"]', 1),
('cfg_employee', 'EMPLOYEE', 'Employee Work Schedule', 'month', '09:00:00', '18:00:00', 1, '["evt_meeting","evt_training","evt_milestone","evt_leave","evt_holiday"]', '["evt_meeting","evt_leave"]', 1),
('cfg_intern', 'INTERN', 'Intern Training & Tasks', 'week', '09:00:00', '18:00:00', 1, '["evt_meeting","evt_training","evt_deadline","evt_leave","evt_holiday"]', '["evt_meeting","evt_leave"]', 1),
('cfg_pm', 'PROJECT_MANAGER', 'Project Delivery & Milestones', 'month', '09:00:00', '18:00:00', 1, '["evt_milestone","evt_meeting","evt_interview","evt_deadline","evt_holiday"]', '["evt_milestone","evt_meeting"]', 1),
('cfg_finance', 'FINANCE', 'Finance & Billing Calendar', 'month', '09:00:00', '18:00:00', 1, '["evt_payment","evt_meeting","evt_holiday"]', '["evt_payment","evt_meeting"]', 1),
('cfg_sales', 'SALES', 'Sales & Pitch Pipeline', 'day', '09:00:00', '18:00:00', 1, '["evt_call","evt_meeting","evt_holiday"]', '["evt_call","evt_meeting"]', 1),
('cfg_reception', 'RECEPTION', 'Front Desk & Visitors', 'day', '09:00:00', '18:00:00', 1, '["evt_appointment","evt_meeting","evt_interview","evt_holiday"]', '["evt_appointment"]', 1),
('cfg_vendor', 'VENDOR', 'Vendor Schedule', 'month', '09:00:00', '18:00:00', 0, '["evt_meeting","evt_payment"]', '["evt_meeting"]', 1),
('cfg_client', 'CLIENT', 'Client Milestones & Reviews', 'month', '09:00:00', '18:00:00', 0, '["evt_milestone","evt_meeting"]', '["evt_meeting"]', 1)
ON DUPLICATE KEY UPDATE
  `calendar_title` = VALUES(`calendar_title`),
  `default_view` = VALUES(`default_view`),
  `work_start_time` = VALUES(`work_start_time`),
  `work_end_time` = VALUES(`work_end_time`),
  `show_others_events` = VALUES(`show_others_events`),
  `event_type_visibility` = VALUES(`event_type_visibility`),
  `quick_create_types` = VALUES(`quick_create_types`),
  `is_active` = VALUES(`is_active`);

-- ============================================================================
-- PART 5: DATA - PUBLIC HOLIDAYS & RBAC ROLES
-- ============================================================================

INSERT INTO `holidays` (`name`, `date`, `is_restricted`) VALUES
  ('Republic Day',            '2026-01-26', 0),
  ('Holi',                    '2026-03-04', 0),
  ('Mahashivratri',           '2026-02-15', 0),
  ('Ugadi',                   '2026-03-19', 0),
  ('Dr. Ambedkar Jayanti',    '2026-04-14', 0),
  ('Good Friday',             '2026-04-03', 0),
  ('May Day',                 '2026-05-01', 0),
  ('Independence Day',        '2026-08-15', 0),
  ('Ganesh Chaturthi',        '2026-09-14', 0),
  ('Gandhi Jayanti',          '2026-10-02', 0),
  ('Dussehra',                '2026-10-20', 0),
  ('Diwali Balipratipada',    '2026-11-08', 0),
  ('Christmas',               '2026-12-25', 0)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `roles` (`id`, `code`, `name`, `description`, `security_rank`, `is_system_role`) VALUES
  ('role-super-admin', 'SUPER_ADMIN',     'Super Administrator',       'Root system and governance authority with platform-wide scope', 100, 1),
  ('role-admin',       'ADMIN',           'Standard Administrator',   'Operational domain administrator with hierarchy boundaries', 80, 1),
  ('role-hr',          'HR',              'Human Resources Manager',  'Talent acquisition, attendance, and leave management', 60, 1),
  ('role-finance',     'FINANCE',         'Financial Controller',     'Payroll processing, invoices, and ledger audits', 60, 1),
  ('role-pm',          'PROJECT_MANAGER', 'Project Manager',          'Project roadmaps, milestone tracking, and task oversight', 40, 1),
  ('role-pm-code',     'PM',              'Project Manager (Alias)',  'Project Manager code alias', 40, 1),
  ('role-tutor',       'TUTOR',           'Academic Instructor',      'Course delivery, question banking, and student assessment', 40, 1),
  ('role-sales',       'SALES',           'Sales Executive',          'Sales deals, leads, and client acquisition', 30, 1),
  ('role-reception',   'RECEPTION',       'Front Desk Coordinator',   'Front office, visitor reception, and appointments', 20, 1),
  ('role-employee',    'EMPLOYEE',        'Staff Employee',           'Internal staff member with departmental responsibilities', 20, 1),
  ('role-intern',      'INTERN',          'Apprentice Intern',        'Vocational trainee undergoing skills development', 20, 1),
  ('role-student',     'STUDENT',         'Enrolled Learner',         'Active course enrollee accessing dynamic learning player', 10, 1),
  ('role-client',      'CLIENT',          'Client Account',           'External client accessing dedicated portal', 10, 1),
  ('role-vendor',      'VENDOR',          'Vendor Partner',           'Third-party supplier and contractor', 10, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `security_rank` = VALUES(`security_rank`);

-- ============================================================================
-- PART 6: ACCOUNTS - 18 MASTER & INTERN USER LOGINS
-- Includes knandhinivnr@gmail.com and mathishree008@gmail.com
-- Standard Passwords:
--   INTERNS (All 7):     Intern@123
--   SUPER_ADMIN / ADMIN: Admin@123
--   HR:                  Hr@123
--   TUTOR:               Tutor@123
--   PROJECT_MANAGER:     Pm@123
--   FINANCE:             Finance@123
--   SALES:               Sales@123
--   RECEPTION:           Reception@123
--   EMPLOYEE / STAFF:    Employee@123
--   STUDENT:             Student@123
-- ============================================================================

-- [SUPER_ADMIN] admin@ethiroli.com (Super Administrator)
-- Plaintext Password: Admin@123 | Portal: /auth/super-admin/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('368f5c88-12cd-11ed-861d-0242ac120002', '723770bf76abc5aa33fdac9e:68d007eb156954a884f0086c47ac8d75:a18e6c09bb52768dcede4184611d436e7de9', '$2b$12$Xoi4XGB1LT.CkYHVrC8MzeH.FRuDoXymWlyr7/gARGeR2h8Z2oRQS', '1b4baba1e650a3793631d34e:ddf5b3c19aaeb66ab63400b262dafd3b:862b69f723e6851f6cb4b0f2f7fded5b518bf5', NULL, 'SUPER_ADMIN', 1, '{"department":"Executive Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'SUPER_ADMIN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('368f5c88-12cd-11ed-861d-0242ac120002', '$2b$12$Xoi4XGB1LT.CkYHVrC8MzeH.FRuDoXymWlyr7/gARGeR2h8Z2oRQS', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Xoi4XGB1LT.CkYHVrC8MzeH.FRuDoXymWlyr7/gARGeR2h8Z2oRQS"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);

-- [ADMIN] orgadmin@ethiroli.com (Organization Admin)
-- Plaintext Password: Admin@123 | Portal: /auth/admin/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('bef7a014-983a-4041-89a1-c8cfa4590993', '096f2daf6bb8534451b7ca22:857266e023017bf9612e7a0a65eb3bb6:b4a75b39c7524335dba60d560087ba69f30e8fa55c', '$2b$12$zge4zOAhkXpux3/fj0fFhemoI7lR7JlvRDOfzQ8D.Xnimon0zA.ge', '4bee65836fee202f5634626f:8b9074803e14d2802cf3bb8358241bc4:59dbd352b3e0334e8e17a2da7934a0e9908c', NULL, 'ADMIN', 1, '{"department":"Administration","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'ADMIN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('bef7a014-983a-4041-89a1-c8cfa4590993', '$2b$12$zge4zOAhkXpux3/fj0fFhemoI7lR7JlvRDOfzQ8D.Xnimon0zA.ge', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$zge4zOAhkXpux3/fj0fFhemoI7lR7JlvRDOfzQ8D.Xnimon0zA.ge"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);

-- [ADMIN] admin@ethiroli.net (System Administrator)
-- Plaintext Password: Admin@123 | Portal: /auth/admin/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('479f6d99-23de-22fe-972e-0353bd230003', '75dd901360b5a88882148fa8:46aca0bca935b9eb9ae4bca62e3e6053:2e772508fdcabad35260ae03e2a895f0841b', '$2b$12$lNkGvyeuiNlALTS1MrM9WOCAFdsqslEQ709IokTXM2elOML1rh5Pa', '26a54a2e3f5e0f371eeea78e:235afaa88773a4effc90b994982afb36:c74c9ee7893d448a9340e8cb19084f4d635afb67', NULL, 'ADMIN', 1, '{"department":"Administration","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'ADMIN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('479f6d99-23de-22fe-972e-0353bd230003', '$2b$12$lNkGvyeuiNlALTS1MrM9WOCAFdsqslEQ709IokTXM2elOML1rh5Pa', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$lNkGvyeuiNlALTS1MrM9WOCAFdsqslEQ709IokTXM2elOML1rh5Pa"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);

-- [HR] hr@ethiroli.com (HR Manager)
-- Plaintext Password: Hr@123 | Portal: /auth/hr/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('0fa117ca-5edf-4687-b099-54290e40ffe1', '9944bc544d9ea138e00b990d:0eb78ed8f7827ef852852e4e5c200207:ec5511024e5ea8f450a1d12321aa16', '$2b$12$f6nfYuI4AjiRYEjv0fr6ievVyGVtidbvicyZ/uZJ/RosCtlKZtVlW', '10e4fdc9c26637acb0b93845:09063f48f74f5239965b9e348651a9bf:e3d9cc53a607ac12d2ea', NULL, 'HR', 1, '{"department":"Human Resources","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'HR',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('0fa117ca-5edf-4687-b099-54290e40ffe1', '$2b$12$f6nfYuI4AjiRYEjv0fr6ievVyGVtidbvicyZ/uZJ/RosCtlKZtVlW', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$f6nfYuI4AjiRYEjv0fr6ievVyGVtidbvicyZ/uZJ/RosCtlKZtVlW"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('88069c4e-a78b-4c7d-aaf6-de8f6785af70', '0fa117ca-5edf-4687-b099-54290e40ffe1', 'EMP-102', 'Human Resources', 'HR Lead & Talent Ops', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [TUTOR] tutor@ethiroli.com (Verified Senior Instructor)
-- Plaintext Password: Tutor@123 | Portal: /auth/tutor/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('c60caddb-2848-492a-8724-4e7ec5d55850', '45d92b301139716fe1e12085:2443a1afcdb5de15edca1ce571372a4a:67e5865b1d9cfa282152ec85939905785601', '$2b$12$VyaC8U1jsc4kcnBwFF/qm.xQqR4KXNJ8Sbmr0nKWuCP2UCK7VRAo.', 'c64bf5e8d2ea438c4cec05d5:3621cc40580dc37100204ead1899ac9f:8ff484bab01c2826e1a3e418648ed99bf83037669129b3f93baf', NULL, 'TUTOR', 1, '{"department":"Academics & Training","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'TUTOR',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('c60caddb-2848-492a-8724-4e7ec5d55850', '$2b$12$VyaC8U1jsc4kcnBwFF/qm.xQqR4KXNJ8Sbmr0nKWuCP2UCK7VRAo.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$VyaC8U1jsc4kcnBwFF/qm.xQqR4KXNJ8Sbmr0nKWuCP2UCK7VRAo."]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);

-- [PROJECT_MANAGER] pm@ethiroli.com (Project Manager)
-- Plaintext Password: Pm@123 | Portal: /auth/pm/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'ef6bacbe5becc007bb0e63f4:0c0ed496a4e4985af6d13eed447cb822:42661e14b1a26e2795d5adbda5b5de', '$2b$12$eWVkseKX3tXFELMSzOoIuuJ0/sZ5Y2htrsh9dTFEJQtCd1OqiRLJa', '926e93928c2fd5095f2e35bd:6153421c389fe9da51f4ca03547099ab:7f55c5c28e40edc1cd629ebacb8b7d', NULL, 'PROJECT_MANAGER', 1, '{"department":"Project Delivery","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'PROJECT_MANAGER',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', '$2b$12$eWVkseKX3tXFELMSzOoIuuJ0/sZ5Y2htrsh9dTFEJQtCd1OqiRLJa', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$eWVkseKX3tXFELMSzOoIuuJ0/sZ5Y2htrsh9dTFEJQtCd1OqiRLJa"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('02f553ea-0df4-4902-8047-972b844fe111', '4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'EMP-103', 'Project Delivery', 'Technical Project Manager', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [FINANCE] finance@ethiroli.com (Finance Lead)
-- Plaintext Password: Finance@123 | Portal: /auth/finance/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'ba19cdc0a1bb6536e110630f:83592ea04dd74df4d81efcaae26479e4:d30ab6c3f86ddaab41550b587b494dd90afe8504', '$2b$12$k48NLDYUVNg0Jh0FM1J/A.FNbUK5Us49b9w7jaJgdZ8HafvboVz4y', '7a2281e8669e7c2b96d9996d:239e7823a0f28b72e1e9383bd5e7649b:9e4c73bdecb7076c293187e6', NULL, 'FINANCE', 1, '{"department":"Finance & Accounts","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'FINANCE',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('8a8b4cfb-012a-4072-a24f-6cd999e9e007', '$2b$12$k48NLDYUVNg0Jh0FM1J/A.FNbUK5Us49b9w7jaJgdZ8HafvboVz4y', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$k48NLDYUVNg0Jh0FM1J/A.FNbUK5Us49b9w7jaJgdZ8HafvboVz4y"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('faea07fd-d893-4cf8-9f3b-c3de8eea7d6f', '8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'EMP-104', 'Finance & Accounts', 'Finance & Accounts Specialist', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [SALES] sales@ethiroli.com (Sales Executive)
-- Plaintext Password: Sales@123 | Portal: /auth/sales/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('a25602e3-ecd5-4fbf-a833-284bf9d36909', '074da5370a0fa5ebc734db45:881e49450079cc132bd265d85b3d373b:f362b09ba267902744c24408df6177741434', '$2b$12$MK65VHsqVRlQru47.KGppeZ/72QkA8jFVM8bgXb0sZ5h5F1v6MP8a', '0effc7a780ab028aa754870c:33af687deef0766bc40c9d3baf2c9edb:cff25eb40721ea9ca213f3f70137c3', NULL, 'SALES', 1, '{"department":"Business Development & Sales","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'SALES',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('a25602e3-ecd5-4fbf-a833-284bf9d36909', '$2b$12$MK65VHsqVRlQru47.KGppeZ/72QkA8jFVM8bgXb0sZ5h5F1v6MP8a', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$MK65VHsqVRlQru47.KGppeZ/72QkA8jFVM8bgXb0sZ5h5F1v6MP8a"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('1ffab667-9022-47a7-871d-83a38b095a15', 'a25602e3-ecd5-4fbf-a833-284bf9d36909', 'EMP-105', 'Business Development & Sales', 'Senior Sales Consultant', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [RECEPTION] reception@ethiroli.com (Front Desk Coordinator)
-- Plaintext Password: Reception@123 | Portal: /auth/reception/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'd037976d6b670d8f6aaf7b11:41c0c3ca0c2e1abede3bb84d11e23f8e:e686a8204ba699917d7f54d12e9bd5df649350eb68e8', '$2b$12$VeAYwYKvqU7t/XN6fSfBKO/pWlIrkzy1W8FzN/.k7/3yCa9CBI1ra', 'ac54989b5833cd28c793f89a:9c90fb6edaac5ca2a2f22b3c47e9b294:b373f13a8639ba9061ebdbbe40bc99ea8192fbf800ee', NULL, 'RECEPTION', 1, '{"department":"Front Office & Reception","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'RECEPTION',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', '$2b$12$VeAYwYKvqU7t/XN6fSfBKO/pWlIrkzy1W8FzN/.k7/3yCa9CBI1ra', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$VeAYwYKvqU7t/XN6fSfBKO/pWlIrkzy1W8FzN/.k7/3yCa9CBI1ra"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('1e744852-578c-4c8d-a0a7-f2b0bc2ed1db', '7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'EMP-106', 'Front Office & Reception', 'Front Desk Lead', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [EMPLOYEE] employee@ethiroli.com (Standard Staff Member)
-- Plaintext Password: Employee@123 | Portal: /auth/employee/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('3bb859a1-cb3d-4952-b892-3868dfd6541f', 'f705510f6931e0c2bb53a848:a11c7bd5d5c145511d88e2668f6d2c64:fed006f97fe30b6d7d139a2f2950e298a2026ba6f5', '$2b$12$pUsRIp5gU3diS9trnzqlFOOL6HDWbPVM.Ryzjs1bYdZzlCiirz1Wq', '14b2acfd7546cf80c70c041d:72aa0d71ef4bc8c24a83d44130d5ce7e:6a868c52ef1ad72567a77c86501e1e928098620ed9', NULL, 'EMPLOYEE', 1, '{"department":"Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'EMPLOYEE',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('3bb859a1-cb3d-4952-b892-3868dfd6541f', '$2b$12$pUsRIp5gU3diS9trnzqlFOOL6HDWbPVM.Ryzjs1bYdZzlCiirz1Wq', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$pUsRIp5gU3diS9trnzqlFOOL6HDWbPVM.Ryzjs1bYdZzlCiirz1Wq"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('6365b935-3e2e-4612-a14b-72f4a6c32d8a', '3bb859a1-cb3d-4952-b892-3868dfd6541f', 'EMP-107', 'Operations', 'Operations Associate', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [EMPLOYEE] staff@ethiroli.com (Senior Operations Staff)
-- Plaintext Password: Employee@123 | Portal: /auth/employee/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('74e45a32-92ab-40f5-97c0-c888d7284c48', '5a0a794dcc347b74766b7d95:5121a3ae5a52962e52592543e9ca1aa3:f062e679fdc2d37ad6576c65c40641c7b161', '$2b$12$CST97m67.CGUD9GkuWPKaetrFE3NtZ811GHa625H3Wr1.TMmXk2WW', '5786c93760f436c7145fb694:d39348b17cba7a4a3e80a145c01a7d31:2134a4759d8da05bec465d4a79621052d8835cecfa51a4', NULL, 'EMPLOYEE', 1, '{"department":"Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'EMPLOYEE',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('74e45a32-92ab-40f5-97c0-c888d7284c48', '$2b$12$CST97m67.CGUD9GkuWPKaetrFE3NtZ811GHa625H3Wr1.TMmXk2WW', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$CST97m67.CGUD9GkuWPKaetrFE3NtZ811GHa625H3Wr1.TMmXk2WW"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`)
VALUES ('e254cb54-a5e2-4602-88d6-47db0f8ddd11', '74e45a32-92ab-40f5-97c0-c888d7284c48', 'EMP-108', 'Operations', 'Senior Associate', CURDATE())
ON DUPLICATE KEY UPDATE
  `employee_code` = VALUES(`employee_code`),
  `department` = VALUES(`department`),
  `designation` = VALUES(`designation`);

-- [STUDENT] student@ethiroli.com (Verified Active Student)
-- Plaintext Password: Student@123 | Portal: /auth/student/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('39a59061-1113-49a8-8d63-4558bb4e70f4', '7f26bdc38553dd76c68db2d2:9867bdde6501388f2de245f3239d5ddb:2858e85a231ed1c7dc5573b007b8da001423172b', '$2b$12$WTbvKcHRAU5rBb3z3pbM5ujtzGh/Ssb1wkY3zbTWWoTPvOdvZsMc6', '5a0a9ae7ab5cbfa0fbb1a58c:2ddec0fcea7fe794b26d86cd8a4b06c5:1cb43bf900607f4d1278e2a0e1963bfc82ecbb127fb9cb', NULL, 'STUDENT', 1, '{"department":"Software Engineering","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'STUDENT',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('39a59061-1113-49a8-8d63-4558bb4e70f4', '$2b$12$WTbvKcHRAU5rBb3z3pbM5ujtzGh/Ssb1wkY3zbTWWoTPvOdvZsMc6', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$WTbvKcHRAU5rBb3z3pbM5ujtzGh/Ssb1wkY3zbTWWoTPvOdvZsMc6"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);

-- [INTERN] gokulrajkumar2006@gmail.com (Gokul Rajkumar)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '197c5d15592a43790ea15cb9:585adf6769f3e41545d9bb2d2c006b8e:0f1de48f6e0c2061984db7caecd39bf8470f3a5d429b257a07cad9', '$2b$12$uBFWPOibgCXs/tG.rqbideOBVYCkTL7Rb0ViwrWDuzRPCFsRYMMTm', 'f37060563fdc71ed42c56186:e79593ca98ccad0a17dae0fa632f545f:dcfd0dec3556161eef57a9d3e726', NULL, 'INTERN', 1, '{"department":"Full Stack Development","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '$2b$12$uBFWPOibgCXs/tG.rqbideOBVYCkTL7Rb0ViwrWDuzRPCFsRYMMTm', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$uBFWPOibgCXs/tG.rqbideOBVYCkTL7Rb0ViwrWDuzRPCFsRYMMTm"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('af5964a2-627c-40a6-b6c1-6f5db35e08ed', '58a8ee15-79a5-473f-ac95-c97bc03d3394', NULL, 'Anna University', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- [INTERN] srinithikumar54@gmail.com (Srinithi Kumar)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', 'dce14f3cf7898a7c500f1773:88a410aaee9d68c90ac4e43c17f8dd9e:90c8c44c3cd833152508bd73f0854cb526ee9723e202fdb758', '$2b$12$GOCwx2fq9ebq8gdm.mP6buIB/w4qKuJQyAzorNllT2AiIQQG/BjLK', '1cc60a84966c8626783fa9e1:1152d6a0d9767f28dc6d1b31f730f1e7:7158ba82bddcb4e8af3ef5bb1c1e', NULL, 'INTERN', 1, '{"department":"Full Stack Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', '$2b$12$GOCwx2fq9ebq8gdm.mP6buIB/w4qKuJQyAzorNllT2AiIQQG/BjLK', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$GOCwx2fq9ebq8gdm.mP6buIB/w4qKuJQyAzorNllT2AiIQQG/BjLK"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('adcd3ce5-b4ea-43c9-a0a8-bd28871c20af', '45d3f678-47a0-442d-8330-9731b2d883b9', NULL, 'PSG College of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- [INTERN] sloganathan0105@gmail.com (S Loganathan)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', 'f24dcded34523c67e52cccd7:d04aab2cace4bcf6c19075767a2c24ba:e234a505fc3ab79e9bcd99979378df585781ae4573ac437fe8', '$2b$12$SrJ9gV.c9gKmf/jgdU/YuOKRvvrHSzk2vpzcDWA3I7d8fgHH1grRS', '2edb63b8546d9083ee7854ff:ac07b16c2744d630a4038cc26184234b:4ab50a6820abfc79310e4e49', NULL, 'INTERN', 1, '{"department":"Web Applications","college":"Coimbatore Institute of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', '$2b$12$SrJ9gV.c9gKmf/jgdU/YuOKRvvrHSzk2vpzcDWA3I7d8fgHH1grRS', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$SrJ9gV.c9gKmf/jgdU/YuOKRvvrHSzk2vpzcDWA3I7d8fgHH1grRS"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('9fa32bc1-192a-43cf-8314-e2908f51a441', '584f6dc7-adaf-4fb5-8cd6-03987543d776', NULL, 'Coimbatore Institute of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- [INTERN] stephen862k7@gmail.com (Stephen)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '75a91c45b6b5d1682a950693:9ad56c79e76403507f62583dc32accd8:3f9b1cbb278defc1ddffec7fa9c57b8192d74f5543c1', '$2b$12$7c2ajH3XLVTIUyz.8.Gw0eGwCWeBU62H54VsSa2UvHTf5gTFRqt5.', '0c35e10b38f1b0484eb6301f:54a43f182ffd727b4fdf99a018ef64a3:08a56b559f79fc', NULL, 'INTERN', 1, '{"department":"Data Science & AI","college":"Government College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '$2b$12$7c2ajH3XLVTIUyz.8.Gw0eGwCWeBU62H54VsSa2UvHTf5gTFRqt5.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$7c2ajH3XLVTIUyz.8.Gw0eGwCWeBU62H54VsSa2UvHTf5gTFRqt5."]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('9ff4b4f5-2803-40f7-a868-d5133f4ab264', '69fa12f1-7d71-4c2a-8122-c8c12ed8754a', NULL, 'Government College of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- [INTERN] Barathappu777@gmail.com (Barath Appu)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', 'f7972af8ac8555bf6a245a88:0e03d2b1c95ce3c02f36b698de61c461:c67bdc98f3d61945deea5395c568e1783de89ef27e8716', '$2b$12$iVB9aCIiSIH04.21DFgXWuiXw7fdafBnO5mmAIkCJduu6X9gxNj1O', 'ddcd5d6a840bb4bca46d9b14:1e4748ce2a276baac79a6568e334e06a:9dbd4dac0771a1518c3e01', NULL, 'INTERN', 1, '{"department":"Backend Engineering","college":"SRM Institute of Science and Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', '$2b$12$iVB9aCIiSIH04.21DFgXWuiXw7fdafBnO5mmAIkCJduu6X9gxNj1O', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$iVB9aCIiSIH04.21DFgXWuiXw7fdafBnO5mmAIkCJduu6X9gxNj1O"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('c56a5051-e898-4afb-897e-61b5eeebe9ba', 'd17aab8c-9280-445f-85ce-cc2a93764ddb', NULL, 'SRM Institute of Science and Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- [INTERN] knandhinivnr@gmail.com (Nandhini K)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('66da1638-9a06-4741-9ed2-8054b0417313', '3cb00bec9c3f1a7868692dc2:c9f65ce8106b238aafae5b7b96d6fbbb:65ee5dd5f6efa5f85cd7fd8fc8ecd826fab650a0e9ae', '$2b$12$zn/836J0pN3GRZDDKTLnq.kc.J/d.MFTiPLTCk48qrDpD6TrGhdVe', 'e0cdb62c9f56fcc2326afcad:4c9a3e2159149ca30d27c1af8782de8e:d5c7614509a3e2390604', NULL, 'INTERN', 1, '{"department":"Full Stack Web Development","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('66da1638-9a06-4741-9ed2-8054b0417313', '$2b$12$zn/836J0pN3GRZDDKTLnq.kc.J/d.MFTiPLTCk48qrDpD6TrGhdVe', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$zn/836J0pN3GRZDDKTLnq.kc.J/d.MFTiPLTCk48qrDpD6TrGhdVe"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('ae5caf31-4b0a-4c4d-a47b-ffd6b87dedb5', '66da1638-9a06-4741-9ed2-8054b0417313', NULL, 'Anna University', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- [INTERN] mathishree008@gmail.com (Mathishree)
-- Plaintext Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `preferences`)
VALUES ('eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', 'd3ca4f4dfe0c1ad1f13a1b58:317b7cd6c1ef147347ef080b2281bd17:81d3b47e661975db99d95728dcf69a94db56e40c0aacf3', '$2b$12$19IHonI7GxJOnxV1wX6W..Fpw2W2L/hjvsj8yPZWOnyVdKR/.vM8O', 'd59b56d7dbe330ac08aac193:f8f475eb9aa9e36ec70832a3242fc762:d4a9f4f4866021d6b1cb', NULL, 'INTERN', 1, '{"department":"Full Stack Web Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `role` = 'INTERN',
  `is_active` = 1,
  `preferences` = VALUES(`preferences`);
INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`)
VALUES ('eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', '$2b$12$19IHonI7GxJOnxV1wX6W..Fpw2W2L/hjvsj8yPZWOnyVdKR/.vM8O', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$19IHonI7GxJOnxV1wX6W..Fpw2W2L/hjvsj8yPZWOnyVdKR/.vM8O"]')
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `password_updated_at` = NOW(),
  `failed_login_attempts` = 0,
  `lockout_until` = NULL,
  `requires_password_change` = 0,
  `password_history` = VALUES(`password_history`);
INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `project_target`, `progress`)
VALUES ('2c2e2b8d-25d8-48ea-937b-cc43f460627f', 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', NULL, 'PSG College of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  `college_name` = VALUES(`college_name`),
  `stipend` = VALUES(`stipend`),
  `project_target` = VALUES(`project_target`),
  `progress` = VALUES(`progress`);

-- ============================================================================
-- PART 7: RBAC USER_ROLES SYNC & DATA CLEANUP
-- ============================================================================

-- Sync all active users with the roles catalog table
INSERT IGNORE INTO `user_roles` (`id`, `user_id`, `role_id`, `assigned_by`, `assigned_at`)
SELECT UUID(), u.id, r.id, 'SYSTEM', NOW()
FROM `users` u
JOIN `roles` r ON (u.role = r.code OR (u.role = 'PROJECT_MANAGER' AND r.code = 'PM'));

-- Backfill existing attendance records to REMOTE work_mode
UPDATE `attendance` SET `work_mode` = 'REMOTE' WHERE `work_mode` IS NULL;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- End of migration script