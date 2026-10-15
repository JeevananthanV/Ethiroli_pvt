import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encrypt, encryptDeterministic } from '../src/config/encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');

// All 18 Master Accounts with verified details and passwords
const MASTER_ACCOUNTS = [
  // 1. SUPER_ADMIN
  {
    id: '368f5c88-12cd-11ed-861d-0242ac120002',
    role: 'SUPER_ADMIN',
    portalUrl: '/auth/super-admin/login',
    email: 'admin@ethiroli.com',
    password: 'Admin@123',
    fullName: 'Super Administrator',
    department: 'Executive Operations'
  },
  // 2. ADMIN (orgadmin)
  {
    id: 'bef7a014-983a-4041-89a1-c8cfa4590993',
    role: 'ADMIN',
    portalUrl: '/auth/admin/login',
    email: 'orgadmin@ethiroli.com',
    password: 'Admin@123',
    fullName: 'Organization Admin',
    department: 'Administration'
  },
  // 3. ADMIN (admin@ethiroli.net)
  {
    id: '479f6d99-23de-22fe-972e-0353bd230003',
    role: 'ADMIN',
    portalUrl: '/auth/admin/login',
    email: 'admin@ethiroli.net',
    password: 'Admin@123',
    fullName: 'System Administrator',
    department: 'Administration'
  },
  // 4. HR
  {
    id: '0fa117ca-5edf-4687-b099-54290e40ffe1',
    role: 'HR',
    portalUrl: '/auth/hr/login',
    email: 'hr@ethiroli.com',
    password: 'Hr@123',
    fullName: 'HR Manager',
    department: 'Human Resources',
    employeeCode: 'EMP-102',
    designation: 'HR Lead & Talent Ops'
  },
  // 5. TUTOR
  {
    id: 'c60caddb-2848-492a-8724-4e7ec5d55850',
    role: 'TUTOR',
    portalUrl: '/auth/tutor/login',
    email: 'tutor@ethiroli.com',
    password: 'Tutor@123',
    fullName: 'Verified Senior Instructor',
    department: 'Academics & Training'
  },
  // 6. PROJECT_MANAGER
  {
    id: '4433911c-04f6-4dc3-8738-e25ba5b1b4d4',
    role: 'PROJECT_MANAGER',
    portalUrl: '/auth/pm/login',
    email: 'pm@ethiroli.com',
    password: 'Pm@123',
    fullName: 'Project Manager',
    department: 'Project Delivery',
    employeeCode: 'EMP-103',
    designation: 'Technical Project Manager'
  },
  // 7. FINANCE
  {
    id: '8a8b4cfb-012a-4072-a24f-6cd999e9e007',
    role: 'FINANCE',
    portalUrl: '/auth/finance/login',
    email: 'finance@ethiroli.com',
    password: 'Finance@123',
    fullName: 'Finance Lead',
    department: 'Finance & Accounts',
    employeeCode: 'EMP-104',
    designation: 'Finance & Accounts Specialist'
  },
  // 8. SALES
  {
    id: 'a25602e3-ecd5-4fbf-a833-284bf9d36909',
    role: 'SALES',
    portalUrl: '/auth/sales/login',
    email: 'sales@ethiroli.com',
    password: 'Sales@123',
    fullName: 'Sales Executive',
    department: 'Business Development & Sales',
    employeeCode: 'EMP-105',
    designation: 'Senior Sales Consultant'
  },
  // 9. RECEPTION
  {
    id: '7aa13dcd-5fd3-49d8-866f-c5451af8bf7f',
    role: 'RECEPTION',
    portalUrl: '/auth/reception/login',
    email: 'reception@ethiroli.com',
    password: 'Reception@123',
    fullName: 'Front Desk Coordinator',
    department: 'Front Office & Reception',
    employeeCode: 'EMP-106',
    designation: 'Front Desk Lead'
  },
  // 10. EMPLOYEE (employee@ethiroli.com)
  {
    id: '3bb859a1-cb3d-4952-b892-3868dfd6541f',
    role: 'EMPLOYEE',
    portalUrl: '/auth/employee/login',
    email: 'employee@ethiroli.com',
    password: 'Employee@123',
    fullName: 'Standard Staff Member',
    department: 'Operations',
    employeeCode: 'EMP-107',
    designation: 'Operations Associate'
  },
  // 11. EMPLOYEE (staff@ethiroli.com)
  {
    id: '74e45a32-92ab-40f5-97c0-c888d7284c48',
    role: 'EMPLOYEE',
    portalUrl: '/auth/employee/login',
    email: 'staff@ethiroli.com',
    password: 'Employee@123',
    fullName: 'Senior Operations Staff',
    department: 'Operations',
    employeeCode: 'EMP-108',
    designation: 'Senior Associate'
  },
  // 12. STUDENT
  {
    id: '39a59061-1113-49a8-8d63-4558bb4e70f4',
    role: 'STUDENT',
    portalUrl: '/auth/student/login',
    email: 'student@ethiroli.com',
    password: 'Student@123',
    fullName: 'Verified Active Student',
    department: 'Software Engineering'
  },
  // 13. INTERN: Gokul Rajkumar
  {
    id: '58a8ee15-79a5-473f-ac95-c97bc03d3394',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'gokulrajkumar2006@gmail.com',
    password: 'Intern@123',
    fullName: 'Gokul Rajkumar',
    college: 'Anna University',
    department: 'Full Stack Development',
    stipend: 15000,
    internId: 'af5964a2-627c-40a6-b6c1-6f5db35e08ed'
  },
  // 14. INTERN: Srinithi Kumar
  {
    id: '45d3f678-47a0-442d-8330-9731b2d883b9',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'srinithikumar54@gmail.com',
    password: 'Intern@123',
    fullName: 'Srinithi Kumar',
    college: 'PSG College of Technology',
    department: 'Full Stack Development',
    stipend: 15000,
    internId: 'adcd3ce5-b4ea-43c9-a0a8-bd28871c20af'
  },
  // 15. INTERN: S Loganathan
  {
    id: '584f6dc7-adaf-4fb5-8cd6-03987543d776',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'sloganathan0105@gmail.com',
    password: 'Intern@123',
    fullName: 'S Loganathan',
    college: 'Coimbatore Institute of Technology',
    department: 'Web Applications',
    stipend: 15000,
    internId: '9fa32bc1-192a-43cf-8314-e2908f51a441'
  },
  // 16. INTERN: Stephen
  {
    id: '69fa12f1-7d71-4c2a-8122-c8c12ed8754a',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'stephen862k7@gmail.com',
    password: 'Intern@123',
    fullName: 'Stephen',
    college: 'Government College of Technology',
    department: 'Data Science & AI',
    stipend: 15000,
    internId: '9ff4b4f5-2803-40f7-a868-d5133f4ab264'
  },
  // 17. INTERN: Barath Appu
  {
    id: 'd17aab8c-9280-445f-85ce-cc2a93764ddb',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'Barathappu777@gmail.com',
    password: 'Intern@123',
    fullName: 'Barath Appu',
    college: 'SRM Institute of Science and Technology',
    department: 'Backend Engineering',
    stipend: 15000,
    internId: 'c56a5051-e898-4afb-897e-61b5eeebe9ba'
  },
  // 18. INTERN: Nandhini K (Requested)
  {
    id: '66da1638-9a06-4741-9ed2-8054b0417313',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'knandhinivnr@gmail.com',
    password: 'Intern@123',
    fullName: 'Nandhini K',
    college: 'Anna University',
    department: 'Full Stack Web Development',
    stipend: 15000,
    internId: 'ae5caf31-4b0a-4c4d-a47b-ffd6b87dedb5'
  },
  // 19. INTERN: Mathishree (Requested)
  {
    id: 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee',
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    email: 'mathishree008@gmail.com',
    password: 'Intern@123',
    fullName: 'Mathishree',
    college: 'PSG College of Technology',
    department: 'Full Stack Web Development',
    stipend: 15000,
    internId: '2c2e2b8d-25d8-48ea-937b-cc43f460627f'
  }
];

