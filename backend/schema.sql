-- ============================================================================
-- Ethiroli Complete Database Schema & Seed Data
-- Synchronized with Production Database Dump on: 2026-09-29T11:53:54.911Z
-- Compatible with Hostinger MySQL 8.0, MariaDB 10/11, LiteSpeed, phpMyAdmin & Node.js
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================================================
-- SECTION 1: Production Tables (1-to-1 Aligned)
-- ============================================================================

-- Table: activity_feeds
CREATE TABLE IF NOT EXISTS `activity_feeds` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `actor_id` char(36) DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `user_id` (`user_id`),
  KEY `actor_id` (`actor_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: anomaly_logs
CREATE TABLE IF NOT EXISTS `anomaly_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `anomaly_type` enum('IMPOSSIBLE_TRAVEL','BRUTE_FORCE','RAPID_DATA_ACCESS','SUSPICIOUS_IP') NOT NULL,
  `severity` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`details`)),
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` datetime DEFAULT NULL,
  `resolved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_severity` (`severity`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (resolved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: api_keys
CREATE TABLE IF NOT EXISTS `api_keys` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `api_key` varchar(64) NOT NULL,
  `api_secret` varchar(64) NOT NULL,
  `scopes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`scopes`)),
  `rate_limit_per_minute` int(11) DEFAULT 60,
  `expires_at` datetime DEFAULT NULL,
  `last_used_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `api_key` (`api_key`),
  KEY `user_id` (`user_id`),
  KEY `idx_api_key` (`api_key`),
  KEY `idx_tenant` (`tenant_id`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: applications
CREATE TABLE IF NOT EXISTS `applications` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `candidate_id` char(36) NOT NULL,
  `job_id` char(36) NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `cover_letter` text DEFAULT NULL,
  `applied_at` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_candidate` (`candidate_id`),
  KEY `idx_job` (`job_id`),
  KEY `idx_status` (`status_id`),
  CONSTRAINT FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (status_id) REFERENCES application_statuses (status_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: application_statuses
CREATE TABLE IF NOT EXISTS `application_statuses` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(100) NOT NULL,
  `status_code` varchar(50) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_final` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  ) ;,
  --,
  -- Dumping data for table `application_statuses`,
  --,
  INSERT INTO `application_statuses` (`status_id`, `status_name`, `status_code`, `display_order`, `is_final`, `created_at`, `updated_at`) VALUES,
  (1, 'Applied', 'APPLIED', 1, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (2, 'Under Review', 'UNDER_REVIEW', 2, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (3, 'Shortlisted', 'SHORTLISTED', 3, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (4, 'Interview Scheduled', 'INTERVIEW_SCHEDULED', 4, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (5, 'Interviewed', 'INTERVIEWED', 5, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (6, 'Offered', 'OFFERED', 6, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (7, 'Accepted', 'ACCEPTED', 7, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (8, 'Rejected', 'REJECTED', 8, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
  (9, 'Withdrawn', 'WITHDRAWN', 9, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43');,
  --,
  -- Triggers `application_statuses`,
  --,
  DELIMITER $$,
  CREATE TRIGGER `trg_application_statuses_updated_at` BEFORE UPDATE ON `application_statuses` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP,
  $$,
  DELIMITER ;,
  -- --------------------------------------------------------,
  --,
  -- Table structure for table `application_status_history`,
  --,
  CREATE TABLE `application_status_history` (,
  `history_id` int(11) NOT NULL,
  `application_id` char(36) NOT NULL,
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `changed_by` char(36) DEFAULT NULL,
  `change_notes` text DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `status_name` (`status_name`),
  UNIQUE KEY `status_code` (`status_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: approval_chains
CREATE TABLE IF NOT EXISTS `approval_chains` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `workflow_id` char(36) NOT NULL,
  `step_order` int(11) NOT NULL,
  `approver_role` enum('HR','FINANCE','MANAGER','ADMIN','SUPER_ADMIN') NOT NULL,
  `approval_condition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`approval_condition`)),
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `unique_step` (`workflow_id`,`step_order`),
  KEY `idx_workflow` (`workflow_id`),
  KEY `idx_approval_chains_name` (`name`),
  CONSTRAINT FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: approval_instances
CREATE TABLE IF NOT EXISTS `approval_instances` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `workflow_id` char(36) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `current_step` int(11) DEFAULT 1,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
  `decisions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`decisions`)),
  `initiated_by` char(36) NOT NULL,
  `initiated_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `initiated_by` (`initiated_by`),
  KEY `idx_workflow` (`workflow_id`),
  KEY `idx_entity` (`entity_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (initiated_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: assignments
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `course_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `max_score` int(11) DEFAULT 100,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_course` (`course_id`),
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: assignment_submissions
CREATE TABLE IF NOT EXISTS `assignment_submissions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `assignment_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `text_content` longtext DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `graded_at` datetime DEFAULT NULL,
  `graded_by` char(36) DEFAULT NULL,
  UNIQUE KEY `unique_submission` (`assignment_id`,`student_id`),
  KEY `student_id` (`student_id`),
  KEY `idx_assignment` (`assignment_id`),
  CONSTRAINT FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: attendance
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `date` date NOT NULL,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `total_hours` decimal(5,2) GENERATED ALWAYS AS (round(timestampdiff(SECOND,`check_in_time`,`check_out_time`) / 3600.0,2)) STORED,
  `is_late` tinyint(1) DEFAULT 0,
  `status` enum('PRESENT','ABSENT','HALF_DAY') DEFAULT 'ABSENT',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_attendance` (`user_id`,`date`),
  KEY `idx_date` (`date`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` char(36) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `old_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_value`)),
  `new_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_value`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `idx_user_action_created` (`user_id`,`action`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: automation_workflows
CREATE TABLE IF NOT EXISTS `automation_workflows` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `trigger_type` enum('SCHEDULE','EVENT','WEBHOOK') NOT NULL,
  `trigger_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`trigger_config`)),
  `is_active` tinyint(1) DEFAULT 1,
  `execution_count` int(11) DEFAULT 0,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `created_by` (`created_by`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: badges
CREATE TABLE IF NOT EXISTS `badges` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`criteria`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `name` (`name`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: batches
CREATE TABLE IF NOT EXISTS `batches` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `course_id` char(36) NOT NULL,
  `tutor_id` char(36) NOT NULL,
  `batch_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `max_capacity` int(11) DEFAULT 30,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `batch_code` (`batch_code`),
  KEY `idx_course` (`course_id`),
  KEY `idx_tutor` (`tutor_id`),
  KEY `idx_code` (`batch_code`),
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (tutor_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: batch_students
CREATE TABLE IF NOT EXISTS `batch_students` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `batch_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `unique_batch_student` (`batch_id`,`student_id`),
  KEY `idx_batch` (`batch_id`),
  KEY `idx_student` (`student_id`),
  CONSTRAINT FOREIGN KEY (batch_id) REFERENCES batches (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: calendar_events
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_type` enum('MEETING','DEADLINE','TASK','ANNOUNCEMENT','TRAINING') NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_all_day` tinyint(1) DEFAULT 0,
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `assigned_users` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`assigned_users`)),
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `created_by` (`created_by`),
  KEY `idx_start` (`start_time`),
  KEY `idx_end` (`end_time`),
  KEY `idx_type` (`event_type`),
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: candidates
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `job_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `resume_url` varchar(500) DEFAULT NULL,
  `source` enum('INDEED','LINKEDIN','NAUKRI','REFERRAL','WEBSITE','MANUAL') DEFAULT 'MANUAL',
  `indeed_candidate_id` varchar(100) DEFAULT NULL,
  `status` enum('NEW','CONTACTED','SCREENING','INTERVIEWING','OFFER','HIRED','REJECTED') DEFAULT 'NEW',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_job` (`job_id`),
  KEY `idx_status` (`status`),
  KEY `idx_source` (`source`),
  CONSTRAINT FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: candidate_documents
CREATE TABLE IF NOT EXISTS `candidate_documents` (
  `document_id` char(36) NOT NULL DEFAULT (UUID()),
  `candidate_id` char(36) NOT NULL,
  `application_id` char(36) DEFAULT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_candidate` (`candidate_id`),
  KEY `idx_application` (`application_id`),
  CONSTRAINT FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cart_sessions
CREATE TABLE IF NOT EXISTS `cart_sessions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `session_token` varchar(255) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `coupon_code` varchar(50) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `tenant_id` (`tenant_id`),
  KEY `idx_session_token` (`session_token`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: certificates
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `enrollment_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `certificate_number` varchar(50) NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `pdf_url` varchar(500) NOT NULL,
  `qr_code_url` varchar(500) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `certificate_number` (`certificate_number`),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_certificate_number` (`certificate_number`),
  CONSTRAINT FOREIGN KEY (enrollment_id) REFERENCES enrollments (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gst` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: communication_logs
CREATE TABLE IF NOT EXISTS `communication_logs` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `channel` enum('EMAIL','SMS','WHATSAPP') NOT NULL,
  `template_id` char(36) DEFAULT NULL,
  `sender` varchar(255) DEFAULT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `status` enum('PENDING','SENT','FAILED','DELIVERED','READ') DEFAULT 'PENDING',
  `provider_response` text DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `read_at` datetime DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `template_id` (`template_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_recipient` (`recipient`),
  KEY `idx_status` (`status`),
  KEY `idx_channel` (`channel`),
  KEY `idx_sent_at` (`sent_at`),
  CONSTRAINT FOREIGN KEY (template_id) REFERENCES communication_templates (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: communication_templates
CREATE TABLE IF NOT EXISTS `communication_templates` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(100) NOT NULL,
  `channel` enum('EMAIL','SMS','WHATSAPP') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` longtext NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `name` (`name`),
  KEY `idx_channel` (`channel`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: company_settings
CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `company_name` varchar(255) NOT NULL,
  `gst` varchar(255) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `bank_ifsc` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: contact_inquiries
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `inquiry_id` char(36) NOT NULL DEFAULT (UUID()),
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `inquiry_source` enum('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','OTHER') DEFAULT 'WEBSITE',
  `is_read` tinyint(1) DEFAULT 0,
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  KEY `idx_email` (`email`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_is_resolved` (`is_resolved`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: contact_inquiry_attachments
CREATE TABLE IF NOT EXISTS `contact_inquiry_attachments` (
  `attachment_id` char(36) NOT NULL DEFAULT (UUID()),
  `inquiry_id` char(36) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_inquiry` (`inquiry_id`),
  CONSTRAINT FOREIGN KEY (inquiry_id) REFERENCES contact_inquiries (inquiry_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: coupons
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('PERCENTAGE','FIXED') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) DEFAULT 0.00,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `valid_from` date NOT NULL,
  `valid_to` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `code` (`code`),
  KEY `tenant_id` (`tenant_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_code` (`code`),
  KEY `idx_valid` (`valid_from`,`valid_to`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `level` varchar(20) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `fee` decimal(10,2) DEFAULT NULL,
  `tutor_id` char(36) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `code` (`code`),
  KEY `idx_tutor` (`tutor_id`),
  KEY `idx_code` (`code`),
  KEY `idx_courses_category` (`category`),
  CONSTRAINT FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: course_completions
CREATE TABLE IF NOT EXISTS `course_completions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `enrollment_id` varchar(191) NOT NULL,
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `completed_at` datetime NOT NULL,
  `certificate_number` varchar(100) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  `qr_code_url` varchar(500) DEFAULT NULL,
  `status` enum('PENDING','ISSUED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `uk_course_completions_enrollment` (`enrollment_id`),
  KEY `idx_completions_student` (`student_id`),
  KEY `idx_completions_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: course_modules
CREATE TABLE IF NOT EXISTS `course_modules` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `course_id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `module_order` int(11) NOT NULL,
  `is_optional` tinyint(1) DEFAULT 0,
  `custom_duration_days` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `module_id` (`module_id`),
  KEY `idx_course_order` (`course_id`,`module_order`),
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (module_id) REFERENCES technology_modules (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: customer_handovers
CREATE TABLE IF NOT EXISTS `customer_handovers` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `deal_id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `handover_to` enum('PROJECT_MANAGER','ACADEMIC_COORDINATOR','OPERATIONS') NOT NULL,
  `assigned_person_id` char(36) DEFAULT NULL,
  `scope_summary` text NOT NULL,
  `kickoff_date` date NOT NULL,
  `status` enum('PENDING','ACCEPTED','ONBOARDED') DEFAULT 'PENDING',
  `handover_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `deal_id` (`deal_id`),
  KEY `client_id` (`client_id`),
  KEY `assigned_person_id` (`assigned_person_id`),
  KEY `handover_by` (`handover_by`),
  KEY `idx_handover_status` (`status`),
  CONSTRAINT FOREIGN KEY (deal_id) REFERENCES sales_deals (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (assigned_person_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (handover_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: departments
CREATE TABLE IF NOT EXISTS `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `department_name` (`department_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: device_registrations
CREATE TABLE IF NOT EXISTS `device_registrations` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `platform` enum('IOS','ANDROID','WEB') NOT NULL,
  `push_token` varchar(255) NOT NULL,
  `app_version` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_active_at` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_user_device` (`user_id`,`device_id`),
  KEY `idx_tenant` (`tenant_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: doubts
CREATE TABLE IF NOT EXISTS `doubts` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `lesson_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `code_snippet` text DEFAULT NULL,
  `screenshot_url` varchar(500) DEFAULT NULL,
  `status` enum('OPEN','IN_REVIEW','RESOLVED') DEFAULT 'OPEN',
  `assigned_tutor_id` char(36) DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_course_status` (`course_id`,`status`),
  KEY `idx_student` (`student_id`),
  KEY `idx_tutor` (`assigned_tutor_id`),
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (assigned_tutor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: employees
CREATE TABLE IF NOT EXISTS `employees` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `salary_structure_id` char(36) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `pf_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  KEY `idx_employee_code` (`employee_code`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: employee_documents
CREATE TABLE IF NOT EXISTS `employee_documents` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `employee_id` char(36) NOT NULL,
  `document_type` enum('RESUME','OFFER_LETTER','APPOINTMENT_LETTER','NDA','ID_PROOF','DEGREE_CERTIFICATE','EXPERIENCE_LETTER','PAYSLIP','OTHER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `status` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  `verified_by` char(36) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `uploaded_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `verified_by` (`verified_by`),
  KEY `idx_employee` (`employee_id`),
  KEY `idx_type` (`document_type`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (verified_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: enrollments
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `assigned_by_tutor_id` char(36) DEFAULT NULL,
  `enrolled_at` timestamp NULL DEFAULT current_timestamp(),
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `status` enum('ACTIVE','COMPLETED','DROPPED') DEFAULT 'ACTIVE',
  `due_date` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: exit_requests
CREATE TABLE IF NOT EXISTS `exit_requests` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `employee_id` char(36) NOT NULL,
  `resignation_date` date NOT NULL,
  `requested_last_day` date NOT NULL,
  `approved_last_day` date DEFAULT NULL,
  `reason` text NOT NULL,
  `notice_period_days` int(11) DEFAULT 30,
  `status` enum('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','WITHDRAWN','COMPLETED') DEFAULT 'SUBMITTED',
  `exit_interview_notes` text DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `approved_by` (`approved_by`),
  KEY `idx_employee` (`employee_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: feature_flags
CREATE TABLE IF NOT EXISTS `feature_flags` (
  `id` char(36) NOT NULL,
  `flag_key` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `environment` varchar(50) NOT NULL DEFAULT 'PROD',
  `rollout_percentage` int(11) NOT NULL DEFAULT 100,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `tenant_id` char(36) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `flag_key` (`flag_key`),
  KEY `idx_flag_key` (`flag_key`),
  KEY `idx_flag_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: financial_budgets
CREATE TABLE IF NOT EXISTS `financial_budgets` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `fiscal_year` varchar(10) NOT NULL,
  `quarter` enum('Q1','Q2','Q3','Q4','ANNUAL') NOT NULL,
  `department` enum('ENGINEERING','MARKETING','OPERATIONS','HUMAN_RESOURCES','GENERAL_ADMIN','SALES') NOT NULL,
  `category` varchar(100) NOT NULL,
  `allocated_amount` decimal(12,2) NOT NULL,
  `spent_amount` decimal(12,2) DEFAULT 0.00,
  `currency` varchar(10) DEFAULT 'INR',
  `notes` text DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_budget_dept` (`fiscal_year`,`quarter`,`department`,`category`),
  KEY `created_by` (`created_by`),
  KEY `idx_fiscal_dept` (`fiscal_year`,`department`),
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: financial_refunds
CREATE TABLE IF NOT EXISTS `financial_refunds` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `invoice_id` char(36) DEFAULT NULL,
  `payment_id` char(36) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `reason` varchar(255) NOT NULL,
  `status` enum('PENDING','APPROVED','PROCESSED','REJECTED') DEFAULT 'PENDING',
  `gateway_refund_id` varchar(100) DEFAULT NULL,
  `utr_number` varchar(100) DEFAULT NULL,
  `requested_at` datetime DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `processed_by` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `payment_id` (`payment_id`),
  KEY `processed_by` (`processed_by`),
  KEY `idx_refund_status` (`status`),
  KEY `idx_invoice` (`invoice_id`),
  CONSTRAINT FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (processed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: forum_posts
CREATE TABLE IF NOT EXISTS `forum_posts` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `course_id` char(36) DEFAULT NULL,
  `author_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` varchar(50) NOT NULL DEFAULT 'general',
  KEY `author_id` (`author_id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_pinned` (`is_pinned`),
  KEY `idx_forum_category` (`category`),
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: forum_post_votes
CREATE TABLE IF NOT EXISTS `forum_post_votes` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `post_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `vote` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `uq_post_user` (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT FOREIGN KEY (post_id) REFERENCES forum_posts (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: forum_replies
CREATE TABLE IF NOT EXISTS `forum_replies` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `post_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  `content` longtext NOT NULL,
  `is_best_answer` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `author_id` (`author_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_best` (`is_best_answer`),
  CONSTRAINT FOREIGN KEY (post_id) REFERENCES forum_posts (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: holidays
CREATE TABLE IF NOT EXISTS `holidays` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `is_restricted` tinyint(1) DEFAULT 0,
  `restricted_to` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`restricted_to`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_holiday_date` (`date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: integrations
CREATE TABLE IF NOT EXISTS `integrations` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `service_name` varchar(100) NOT NULL,
  `category` enum('SECURITY','PAYMENTS','COMMUNICATION','CALENDAR','ANALYTICS','AUTOMATION','CRM','DEVTOOLS','JOBS') NOT NULL,
  `config` text NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 0,
  `connection_status` enum('PENDING','CONNECTED','ERROR','DISABLED') DEFAULT 'PENDING',
  `last_synced_at` datetime DEFAULT NULL,
  `sync_log` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sync_log`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `service_name` (`service_name`),
  KEY `idx_category` (`category`),
  KEY `idx_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: interns
CREATE TABLE IF NOT EXISTS `interns` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `mentor_id` char(36) DEFAULT NULL,
  `college_name` varchar(255) DEFAULT NULL,
  `stipend` decimal(10,2) DEFAULT 0.00,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_mentor` (`mentor_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: interviews
CREATE TABLE IF NOT EXISTS `interviews` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `candidate_id` char(36) NOT NULL,
  `round` enum('ROUND_1','ROUND_2','HR_ROUND') NOT NULL,
  `interviewer_id` char(36) DEFAULT NULL,
  `scheduled_at` datetime NOT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `meeting_link` varchar(500) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `rating` int(11) DEFAULT 0,
  `status` enum('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'SCHEDULED',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `interviewer_id` (`interviewer_id`),
  KEY `idx_candidate` (`candidate_id`),
  KEY `idx_round` (`round`),
  KEY `idx_status` (`status`),
  KEY `idx_scheduled` (`scheduled_at`),
  CONSTRAINT FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (interviewer_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: interview_schedules
CREATE TABLE IF NOT EXISTS `interview_schedules` (
  `interview_id` char(36) NOT NULL DEFAULT (UUID()),
  `application_id` char(36) NOT NULL,
  `interview_type` varchar(100) DEFAULT NULL,
  `interview_round` int(11) DEFAULT 1,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `timezone` varchar(50) DEFAULT 'Asia/Kolkata',
  `interview_mode` enum('ONLINE','OFFLINE','PHONE') DEFAULT 'ONLINE',
  `location_link` varchar(500) DEFAULT NULL,
  `interviewer_name` varchar(255) DEFAULT NULL,
  `interviewer_email` varchar(255) DEFAULT NULL,
  `interviewer_phone` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `feedback_text` text DEFAULT NULL,
  `feedback_score` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` char(36) DEFAULT NULL,
  KEY `created_by` (`created_by`),
  KEY `idx_application` (`application_id`),
  KEY `idx_scheduled` (`scheduled_date`,`scheduled_time`),
  CONSTRAINT FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: invoices
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `invoice_number` varchar(50) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `student_id` char(36) DEFAULT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `gst_rate` decimal(5,2) DEFAULT 0.00,
  `gst_amount` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` enum('DRAFT','SENT','PAID','OVERDUE','CANCELLED') DEFAULT 'DRAFT',
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurring_schedule_id` char(36) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `client_id` (`client_id`),
  KEY `student_id` (`student_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`),
  KEY `idx_invoice_number` (`invoice_number`),
  CONSTRAINT FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `required_skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`required_skills`)),
  `status` enum('DRAFT','OPEN','CLOSED','FILLED') DEFAULT 'DRAFT',
  `posted_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `created_by` (`created_by`),
  KEY `idx_status` (`status`),
  KEY `idx_title` (`title`),
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: job_board_posts
CREATE TABLE IF NOT EXISTS `job_board_posts` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `job_id` char(36) NOT NULL,
  `platform` enum('LINKEDIN','NAUKRI','INDEED','INTERNSHALA') NOT NULL,
  `external_post_id` varchar(255) DEFAULT NULL,
  `posted_at` datetime DEFAULT NULL,
  `status` enum('PENDING','POSTED','FAILED','EXPIRED') DEFAULT 'PENDING',
  `error_message` text DEFAULT NULL,
  `platform_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`platform_response`)),
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_job_platform` (`job_id`,`platform`),
  KEY `created_by` (`created_by`),
  KEY `idx_job` (`job_id`),
  KEY `idx_platform` (`platform`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: job_categories
CREATE TABLE IF NOT EXISTS `job_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: job_types
CREATE TABLE IF NOT EXISTS `job_types` (
  `job_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: leads
CREATE TABLE IF NOT EXISTS `leads` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `source` enum('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','INDEED','OTHER') NOT NULL DEFAULT 'OTHER',
  `status` enum('NEW','CONTACTED','DEMO','COUNSELLING','ADMISSION','PAYMENT','LOST') NOT NULL DEFAULT 'NEW',
  `assigned_to` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `converted_at` timestamp NULL DEFAULT NULL,
  `lost_reason` text DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `assigned_to` (`assigned_to`),
  KEY `created_by` (`created_by`),
  KEY `idx_leads_company` (`company_name`),
  CONSTRAINT FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: leaves
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `leave_type` enum('CASUAL','SICK','EARNED') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `approved_by` char(36) DEFAULT NULL,
  `approval_chain_step` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `approved_by` (`approved_by`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_dates` (`start_date`,`end_date`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: leave_balances
CREATE TABLE IF NOT EXISTS `leave_balances` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `leave_type` enum('CASUAL','SICK','EARNED') NOT NULL,
  `financial_year` varchar(10) NOT NULL,
  `total_credited` decimal(4,1) NOT NULL DEFAULT 0.0,
  `consumed` decimal(4,1) NOT NULL DEFAULT 0.0,
  `balance` decimal(4,1) GENERATED ALWAYS AS (`total_credited` - `consumed`) STORED,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_user_year_type` (`user_id`,`financial_year`,`leave_type`),
  KEY `idx_user` (`user_id`),
  KEY `idx_fin_year` (`financial_year`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: lessons
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `module_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `lesson_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `technology_module_id` char(36) DEFAULT NULL,
  KEY `idx_module_order` (`module_id`,`lesson_order`),
  KEY `idx_lessons_technology_module` (`technology_module_id`),
  CONSTRAINT FOREIGN KEY (module_id) REFERENCES modules (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: lesson_blocks
CREATE TABLE IF NOT EXISTS `lesson_blocks` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `lesson_id` char(36) NOT NULL,
  `block_type` enum('VIDEO','MARKDOWN','CODE_PLAYGROUND','QUIZ_EMBED','RESOURCE_DOWNLOAD','CALLOUT') NOT NULL,
  `block_order` int(11) NOT NULL DEFAULT 1,
  `content_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content_payload`)),
  `is_interactive` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_lesson_block_order` (`lesson_id`,`block_order`),
  CONSTRAINT FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: lesson_progress
CREATE TABLE IF NOT EXISTS `lesson_progress` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `enrollment_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `lesson_id` char(36) NOT NULL,
  `status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED') DEFAULT 'NOT_STARTED',
  `seconds_watched` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_student_lesson` (`student_id`,`lesson_id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `idx_lesson_progress_enrollment` (`enrollment_id`),
  KEY `idx_lesson_progress_student` (`student_id`),
  CONSTRAINT FOREIGN KEY (enrollment_id) REFERENCES enrollments (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: live_quiz_sessions
CREATE TABLE IF NOT EXISTS `live_quiz_sessions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `quiz_id` char(36) NOT NULL,
  `tutor_id` char(36) NOT NULL,
  `started_at` datetime DEFAULT current_timestamp(),
  `ended_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `total_participants` int(11) DEFAULT 0,
  KEY `quiz_id` (`quiz_id`),
  KEY `tutor_id` (`tutor_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `sender_id` char(36) NOT NULL,
  `recipient_id` char(36) DEFAULT NULL,
  `channel_name` varchar(100) DEFAULT NULL,
  `message_content` text NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `recipient_id` (`recipient_id`),
  KEY `idx_chat_convo` (`sender_id`,`recipient_id`,`created_at`),
  KEY `idx_channel` (`channel_name`,`created_at`),
  CONSTRAINT FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: mfa_secrets
CREATE TABLE IF NOT EXISTS `mfa_secrets` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `backup_codes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`backup_codes`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  KEY `idx_user_mfa` (`user_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: mindmap_nodes
CREATE TABLE IF NOT EXISTS `mindmap_nodes` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `node_type` enum('ROOT','BRANCH','LEAF') DEFAULT 'BRANCH',
  `position_x` decimal(10,2) DEFAULT 0.00,
  `position_y` decimal(10,2) DEFAULT 0.00,
  `color` varchar(20) DEFAULT '#4F46E5',
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_user` (`user_id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (project_id) REFERENCES student_projects (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (parent_id) REFERENCES mindmap_nodes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: modules
CREATE TABLE IF NOT EXISTS `modules` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `course_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `module_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  KEY `idx_course_order` (`course_id`,`module_order`),
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: module_topics
CREATE TABLE IF NOT EXISTS `module_topics` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `module_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `topic_order` int(11) NOT NULL,
  `estimated_hours` decimal(5,2) DEFAULT 1.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_module_order` (`module_id`,`topic_order`),
  CONSTRAINT FOREIGN KEY (module_id) REFERENCES technology_modules (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: oauth_states
CREATE TABLE IF NOT EXISTS `oauth_states` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `state` varchar(255) NOT NULL,
  `portal_slug` varchar(100) NOT NULL,
  `redirect_uri` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `state` (`state`),
  KEY `idx_state` (`state`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: offboarding_checklists
CREATE TABLE IF NOT EXISTS `offboarding_checklists` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `exit_request_id` char(36) NOT NULL,
  `department` enum('IT','HR','FINANCE','OPERATIONS','ADMIN') NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `is_cleared` tinyint(1) DEFAULT 0,
  `cleared_by` char(36) DEFAULT NULL,
  `cleared_at` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `cleared_by` (`cleared_by`),
  KEY `idx_exit_request` (`exit_request_id`),
  KEY `idx_cleared` (`is_cleared`),
  CONSTRAINT FOREIGN KEY (exit_request_id) REFERENCES exit_requests (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (cleared_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `coupon_code` varchar(50) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
  `payment_method` enum('RAZORPAY','STRIPE','BANK_TRANSFER') DEFAULT 'RAZORPAY',
  `payment_id` varchar(255) DEFAULT NULL,
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billing_address`)),
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `placed_at` datetime DEFAULT current_timestamp(),
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_placed_at` (`placed_at`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `product_id` (`product_id`),
  KEY `course_id` (`course_id`),
  KEY `idx_order` (`order_id`),
  CONSTRAINT FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `invoice_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `method` enum('RAZORPAY','STRIPE','BANK_TRANSFER','CASH','CHEQUE') NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_invoice` (`invoice_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payroll
CREATE TABLE IF NOT EXISTS `payroll` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `employee_id` char(36) NOT NULL,
  `month_year` date NOT NULL,
  `basic` decimal(10,2) NOT NULL,
  `hra` decimal(10,2) NOT NULL,
  `da` decimal(10,2) DEFAULT 0.00,
  `pf_employee` decimal(10,2) DEFAULT 0.00,
  `pf_employer` decimal(10,2) DEFAULT 0.00,
  `esi_employee` decimal(10,2) DEFAULT 0.00,
  `esi_employer` decimal(10,2) DEFAULT 0.00,
  `tds` decimal(10,2) DEFAULT 0.00,
  `gross_salary` decimal(10,2) NOT NULL,
  `net_salary` decimal(10,2) NOT NULL,
  `total_deductions` decimal(10,2) DEFAULT 0.00,
  `bank_transfer_ref` varchar(100) DEFAULT NULL,
  `payslip_pdf_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'DRAFT',
  `processed_by` char(36) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dispute_reason` text DEFAULT NULL,
  `adjustment_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `disputed_by` char(36) DEFAULT NULL,
  `disputed_at` datetime DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  UNIQUE KEY `unique_payroll` (`employee_id`,`month_year`),
  KEY `processed_by` (`processed_by`),
  KEY `idx_employee` (`employee_id`),
  KEY `idx_month` (`month_year`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (processed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: performance_reviews
CREATE TABLE IF NOT EXISTS `performance_reviews` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `employee_id` char(36) NOT NULL,
  `reviewer_id` char(36) NOT NULL,
  `review_date` date NOT NULL,
  `rating` int(11) DEFAULT 0,
  `feedback` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`feedback`)),
  `overall_comment` text DEFAULT NULL,
  `status` enum('DRAFT','SUBMITTED','ACKNOWLEDGED','ARCHIVED') DEFAULT 'DRAFT',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_employee` (`employee_id`),
  KEY `idx_reviewer` (`reviewer_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` varchar(36) NOT NULL,
  `code` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;,
  -- --------------------------------------------------------,
  --,
  -- Table structure for table `prediction_logs`,
  --,
  CREATE TABLE `prediction_logs` (,
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `entity_type` enum('LEAD','STUDENT','EMPLOYEE') NOT NULL,
  `entity_id` char(36) NOT NULL,
  `prediction_type` enum('LEAD_SCORE','CHURN_PROBABILITY','PERFORMANCE') NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `confidence` decimal(5,2) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `explanation` text DEFAULT NULL,
  `model_version` varchar(50) DEFAULT NULL,
  `predicted_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `code` (`code`),
  KEY `idx_perm_module` (`module`),
  KEY `idx_perm_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
CREATE TABLE IF NOT EXISTS `products` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_tenant_course` (`tenant_id`,`course_id`),
  KEY `course_id` (`course_id`),
  KEY `idx_published` (`is_published`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: programs
CREATE TABLE IF NOT EXISTS `programs` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `tracks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tracks`)),
  `final_project` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: program_modules
CREATE TABLE IF NOT EXISTS `program_modules` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `program_id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `module_order` int(11) NOT NULL,
  `allocated_days` int(11) NOT NULL,
  `start_day` int(11) DEFAULT NULL,
  `end_day` int(11) DEFAULT NULL,
  `is_core` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `module_id` (`module_id`),
  KEY `idx_program_order` (`program_id`,`module_order`),
  CONSTRAINT FOREIGN KEY (program_id) REFERENCES programs (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (module_id) REFERENCES technology_modules (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_expenses
CREATE TABLE IF NOT EXISTS `project_expenses` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `project_id` char(36) NOT NULL,
  `logged_by` char(36) NOT NULL,
  `category` enum('CLOUD_INFRA','SOFTWARE_LICENSE','HARDWARE','CONTRACTOR_FEE','TRAVEL','MISC') NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `expense_date` date NOT NULL,
  `receipt_url` varchar(500) DEFAULT NULL,
  `is_billable` tinyint(1) DEFAULT 1,
  `status` enum('PENDING','APPROVED','REJECTED','BILLED') DEFAULT 'PENDING',
  `approved_by` char(36) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `invoice_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `logged_by` (`logged_by`),
  KEY `approved_by` (`approved_by`),
  KEY `invoice_id` (`invoice_id`),
  KEY `idx_proj_expense` (`project_id`,`status`),
  KEY `idx_expense_date` (`expense_date`),
  CONSTRAINT FOREIGN KEY (project_id) REFERENCES student_projects (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (logged_by) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_files
CREATE TABLE IF NOT EXISTS `project_files` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `project_id` char(36) NOT NULL,
  `uploaded_by` char(36) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) NOT NULL DEFAULT 0,
  `mime_type` varchar(100) DEFAULT 'application/octet-stream',
  `version` varchar(20) DEFAULT '1.0',
  `category` enum('SPECIFICATION','DESIGN_ASSET','DELIVERABLE','CONTRACT','MEETING_RECORDING','OTHER') DEFAULT 'SPECIFICATION',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `idx_project_cat` (`project_id`,`category`),
  CONSTRAINT FOREIGN KEY (project_id) REFERENCES student_projects (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_members
CREATE TABLE IF NOT EXISTS `project_members` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `project_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `project_role` enum('LEAD','MEMBER','CONTRIBUTOR','REVIEWER') DEFAULT 'MEMBER',
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `unique_project_user` (`project_id`,`user_id`),
  KEY `idx_user_projects` (`user_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_milestones
CREATE TABLE IF NOT EXISTS `project_milestones` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `project_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `target_date` date NOT NULL,
  `completed_date` date DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','REVIEW','COMPLETED','DELAYED') DEFAULT 'PENDING',
  `deliverable_url` varchar(500) DEFAULT NULL,
  `budget_allocated` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_project_status` (`project_id`,`status`),
  KEY `idx_target_date` (`target_date`),
  CONSTRAINT FOREIGN KEY (project_id) REFERENCES student_projects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: project_sprints
CREATE TABLE IF NOT EXISTS `project_sprints` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `project_id` char(36) NOT NULL,
  `sprint_number` int(11) NOT NULL,
  `sprint_name` varchar(100) NOT NULL,
  `goal` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('PLANNING','ACTIVE','COMPLETED','CANCELLED') DEFAULT 'PLANNING',
  `target_velocity` int(11) DEFAULT 0,
  `actual_velocity` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_proj_sprint` (`project_id`,`sprint_number`),
  KEY `idx_proj_sprint_status` (`project_id`,`status`),
  CONSTRAINT FOREIGN KEY (project_id) REFERENCES student_projects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: provider_configs
CREATE TABLE IF NOT EXISTS `provider_configs` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `provider` varchar(50) NOT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` text NOT NULL,
  `is_encrypted` tinyint(1) DEFAULT 1,
  `is_enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_provider_key` (`provider`,`config_key`),
  KEY `idx_provider` (`provider`),
  KEY `idx_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: quizzes
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `course_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit_minutes` int(11) DEFAULT 10,
  `passing_score` int(11) DEFAULT 70,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_course` (`course_id`),
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: quiz_attempts
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `quiz_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `score` int(11) DEFAULT 0,
  `total_questions` int(11) NOT NULL,
  `time_taken_seconds` int(11) DEFAULT 0,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers`)),
  `submitted_at` datetime DEFAULT current_timestamp(),
  `is_live` tinyint(1) DEFAULT 0,
  `live_session_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `student_id` (`student_id`),
  KEY `idx_quiz_student` (`quiz_id`,`student_id`),
  KEY `idx_live_session` (`live_session_id`),
  CONSTRAINT FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reception_appointments
CREATE TABLE IF NOT EXISTS `reception_appointments` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `visitor_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) NOT NULL,
  `person_to_meet` char(36) DEFAULT NULL,
  `person_to_meet_name` varchar(255) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('SCHEDULED','CHECKED_IN','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'SCHEDULED',
  `badge_number` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_appt_date` (`appointment_date`),
  KEY `idx_appt_status` (`status`),
  KEY `idx_appt_host` (`person_to_meet`),
  CONSTRAINT FOREIGN KEY (person_to_meet) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reception_receipts
CREATE TABLE IF NOT EXISTS `reception_receipts` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `receipt_number` varchar(50) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_id` char(36) DEFAULT NULL,
  `course_id` char(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_mode` enum('CASH','UPI','CARD','NET_BANKING') DEFAULT 'UPI',
  `purpose` enum('TUITION_FEE','ADMISSION_FEE','EXAM_FEE','CERTIFICATE_FEE','OTHER') DEFAULT 'ADMISSION_FEE',
  `issued_by` char(36) NOT NULL,
  `issued_at` timestamp NULL DEFAULT current_timestamp(),
  `transaction_reference` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `student_id` (`student_id`),
  KEY `course_id` (`course_id`),
  KEY `issued_by` (`issued_by`),
  KEY `idx_receipt_num` (`receipt_number`),
  KEY `idx_receipt_issued` (`issued_at`),
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (issued_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: recurring_schedules
CREATE TABLE IF NOT EXISTS `recurring_schedules` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `client_id` char(36) DEFAULT NULL,
  `student_id` char(36) DEFAULT NULL,
  `frequency` enum('MONTHLY','QUARTERLY','YEARLY') NOT NULL,
  `next_generation_date` date NOT NULL,
  `last_generated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `client_id` (`client_id`),
  KEY `student_id` (`student_id`),
  KEY `idx_next_date` (`next_generation_date`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: report_definitions
CREATE TABLE IF NOT EXISTS `report_definitions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `tenant_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`dimensions`)),
  `metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`metrics`)),
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`filters`)),
  `chart_type` enum('TABLE','BAR','LINE','PIE','AREA') DEFAULT 'TABLE',
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `created_by` (`created_by`),
  KEY `idx_tenant` (`tenant_id`),
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` varchar(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `security_rank` int(11) NOT NULL DEFAULT 10,
  `is_system_role` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;,
  --,
  -- Dumping data for table `roles`,
  --,
  INSERT INTO `roles` (`id`, `code`, `name`, `description`, `security_rank`, `is_system_role`, `created_at`, `updated_at`) VALUES,
  ('role-admin', 'ADMIN', 'Administrator', 'Platform operations and tenant manager', 80, 1, '2026-09-29 11:29:13', '2026-09-29 11:29:13'),
  ('role-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'Global root platform administrator with full clearance', 100, 1, '2026-09-29 11:29:13', '2026-09-29 11:29:13');,
  -- --------------------------------------------------------,
  --,
  -- Table structure for table `role_permissions`,
  --,
  CREATE TABLE `role_permissions` (,
  `role_id` varchar(36) NOT NULL,
  `permission_id` varchar(36) NOT NULL,
  `granted_at` timestamp NULL DEFAULT current_timestamp(),
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;,
  -- --------------------------------------------------------,
  --,
  -- Table structure for table `salary_structures`,
  --,
  CREATE TABLE `salary_structures` (,
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `employee_id` char(36) NOT NULL,
  `basic` decimal(10,2) NOT NULL,
  `hra` decimal(10,2) NOT NULL,
  `da` decimal(10,2) DEFAULT 0.00,
  `pf_percentage` decimal(5,2) DEFAULT 12.00,
  `esi_percentage` decimal(5,2) DEFAULT 0.75,
  `tds_percentage` decimal(5,2) DEFAULT 0.00,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `code` (`code`),
  KEY `idx_roles_rank` (`security_rank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sales_activities
CREATE TABLE IF NOT EXISTS `sales_activities` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `activity_type` enum('CALL','MEETING','DEMO','EMAIL','FOLLOW_UP','NOTE') NOT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `deal_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `outcome` enum('CONNECTED','BUSY','NO_ANSWER','MEETING_BOOKED','COMPLETED','CANCELLED') DEFAULT 'COMPLETED',
  `duration_minutes` int(11) DEFAULT 15,
  `scheduled_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `performed_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `lead_id` (`lead_id`),
  KEY `idx_act_user` (`performed_by`,`scheduled_at`),
  KEY `idx_act_deal` (`deal_id`),
  CONSTRAINT FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (deal_id) REFERENCES sales_deals (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (performed_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sales_deals
CREATE TABLE IF NOT EXISTS `sales_deals` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `title` varchar(255) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `deal_value` decimal(12,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `stage` enum('QUALIFICATION','DISCOVERY','PROPOSAL_SENT','NEGOTIATION','CLOSED_WON','CLOSED_LOST') DEFAULT 'QUALIFICATION',
  `probability` int(11) DEFAULT 20,
  `expected_close_date` date NOT NULL,
  `actual_close_date` date DEFAULT NULL,
  `loss_reason` varchar(255) DEFAULT NULL,
  `owner_id` char(36) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `client_id` (`client_id`),
  KEY `lead_id` (`lead_id`),
  KEY `idx_deal_stage` (`stage`),
  KEY `idx_deal_owner` (`owner_id`),
  KEY `idx_close_date` (`expected_close_date`),
  CONSTRAINT FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sales_proposals
CREATE TABLE IF NOT EXISTS `sales_proposals` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `proposal_number` varchar(50) NOT NULL,
  `deal_id` char(36) DEFAULT NULL,
  `client_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `valid_until` date NOT NULL,
  `status` enum('DRAFT','SENT','ACCEPTED','DECLINED','EXPIRED') DEFAULT 'DRAFT',
  `deliverables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`deliverables`)),
  `pdf_url` varchar(500) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `proposal_number` (`proposal_number`),
  KEY `client_id` (`client_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_prop_status` (`status`),
  KEY `idx_prop_deal` (`deal_id`),
  CONSTRAINT FOREIGN KEY (deal_id) REFERENCES sales_deals (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sales_targets
CREATE TABLE IF NOT EXISTS `sales_targets` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `fiscal_year` varchar(10) NOT NULL,
  `period_type` enum('MONTHLY','QUARTERLY','ANNUAL') NOT NULL,
  `period_label` varchar(50) NOT NULL,
  `target_revenue` decimal(12,2) NOT NULL,
  `achieved_revenue` decimal(12,2) DEFAULT 0.00,
  `deals_target` int(11) DEFAULT 5,
  `deals_won` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_rep_target` (`user_id`,`fiscal_year`,`period_label`),
  KEY `idx_target_user` (`user_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: scheduled_reports
CREATE TABLE IF NOT EXISTS `scheduled_reports` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `report_definition_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `frequency` enum('DAILY','WEEKLY','MONTHLY') NOT NULL,
  `format` enum('PDF','CSV','EXCEL') DEFAULT 'PDF',
  `recipient_emails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recipient_emails`)),
  `last_sent_at` datetime DEFAULT NULL,
  `next_send_at` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `report_definition_id` (`report_definition_id`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_next_send` (`next_send_at`),
  CONSTRAINT FOREIGN KEY (report_definition_id) REFERENCES report_definitions (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: security_threat_logs
CREATE TABLE IF NOT EXISTS `security_threat_logs` (
  `id` char(36) NOT NULL,
  `threat_type` varchar(100) NOT NULL,
  `source_ip` varchar(45) NOT NULL,
  `target_endpoint` varchar(255) NOT NULL,
  `severity` varchar(50) NOT NULL DEFAULT 'HIGH',
  `status` varchar(50) NOT NULL DEFAULT 'IP_BLOCKED',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  KEY `idx_threat_created` (`created_at`),
  KEY `idx_threat_ip` (`source_ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `portal_slug` varchar(100) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `token` (`token`),
  KEY `idx_token_portal` (`token`,`portal_slug`),
  KEY `idx_user_portal` (`user_id`,`portal_slug`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: student_projects
CREATE TABLE IF NOT EXISTS `student_projects` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `student_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `github_repo_url` varchar(500) NOT NULL,
  `repo_owner` varchar(255) DEFAULT NULL,
  `repo_name` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT 'main',
  `last_commit_hash` varchar(255) DEFAULT NULL,
  `repo_structure` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`repo_structure`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `unique_student_repo` (`student_id`,`github_repo_url`(255),
  KEY `idx_student` (`student_id`),
  KEY `idx_repo` (`github_repo_url`(255),
  CONSTRAINT FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: subscriptions
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `client_id` char(36) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `monthly_fee` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `renewal_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `idx_client` (`client_id`),
  KEY `idx_renewal` (`renewal_date`),
  CONSTRAINT FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: support_tickets
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `ticket_number` varchar(30) NOT NULL,
  `user_id` char(36) NOT NULL,
  `category` enum('IT_SUPPORT','HR_QUERY','PAYROLL_ISSUE','FACILITIES','ADMIN') NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
  `assigned_to` char(36) DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `ticket_number` (`ticket_number`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_category` (`category`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: system_configs
CREATE TABLE IF NOT EXISTS `system_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config_key` varchar(100) NOT NULL,
  `config_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config_value`)),
  `is_encrypted` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: system_error_logs
CREATE TABLE IF NOT EXISTS `system_error_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) NOT NULL,
  `error_type` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `stack_trace` longtext DEFAULT NULL,
  `endpoint` varchar(500) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `status_code` int(11) DEFAULT NULL,
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_payload`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` datetime DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `resolved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `user_id` (`user_id`),
  KEY `resolved_by` (`resolved_by`),
  KEY `idx_service` (`service_name`),
  KEY `idx_error_type` (`error_type`),
  KEY `idx_resolved` (`is_resolved`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (resolved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `subscription_id` char(36) NOT NULL,
  `description` text NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING',
  `assigned_to` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `project_id` char(36) DEFAULT NULL,
  `sprint_id` char(36) DEFAULT NULL,
  `milestone_id` char(36) DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `estimated_hours` decimal(4,1) DEFAULT 0.0,
  `actual_hours` decimal(4,1) DEFAULT 0.0,
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_subscription` (`subscription_id`),
  KEY `idx_due_date` (`due_date`),
  CONSTRAINT FOREIGN KEY (subscription_id) REFERENCES subscriptions (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tax_filings
CREATE TABLE IF NOT EXISTS `tax_filings` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `return_type` enum('GSTR1','GSTR3B','GSTR2B','TDS_26Q','TDS_24Q','ADVANCE_TAX') NOT NULL,
  `filing_period` varchar(50) NOT NULL,
  `due_date` date NOT NULL,
  `filed_date` date DEFAULT NULL,
  `arn_number` varchar(100) DEFAULT NULL,
  `tax_payable` decimal(12,2) DEFAULT 0.00,
  `tax_paid` decimal(12,2) DEFAULT 0.00,
  `status` enum('DRAFT','FILED','VERIFIED','OVERDUE') DEFAULT 'DRAFT',
  `acknowledgment_url` varchar(500) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `created_by` (`created_by`),
  KEY `idx_return_period` (`return_type`,`filing_period`),
  KEY `idx_tax_status` (`status`),
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: technology_modules
CREATE TABLE IF NOT EXISTS `technology_modules` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `code` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `level` varchar(50) NOT NULL,
  `duration_hours` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `topics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`topics`)),
  `technologies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`technologies`)),
  `practicals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`practicals`)),
  `projects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`projects`)),
  `prerequisites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`prerequisites`)),
  `learning_outcomes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`learning_outcomes`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_category_level` (`category`,`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tenants
CREATE TABLE IF NOT EXISTS `tenants` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `subdomain` varchar(100) NOT NULL,
  `custom_domain` varchar(255) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `primary_color` varchar(20) DEFAULT '#4F46E5',
  `secondary_color` varchar(20) DEFAULT '#0EA5E9',
  `favicon_url` varchar(500) DEFAULT NULL,
  `email_from` varchar(255) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT 'Asia/Kolkata',
  `currency` varchar(10) DEFAULT 'INR',
  `is_active` tinyint(1) DEFAULT 1,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `subdomain` (`subdomain`),
  KEY `idx_subdomain` (`subdomain`),
  KEY `idx_custom_domain` (`custom_domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tenant_users
CREATE TABLE IF NOT EXISTS `tenant_users` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `tenant_role` varchar(50) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `unique_tenant_user` (`user_id`,`tenant_id`),
  KEY `idx_tenant` (`tenant_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: timesheets
CREATE TABLE IF NOT EXISTS `timesheets` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `task_id` char(36) DEFAULT NULL,
  `work_date` date NOT NULL,
  `hours_spent` decimal(4,2) NOT NULL,
  `description` text NOT NULL,
  `status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED') DEFAULT 'SUBMITTED',
  `approved_by` char(36) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `task_id` (`task_id`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_user_date` (`user_id`,`work_date`),
  KEY `idx_project` (`project_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (project_id) REFERENCES student_projects (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (approved_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `type` enum('INCOME','EXPENSE') NOT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `description` text DEFAULT NULL,
  `invoice_id` char(36) DEFAULT NULL,
  `gst_applicable` tinyint(1) DEFAULT 0,
  `gst_amount` decimal(10,2) DEFAULT 0.00,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_method` enum('BANK_TRANSFER','UPI','CARD','CASH','CHEQUE','RAZORPAY','STRIPE') DEFAULT 'BANK_TRANSFER',
  `reference_number` varchar(100) DEFAULT NULL,
  `is_reconciled` tinyint(1) DEFAULT 0,
  `reconciled_at` datetime DEFAULT NULL,
  KEY `created_by` (`created_by`),
  KEY `invoice_id` (`invoice_id`),
  KEY `idx_type` (`type`),
  KEY `idx_date` (`date`),
  KEY `idx_category` (`category`),
  CONSTRAINT FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','HR','TUTOR','PROJECT_MANAGER','FINANCE','SALES','RECEPTION','EMPLOYEE','STUDENT','INTERN','CLIENT','VENDOR') NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user_badges
CREATE TABLE IF NOT EXISTS `user_badges` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `user_id` char(36) NOT NULL,
  `badge_id` char(36) NOT NULL,
  `earned_at` timestamp NULL DEFAULT current_timestamp(),
  UNIQUE KEY `unique_user_badge` (`user_id`,`badge_id`),
  KEY `badge_id` (`badge_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (badge_id) REFERENCES badges (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: visitor_logs
CREATE TABLE IF NOT EXISTS `visitor_logs` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `visitor_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) NOT NULL,
  `person_to_meet` char(36) DEFAULT NULL,
  `person_to_meet_name` varchar(255) DEFAULT NULL,
  `badge_number` varchar(50) DEFAULT NULL,
  `check_in_time` datetime NOT NULL DEFAULT current_timestamp(),
  `check_out_time` datetime DEFAULT NULL,
  `status` enum('CHECKED_IN','CHECKED_OUT','EXPECTED') DEFAULT 'CHECKED_IN',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `person_to_meet` (`person_to_meet`),
  KEY `idx_status` (`status`),
  KEY `idx_check_in` (`check_in_time`),
  CONSTRAINT FOREIGN KEY (person_to_meet) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: workflows
CREATE TABLE IF NOT EXISTS `workflows` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `entity_type` enum('LEAVE','INVOICE','HIRING','EXPENSE','PURCHASE') NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `name` (`name`),
  KEY `idx_entity_type` (`entity_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: workflow_executions
CREATE TABLE IF NOT EXISTS `workflow_executions` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `workflow_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `current_node_id` char(36) DEFAULT NULL,
  `status` enum('PENDING','RUNNING','COMPLETED','FAILED','PAUSED') DEFAULT 'PENDING',
  `execution_context` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`execution_context`)),
  `error_message` text DEFAULT NULL,
  `triggered_by` char(36) DEFAULT NULL,
  `started_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `tenant_id` (`tenant_id`),
  KEY `current_node_id` (`current_node_id`),
  KEY `triggered_by` (`triggered_by`),
  KEY `idx_workflow` (`workflow_id`),
  KEY `idx_entity` (`entity_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT FOREIGN KEY (workflow_id) REFERENCES automation_workflows (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (current_node_id) REFERENCES workflow_nodes (id) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (triggered_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: workflow_nodes
CREATE TABLE IF NOT EXISTS `workflow_nodes` (
  `id` char(36) NOT NULL DEFAULT (UUID()),
  `workflow_id` char(36) NOT NULL,
  `node_type` enum('TRIGGER','ACTION','CONDITION','DELAY','EMAIL','SMS','CREATE_INVOICE','ENROLL_COURSE','UPDATE_CRM') NOT NULL,
  `node_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`node_config`)),
  `position_x` decimal(10,2) NOT NULL,
  `position_y` decimal(10,2) NOT NULL,
  `next_node_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `next_node_id` (`next_node_id`),
  KEY `idx_workflow` (`workflow_id`),
  CONSTRAINT FOREIGN KEY (workflow_id) REFERENCES automation_workflows (id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (next_node_id) REFERENCES workflow_nodes (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 2: Security, RBAC & Extended Application Tables
-- ============================================================================

-- Table: user_credentials
CREATE TABLE IF NOT EXISTS user_credentials (
  user_id CHAR(36) PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  password_algo VARCHAR(30) NOT NULL DEFAULT 'BCRYPT',
  password_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  lockout_until TIMESTAMP NULL DEFAULT NULL,
  requires_password_change BOOLEAN NOT NULL DEFAULT FALSE,
  password_history JSON NULL,
  two_factor_secret VARCHAR(255) NULL DEFAULT NULL,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  id VARCHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  tenant_id VARCHAR(36) NULL,
  assigned_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_role_tenant (user_id, role_id, tenant_id),
  INDEX idx_ur_user (user_id),
  INDEX idx_ur_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: webhook_subscriptions
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tenant_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  events JSON NOT NULL,
  secret VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_delivery_at DATETIME DEFAULT NULL,
  last_delivery_status INT DEFAULT NULL,
  failure_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_webhook_tenant (tenant_id),
  INDEX idx_webhook_user (user_id),
  INDEX idx_webhook_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: application_status_history
CREATE TABLE IF NOT EXISTS application_status_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id CHAR(36) NOT NULL,
  status_id INT NOT NULL,
  changed_by CHAR(36) DEFAULT NULL,
  change_notes TEXT DEFAULT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES application_statuses(status_id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ash_application (application_id),
  INDEX idx_ash_status (status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: policy_rules
CREATE TABLE IF NOT EXISTS policy_rules (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NULL,
  role_id VARCHAR(36) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  effect ENUM('ALLOW', 'DENY') NOT NULL DEFAULT 'ALLOW',
  conditions JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_pr_role_resource (role_id, resource),
  INDEX idx_pr_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: break_glass_events
CREATE TABLE IF NOT EXISTS break_glass_events (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NULL,
  user_id CHAR(36) NOT NULL,
  elevated_role_id VARCHAR(36) NOT NULL,
  justification TEXT NOT NULL,
  approved_by CHAR(36) NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  revoked_by CHAR(36) NULL,
  status ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'REVOKED') NOT NULL DEFAULT 'PENDING',
  metadata JSON NULL,
  CONSTRAINT fk_bg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bg_role FOREIGN KEY (elevated_role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_bg_status (status),
  INDEX idx_bg_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: calendar_event_types
CREATE TABLE IF NOT EXISTS calendar_event_types (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'calendar',
  allowed_roles JSON NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_event_type_tenant_code (tenant_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: calendar_role_configs
CREATE TABLE IF NOT EXISTS calendar_role_configs (
  id VARCHAR(36) PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  tenant_id VARCHAR(36) DEFAULT NULL,
  visible_event_types JSON NOT NULL,
  can_create_event_types JSON NOT NULL,
  default_view ENUM('day','week','month','agenda') NOT NULL DEFAULT 'month',
  work_start_time TIME NOT NULL DEFAULT '09:00:00',
  work_end_time TIME NOT NULL DEFAULT '18:00:00',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_role_config_tenant (role, tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: recurring_rules
CREATE TABLE IF NOT EXISTS recurring_rules (
  id VARCHAR(36) PRIMARY KEY,
  frequency ENUM('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
  interval_val INT NOT NULL DEFAULT 1,
  by_day JSON DEFAULT NULL,
  by_month_day JSON DEFAULT NULL,
  count INT DEFAULT NULL,
  until_date DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: email_daily_quota
CREATE TABLE IF NOT EXISTS email_daily_quota (
  date_key DATE PRIMARY KEY,
  send_count INT UNSIGNED NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: incoming_webhook_logs
CREATE TABLE IF NOT EXISTS incoming_webhook_logs (
  id VARCHAR(36) PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  payload_json JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PROCESSED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: question_bank
CREATE TABLE IF NOT EXISTS question_bank (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  module_id CHAR(36) NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER') NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  difficulty ENUM('EASY','MEDIUM','HARD') NOT NULL DEFAULT 'MEDIUM',
  points DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  explanation TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_qb_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: question_options
CREATE TABLE IF NOT EXISTS question_options (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  question_id CHAR(36) NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE,
  INDEX idx_qo_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  quiz_id CHAR(36) NOT NULL,
  question_id CHAR(36) NOT NULL,
  question_order INT NOT NULL DEFAULT 0,
  points_override DECIMAL(5,2) NULL,
  PRIMARY KEY (quiz_id, question_id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================================
-- SECTION 3: Views
-- ============================================================================

CREATE OR REPLACE VIEW vw_active_job_postings AS
SELECT 
    jp.id AS job_id,
    jp.tenant_id,
    jp.title,
    jp.department_id,
    d.department_name,
    jp.category_id,
    jc.category_name,
    jp.job_type_id,
    jt.type_name AS job_type,
    jp.location,
    jp.is_remote,
    jp.experience_level,
    jp.min_salary,
    jp.max_salary,
    jp.currency,
    jp.created_at,
    jp.expires_at,
    COUNT(a.id) AS total_applications
FROM job_postings jp
LEFT JOIN departments d ON jp.department_id = d.department_id
LEFT JOIN job_categories jc ON jp.category_id = jc.category_id
LEFT JOIN job_types jt ON jp.job_type_id = jt.job_type_id
LEFT JOIN applications a ON jp.id = a.job_id
WHERE jp.status = 'ACTIVE' AND (jp.expires_at IS NULL OR jp.expires_at > NOW())
GROUP BY jp.id;


-- ============================================================================
-- SECTION 4: Triggers
-- ============================================================================
DROP TRIGGER IF EXISTS `trg_applications_updated_at`;
CREATE TRIGGER `trg_applications_updated_at` BEFORE UPDATE ON `applications`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_application_statuses_updated_at`;
CREATE TRIGGER `trg_application_statuses_updated_at` BEFORE UPDATE ON `application_statuses`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_application_status_history_updated_at`;
CREATE TRIGGER `trg_application_status_history_updated_at` BEFORE UPDATE ON `application_status_history`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_candidate_documents_updated_at`;
CREATE TRIGGER `trg_candidate_documents_updated_at` BEFORE UPDATE ON `candidate_documents`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_contact_inquiries_updated_at`;
CREATE TRIGGER `trg_contact_inquiries_updated_at` BEFORE UPDATE ON `contact_inquiries`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_contact_inquiry_attachments_updated_at`;
CREATE TRIGGER `trg_contact_inquiry_attachments_updated_at` BEFORE UPDATE ON `contact_inquiry_attachments`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_departments_updated_at`;
CREATE TRIGGER `trg_departments_updated_at` BEFORE UPDATE ON `departments`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_interview_schedules_updated_at`;
CREATE TRIGGER `trg_interview_schedules_updated_at` BEFORE UPDATE ON `interview_schedules`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_job_categories_updated_at`;
CREATE TRIGGER `trg_job_categories_updated_at` BEFORE UPDATE ON `job_categories`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS `trg_job_types_updated_at`;
CREATE TRIGGER `trg_job_types_updated_at` BEFORE UPDATE ON `job_types`
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- SECTION 5: Master Seed Data
-- ============================================================================
-- Seed Data for: application_statuses
INSERT INTO `application_statuses` (`status_id`, `status_name`, `status_code`, `display_order`, `is_final`, `created_at`, `updated_at`) VALUES
(1, 'Applied', 'APPLIED', 1, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Under Review', 'UNDER_REVIEW', 2, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Shortlisted', 'SHORTLISTED', 3, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Interview Scheduled', 'INTERVIEW_SCHEDULED', 4, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Interviewed', 'INTERVIEWED', 5, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(6, 'Offered', 'OFFERED', 6, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(7, 'Accepted', 'ACCEPTED', 7, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(8, 'Rejected', 'REJECTED', 8, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(9, 'Withdrawn', 'WITHDRAWN', 9, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: badges
INSERT INTO `badges` (`id`, `name`, `description`, `icon`, `criteria`, `is_active`, `created_at`, `updated_at`) VALUES
('b3f1a000000000000000000000000001', 'Course Completed', 'Finished every lesson in a course from start to finish.', 'workspace_premium', '{\"type\":\"COURSE_COMPLETION\",\"courses\":1}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000002', 'First Lesson', 'Completed your very first lesson.', 'flag', '{\"type\":\"LESSON_COMPLETION\",\"lessons\":1}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000003', 'Module Master', 'Completed five course modules.', 'menu_book', '{\"type\":\"MODULE_COMPLETION\",\"modules\":5}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000004', 'Quiz Whiz', 'Scored 100% on a published quiz.', 'quiz', '{\"type\":\"QUIZ_PASS\",\"score\":100}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000005', 'Assignment Pro', 'Scored 90% or better on a graded assignment.', 'assignment_turned_in', '{\"type\":\"ASSIGNMENT_GRADE\",\"score\":90}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: contact_inquiries
INSERT INTO `contact_inquiries` (`inquiry_id`, `first_name`, `last_name`, `email`, `phone`, `subject`, `message`, `inquiry_source`, `is_read`, `is_resolved`, `resolved_at`, `notes`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
('b1c2d3e4-1234-5678-9012-345678901234', 'John', 'Doe', 'john.doe@example.com', '+91-9876543210', 'General Inquiry', 'I am interested in learning more about your services.', 'WEBSITE', 0, 0, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:19:43', 0, NULL)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: departments
INSERT INTO `departments` (`department_id`, `department_name`, `description`, `location`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Engineering', 'Software development and technical operations', 'Building A', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Human Resources', 'Recruitment, payroll, and employee relations', 'Building B', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Finance', 'Accounting, invoicing, and financial planning', 'Building B', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Sales', 'Client acquisition and relationship management', 'Building A', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Operations', 'Project management and workflow coordination', 'Building C', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(6, 'Marketing', 'Brand management and digital marketing', 'Building A', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: feature_flags
INSERT INTO `feature_flags` (`id`, `flag_key`, `name`, `description`, `environment`, `rollout_percentage`, `is_enabled`, `tenant_id`, `metadata`, `created_at`, `updated_at`) VALUES
('e9c57aef-bbf6-11f1-8036-89f8415d1036', 'enable_ai_analytics', 'Gemini AI Telemetry', 'Enables predictive student drop-off analytics and AI curriculum assistant.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c57e3b-bbf6-11f1-8036-89f8415d1036', 'enable_stripe_billing', 'Stripe International Gateway', 'Allows USD and multi-currency credit card settlements.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c57f24-bbf6-11f1-8036-89f8415d1036', 'enable_gamification_v2', 'Gamification Badges v2.0', 'New leaderboard algorithms and seasonal streak challenges.', 'CANARY', 50, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c57f96-bbf6-11f1-8036-89f8415d1036', 'enable_automated_whatsapp', 'Automated WhatsApp Workflows', 'Dispatches interview and attendance notifications via WhatsApp gateway.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c58004-bbf6-11f1-8036-89f8415d1036', 'enable_dark_mode_global', 'Global OLED Dark Theme', 'Platform-wide dark theme toggle for high-density portals.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: job_categories
INSERT INTO `job_categories` (`category_id`, `category_name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Software Development', 'Roles related to building software applications', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Design', 'UI/UX and graphic design roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Marketing', 'Digital and traditional marketing roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Sales', 'Business development and sales roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Human Resources', 'HR operations and recruitment roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(6, 'Finance', 'Accounting and financial analysis roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(7, 'Operations', 'Operations management and support roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: job_types
INSERT INTO `job_types` (`job_type_id`, `type_name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Full-Time', 'Permanent full-time employment', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Part-Time', 'Part-time employment with flexible hours', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Contract', 'Fixed-term contract employment', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Internship', 'Temporary internship position', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Remote', 'Fully remote work arrangement', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: roles
INSERT INTO `roles` (`id`, `code`, `name`, `description`, `security_rank`, `is_system_role`, `created_at`, `updated_at`) VALUES
('role-admin', 'ADMIN', 'Administrator', 'Platform operations and tenant manager', 80, 1, '2026-09-29 11:29:13', '2026-09-29 11:29:13'),
('role-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'Global root platform administrator with full clearance', 100, 1, '2026-09-29 11:29:13', '2026-09-29 11:29:13')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: security_threat_logs
INSERT INTO `security_threat_logs` (`id`, `threat_type`, `source_ip`, `target_endpoint`, `severity`, `status`, `details`, `created_at`) VALUES
('e9c5b961-bbf6-11f1-8036-89f8415d1036', 'BRUTE_FORCE_PREVENTION', '185.220.101.5', '/v1/auth/login', 'CRITICAL', 'IP_BLOCKED', '{\"attempts\": 15, \"country\": \"DE\"}', '2026-09-29 11:14:18'),
('e9c5bcef-bbf6-11f1-8036-89f8415d1036', 'UNAUTHORIZED_SCOPED_TOKEN', '194.26.29.112', '/v1/tenants/export', 'HIGH', 'TOKEN_REVOKED', '{\"token_prefix\": \"ey...\", \"reason\": \"scope_mismatch\"}', '2026-09-29 11:14:18'),
('e9c5be04-bbf6-11f1-8036-89f8415d1036', 'RATE_LIMIT_EXCEEDED', '103.14.26.89', '/v1/users', 'MEDIUM', 'THROTTLED', '{\"rate\": \"45 req/s\", \"limit\": \"30 req/s\"}', '2026-09-29 11:14:18')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: system_configs
INSERT INTO `system_configs` (`id`, `config_key`, `config_value`, `is_encrypted`, `updated_at`) VALUES
(1, 'ALLOWED_ORIGINS', '[\"http://localhost:5173\", \"http://localhost:3000\"]', 0, '2026-09-22 05:59:16')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Data for: users
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `avatar_url`, `last_login_at`, `is_active`, `preferences`, `created_at`, `updated_at`) VALUES
('368f5c88-12cd-11ed-861d-0242ac120002', 'admin@ethiroli.com', '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK', 'Super Administrator', NULL, 'SUPER_ADMIN', NULL, NULL, 1, NULL, '2026-09-22 05:59:16', '2026-09-29 11:29:13'),
('479f6d99-23de-22fe-972e-0353bd230003', 'admin@ethiroli.net', '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK', 'System Administrator', NULL, 'ADMIN', NULL, NULL, 1, NULL, '2026-09-29 11:29:13', '2026-09-29 11:29:13')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;


-- Administrator & Super Admin Credentials (Password: Admin@123)
INSERT INTO users (id, email, password_hash, full_name, role, is_active)
VALUES 
(
  '368f5c88-12cd-11ed-861d-0242ac120002',
  'admin@ethiroli.com',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'Super Administrator',
  'SUPER_ADMIN',
  1
),
(
  '479f6d99-23de-22fe-972e-0353bd230003',
  'admin@ethiroli.net',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'System Administrator',
  'ADMIN',
  1
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  is_active = 1;

INSERT INTO user_credentials (
  user_id,
  password_hash,
  password_algo,
  failed_login_attempts,
  lockout_until,
  requires_password_change,
  two_factor_enabled
)
VALUES 
(
  '368f5c88-12cd-11ed-861d-0242ac120002',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'BCRYPT',
  0,
  NULL,
  0,
  0
),
(
  '479f6d99-23de-22fe-972e-0353bd230003',
  '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK',
  'BCRYPT',
  0,
  NULL,
  0,
  0
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0;

INSERT INTO user_roles (id, user_id, role_id, assigned_by)
VALUES
  ('ur-super-admin-01', '368f5c88-12cd-11ed-861d-0242ac120002', 'role-super-admin', 'SYSTEM'),
  ('ur-admin-01', '479f6d99-23de-22fe-972e-0353bd230003', 'role-admin', 'SYSTEM')
ON DUPLICATE KEY UPDATE 
  role_id = VALUES(role_id);


SET FOREIGN_KEY_CHECKS = 1;
