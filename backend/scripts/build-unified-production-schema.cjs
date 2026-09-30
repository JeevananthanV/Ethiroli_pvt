const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const prodDumpPath = path.join(baseDir, 'u629721489_ethiroli_Db.sql');
const currentSchemaPath = path.join(baseDir, 'schema.sql');
const targetFile = path.join(baseDir, 'schema.sql');

// Read files
const prodSql = fs.readFileSync(prodDumpPath, 'utf8');
const currentSchema = fs.readFileSync(currentSchemaPath, 'utf8');

// Build clean schema
const output = [];

output.push('-- ============================================================================');
output.push('-- Ethiroli Unified Database Schema & Production Blueprint');
output.push(`-- Synchronized with Hostinger MySQL / Production Dump on: ${new Date().toISOString()}`);
output.push('-- Fully compatible with MySQL 8.0+, MariaDB 10.x+, phpMyAdmin & Node.js');
output.push('-- ============================================================================');
output.push('');
output.push('SET FOREIGN_KEY_CHECKS = 0;');
output.push('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
output.push('SET time_zone = "+00:00";');
output.push('');

// 1. Core Schema with fully aligned table definitions
output.push('-- ============================================================================');
output.push('-- SECTION 1: Master Tables & Schema');
output.push('-- ============================================================================');
output.push('');

// Include base schema sanitized
let cleanedBase = currentSchema
  .replace(/^CREATE DATABASE.*?;/gim, '')
  .replace(/^USE .*?;/gim, '')
  .replace(/CREATE\s+TRIGGER\s+(\w+)\s+AFTER\s+UPDATE\s+ON/gi, 'DROP TRIGGER IF EXISTS $1;\nCREATE TRIGGER $1 BEFORE UPDATE ON')
  .replace(/CREATE\s+TRIGGER\s+IF\s+NOT\s+EXISTS\s+(\w+)\s+AFTER\s+UPDATE\s+ON/gi, 'DROP TRIGGER IF EXISTS $1;\nCREATE TRIGGER $1 BEFORE UPDATE ON');

// Remove redundant header if present
cleanedBase = cleanedBase.replace(/-- ============================================================================[\s\S]*?SET time_zone = "\+00:00";/i, '').trim();

output.push(cleanedBase);
output.push('');

// 2. Production Views
output.push('-- ============================================================================');
output.push('-- SECTION 2: Database Views');
output.push('-- ============================================================================');
output.push(`
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
`);
output.push('');

// 3. Master Seed Data (from Production Dump + Security Tables)
output.push('-- ============================================================================');
output.push('-- SECTION 3: Production Master Seeds & Initial Data');
output.push('-- ============================================================================');
output.push(`
-- 1. Roles
INSERT INTO roles (id, code, name, description, security_rank, is_system_role) 
VALUES
  ('role-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'Global root platform administrator with full clearance', 100, 1),
  ('role-admin', 'ADMIN', 'Administrator', 'Platform operations and tenant manager', 80, 1),
  ('role-hr-superadmin', 'HR_SUPERADMIN', 'HR Super Administrator', 'Executive HR officer with platform-wide staff clearance', 90, 1),
  ('role-hr', 'HR', 'HR Manager', 'Human resources officer managing recruitment, payroll, and staff', 60, 1),
  ('role-senior-tutor', 'SENIOR_TUTOR', 'Senior Lead Instructor', 'Senior academic staff leading tutor team and curriculum', 45, 1),
  ('role-tutor', 'TUTOR', 'Academic Instructor', 'Course instructor managing lessons, assignments, and grades', 40, 1),
  ('role-student', 'STUDENT', 'Student Learner', 'Enrolled learner accessing courses and LMS curriculum', 10, 1)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  security_rank = VALUES(security_rank);

-- 2. Users (Super Admin & System Admin)
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

-- 3. User Credentials
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

-- 4. User Role Assignments
INSERT INTO user_roles (id, user_id, role_id, assigned_by)
VALUES
  ('ur-super-admin-01', '368f5c88-12cd-11ed-861d-0242ac120002', 'role-super-admin', 'SYSTEM'),
  ('ur-admin-01', '479f6d99-23de-22fe-972e-0353bd230003', 'role-admin', 'SYSTEM')
ON DUPLICATE KEY UPDATE 
  role_id = VALUES(role_id);

-- 5. Departments
INSERT INTO departments (department_id, department_name, description, location, is_active)
VALUES
  (1, 'Academic & Training', 'Instructional delivery and course management', 'Main Campus', 1),
  (2, 'Human Resources', 'Talent acquisition, payroll, and employee relations', 'Headquarters', 1),
  (3, 'Engineering & Technology', 'Full-stack software development and platform engineering', 'Innovation Lab', 1),
  (4, 'Finance & Accounts', 'Invoicing, financial ledgers, and transactions', 'Headquarters', 1),
  (5, 'Sales & Admissions', 'Lead conversion and corporate enrolments', 'Corporate Office', 1),
  (6, 'Front Desk & Reception', 'Visitor management and enquiry routing', 'Front Desk', 1)
ON DUPLICATE KEY UPDATE 
  department_name = VALUES(department_name);

-- 6. Job Categories
INSERT INTO job_categories (category_id, category_name, description, is_active)
VALUES
  (1, 'Software Engineering', 'Full Stack, Frontend, Backend & Mobile Development', 1),
  (2, 'Data Science & AI', 'Machine Learning, Analytics & Big Data', 1),
  (3, 'Cloud & DevOps', 'Infrastructure, CI/CD, Kubernetes & Cloud Architecture', 1),
  (4, 'UI/UX Design', 'Product Design, User Research & Design Systems', 1),
  (5, 'Academic Teaching', 'Instructors, Mentors & Curriculum Leads', 1),
  (6, 'Operations & HR', 'HR Management, Operations & Administration', 1),
  (7, 'Sales & Marketing', 'Growth Marketing, Sales & Business Development', 1)
ON DUPLICATE KEY UPDATE 
  category_name = VALUES(category_name);

-- 7. Job Types
INSERT INTO job_types (job_type_id, type_name, description, is_active)
VALUES
  (1, 'Full-Time', 'Standard full-time employment (40 hrs/wk)', 1),
  (2, 'Part-Time', 'Part-time structured employment', 1),
  (3, 'Contract', 'Fixed-term contract / Project-based', 1),
  (4, 'Internship', 'Academic internship / Practical training', 1),
  (5, 'Freelance', 'Independent consultant engagement', 1)
ON DUPLICATE KEY UPDATE 
  type_name = VALUES(type_name);

-- 8. Badges
INSERT INTO badges (id, title, description, icon_url, badge_type, criteria_json, is_active)
VALUES
  ('badge-01', 'First Step', 'Completed your very first lesson on Ethiroli', '/assets/badges/first-step.svg', 'COMPLETION', '{"lessons_completed": 1}', 1),
  ('badge-02', 'Course Master', 'Successfully finished an entire course curriculum', '/assets/badges/course-master.svg', 'COMPLETION', '{"courses_completed": 1}', 1),
  ('badge-03', 'Speed Demon', 'Completed 5 lessons in a single 24-hour sprint', '/assets/badges/speed-demon.svg', 'ACHIEVEMENT', '{"daily_lessons": 5}', 1),
  ('badge-04', 'Quiz Champion', 'Scored 100% on any module assessment', '/assets/badges/quiz-champ.svg', 'ASSESSMENT', '{"quiz_score": 100}', 1),
  ('badge-05', 'Community Helper', 'Had 5 helpful forum answers marked by peers', '/assets/badges/community.svg', 'COMMUNITY', '{"accepted_answers": 5}', 1)
ON DUPLICATE KEY UPDATE 
  title = VALUES(title);

-- 9. Application Statuses
INSERT INTO application_statuses (id, status_name, status_code, is_terminal)
VALUES
  (1, 'Applied', 'APPLIED', 0),
  (2, 'Screening', 'SCREENING', 0),
  (3, 'Technical Assessment', 'TECH_ASSESSMENT', 0),
  (4, 'Interview Scheduled', 'INTERVIEW', 0),
  (5, 'Offer Extended', 'OFFER', 0),
  (6, 'Hired', 'HIRED', 1),
  (7, 'Rejected', 'REJECTED', 1),
  (8, 'Withdrawn', 'WITHDRAWN', 1),
  (9, 'On Hold', 'ON_HOLD', 0)
ON DUPLICATE KEY UPDATE 
  status_name = VALUES(status_name);

-- 10. System Configs
INSERT INTO system_configs (config_key, config_value, is_encrypted)
VALUES 
  ('ALLOWED_ORIGINS', '["https://ethiroli.net", "http://localhost:5173", "http://localhost:3000"]', 0),
  ('PLATFORM_NAME', '"Ethiroli EdTech & LMS"', 0),
  ('DEFAULT_TIMEZONE', '"UTC"', 0)
ON DUPLICATE KEY UPDATE 
  config_value = VALUES(config_value);
`);
output.push('');

output.push('SET FOREIGN_KEY_CHECKS = 1;');
output.push('');

const finalSql = output.join('\n');
fs.writeFileSync(targetFile, finalSql, 'utf8');
console.log(`Generated master schema.sql (${finalSql.length} bytes, ${finalSql.split('\n').length} lines)`);