async function generateMasterSql() {
  console.log('Generating Unified Master Production SQL Script for Hostinger MariaDB...');

  const sql = [];

  // Header
  sql.push(`-- ============================================================================`);
  sql.push(`-- ETHIROLI PLATFORM - MASTER PRODUCTION MIGRATION & REPAIR SCRIPT`);
  sql.push(`-- Target Database: u629721489_ethiroli_Db (Hostinger MariaDB 11.8+)`);
  sql.push(`-- Generated: ${new Date().toISOString()}`);
  sql.push(`-- Scope: Missing Tables (14) + Missing Columns (20) + Indexes + Seeds & Credentials`);
  sql.push(`-- Safe & Idempotent: Can be run repeatedly without data loss or duplicate keys.`);
  sql.push(`-- ============================================================================`);
  sql.push(``);
  sql.push(`SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`);
  sql.push(`SET time_zone = "+00:00";`);
  sql.push(`SET FOREIGN_KEY_CHECKS = 0;`);
  sql.push(`SET NAMES utf8mb4;`);
  sql.push(``);

  // ============================================================================
  // PART 0: COLLATION HARMONIZATION (FIX FOR MYSQL ERROR 150)
  // ============================================================================
  // Live database has 120 tables in utf8mb4_unicode_ci, but roles, permissions,
  // and role_permissions were created with MariaDB 11 default utf8mb4_uca1400_ai_ci.
  // Foreign keys (e.g. user_roles -> roles & users) fail with errno 150 unless collations match.
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 0: COLLATION HARMONIZATION (FIX FOR MYSQL ERRORS 150 & 1833)`);
  sql.push(`-- Live database has 120 tables in utf8mb4_unicode_ci, but roles, permissions,`);
  sql.push(`-- and role_permissions were created with MariaDB default utf8mb4_uca1400_ai_ci.`);
  sql.push(`-- Temporarily drop the FKs on role_permissions to allow converting roles/permissions`);
  sql.push(`-- without Error #1833, then convert and restore the foreign keys seamlessly.`);
  sql.push(`-- ============================================================================`);
  sql.push(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY IF EXISTS \`fk_rp_role\`;`);
  sql.push(`ALTER TABLE \`role_permissions\` DROP FOREIGN KEY IF EXISTS \`fk_rp_perm\`;`);
  sql.push(``);
  sql.push(`ALTER TABLE \`roles\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  sql.push(`ALTER TABLE \`permissions\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  sql.push(`ALTER TABLE \`role_permissions\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  sql.push(``);
  sql.push(`ALTER TABLE \`role_permissions\`
  ADD CONSTRAINT \`fk_rp_perm\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\` (\`id\`) ON DELETE CASCADE,
  ADD CONSTRAINT \`fk_rp_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE;`);
  sql.push(``);

  // ============================================================================
  // PART 1: MISSING TABLES CREATION (15 TABLES)
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 1: DDL - ENSURE MISSING TABLES EXIST`);
  sql.push(`-- ============================================================================`);
  sql.push(``);

  // 1. user_credentials (ensure structure in case missing)
  sql.push(`-- 1. Table: user_credentials`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`user_credentials\` (
  \`user_id\` char(36) NOT NULL,
  \`password_hash\` varchar(255) NOT NULL,
  \`password_algo\` varchar(30) NOT NULL DEFAULT 'BCRYPT',
  \`password_updated_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`failed_login_attempts\` int(11) NOT NULL DEFAULT 0,
  \`lockout_until\` timestamp NULL DEFAULT NULL,
  \`requires_password_change\` tinyint(1) NOT NULL DEFAULT 0,
  \`password_history\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  \`two_factor_secret\` varchar(255) DEFAULT NULL,
  \`two_factor_enabled\` tinyint(1) NOT NULL DEFAULT 0,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`user_id\`),
  CONSTRAINT \`fk_uc_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 2. attendance_sessions
  sql.push(`-- 2. Table: attendance_sessions (Multi-session attendance & breaks)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`attendance_sessions\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`user_id\` char(36) NOT NULL,
  \`work_date\` date NOT NULL,
  \`check_in_time\` datetime NOT NULL,
  \`check_out_time\` datetime DEFAULT NULL,
  \`worked_minutes\` int(11) GENERATED ALWAYS AS (ifnull(timestampdiff(MINUTE,\`check_in_time\`,\`check_out_time\`),0)) STORED,
  \`status\` enum('ACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_sessions_user_date\` (\`user_id\`,\`work_date\`),
  KEY \`idx_sessions_user_status\` (\`user_id\`,\`status\`),
  CONSTRAINT \`fk_att_sess_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 3. password_change_requests
  sql.push(`-- 3. Table: password_change_requests (Staff authenticated password change request queue)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`password_change_requests\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`user_id\` char(36) NOT NULL,
  \`reason\` varchar(500) DEFAULT NULL,
  \`status\` enum('PENDING','APPROVED','REJECTED','COMPLETED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  \`requested_at\` timestamp(6) NULL DEFAULT current_timestamp(6),
  \`reviewed_by\` char(36) DEFAULT NULL,
  \`reviewed_at\` datetime(6) DEFAULT NULL,
  \`review_note\` varchar(500) DEFAULT NULL,
  \`grant_expires_at\` datetime(6) DEFAULT NULL,
  \`grant_used_at\` datetime(6) DEFAULT NULL,
  \`completed_at\` datetime(6) DEFAULT NULL,
  \`created_at\` timestamp(6) NULL DEFAULT current_timestamp(6),
  \`updated_at\` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (\`id\`),
  KEY \`idx_pcr_user\` (\`user_id\`),
  KEY \`idx_pcr_status\` (\`status\`),
  CONSTRAINT \`fk_pcr_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 4. password_recovery_requests
  sql.push(`-- 4. Table: password_recovery_requests (Public unauthenticated self-service recovery queue)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`password_recovery_requests\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`email_hash\` char(64) NOT NULL,
  \`employee_code\` varchar(50) NOT NULL,
  \`user_id\` char(36) DEFAULT NULL,
  \`reason\` varchar(500) DEFAULT NULL,
  \`status\` enum('PENDING','APPROVED','REJECTED','COMPLETED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  \`requested_ip\` varchar(64) DEFAULT NULL,
  \`requested_at\` timestamp(6) NULL DEFAULT current_timestamp(6),
  \`resolved_at\` datetime(6) DEFAULT NULL,
  \`created_at\` timestamp(6) NULL DEFAULT current_timestamp(6),
  \`updated_at\` timestamp(6) NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (\`id\`),
  KEY \`idx_prr_status\` (\`status\`),
  KEY \`idx_prr_email_hash\` (\`email_hash\`),
  KEY \`idx_prr_user\` (\`user_id\`),
  CONSTRAINT \`fk_prr_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 5. user_roles
  sql.push(`-- 5. Table: user_roles (Enterprise RBAC multi-tenant role assignments)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`user_roles\` (
  \`id\` varchar(36) NOT NULL,
  \`user_id\` char(36) NOT NULL,
  \`role_id\` varchar(36) NOT NULL,
  \`tenant_id\` varchar(36) DEFAULT NULL,
  \`assigned_by\` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  \`assigned_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`expires_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_user_role_tenant\` (\`user_id\`,\`role_id\`,\`tenant_id\`),
  KEY \`idx_ur_user\` (\`user_id\`),
  KEY \`idx_ur_tenant\` (\`tenant_id\`),
  KEY \`fk_ur_role\` (\`role_id\`),
  CONSTRAINT \`fk_ur_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_ur_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 6. policy_rules
  sql.push(`-- 6. Table: policy_rules (ABAC Contextual Rules / Policy Predicates)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`policy_rules\` (
  \`id\` varchar(36) NOT NULL,
  \`role_id\` varchar(36) NOT NULL,
  \`permission_code\` varchar(100) NOT NULL,
  \`predicate_expression\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`predicate_expression\`)),
  \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_pr_role_perm\` (\`role_id\`,\`permission_code\`),
  CONSTRAINT \`fk_pr_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 7. break_glass_events
  sql.push(`-- 7. Table: break_glass_events (Emergency Elevated Privilege Audits)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`break_glass_events\` (
  \`id\` varchar(36) NOT NULL,
  \`initiator_user_id\` char(36) NOT NULL,
  \`approver_user_id\` char(36) DEFAULT NULL,
  \`reason\` text NOT NULL,
  \`incident_ticket_id\` varchar(100) NOT NULL,
  \`status\` enum('PENDING','ACTIVE','REVOKED','EXPIRED') DEFAULT 'PENDING',
  \`activated_at\` timestamp NULL DEFAULT NULL,
  \`expires_at\` timestamp NULL DEFAULT NULL,
  \`ip_address\` varchar(45) NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`fk_bg_initiator\` (\`initiator_user_id\`),
  CONSTRAINT \`fk_bg_initiator\` FOREIGN KEY (\`initiator_user_id\`) REFERENCES \`users\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 8. calendar_event_types
  sql.push(`-- 8. Table: calendar_event_types (Dynamic Event Types & Access Control)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`calendar_event_types\` (
  \`id\` varchar(36) NOT NULL,
  \`label\` varchar(100) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`icon\` varchar(50) DEFAULT 'event',
  \`default_duration_minutes\` int(11) DEFAULT 30,
  \`color\` varchar(7) DEFAULT '#6366f1',
  \`allowed_create_roles\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`allowed_create_roles\`)),
  \`allowed_write_roles\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`allowed_write_roles\`)),
  \`notification_target_roles\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(\`notification_target_roles\`)),
  \`is_active\` tinyint(1) DEFAULT 1,
  \`sort_order\` int(11) DEFAULT 0,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_calendar_event_type_label\` (\`label\`),
  KEY \`idx_calendar_event_type_active\` (\`is_active\`),
  KEY \`idx_calendar_event_type_sort\` (\`sort_order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 9. calendar_role_configs
  sql.push(`-- 9. Table: calendar_role_configs (Role-specific Calendar Views & Schedules)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`calendar_role_configs\` (
  \`id\` varchar(36) NOT NULL,
  \`role\` varchar(50) NOT NULL,
  \`calendar_title\` varchar(100) DEFAULT 'Calendar',
  \`default_view\` enum('day','week','month','agenda') DEFAULT 'month',
  \`work_start_time\` time DEFAULT '09:00:00',
  \`work_end_time\` time DEFAULT '18:00:00',
  \`show_others_events\` tinyint(1) DEFAULT 1,
  \`event_type_visibility\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`event_type_visibility\`)),
  \`quick_create_types\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`quick_create_types\`)),
  \`is_active\` tinyint(1) DEFAULT 1,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_calendar_role_config_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 10. recurring_rules
  sql.push(`-- 10. Table: recurring_rules (Recurrence Patterns for Calendar Events)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`recurring_rules\` (
  \`id\` varchar(36) NOT NULL,
  \`event_id\` varchar(36) NOT NULL,
  \`frequency\` enum('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
  \`interval\` int(11) DEFAULT 1,
  \`days_of_week\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`days_of_week\`)),
  \`day_of_month\` int(11) DEFAULT NULL,
  \`month_of_year\` int(11) DEFAULT NULL,
  \`end_date\` date DEFAULT NULL,
  \`max_occurrences\` int(11) DEFAULT NULL,
  \`instance_count\` int(11) DEFAULT 0,
  \`next_occurrence\` date DEFAULT NULL,
  \`is_active\` tinyint(1) DEFAULT 1,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_recurring_rules_event\` (\`event_id\`),
  KEY \`idx_recurring_rules_freq\` (\`frequency\`),
  KEY \`idx_recurring_rules_active\` (\`is_active\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 11. email_daily_quota
  sql.push(`-- 11. Table: email_daily_quota (Brevo / Transactional Email Daily Quota Tracking)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`email_daily_quota\` (
  \`quota_date\` date NOT NULL,
  \`emails_sent\` int(11) DEFAULT 0,
  \`max_limit\` int(11) DEFAULT 300,
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`quota_date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 12. incoming_webhook_logs
  sql.push(`-- 12. Table: incoming_webhook_logs (External Webhook Audit Trail)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`incoming_webhook_logs\` (
  \`id\` char(36) NOT NULL,
  \`source\` varchar(50) NOT NULL,
  \`event\` varchar(100) DEFAULT NULL,
  \`payload\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`payload\`)),
  \`status\` varchar(20) DEFAULT 'PROCESSED',
  \`error_message\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 13. question_bank
  sql.push(`-- 13. Table: question_bank (Master Curated Examination Questions)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`question_bank\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`course_id\` char(36) DEFAULT NULL,
  \`module_id\` char(36) DEFAULT NULL,
  \`topic\` varchar(100) NOT NULL,
  \`difficulty\` enum('EASY','MEDIUM','HARD') DEFAULT 'MEDIUM',
  \`question_type\` enum('MCQ','MULTI_SELECT','TRUE_FALSE','CODE_OUTPUT') NOT NULL DEFAULT 'MCQ',
  \`question_text\` text NOT NULL,
  \`code_snippet\` text DEFAULT NULL,
  \`explanation\` text DEFAULT NULL,
  \`is_active\` tinyint(1) DEFAULT 1,
  \`created_by\` char(36) NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_topic_diff\` (\`topic\`,\`difficulty\`),
  KEY \`idx_course\` (\`course_id\`),
  KEY \`created_by\` (\`created_by\`),
  CONSTRAINT \`fk_qb_course\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\` (\`id\`) ON DELETE SET NULL,
  CONSTRAINT \`fk_qb_user\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 14. question_options & quiz_questions
  sql.push(`-- 14. Table: question_options (Server-side Answer Keys)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`question_options\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`question_id\` char(36) NOT NULL,
  \`option_text\` text NOT NULL,
  \`is_correct\` tinyint(1) NOT NULL DEFAULT 0,
  \`display_order\` int(11) NOT NULL DEFAULT 1,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_question\` (\`question_id\`),
  CONSTRAINT \`fk_qo_question\` FOREIGN KEY (\`question_id\`) REFERENCES \`question_bank\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  sql.push(`-- 15. Table: quiz_questions (Quiz and Question Bank Mapping)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`quiz_questions\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`quiz_id\` char(36) NOT NULL,
  \`question_id\` char(36) NOT NULL,
  \`points\` int(11) DEFAULT 1,
  \`question_order\` int(11) NOT NULL DEFAULT 1,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_quiz_question\` (\`quiz_id\`,\`question_id\`),
  KEY \`idx_quiz_order\` (\`quiz_id\`,\`question_order\`),
  KEY \`question_id\` (\`question_id\`),
  CONSTRAINT \`fk_qq_quiz\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_qq_question\` FOREIGN KEY (\`question_id\`) REFERENCES \`question_bank\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // 16. sales_commissions
  sql.push(`-- 16. Table: sales_commissions (BDA Sales Commission Management)`);
  sql.push(`CREATE TABLE IF NOT EXISTS \`sales_commissions\` (
  \`id\` char(36) NOT NULL DEFAULT uuid(),
  \`deal_id\` char(36) NOT NULL,
  \`bda_user_id\` char(36) NOT NULL,
  \`eligible_amount\` decimal(15,2) NOT NULL DEFAULT 0.00,
  \`commission_rate\` decimal(5,2) NOT NULL DEFAULT 10.00,
  \`commission_amount\` decimal(15,2) NOT NULL DEFAULT 0.00,
  \`status\` enum('Pending Approval','Approved','Payable','Paid','Rejected') NOT NULL DEFAULT 'Pending Approval',
  \`approved_by\` char(36) DEFAULT NULL,
  \`approved_at\` timestamp NULL DEFAULT NULL,
  \`paid_at\` timestamp NULL DEFAULT NULL,
  \`payment_reference\` varchar(100) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uc_deal_commission\` (\`deal_id\`),
  KEY \`idx_bda_user_id\` (\`bda_user_id\`),
  KEY \`idx_status\` (\`status\`),
  KEY \`idx_created_at\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(``);

  // ============================================================================
  // PART 2: MISSING COLUMNS IN EXISTING TABLES
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 2: DDL - ADD MISSING COLUMNS TO EXISTING TABLES (ADD COLUMN IF NOT EXISTS)`);
  sql.push(`-- ============================================================================`);
  sql.push(``);

  sql.push(`-- A. Table: interns`);
  sql.push(`ALTER TABLE \`interns\`
  ADD COLUMN IF NOT EXISTS \`project_target\` VARCHAR(255) DEFAULT 'Full Stack Development',
  ADD COLUMN IF NOT EXISTS \`progress\` INT DEFAULT 10;`);
  sql.push(``);

  sql.push(`-- B. Table: attendance`);
  sql.push(`ALTER TABLE \`attendance\`
  ADD COLUMN IF NOT EXISTS \`work_mode\` ENUM('REMOTE', 'OFFICE') NULL DEFAULT NULL AFTER \`status\`,
  ADD COLUMN IF NOT EXISTS \`worked_minutes\` INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS \`session_count\` INT NOT NULL DEFAULT 0;`);
  sql.push(``);

  sql.push(`-- C. Table: employees`);
  sql.push(`ALTER TABLE \`employees\`
  ADD COLUMN IF NOT EXISTS \`uan\` VARCHAR(20) NULL DEFAULT NULL AFTER \`pf_number\`;`);
  sql.push(``);

  sql.push(`-- D. Table: leaves`);
  sql.push(`ALTER TABLE \`leaves\`
  ADD COLUMN IF NOT EXISTS \`review_note\` VARCHAR(500) NULL DEFAULT NULL AFTER \`approval_chain_step\`;`);
  sql.push(``);

  sql.push(`-- E. Table: sessions`);
  sql.push(`ALTER TABLE \`sessions\`
  ADD COLUMN IF NOT EXISTS \`impersonated_by\` CHAR(36) NULL AFTER \`ip_address\`,
  ADD COLUMN IF NOT EXISTS \`impersonation_origin_token\` VARCHAR(255) NULL AFTER \`impersonated_by\`;`);
  sql.push(``);

  sql.push(`-- F. Table: calendar_events`);
  sql.push(`ALTER TABLE \`calendar_events\`
  MODIFY COLUMN \`event_type\` VARCHAR(50) NOT NULL DEFAULT 'MEETING',
  ADD COLUMN IF NOT EXISTS \`event_type_id\` VARCHAR(36) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`status\` ENUM('scheduled','completed','cancelled','postponed') DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS \`priority\` ENUM('low','medium','high','urgent') DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS \`tags\` JSON DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`recurrence_rule\` JSON DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`recurrence_end_date\` DATE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`recurrence_instance_count\` INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`index_key\` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`parent_event_id\` VARCHAR(36) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`cancelled_instance_dates\` JSON DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`tenant_id\` VARCHAR(36) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`role\` VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS \`metadata\` JSON DEFAULT NULL;`);
  sql.push(``);

  sql.push(`-- G. Table: sales_deals`);
  sql.push(`ALTER TABLE \`sales_deals\`
  ADD COLUMN IF NOT EXISTS \`linked_deal_id\` CHAR(36) NULL;`);
  sql.push(``);

  // ============================================================================
  // PART 3: INDEXES & CONSTRAINTS
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 3: INDEXES - ADD PERFORMANCE & LOOKUP INDEXES`);
  sql.push(`-- ============================================================================`);
  sql.push(``);
  sql.push(`ALTER TABLE \`calendar_events\`
  ADD INDEX IF NOT EXISTS \`idx_events_event_type_id\` (\`event_type_id\`),
  ADD INDEX IF NOT EXISTS \`idx_events_parent_id\` (\`parent_event_id\`),
  ADD INDEX IF NOT EXISTS \`idx_events_role\` (\`role\`),
  ADD INDEX IF NOT EXISTS \`idx_events_status\` (\`status\`);`);
  sql.push(``);

  sql.push(`ALTER TABLE \`sessions\`
  ADD INDEX IF NOT EXISTS \`idx_sessions_impersonated_by\` (\`impersonated_by\`);`);
  sql.push(``);

  sql.push(`ALTER TABLE \`sales_deals\`
  ADD INDEX IF NOT EXISTS \`idx_sales_deals_linked_deal\` (\`linked_deal_id\`);`);
  sql.push(``);

  // ============================================================================
  // PART 4: SYSTEM CONFIGS & CALENDAR SEED DATA
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 4: DATA - CALENDAR TYPES & ROLE CONFIGURATIONS`);
  sql.push(`-- ============================================================================`);
  sql.push(``);

  sql.push(`INSERT INTO \`calendar_event_types\` (\`id\`, \`label\`, \`description\`, \`icon\`, \`default_duration_minutes\`, \`color\`, \`allowed_create_roles\`, \`allowed_write_roles\`, \`notification_target_roles\`, \`is_active\`, \`sort_order\`)
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
  \`label\` = VALUES(\`label\`),
  \`description\` = VALUES(\`description\`),
  \`icon\` = VALUES(\`icon\`),
  \`default_duration_minutes\` = VALUES(\`default_duration_minutes\`),
  \`color\` = VALUES(\`color\`),
  \`allowed_create_roles\` = VALUES(\`allowed_create_roles\`),
  \`allowed_write_roles\` = VALUES(\`allowed_write_roles\`),
  \`notification_target_roles\` = VALUES(\`notification_target_roles\`),
  \`is_active\` = VALUES(\`is_active\`),
  \`sort_order\` = VALUES(\`sort_order\`);`);
  sql.push(``);

  sql.push(`INSERT INTO \`calendar_role_configs\` (\`id\`, \`role\`, \`calendar_title\`, \`default_view\`, \`work_start_time\`, \`work_end_time\`, \`show_others_events\`, \`event_type_visibility\`, \`quick_create_types\`, \`is_active\`)
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
  \`calendar_title\` = VALUES(\`calendar_title\`),
  \`default_view\` = VALUES(\`default_view\`),
  \`work_start_time\` = VALUES(\`work_start_time\`),
  \`work_end_time\` = VALUES(\`work_end_time\`),
  \`show_others_events\` = VALUES(\`show_others_events\`),
  \`event_type_visibility\` = VALUES(\`event_type_visibility\`),
  \`quick_create_types\` = VALUES(\`quick_create_types\`),
  \`is_active\` = VALUES(\`is_active\`);`);
  sql.push(``);

  // ============================================================================
  // PART 5: PUBLIC HOLIDAYS & RBAC ROLES SEED
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 5: DATA - PUBLIC HOLIDAYS & RBAC ROLES`);
  sql.push(`-- ============================================================================`);
  sql.push(``);

  sql.push(`INSERT INTO \`holidays\` (\`name\`, \`date\`, \`is_restricted\`) VALUES
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
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);`);
  sql.push(``);

  sql.push(`INSERT INTO \`roles\` (\`id\`, \`code\`, \`name\`, \`description\`, \`security_rank\`, \`is_system_role\`) VALUES
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
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`description\` = VALUES(\`description\`), \`security_rank\` = VALUES(\`security_rank\`);`);
  sql.push(``);

  // ============================================================================
  // PART 6: ALL 18 MASTER USER ACCOUNTS, CREDENTIALS & CHILD PROFILES
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 6: ACCOUNTS - 18 MASTER & INTERN USER LOGINS`);
  sql.push(`-- Includes knandhinivnr@gmail.com and mathishree008@gmail.com`);
  sql.push(`-- Standard Passwords:`);
  sql.push(`--   INTERNS (All 7):     Intern@123`);
  sql.push(`--   SUPER_ADMIN / ADMIN: Admin@123`);
  sql.push(`--   HR:                  Hr@123`);
  sql.push(`--   TUTOR:               Tutor@123`);
  sql.push(`--   PROJECT_MANAGER:     Pm@123`);
  sql.push(`--   FINANCE:             Finance@123`);
  sql.push(`--   SALES:               Sales@123`);
  sql.push(`--   RECEPTION:           Reception@123`);
  sql.push(`--   EMPLOYEE / STAFF:    Employee@123`);
  sql.push(`--   STUDENT:             Student@123`);
  sql.push(`-- ============================================================================`);
  sql.push(``);

  for (const account of MASTER_ACCOUNTS) {
    const rawEmail = account.email.toLowerCase().trim();
    const encEmail = encryptDeterministic(rawEmail);
    const encFullName = encrypt(account.fullName);
    const passwordHash = await bcrypt.hash(account.password, 12);

    const prefJson = JSON.stringify({
      department: account.department || 'General',
      college: account.college || null,
      seeded: true
    });

    const escapedEmail = encEmail.replace(/'/g, "\\'");
    const escapedName = encFullName.replace(/'/g, "\\'");
    const escapedHash = passwordHash.replace(/'/g, "\\'");
    const escapedPref = prefJson.replace(/'/g, "\\'");
    const escapedHistory = JSON.stringify([passwordHash]).replace(/'/g, "\\'");

    sql.push(`-- [${account.role}] ${account.email} (${account.fullName})`);
    sql.push(`-- Plaintext Password: ${account.password} | Portal: ${account.portalUrl}`);
    sql.push(`INSERT INTO \`users\` (\`id\`, \`email\`, \`password_hash\`, \`full_name\`, \`phone\`, \`role\`, \`is_active\`, \`preferences\`)
VALUES ('${account.id}', '${escapedEmail}', '${escapedHash}', '${escapedName}', NULL, '${account.role}', 1, '${escapedPref}')
ON DUPLICATE KEY UPDATE
  \`password_hash\` = VALUES(\`password_hash\`),
  \`full_name\` = VALUES(\`full_name\`),
  \`role\` = '${account.role}',
  \`is_active\` = 1,
  \`preferences\` = VALUES(\`preferences\`);`);

    sql.push(`INSERT INTO \`user_credentials\` (\`user_id\`, \`password_hash\`, \`password_algo\`, \`password_updated_at\`, \`failed_login_attempts\`, \`lockout_until\`, \`requires_password_change\`, \`password_history\`)
VALUES ('${account.id}', '${escapedHash}', 'BCRYPT', NOW(), 0, NULL, 0, '${escapedHistory}')
ON DUPLICATE KEY UPDATE
  \`password_hash\` = VALUES(\`password_hash\`),
  \`password_updated_at\` = NOW(),
  \`failed_login_attempts\` = 0,
  \`lockout_until\` = NULL,
  \`requires_password_change\` = 0,
  \`password_history\` = VALUES(\`password_history\`);`);

    if (account.role === 'INTERN') {
      const collegeName = (account.college || 'Engineering College').replace(/'/g, "\\'");
      const stipend = account.stipend || 15000;
      const startDate = new Date().toISOString().slice(0, 10);
      const endDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

      sql.push(`INSERT INTO \`interns\` (\`id\`, \`user_id\`, \`mentor_id\`, \`college_name\`, \`stipend\`, \`start_date\`, \`end_date\`, \`project_target\`, \`progress\`)
VALUES ('${account.internId || crypto.randomUUID()}', '${account.id}', NULL, '${collegeName}', ${stipend}, '${startDate}', '${endDate}', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  \`college_name\` = VALUES(\`college_name\`),
  \`stipend\` = VALUES(\`stipend\`),
  \`project_target\` = VALUES(\`project_target\`),
  \`progress\` = VALUES(\`progress\`);`);
    }

    if (account.employeeCode) {
      const designation = (account.designation || 'Staff').replace(/'/g, "\\'");
      const dept = (account.department || 'Operations').replace(/'/g, "\\'");
      const empId = crypto.randomUUID();
      sql.push(`INSERT INTO \`employees\` (\`id\`, \`user_id\`, \`employee_code\`, \`department\`, \`designation\`, \`date_of_joining\`)
VALUES ('${empId}', '${account.id}', '${account.employeeCode}', '${dept}', '${designation}', CURDATE())
ON DUPLICATE KEY UPDATE
  \`employee_code\` = VALUES(\`employee_code\`),
  \`department\` = VALUES(\`department\`),
  \`designation\` = VALUES(\`designation\`);`);
    }

    sql.push(``);
  }

  // ============================================================================
  // PART 7: USER ROLES SYNC & ATTENDANCE BACKFILL
  // ============================================================================
  sql.push(`-- ============================================================================`);
  sql.push(`-- PART 7: RBAC USER_ROLES SYNC & DATA CLEANUP`);
  sql.push(`-- ============================================================================`);
  sql.push(``);

  sql.push(`-- Sync all active users with the roles catalog table`);
  sql.push(`INSERT IGNORE INTO \`user_roles\` (\`id\`, \`user_id\`, \`role_id\`, \`assigned_by\`, \`assigned_at\`)
SELECT UUID(), u.id, r.id, 'SYSTEM', NOW()
FROM \`users\` u
JOIN \`roles\` r ON (u.role = r.code OR (u.role = 'PROJECT_MANAGER' AND r.code = 'PM'));`);
  sql.push(``);

  sql.push(`-- Backfill existing attendance records to REMOTE work_mode`);
  sql.push(`UPDATE \`attendance\` SET \`work_mode\` = 'REMOTE' WHERE \`work_mode\` IS NULL;`);
  sql.push(``);

  // Footer
  sql.push(`SET FOREIGN_KEY_CHECKS = 1;`);
  sql.push(`COMMIT;`);
  sql.push(``);
  sql.push(`-- End of migration script`);

  const masterSqlText = sql.join('\n');

  // Write to both canonical destinations
  const target1 = path.join(backendDir, 'live_production_update.sql');
  const target2 = path.join(backendDir, 'scripts', 'seed-all-roles-live.sql');

  fs.writeFileSync(target1, masterSqlText, 'utf8');
  fs.writeFileSync(target2, masterSqlText, 'utf8');

  console.log(`\nSuccessfully generated single master live SQL file!`);
  console.log(`Output 1: ${target1} (${(masterSqlText.length / 1024).toFixed(1)} KB)`);
  console.log(`Output 2: ${target2} (${(masterSqlText.length / 1024).toFixed(1)} KB)`);
}

generateMasterSql().catch(err => {
  console.error('Error generating master SQL:', err);
  process.exit(1);
});
