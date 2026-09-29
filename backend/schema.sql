-- Ethiroli baseline schema.
-- IMPORTANT: this file only covers the core tables. After loading it, run
--   npm run db:migrate
-- which applies every file in migrations/*.sql in order. Those migrations add
-- the tables/columns the app requires but that are not in the baseline:
--   question_bank, question_options, quiz_questions (quiz authoring)
--   course_modules + module ordering columns (module-based curriculum)
--   forum_post_votes, forum_posts.category (forum reactions)
--   lessons/lesson_blocks progress + certificate columns
-- The runner is idempotent, so it is safe to run repeatedly.

CREATE DATABASE IF NOT EXISTS ethiroli;
USE ethiroli;

-- Table 1: users
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NULL,
role ENUM(
     'SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 
     'FINANCE', 'SALES', 'RECEPTION', 'EMPLOYEE', 'STUDENT', 'INTERN',
     'CLIENT', 'VENDOR'
   ) NOT NULL,
  avatar_url VARCHAR(255) NULL,
  last_login_at TIMESTAMP NULL DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  preferences JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 2: sessions
CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  portal_slug VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  user_agent VARCHAR(255) NULL,
  ip_address VARCHAR(45) NULL,
  impersonated_by CHAR(36) NULL,
  impersonation_origin_token VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (impersonated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_token_portal (token, portal_slug),
  INDEX idx_user_portal (user_id, portal_slug),
  INDEX idx_sessions_impersonated_by (impersonated_by)
);

-- Table 2b: mfa_secrets
CREATE TABLE IF NOT EXISTS mfa_secrets (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  secret VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  backup_codes JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_mfa (user_id)
);

-- Table 2c: oauth_states
CREATE TABLE IF NOT EXISTS oauth_states (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  state VARCHAR(255) NOT NULL UNIQUE,
  portal_slug VARCHAR(100) NOT NULL,
  redirect_uri VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_state (state),
  INDEX idx_expires (expires_at)
);

-- Table 3: leads
CREATE TABLE IF NOT EXISTS leads (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(255) NULL,
  source ENUM(
    'WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'WALK_IN', 'PHONE', 'INDEED', 'OTHER'
  ) NOT NULL DEFAULT 'OTHER',
  status ENUM(
    'NEW', 'CONTACTED', 'DEMO', 'COUNSELLING', 'ADMISSION', 'PAYMENT', 'LOST'
  ) NOT NULL DEFAULT 'NEW',
  assigned_to CHAR(36) NULL,
  notes TEXT NULL,
  follow_up_date DATE NULL,
  converted_at TIMESTAMP NULL DEFAULT NULL,
  lost_reason TEXT NULL,
  created_by CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table 4: activity_feeds
CREATE TABLE IF NOT EXISTS activity_feeds (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  actor_id CHAR(36) NULL,
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id CHAR(36) NULL,
  payload JSON NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table 5: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255) NULL,
  old_value JSON NULL,
  new_value JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_action_created (user_id, action, created_at)
);

-- Table 6: system_configs
CREATE TABLE IF NOT EXISTS system_configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value JSON NOT NULL,
  is_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 7: employees
CREATE TABLE IF NOT EXISTS employees (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    date_of_joining DATE,
    salary_structure_id CHAR(36) DEFAULT NULL,
    pan VARCHAR(255) DEFAULT NULL,
    bank_account VARCHAR(255) DEFAULT NULL,
    pf_number VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee_code (employee_code)
);

-- Table 8: interns
CREATE TABLE IF NOT EXISTS interns (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    mentor_id CHAR(36) DEFAULT NULL,
    college_name VARCHAR(255),
    stipend DECIMAL(10,2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_mentor (mentor_id)
);

-- Table 9: attendance
CREATE TABLE IF NOT EXISTS attendance (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    check_in_time DATETIME,
    check_out_time DATETIME,
    total_hours DECIMAL(5,2) GENERATED ALWAYS AS (ROUND(TIMESTAMPDIFF(SECOND, check_in_time, check_out_time) / 3600.0, 2)) STORED,
    is_late BOOLEAN DEFAULT FALSE,
    status ENUM('PRESENT','ABSENT','HALF_DAY') DEFAULT 'ABSENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (user_id, date),
    INDEX idx_date (date),
    INDEX idx_user_id (user_id)
);

-- Table 10: leaves
CREATE TABLE IF NOT EXISTS leaves (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    leave_type ENUM('CASUAL','SICK','EARNED') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
    approved_by CHAR(36) DEFAULT NULL,
    approval_chain_step INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);
-- Table 11: courses
CREATE TABLE IF NOT EXISTS courses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    fee DECIMAL(10,2),
    tutor_id CHAR(36) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tutor (tutor_id),
    INDEX idx_code (code)
);

-- Table 12: modules
CREATE TABLE IF NOT EXISTS modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration_minutes INT NULL,
    module_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_order (course_id, module_order)
);

-- Table 13: lessons
CREATE TABLE IF NOT EXISTS lessons (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    module_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    video_url VARCHAR(500) DEFAULT NULL,
    lesson_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_module_order (module_id, lesson_order)
);

-- Table 14: enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    assigned_by_tutor_id CHAR(36) NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('ACTIVE','COMPLETED','DROPPED') DEFAULT 'ACTIVE',
    due_date TIMESTAMP NULL DEFAULT NULL,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by_tutor_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_enrollment_student (student_id),
    INDEX idx_enrollment_course (course_id),
    INDEX idx_enrollment_tutor (assigned_by_tutor_id),
    INDEX idx_enrollment_status (status)
);

-- Table 15: quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INT DEFAULT 10,
    passing_score INT DEFAULT 70,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id)
);

-- Table 16: assignments
CREATE TABLE IF NOT EXISTS assignments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    max_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id)
);

-- Table 17: clients
CREATE TABLE IF NOT EXISTS clients (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(255),
    gst VARCHAR(255),
    address TEXT,
    company_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Table 18: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id CHAR(36) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_renewal (renewal_date)
);

-- Table 19: tasks
CREATE TABLE IF NOT EXISTS tasks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subscription_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING',
    assigned_to CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_subscription (subscription_id),
    INDEX idx_due_date (due_date)
);

-- Table 20: invoices
CREATE TABLE IF NOT EXISTS invoices (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id CHAR(36) DEFAULT NULL,
    student_id CHAR(36) DEFAULT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    gst_rate DECIMAL(5,2) DEFAULT 0.00,
    gst_amount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('DRAFT','SENT','PAID','OVERDUE','CANCELLED') DEFAULT 'DRAFT',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_schedule_id CHAR(36) DEFAULT NULL,
    sent_at DATETIME DEFAULT NULL,
    paid_at DATETIME DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_invoice_number (invoice_number)
);
-- Table 21: transactions
CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('INCOME','EXPENSE') NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    invoice_id CHAR(36) DEFAULT NULL,
    gst_applicable BOOLEAN DEFAULT FALSE,
    gst_amount DECIMAL(10,2) DEFAULT 0.00,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_date (date),
    INDEX idx_category (category)
);

-- Table 22: payments
CREATE TABLE IF NOT EXISTS payments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id CHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    method ENUM('RAZORPAY','STRIPE','BANK_TRANSFER','CASH','CHEQUE') NOT NULL,
    reference_number VARCHAR(100) DEFAULT NULL,
    status ENUM('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
    gateway_response JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice (invoice_id),
    INDEX idx_status (status)
);

-- Table 23: recurring_schedules
CREATE TABLE IF NOT EXISTS recurring_schedules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id CHAR(36) DEFAULT NULL,
    student_id CHAR(36) DEFAULT NULL,
    frequency ENUM('MONTHLY','QUARTERLY','YEARLY') NOT NULL,
    next_generation_date DATE NOT NULL,
    last_generated_at DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_next_date (next_generation_date),
    INDEX idx_active (is_active)
);

-- Table 24: quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quiz_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    score INT DEFAULT 0,
    total_questions INT NOT NULL,
    time_taken_seconds INT DEFAULT 0,
    answers JSON DEFAULT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_live BOOLEAN DEFAULT FALSE,
    live_session_id CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_quiz_student (quiz_id, student_id),
    INDEX idx_live_session (live_session_id)
);

-- Table 25: assignment_submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    assignment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    file_url VARCHAR(500) DEFAULT NULL,
    text_content LONGTEXT DEFAULT NULL,
    grade INT DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    graded_by CHAR(36) DEFAULT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    graded_at DATETIME DEFAULT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_submission (assignment_id, student_id),
    INDEX idx_assignment (assignment_id)
);

-- Table 26: forum_posts
CREATE TABLE IF NOT EXISTS forum_posts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_pinned (is_pinned)
);

-- Table 27: forum_replies
CREATE TABLE IF NOT EXISTS forum_replies (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    content LONGTEXT NOT NULL,
    is_best_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post (post_id),
    INDEX idx_best (is_best_answer)
);

-- Table 28: badges
CREATE TABLE IF NOT EXISTS badges (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    criteria JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);

-- Table 29: user_badges
CREATE TABLE IF NOT EXISTS user_badges (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    badge_id CHAR(36) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    INDEX idx_user (user_id)
);

-- Table 30: live_quiz_sessions
CREATE TABLE IF NOT EXISTS live_quiz_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    quiz_id CHAR(36) NOT NULL,
    tutor_id CHAR(36) NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    total_participants INT DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_active (is_active)
);

-- Table 31: provider_configs
CREATE TABLE IF NOT EXISTS provider_configs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    provider VARCHAR(50) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT TRUE,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_provider_key (provider, config_key),
    INDEX idx_provider (provider),
    INDEX idx_enabled (is_enabled)
);

-- Table 32: communication_templates
CREATE TABLE IF NOT EXISTS communication_templates (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    channel ENUM('EMAIL','SMS','WHATSAPP') NOT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    body LONGTEXT NOT NULL,
    variables JSON DEFAULT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_channel (channel),
    INDEX idx_name (name)
);

-- Table 33: communication_logs
CREATE TABLE IF NOT EXISTS communication_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    channel ENUM('EMAIL','SMS','WHATSAPP') NOT NULL,
    template_id CHAR(36) DEFAULT NULL,
    sender VARCHAR(255) DEFAULT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    content LONGTEXT NOT NULL,
    status ENUM('PENDING','SENT','FAILED','DELIVERED','READ') DEFAULT 'PENDING',
    provider_response TEXT DEFAULT NULL,
    error_message TEXT DEFAULT NULL,
    scheduled_at DATETIME DEFAULT NULL,
    sent_at DATETIME DEFAULT NULL,
    delivered_at DATETIME DEFAULT NULL,
    read_at DATETIME DEFAULT NULL,
    created_by CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES communication_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_recipient (recipient),
    INDEX idx_status (status),
    INDEX idx_channel (channel),
    INDEX idx_sent_at (sent_at)
);

-- Table 34: jobs
CREATE TABLE IF NOT EXISTS jobs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255),
    salary_range VARCHAR(100),
    required_skills JSON DEFAULT NULL,
    status ENUM('DRAFT','OPEN','CLOSED','FILLED') DEFAULT 'DRAFT',
    posted_at DATETIME DEFAULT NULL,
    closed_at DATETIME DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_title (title)
);

-- Table 35: candidates
CREATE TABLE IF NOT EXISTS candidates (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) DEFAULT NULL,
    resume_url VARCHAR(500) DEFAULT NULL,
    source ENUM('INDEED','LINKEDIN','NAUKRI','REFERRAL','WEBSITE','MANUAL') DEFAULT 'MANUAL',
    indeed_candidate_id VARCHAR(100) DEFAULT NULL,
    status ENUM('NEW','CONTACTED','SCREENING','INTERVIEWING','OFFER','HIRED','REJECTED') DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job (job_id),
    INDEX idx_status (status),
    INDEX idx_source (source)
);

-- Table 36: interviews
CREATE TABLE IF NOT EXISTS interviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    candidate_id CHAR(36) NOT NULL,
    round ENUM('ROUND_1','ROUND_2','HR_ROUND') NOT NULL,
    interviewer_id CHAR(36) DEFAULT NULL,
    scheduled_at DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    meeting_link VARCHAR(500) DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    rating INT DEFAULT 0,
    status ENUM('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_candidate (candidate_id),
    INDEX idx_round (round),
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_at)
);

-- Table 37: integrations
CREATE TABLE IF NOT EXISTS integrations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    service_name VARCHAR(100) UNIQUE NOT NULL,
    category ENUM(
        'SECURITY','PAYMENTS','COMMUNICATION','CALENDAR','ANALYTICS',
        'AUTOMATION','CRM','DEVTOOLS','JOBS'
    ) NOT NULL,
    config TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    connection_status ENUM('PENDING','CONNECTED','ERROR','DISABLED') DEFAULT 'PENDING',
    last_synced_at DATETIME DEFAULT NULL,
    sync_log JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_enabled (is_enabled)
);

-- Table 38: salary_structures
CREATE TABLE IF NOT EXISTS salary_structures (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    basic DECIMAL(10,2) NOT NULL,
    hra DECIMAL(10,2) NOT NULL,
    da DECIMAL(10,2) DEFAULT 0.00,
    pf_percentage DECIMAL(5,2) DEFAULT 12.00,
    esi_percentage DECIMAL(5,2) DEFAULT 0.75,
    tds_percentage DECIMAL(5,2) DEFAULT 0.00,
    effective_from DATE NOT NULL,
    effective_to DATE DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_active (is_active)
);

-- Table 39: payroll
CREATE TABLE IF NOT EXISTS payroll (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    month_year DATE NOT NULL,
    basic DECIMAL(10,2) NOT NULL,
    hra DECIMAL(10,2) NOT NULL,
    da DECIMAL(10,2) DEFAULT 0.00,
    pf_employee DECIMAL(10,2) DEFAULT 0.00,
    pf_employer DECIMAL(10,2) DEFAULT 0.00,
    esi_employee DECIMAL(10,2) DEFAULT 0.00,
    esi_employer DECIMAL(10,2) DEFAULT 0.00,
    tds DECIMAL(10,2) DEFAULT 0.00,
    gross_salary DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    total_deductions DECIMAL(10,2) DEFAULT 0.00,
    bank_transfer_ref VARCHAR(100) DEFAULT NULL,
    payslip_pdf_url VARCHAR(500) DEFAULT NULL,
    status ENUM('DRAFT','PROCESSED','PAID') DEFAULT 'DRAFT',
    processed_by CHAR(36) DEFAULT NULL,
    processed_at DATETIME DEFAULT NULL,
    paid_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_payroll (employee_id, month_year),
    INDEX idx_employee (employee_id),
    INDEX idx_month (month_year),
    INDEX idx_status (status)
);

-- Table 40: performance_reviews
CREATE TABLE IF NOT EXISTS performance_reviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    reviewer_id CHAR(36) NOT NULL,
    review_date DATE NOT NULL,
    rating INT DEFAULT 0,
    feedback JSON DEFAULT NULL,
    overall_comment TEXT,
    status ENUM('DRAFT','SUBMITTED','ACKNOWLEDGED','ARCHIVED') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_reviewer (reviewer_id),
    INDEX idx_status (status)
);
-- Table 41: calendar_events
CREATE TABLE IF NOT EXISTS calendar_events (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('MEETING','DEADLINE','TASK','ANNOUNCEMENT','TRAINING') NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR(255) DEFAULT NULL,
    meeting_link VARCHAR(500) DEFAULT NULL,
    assigned_users JSON DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_start (start_time),
    INDEX idx_end (end_time),
    INDEX idx_type (event_type)
);

-- Table 42: holidays
CREATE TABLE IF NOT EXISTS holidays (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    is_restricted BOOLEAN DEFAULT FALSE,
    restricted_to JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_holiday_date (date),
    INDEX idx_date (date)
);

-- Table 43: workflows
CREATE TABLE IF NOT EXISTS workflows (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL UNIQUE,
    entity_type ENUM('LEAVE','INVOICE','HIRING','EXPENSE','PURCHASE') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_entity_type (entity_type),
    INDEX idx_active (is_active)
);

-- Table 44: approval_chains
CREATE TABLE IF NOT EXISTS approval_chains (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    workflow_id CHAR(36) NOT NULL,
    step_order INT NOT NULL,
    approver_role ENUM('HR','FINANCE','MANAGER','ADMIN','SUPER_ADMIN') NOT NULL,
    approval_condition JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    UNIQUE KEY unique_step (workflow_id, step_order),
    INDEX idx_workflow (workflow_id)
);

-- Table 45: approval_instances
CREATE TABLE IF NOT EXISTS approval_instances (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    workflow_id CHAR(36) NOT NULL,
    entity_id CHAR(36) NOT NULL,
    current_step INT DEFAULT 1,
    status ENUM('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
    decisions JSON DEFAULT NULL,
    initiated_by CHAR(36) NOT NULL,
    initiated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (initiated_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_workflow (workflow_id),
    INDEX idx_entity (entity_id),
    INDEX idx_status (status)
);

-- Table 46: company_settings
CREATE TABLE IF NOT EXISTS company_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_name VARCHAR(255) NOT NULL,
    gst VARCHAR(255) DEFAULT NULL,
    pan VARCHAR(255) DEFAULT NULL,
    bank_name VARCHAR(255) DEFAULT NULL,
    bank_account VARCHAR(255) DEFAULT NULL,
    bank_ifsc VARCHAR(50) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    logo_url VARCHAR(500) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 47: job_board_posts
CREATE TABLE IF NOT EXISTS job_board_posts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id CHAR(36) NOT NULL,
    platform ENUM('LINKEDIN','NAUKRI','INDEED','INTERNSHALA') NOT NULL,
    external_post_id VARCHAR(255) DEFAULT NULL,
    posted_at DATETIME DEFAULT NULL,
    status ENUM('PENDING','POSTED','FAILED','EXPIRED') DEFAULT 'PENDING',
    error_message TEXT DEFAULT NULL,
    platform_response JSON DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_platform (job_id, platform),
    INDEX idx_job (job_id),
    INDEX idx_platform (platform),
    INDEX idx_status (status)
);

-- Table 48: student_projects
CREATE TABLE IF NOT EXISTS student_projects (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    github_repo_url VARCHAR(500) NOT NULL,
    repo_owner VARCHAR(255) DEFAULT NULL,
    repo_name VARCHAR(255) DEFAULT NULL,
    branch VARCHAR(255) DEFAULT 'main',
    last_commit_hash VARCHAR(255) DEFAULT NULL,
    repo_structure JSON DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_repo (student_id, github_repo_url(255)),
    INDEX idx_student (student_id),
    INDEX idx_repo (github_repo_url(255))
);

-- Table 49: mindmap_nodes
CREATE TABLE IF NOT EXISTS mindmap_nodes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    project_id CHAR(36) DEFAULT NULL,
    parent_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    node_type ENUM('ROOT','BRANCH','LEAF') DEFAULT 'BRANCH',
    position_x DECIMAL(10,2) DEFAULT 0.00,
    position_y DECIMAL(10,2) DEFAULT 0.00,
    color VARCHAR(20) DEFAULT '#4F46E5',
    icon VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES mindmap_nodes(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_project (project_id),
    INDEX idx_parent (parent_id)
);

-- Table 50: certificates
CREATE TABLE IF NOT EXISTS certificates (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    enrollment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE DEFAULT NULL,
    pdf_url VARCHAR(500) NOT NULL,
    qr_code_url VARCHAR(500) DEFAULT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_certificate_number (certificate_number)
);

-- Table 51: system_error_logs
CREATE TABLE IF NOT EXISTS system_error_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    error_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    stack_trace LONGTEXT DEFAULT NULL,
    endpoint VARCHAR(500) DEFAULT NULL,
    method VARCHAR(10) DEFAULT NULL,
    status_code INT DEFAULT NULL,
    request_payload JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_id CHAR(36) DEFAULT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME DEFAULT NULL,
    resolution_notes TEXT DEFAULT NULL,
    resolved_by CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_service (service_name),
    INDEX idx_error_type (error_type),
    INDEX idx_resolved (is_resolved),
    INDEX idx_created (created_at)
);
-- Table 52: tenants
CREATE TABLE IF NOT EXISTS tenants (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) DEFAULT NULL,
    logo_url VARCHAR(500) DEFAULT NULL,
    primary_color VARCHAR(20) DEFAULT '#4F46E5',
    secondary_color VARCHAR(20) DEFAULT '#0EA5E9',
    favicon_url VARCHAR(500) DEFAULT NULL,
    email_from VARCHAR(255) DEFAULT NULL,
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(10) DEFAULT 'INR',
    is_active BOOLEAN DEFAULT TRUE,
    settings JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subdomain (subdomain),
    INDEX idx_custom_domain (custom_domain)
);

-- Table 53: tenant_users
CREATE TABLE IF NOT EXISTS tenant_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    tenant_id CHAR(36) NOT NULL,
    tenant_role VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_user (user_id, tenant_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_user (user_id)
);

-- Table 54: products
CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2) DEFAULT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255) DEFAULT NULL,
    seo_description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_course (tenant_id, course_id),
    INDEX idx_published (is_published)
);

-- Table 55: coupons
CREATE TABLE IF NOT EXISTS coupons (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('PERCENTAGE','FIXED') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10,2) DEFAULT NULL,
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_code (code),
    INDEX idx_valid (valid_from, valid_to)
);

-- Table 56: cart_sessions
CREATE TABLE IF NOT EXISTS cart_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    user_id CHAR(36) DEFAULT NULL,
    session_token VARCHAR(255) NOT NULL,
    items JSON NOT NULL,
    coupon_code VARCHAR(50) DEFAULT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user (user_id)
);

-- Table 57: orders
CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    user_id CHAR(36) DEFAULT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    coupon_code VARCHAR(50) DEFAULT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    payment_method ENUM('RAZORPAY','STRIPE','BANK_TRANSFER') DEFAULT 'RAZORPAY',
    payment_id VARCHAR(255) DEFAULT NULL,
    billing_address JSON DEFAULT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) DEFAULT NULL,
    placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant (tenant_id),
    INDEX idx_user (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_placed_at (placed_at)
);

-- Table 58: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
);

-- Table 59: report_definitions
CREATE TABLE IF NOT EXISTS report_definitions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dimensions JSON NOT NULL,
    metrics JSON NOT NULL,
    filters JSON DEFAULT NULL,
    chart_type ENUM('TABLE','BAR','LINE','PIE','AREA') DEFAULT 'TABLE',
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id)
);

-- Table 60: scheduled_reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    report_definition_id CHAR(36) NOT NULL,
    tenant_id CHAR(36) NOT NULL,
    frequency ENUM('DAILY','WEEKLY','MONTHLY') NOT NULL,
    format ENUM('PDF','CSV','EXCEL') DEFAULT 'PDF',
    recipient_emails JSON NOT NULL,
    last_sent_at DATETIME DEFAULT NULL,
    next_send_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (report_definition_id) REFERENCES report_definitions(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id),
    INDEX idx_next_send (next_send_at)
);
-- Table 61: api_keys
CREATE TABLE IF NOT EXISTS api_keys (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    api_key VARCHAR(64) UNIQUE NOT NULL,
    api_secret VARCHAR(64) NOT NULL,
    scopes JSON DEFAULT NULL,
    rate_limit_per_minute INT DEFAULT 60,
    expires_at DATETIME DEFAULT NULL,
    last_used_at DATETIME DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_api_key (api_key),
    INDEX idx_tenant (tenant_id)
);

-- Table 62: webhook_subscriptions
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events JSON NOT NULL,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_delivery_at DATETIME DEFAULT NULL,
    last_delivery_status ENUM('SUCCESS','FAILED') DEFAULT NULL,
    failure_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id)
);

-- Table 63: device_registrations
CREATE TABLE IF NOT EXISTS device_registrations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    tenant_id CHAR(36) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    platform ENUM('IOS','ANDROID','WEB') NOT NULL,
    push_token VARCHAR(255) NOT NULL,
    app_version VARCHAR(50) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_device (user_id, device_id),
    INDEX idx_tenant (tenant_id)
);

-- Table 64: prediction_logs
CREATE TABLE IF NOT EXISTS prediction_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    entity_type ENUM('LEAD','STUDENT','EMPLOYEE') NOT NULL,
    entity_id CHAR(36) NOT NULL,
    prediction_type ENUM('LEAD_SCORE','CHURN_PROBABILITY','PERFORMANCE') NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    features JSON NOT NULL,
    explanation TEXT DEFAULT NULL,
    model_version VARCHAR(50) DEFAULT NULL,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_type (prediction_type)
);

-- Table 65: automation_workflows
CREATE TABLE IF NOT EXISTS automation_workflows (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type ENUM('SCHEDULE','EVENT','WEBHOOK') NOT NULL,
    trigger_config JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    execution_count INT DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id),
    INDEX idx_active (is_active)
);

-- Table 66: workflow_nodes
CREATE TABLE IF NOT EXISTS workflow_nodes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    workflow_id CHAR(36) NOT NULL,
    node_type ENUM('TRIGGER','ACTION','CONDITION','DELAY','EMAIL','SMS','CREATE_INVOICE','ENROLL_COURSE','UPDATE_CRM') NOT NULL,
    node_config JSON NOT NULL,
    position_x DECIMAL(10,2) NOT NULL,
    position_y DECIMAL(10,2) NOT NULL,
    next_node_id CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (next_node_id) REFERENCES workflow_nodes(id) ON DELETE SET NULL,
    INDEX idx_workflow (workflow_id)
);

-- Table 67: workflow_executions
CREATE TABLE IF NOT EXISTS workflow_executions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    workflow_id CHAR(36) NOT NULL,
    tenant_id CHAR(36) NOT NULL,
    entity_id CHAR(36) NOT NULL,
    current_node_id CHAR(36) DEFAULT NULL,
    status ENUM('PENDING','RUNNING','COMPLETED','FAILED','PAUSED') DEFAULT 'PENDING',
    execution_context JSON DEFAULT NULL,
    error_message TEXT DEFAULT NULL,
    triggered_by CHAR(36) DEFAULT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (current_node_id) REFERENCES workflow_nodes(id) ON DELETE SET NULL,
    FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_workflow (workflow_id),
    INDEX idx_entity (entity_id),
    INDEX idx_status (status)
);

-- Table 68: anomaly_logs
CREATE TABLE IF NOT EXISTS anomaly_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    user_id CHAR(36) DEFAULT NULL,
    anomaly_type ENUM('IMPOSSIBLE_TRAVEL','BRUTE_FORCE','RAPID_DATA_ACCESS','SUSPICIOUS_IP') NOT NULL,
    severity ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
    details JSON NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME DEFAULT NULL,
    resolved_by CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant (tenant_id),
    INDEX idx_user (user_id),
    INDEX idx_severity (severity)
);

-- Initial seed data
INSERT INTO users (id, email, password_hash, full_name, role, is_active)
VALUES (
  '368f5c88-12cd-11ed-861d-0242ac120002',
  'admin@ethiroli.com',
  '$2a$10$EPYtG8pA4U4.3vQc2y5cO.vA0Fq9l.Jj1Ww/W/8z.lV3nE5tL7j7S',
  'Super Administrator',
  'SUPER_ADMIN',
  TRUE
) ON DUPLICATE KEY UPDATE id=id;

-- Initial config seeds
INSERT INTO system_configs (config_key, config_value, is_encrypted)
VALUES (
  'ALLOWED_ORIGINS',
  '["http://localhost:5173", "http://localhost:3000"]',
  FALSE
) ON DUPLICATE KEY UPDATE config_key=config_key;

-- ============================================
-- LOOKUP TABLES (Tables 69-72)
-- ============================================

-- Table 69: departments
CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 70: job_categories
CREATE TABLE IF NOT EXISTS job_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 71: job_types
CREATE TABLE IF NOT EXISTS job_types (
    job_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 72: application_statuses
CREATE TABLE IF NOT EXISTS application_statuses (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL UNIQUE,
    status_code VARCHAR(50) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (display_order >= 0)
);

-- ============================================
-- CONTACT US MODULE (Tables 73-74)
-- ============================================

-- Table 73: contact_inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
    inquiry_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    inquiry_source ENUM('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','OTHER') DEFAULT 'WEBSITE',
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_is_resolved (is_resolved),
    INDEX idx_created_at (created_at)
);

-- Table 74: contact_inquiry_attachments
CREATE TABLE IF NOT EXISTS contact_inquiry_attachments (
    attachment_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    inquiry_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES contact_inquiries(inquiry_id) ON DELETE CASCADE,
    INDEX idx_inquiry (inquiry_id)
);

-- ============================================
-- CAREERS MODULE ENHANCEMENTS (Tables 75-78)
-- ============================================

-- Table 75: applications
CREATE TABLE IF NOT EXISTS applications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    candidate_id CHAR(36) NOT NULL,
    job_id CHAR(36) NOT NULL,
    status_id INT DEFAULT NULL,
    cover_letter TEXT DEFAULT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES application_statuses(status_id) ON DELETE SET NULL,
    INDEX idx_candidate (candidate_id),
    INDEX idx_job (job_id),
    INDEX idx_status (status_id)
);

-- Table 76: application_status_history
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
    INDEX idx_application (application_id),
    INDEX idx_changed_at (changed_at)
);

-- Table 77: candidate_documents
CREATE TABLE IF NOT EXISTS candidate_documents (
    document_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    candidate_id CHAR(36) NOT NULL,
    application_id CHAR(36) DEFAULT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_application (application_id)
);

-- Table 78: interview_schedules
CREATE TABLE IF NOT EXISTS interview_schedules (
    interview_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL,
    interview_type VARCHAR(100) DEFAULT NULL,
    interview_round INT DEFAULT 1,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME DEFAULT NULL,
    duration_minutes INT DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    interview_mode ENUM('ONLINE','OFFLINE','PHONE') DEFAULT 'ONLINE',
    location_link VARCHAR(500) DEFAULT NULL,
    interviewer_name VARCHAR(255) DEFAULT NULL,
    interviewer_email VARCHAR(255) DEFAULT NULL,
    interviewer_phone VARCHAR(50) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    is_confirmed BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    feedback_text TEXT DEFAULT NULL,
    feedback_score INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36) DEFAULT NULL,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_application (application_id),
    INDEX idx_scheduled (scheduled_date, scheduled_time)
);

-- ============================================
-- TRIGGERS FOR updated_at COLUMNS
-- ============================================

CREATE TRIGGER trg_departments_updated_at AFTER UPDATE ON departments
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_job_categories_updated_at AFTER UPDATE ON job_categories
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_job_types_updated_at AFTER UPDATE ON job_types
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_application_statuses_updated_at AFTER UPDATE ON application_statuses
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_contact_inquiries_updated_at AFTER UPDATE ON contact_inquiries
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_contact_inquiry_attachments_updated_at AFTER UPDATE ON contact_inquiry_attachments
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_applications_updated_at AFTER UPDATE ON applications
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_application_status_history_updated_at AFTER UPDATE ON application_status_history
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_candidate_documents_updated_at AFTER UPDATE ON candidate_documents
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER trg_interview_schedules_updated_at AFTER UPDATE ON interview_schedules
FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW vw_active_job_postings AS
SELECT
    j.id,
    j.title,
    j.description,
    j.location,
    j.salary_range,
    j.status,
    j.posted_at,
    j.created_at,
    j.department,
    d.department_name,
    j.required_skills
FROM jobs j
LEFT JOIN departments d ON j.department = d.department_name
WHERE j.status IN ('OPEN', 'DRAFT');

CREATE OR REPLACE VIEW vw_application_tracking AS
SELECT
    a.id AS application_id,
    a.applied_at,
    a.cover_letter,
    j.id AS job_id,
    j.title AS job_title,
    j.department AS job_department,
    c.id AS candidate_id,
    c.name AS candidate_name,
    c.email AS candidate_email,
    c.phone AS candidate_phone,
    s.status_id,
    s.status_name,
    s.display_order
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN candidates c ON a.candidate_id = c.id
LEFT JOIN application_statuses s ON a.status_id = s.status_id
ORDER BY a.applied_at DESC;

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO departments (department_name, description, location) VALUES
('Engineering', 'Software development and technical operations', 'Building A'),
('Human Resources', 'Recruitment, payroll, and employee relations', 'Building B'),
('Finance', 'Accounting, invoicing, and financial planning', 'Building B'),
('Sales', 'Client acquisition and relationship management', 'Building A'),
('Operations', 'Project management and workflow coordination', 'Building C'),
('Marketing', 'Brand management and digital marketing', 'Building A')
ON DUPLICATE KEY UPDATE department_name=department_name;

INSERT INTO job_categories (category_name, description) VALUES
('Software Development', 'Roles related to building software applications'),
('Design', 'UI/UX and graphic design roles'),
('Marketing', 'Digital and traditional marketing roles'),
('Sales', 'Business development and sales roles'),
('Human Resources', 'HR operations and recruitment roles'),
('Finance', 'Accounting and financial analysis roles'),
('Operations', 'Operations management and support roles')
ON DUPLICATE KEY UPDATE category_name=category_name;

INSERT INTO job_types (type_name, description) VALUES
('Full-Time', 'Permanent full-time employment'),
('Part-Time', 'Part-time employment with flexible hours'),
('Contract', 'Fixed-term contract employment'),
('Internship', 'Temporary internship position'),
('Remote', 'Fully remote work arrangement')
ON DUPLICATE KEY UPDATE type_name=type_name;

INSERT INTO application_statuses (status_name, status_code, display_order, is_final) VALUES
('Applied', 'APPLIED', 1, FALSE),
('Under Review', 'UNDER_REVIEW', 2, FALSE),
('Shortlisted', 'SHORTLISTED', 3, FALSE),
('Interview Scheduled', 'INTERVIEW_SCHEDULED', 4, FALSE),
('Interviewed', 'INTERVIEWED', 5, FALSE),
('Offered', 'OFFERED', 6, FALSE),
('Accepted', 'ACCEPTED', 7, TRUE),
('Rejected', 'REJECTED', 8, TRUE),
('Withdrawn', 'WITHDRAWN', 9, TRUE)
ON DUPLICATE KEY UPDATE status_name=status_name;

INSERT INTO contact_inquiries (inquiry_id, first_name, last_name, email, phone, subject, message, inquiry_source)
VALUES (
    'b1c2d3e4-1234-5678-9012-345678901234',
    'John',
    'Doe',
    'john.doe@example.com',
    '+91-9876543210',
    'General Inquiry',
    'I am interested in learning more about your services.',
    'WEBSITE'
) ON DUPLICATE KEY UPDATE inquiry_id=inquiry_id;

-- ==========================================================
-- HRMS ENHANCEMENTS (Tables 79-82)
-- ==========================================================

-- Table 79: leave_balances
CREATE TABLE IF NOT EXISTS leave_balances (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    leave_type ENUM('CASUAL','SICK','EARNED') NOT NULL,
    financial_year VARCHAR(10) NOT NULL,
    total_credited DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    consumed DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    balance DECIMAL(4,1) GENERATED ALWAYS AS (total_credited - consumed) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_year_type (user_id, financial_year, leave_type),
    INDEX idx_user (user_id),
    INDEX idx_fin_year (financial_year)
);

-- Table 80: employee_documents
CREATE TABLE IF NOT EXISTS employee_documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    document_type ENUM('RESUME', 'OFFER_LETTER', 'APPOINTMENT_LETTER', 'NDA', 'ID_PROOF', 'DEGREE_CERTIFICATE', 'EXPERIENCE_LETTER', 'PAYSLIP', 'OTHER') NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    verified_by CHAR(36) DEFAULT NULL,
    verified_at DATETIME DEFAULT NULL,
    uploaded_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_type (document_type),
    INDEX idx_status (status)
);

-- Table 81: exit_requests
CREATE TABLE IF NOT EXISTS exit_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    employee_id CHAR(36) NOT NULL,
    resignation_date DATE NOT NULL,
    requested_last_day DATE NOT NULL,
    approved_last_day DATE DEFAULT NULL,
    reason TEXT NOT NULL,
    notice_period_days INT DEFAULT 30,
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'COMPLETED') DEFAULT 'SUBMITTED',
    exit_interview_notes TEXT DEFAULT NULL,
    approved_by CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee (employee_id),
    INDEX idx_status (status)
);

-- Table 82: offboarding_checklists
CREATE TABLE IF NOT EXISTS offboarding_checklists (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    exit_request_id CHAR(36) NOT NULL,
    department ENUM('IT', 'HR', 'FINANCE', 'OPERATIONS', 'ADMIN') NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    cleared_by CHAR(36) DEFAULT NULL,
    cleared_at DATETIME DEFAULT NULL,
    remarks TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exit_request_id) REFERENCES exit_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (cleared_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_exit_request (exit_request_id),
    INDEX idx_cleared (is_cleared)
);

-- ==========================================================
-- EMPLOYEE PORTAL ENHANCEMENTS (Tables 83-85)
-- ==========================================================

-- Table 83: support_tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_number VARCHAR(30) UNIQUE NOT NULL,
    user_id CHAR(36) NOT NULL,
    category ENUM('IT_SUPPORT', 'HR_QUERY', 'PAYROLL_ISSUE', 'FACILITIES', 'ADMIN') NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment_url VARCHAR(500) DEFAULT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    assigned_to CHAR(36) DEFAULT NULL,
    resolved_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_status (user_id, status),
    INDEX idx_category (category)
);

-- Table 84: project_members
CREATE TABLE IF NOT EXISTS project_members (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    project_role ENUM('LEAD', 'MEMBER', 'CONTRIBUTOR', 'REVIEWER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_user (project_id, user_id),
    INDEX idx_user_projects (user_id)
);

-- Table 85: messages
CREATE TABLE IF NOT EXISTS messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    sender_id CHAR(36) NOT NULL,
    recipient_id CHAR(36) NULL,
    channel_name VARCHAR(100) NULL,
    message_content TEXT NOT NULL,
    attachment_url VARCHAR(500) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_convo (sender_id, recipient_id, created_at),
    INDEX idx_channel (channel_name, created_at)
);

-- ==========================================================
-- LMS ACADEMIC & ENGAGEMENT EXTENSIONS (Tables 86-88)
-- ==========================================================

-- Table 86: batches
CREATE TABLE IF NOT EXISTS batches (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    tutor_id CHAR(36) NOT NULL,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_capacity INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_course (course_id),
    INDEX idx_tutor (tutor_id),
    INDEX idx_code (batch_code)
);

-- Table 87: batch_students
CREATE TABLE IF NOT EXISTS batch_students (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    batch_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_batch_student (batch_id, student_id),
    INDEX idx_batch (batch_id),
    INDEX idx_student (student_id)
);

-- Table 88: doubts
CREATE TABLE IF NOT EXISTS doubts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    course_id CHAR(36) NOT NULL,
    lesson_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    code_snippet TEXT DEFAULT NULL,
    screenshot_url VARCHAR(500) DEFAULT NULL,
    status ENUM('OPEN', 'IN_REVIEW', 'RESOLVED') DEFAULT 'OPEN',
    assigned_tutor_id CHAR(36) DEFAULT NULL,
    resolution_notes TEXT DEFAULT NULL,
    resolved_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_tutor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_course_status (course_id, status),
    INDEX idx_student (student_id),
    INDEX idx_tutor (assigned_tutor_id)
);

-- ==========================================================
-- OPERATIONS SUITE EXTENSIONS (Tables 89-90)
-- ==========================================================

-- Table 89: visitor_logs
CREATE TABLE IF NOT EXISTS visitor_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    company VARCHAR(255) DEFAULT NULL,
    purpose VARCHAR(255) NOT NULL,
    person_to_meet CHAR(36) DEFAULT NULL,
    person_to_meet_name VARCHAR(255) DEFAULT NULL,
    badge_number VARCHAR(50) DEFAULT NULL,
    check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time DATETIME DEFAULT NULL,
    status ENUM('CHECKED_IN', 'CHECKED_OUT', 'EXPECTED') DEFAULT 'CHECKED_IN',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (person_to_meet) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_check_in (check_in_time)
);

-- Table 90: timesheets
CREATE TABLE IF NOT EXISTS timesheets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    project_id CHAR(36) DEFAULT NULL,
    task_id CHAR(36) DEFAULT NULL,
    work_date DATE NOT NULL,
    hours_spent DECIMAL(4,2) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') DEFAULT 'SUBMITTED',
    approved_by CHAR(36) DEFAULT NULL,
    approved_at DATETIME DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_date (user_id, work_date),
    INDEX idx_project (project_id),
    INDEX idx_status (status)
);

-- ==========================================================
-- PROJECT MANAGEMENT DASHBOARD EXTENSIONS (Tables 91-94)
-- ==========================================================

-- Table 91: project_milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    target_date DATE NOT NULL,
    completed_date DATE DEFAULT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'DELAYED') DEFAULT 'PENDING',
    deliverable_url VARCHAR(500) DEFAULT NULL,
    budget_allocated DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    INDEX idx_project_status (project_id, status),
    INDEX idx_target_date (target_date)
);

-- Table 92: project_sprints
CREATE TABLE IF NOT EXISTS project_sprints (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    sprint_number INT NOT NULL,
    sprint_name VARCHAR(100) NOT NULL,
    goal TEXT DEFAULT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING',
    target_velocity INT DEFAULT 0,
    actual_velocity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_proj_sprint (project_id, sprint_number),
    INDEX idx_proj_sprint_status (project_id, status)
);

-- Table 93: project_files
CREATE TABLE IF NOT EXISTS project_files (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    uploaded_by CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type VARCHAR(100) DEFAULT 'application/octet-stream',
    version VARCHAR(20) DEFAULT '1.0',
    category ENUM('SPECIFICATION', 'DESIGN_ASSET', 'DELIVERABLE', 'CONTRACT', 'MEETING_RECORDING', 'OTHER') DEFAULT 'SPECIFICATION',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_cat (project_id, category)
);

-- Table 94: project_expenses
CREATE TABLE IF NOT EXISTS project_expenses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    logged_by CHAR(36) NOT NULL,
    category ENUM('CLOUD_INFRA', 'SOFTWARE_LICENSE', 'HARDWARE', 'CONTRACTOR_FEE', 'TRAVEL', 'MISC') NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500) DEFAULT NULL,
    is_billable BOOLEAN DEFAULT TRUE,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'BILLED') DEFAULT 'PENDING',
    approved_by CHAR(36) DEFAULT NULL,
    approved_at DATETIME DEFAULT NULL,
    invoice_id CHAR(36) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES student_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (logged_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    INDEX idx_proj_expense (project_id, status),
    INDEX idx_expense_date (expense_date)
);

-- Tasks table linkage for Sprints and Milestones
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS project_id CHAR(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sprint_id CHAR(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS milestone_id CHAR(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(4,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(4,1) DEFAULT 0.0;

-- ==========================================================
-- FINANCIAL MANAGEMENT EXTENSIONS (Tables 95-97)
-- ==========================================================

-- Table 95: financial_refunds
CREATE TABLE IF NOT EXISTS financial_refunds (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id CHAR(36) DEFAULT NULL,
    payment_id CHAR(36) DEFAULT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    reason VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'PROCESSED', 'REJECTED') DEFAULT 'PENDING',
    gateway_refund_id VARCHAR(100) DEFAULT NULL,
    utr_number VARCHAR(100) DEFAULT NULL,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME DEFAULT NULL,
    processed_by CHAR(36) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_refund_status (status),
    INDEX idx_invoice (invoice_id)
);

-- Table 96: financial_budgets
CREATE TABLE IF NOT EXISTS financial_budgets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    fiscal_year VARCHAR(10) NOT NULL,
    quarter ENUM('Q1', 'Q2', 'Q3', 'Q4', 'ANNUAL') NOT NULL,
    department ENUM('ENGINEERING', 'MARKETING', 'OPERATIONS', 'HUMAN_RESOURCES', 'GENERAL_ADMIN', 'SALES') NOT NULL,
    category VARCHAR(100) NOT NULL,
    allocated_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    notes TEXT DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_budget_dept (fiscal_year, quarter, department, category),
    INDEX idx_fiscal_dept (fiscal_year, department)
);

-- Table 97: tax_filings
CREATE TABLE IF NOT EXISTS tax_filings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    return_type ENUM('GSTR1', 'GSTR3B', 'GSTR2B', 'TDS_26Q', 'TDS_24Q', 'ADVANCE_TAX') NOT NULL,
    filing_period VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    filed_date DATE DEFAULT NULL,
    arn_number VARCHAR(100) DEFAULT NULL,
    tax_payable DECIMAL(12,2) DEFAULT 0.00,
    tax_paid DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('DRAFT', 'FILED', 'VERIFIED', 'OVERDUE') DEFAULT 'DRAFT',
    acknowledgment_url VARCHAR(500) DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_return_period (return_type, filing_period),
    INDEX idx_tax_status (status)
);

-- Extension to Table 21: transactions (Add payment method and bank reconciliation flags)
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS payment_method ENUM('BANK_TRANSFER', 'UPI', 'CARD', 'CASH', 'CHEQUE', 'RAZORPAY', 'STRIPE') DEFAULT 'BANK_TRANSFER',
ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_reconciled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reconciled_at DATETIME DEFAULT NULL;

-- ==========================================================
-- SALES MANAGEMENT EXTENSIONS (Tables 98-102)
-- ==========================================================

-- Table 98: sales_deals
CREATE TABLE IF NOT EXISTS sales_deals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    client_id CHAR(36) DEFAULT NULL,
    lead_id CHAR(36) DEFAULT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(50) DEFAULT NULL,
    deal_value DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    stage ENUM('QUALIFICATION', 'DISCOVERY', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST') DEFAULT 'QUALIFICATION',
    probability INT DEFAULT 20,
    expected_close_date DATE NOT NULL,
    actual_close_date DATE DEFAULT NULL,
    loss_reason VARCHAR(255) DEFAULT NULL,
    owner_id CHAR(36) NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_deal_stage (stage),
    INDEX idx_deal_owner (owner_id),
    INDEX idx_close_date (expected_close_date)
);

-- Table 99: sales_proposals
CREATE TABLE IF NOT EXISTS sales_proposals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proposal_number VARCHAR(50) UNIQUE NOT NULL,
    deal_id CHAR(36) DEFAULT NULL,
    client_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    valid_until DATE NOT NULL,
    status ENUM('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED') DEFAULT 'DRAFT',
    deliverables JSON DEFAULT NULL,
    pdf_url VARCHAR(500) DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES sales_deals(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prop_status (status),
    INDEX idx_prop_deal (deal_id)
);

-- Table 100: sales_activities
CREATE TABLE IF NOT EXISTS sales_activities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    activity_type ENUM('CALL', 'MEETING', 'DEMO', 'EMAIL', 'FOLLOW_UP', 'NOTE') NOT NULL,
    lead_id CHAR(36) DEFAULT NULL,
    deal_id CHAR(36) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    outcome ENUM('CONNECTED', 'BUSY', 'NO_ANSWER', 'MEETING_BOOKED', 'COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
    duration_minutes INT DEFAULT 15,
    scheduled_at DATETIME NOT NULL,
    completed_at DATETIME DEFAULT NULL,
    meeting_link VARCHAR(500) DEFAULT NULL,
    performed_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    FOREIGN KEY (deal_id) REFERENCES sales_deals(id) ON DELETE SET NULL,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_act_user (performed_by, scheduled_at),
    INDEX idx_act_deal (deal_id)
);

-- Table 101: sales_targets
CREATE TABLE IF NOT EXISTS sales_targets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    fiscal_year VARCHAR(10) NOT NULL,
    period_type ENUM('MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    period_label VARCHAR(50) NOT NULL,
    target_revenue DECIMAL(12,2) NOT NULL,
    achieved_revenue DECIMAL(12,2) DEFAULT 0.00,
    deals_target INT DEFAULT 5,
    deals_won INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rep_target (user_id, fiscal_year, period_label),
    INDEX idx_target_user (user_id)
);

-- Table 102: customer_handovers
CREATE TABLE IF NOT EXISTS customer_handovers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    deal_id CHAR(36) NOT NULL,
    client_id CHAR(36) NOT NULL,
    handover_to ENUM('PROJECT_MANAGER', 'ACADEMIC_COORDINATOR', 'OPERATIONS') NOT NULL,
    assigned_person_id CHAR(36) DEFAULT NULL,
    scope_summary TEXT NOT NULL,
    kickoff_date DATE NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'ONBOARDED') DEFAULT 'PENDING',
    handover_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES sales_deals(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_person_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (handover_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_handover_status (status)
);

-- ==========================================================
-- RECEPTION & FRONT DESK EXTENSIONS (Tables 103-104)
-- ==========================================================

-- Table 103: reception_appointments
CREATE TABLE IF NOT EXISTS reception_appointments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    company VARCHAR(255) DEFAULT NULL,
    purpose VARCHAR(255) NOT NULL,
    person_to_meet CHAR(36) DEFAULT NULL,
    person_to_meet_name VARCHAR(255) DEFAULT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    badge_number VARCHAR(50) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (person_to_meet) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_appt_date (appointment_date),
    INDEX idx_appt_status (status),
    INDEX idx_appt_host (person_to_meet)
);

-- Table 104: reception_receipts
CREATE TABLE IF NOT EXISTS reception_receipts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_id CHAR(36) DEFAULT NULL,
    course_id CHAR(36) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('CASH', 'UPI', 'CARD', 'NET_BANKING') DEFAULT 'UPI',
    purpose ENUM('TUITION_FEE', 'ADMISSION_FEE', 'EXAM_FEE', 'CERTIFICATE_FEE', 'OTHER') DEFAULT 'ADMISSION_FEE',
    issued_by CHAR(36) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_reference VARCHAR(100) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_receipt_num (receipt_number),
    INDEX idx_receipt_issued (issued_at)
);

-- Table: lesson_blocks (interactive lesson content components)
CREATE TABLE IF NOT EXISTS lesson_blocks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    lesson_id CHAR(36) NOT NULL,
    block_type ENUM('VIDEO', 'MARKDOWN', 'CODE_PLAYGROUND', 'QUIZ_EMBED', 'RESOURCE_DOWNLOAD', 'CALLOUT') NOT NULL,
    block_order INT NOT NULL DEFAULT 1,
    content_payload JSON NOT NULL,
    is_interactive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_block_order (lesson_id, block_order)
);

-- Table: lesson_progress (per-student lesson completion tracking)
CREATE TABLE IF NOT EXISTS lesson_progress (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    enrollment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    lesson_id CHAR(36) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
    seconds_watched INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_lesson (student_id, lesson_id),
    INDEX idx_lesson_progress_enrollment (enrollment_id),
    INDEX idx_lesson_progress_student (student_id)
);







