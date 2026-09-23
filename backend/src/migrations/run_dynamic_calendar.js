import pool from '../config/database.js';

export async function runDynamicCalendarMigration() {
  console.log('🔄 Running dynamic calendar schema migration...');

  // 1. Create calendar_event_types
  await pool.query(`
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 2. Create calendar_role_configs
  await pool.query(`
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
      UNIQUE KEY uk_role (role)
    )
  `);

  // 3. Create recurring_rules
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recurring_rules (
      id VARCHAR(36) PRIMARY KEY,
      event_id VARCHAR(36) NOT NULL,
      frequency ENUM('DAILY','WEEKLY','MONTHLY','YEARLY') NOT NULL,
      \`interval\` INT DEFAULT 1,
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
      INDEX idx_event (event_id)
    )
  `);

  // 4. Safely alter calendar_events table
  const [existingCols] = await pool.query(`DESCRIBE calendar_events`);
  const colNames = existingCols.map(c => c.Field.toLowerCase());

  const columnsToAdd = [
    { name: 'event_type_id', def: 'VARCHAR(36) DEFAULT NULL' },
    { name: 'status', def: "ENUM('scheduled','completed','cancelled','postponed') DEFAULT 'scheduled'" },
    { name: 'priority', def: "ENUM('low','medium','high','urgent') DEFAULT 'medium'" },
    { name: 'tags', def: 'JSON DEFAULT NULL' },
    { name: 'recurrence_rule', def: 'JSON DEFAULT NULL' },
    { name: 'recurrence_end_date', def: 'DATE DEFAULT NULL' },
    { name: 'recurrence_instance_count', def: 'INT DEFAULT NULL' },
    { name: 'index_key', def: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'parent_event_id', def: 'VARCHAR(36) DEFAULT NULL' },
    { name: 'cancelled_instance_dates', def: 'JSON DEFAULT NULL' },
    { name: 'tenant_id', def: 'VARCHAR(36) DEFAULT NULL' },
    { name: 'role', def: 'VARCHAR(50) DEFAULT NULL' },
    { name: 'metadata', def: 'JSON DEFAULT NULL' }
  ];

  for (const col of columnsToAdd) {
    if (!colNames.includes(col.name.toLowerCase())) {
      await pool.query(`ALTER TABLE calendar_events ADD COLUMN ${col.name} ${col.def}`);
      console.log(`  ➕ Added column ${col.name} to calendar_events`);
    }
  }

  // Ensure event_type is VARCHAR(50) not an ENUM
  await pool.query(`ALTER TABLE calendar_events MODIFY COLUMN event_type VARCHAR(50) NOT NULL DEFAULT 'MEETING'`);
  console.log(`  🔄 Modified event_type column to VARCHAR(50)`);

  // 5. Seed Event Types
  const eventTypes = [
    ['evt_interview', 'Interview', 'Candidate recruitment and hiring interviews', 'bi-person-video', 45, '#3b82f6', JSON.stringify(["HR","PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]), JSON.stringify(["HR","PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]), JSON.stringify(["HR","PROJECT_MANAGER"]), true, 1],
    ['evt_class', 'Class', 'Live academic lecture or training session', 'bi-mortarboard', 60, '#10b981', JSON.stringify(["TUTOR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["TUTOR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["TUTOR","STUDENT"]), true, 2],
    ['evt_quiz', 'Quiz', 'Examination or assessment session', 'bi-question-diamond', 30, '#8b5cf6', JSON.stringify(["TUTOR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["TUTOR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["TUTOR","STUDENT"]), true, 3],
    ['evt_meeting', 'Meeting', 'General team meeting or client consultation', 'bi-people', 30, '#06b6d4', JSON.stringify(["HR","PROJECT_MANAGER","EMPLOYEE","INTERN","ADMIN","SUPER_ADMIN","FINANCE","SALES","RECEPTION"]), JSON.stringify(["HR","PROJECT_MANAGER","EMPLOYEE","INTERN","ADMIN","SUPER_ADMIN"]), JSON.stringify(["SELF","CREATOR_ROLE"]), true, 4],
    ['evt_training', 'Training', 'Employee or intern skill workshop', 'bi-journal-code', 90, '#f59e0b', JSON.stringify(["HR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["HR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["HR","EMPLOYEE","INTERN"]), true, 5],
    ['evt_milestone', 'Milestone', 'Project milestone or delivery deadline', 'bi-flag', 0, '#ec4899', JSON.stringify(["PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]), JSON.stringify(["PROJECT_MANAGER","ADMIN","SUPER_ADMIN"]), JSON.stringify(["PROJECT_MANAGER","EMPLOYEE"]), true, 6],
    ['evt_payment', 'Payment', 'Invoice due date or salary disbursement', 'bi-cash-coin', 0, '#14b8a6', JSON.stringify(["FINANCE","ADMIN","SUPER_ADMIN"]), JSON.stringify(["FINANCE","ADMIN","SUPER_ADMIN"]), JSON.stringify(["FINANCE","ADMIN"]), true, 7],
    ['evt_call', 'Sales Call', 'Prospective client pitch or follow-up call', 'bi-telephone', 30, '#f97316', JSON.stringify(["SALES","ADMIN","SUPER_ADMIN"]), JSON.stringify(["SALES","ADMIN","SUPER_ADMIN"]), JSON.stringify(["SALES"]), true, 8],
    ['evt_appointment', 'Appointment', 'Front-desk or visitor appointment', 'bi-calendar-check', 30, '#64748b', JSON.stringify(["RECEPTION","ADMIN","SUPER_ADMIN"]), JSON.stringify(["RECEPTION","ADMIN","SUPER_ADMIN"]), JSON.stringify(["RECEPTION"]), true, 9],
    ['evt_leave', 'Leave', 'Staff approved leave or time-off', 'bi-calendar-x', 0, '#ef4444', JSON.stringify(["EMPLOYEE","INTERN","HR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["HR","ADMIN","SUPER_ADMIN"]), JSON.stringify(["HR","EMPLOYEE","INTERN"]), true, 10],
    ['evt_deadline', 'Deadline', 'Task or assignment submission deadline', 'bi-clock-history', 0, '#dc2626', JSON.stringify(["ALL"]), JSON.stringify(["ALL"]), JSON.stringify(["SELF"]), true, 11],
    ['evt_holiday', 'Holiday', 'Official company holiday or public day off', 'bi-sun', 0, '#eab308', JSON.stringify(["ADMIN","HR","SUPER_ADMIN"]), JSON.stringify(["ADMIN","HR","SUPER_ADMIN"]), JSON.stringify(["ALL"]), true, 12]
  ];

  for (const t of eventTypes) {
    await pool.execute(`
      INSERT INTO calendar_event_types (id, label, description, icon, default_duration_minutes, color, allowed_create_roles, allowed_write_roles, notification_target_roles, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        sort_order = VALUES(sort_order)
    `, t);
  }

  // 6. Seed Role Configs
  const roleConfigs = [
    ['cfg_super_admin', 'SUPER_ADMIN', 'Master Operations Calendar', 'month', '09:00:00', '18:00:00', true, '[]', JSON.stringify(["evt_meeting","evt_holiday","evt_training"]), true],
    ['cfg_admin', 'ADMIN', 'Executive Operations Calendar', 'month', '09:00:00', '18:00:00', true, '[]', JSON.stringify(["evt_meeting","evt_holiday","evt_training"]), true],
    ['cfg_hr', 'HR', 'HR & People Operations Calendar', 'month', '09:00:00', '18:00:00', true, JSON.stringify(["evt_interview","evt_leave","evt_training","evt_holiday","evt_meeting"]), JSON.stringify(["evt_interview","evt_leave","evt_training"]), true],
    ['cfg_tutor', 'TUTOR', 'Academic & Class Schedule', 'week', '09:00:00', '18:00:00', true, JSON.stringify(["evt_class","evt_quiz","evt_meeting","evt_holiday"]), JSON.stringify(["evt_class","evt_quiz"]), true],
    ['cfg_student', 'STUDENT', 'My Learning Schedule', 'month', '09:00:00', '18:00:00', false, JSON.stringify(["evt_class","evt_quiz","evt_deadline","evt_holiday"]), JSON.stringify(["evt_deadline"]), true],
    ['cfg_employee', 'EMPLOYEE', 'Employee Work Schedule', 'month', '09:00:00', '18:00:00', true, JSON.stringify(["evt_meeting","evt_training","evt_milestone","evt_leave","evt_holiday"]), JSON.stringify(["evt_meeting","evt_leave"]), true],
    ['cfg_intern', 'INTERN', 'Intern Training & Tasks', 'week', '09:00:00', '18:00:00', true, JSON.stringify(["evt_meeting","evt_training","evt_deadline","evt_leave","evt_holiday"]), JSON.stringify(["evt_meeting","evt_leave"]), true],
    ['cfg_pm', 'PROJECT_MANAGER', 'Project Delivery & Milestones', 'month', '09:00:00', '18:00:00', true, JSON.stringify(["evt_milestone","evt_meeting","evt_interview","evt_deadline","evt_holiday"]), JSON.stringify(["evt_milestone","evt_meeting"]), true],
    ['cfg_finance', 'FINANCE', 'Finance & Billing Calendar', 'month', '09:00:00', '18:00:00', true, JSON.stringify(["evt_payment","evt_meeting","evt_holiday"]), JSON.stringify(["evt_payment","evt_meeting"]), true],
    ['cfg_sales', 'SALES', 'Sales & Pitch Pipeline', 'day', '09:00:00', '18:00:00', true, JSON.stringify(["evt_call","evt_meeting","evt_holiday"]), JSON.stringify(["evt_call","evt_meeting"]), true],
    ['cfg_reception', 'RECEPTION', 'Front Desk & Visitors', 'day', '09:00:00', '18:00:00', true, JSON.stringify(["evt_appointment","evt_meeting","evt_interview","evt_holiday"]), JSON.stringify(["evt_appointment"]), true],
    ['cfg_vendor', 'VENDOR', 'Vendor Schedule', 'month', '09:00:00', '18:00:00', false, JSON.stringify(["evt_meeting","evt_payment"]), JSON.stringify(["evt_meeting"]), true],
    ['cfg_client', 'CLIENT', 'Client Milestones & Reviews', 'month', '09:00:00', '18:00:00', false, JSON.stringify(["evt_milestone","evt_meeting"]), JSON.stringify(["evt_meeting"]), true]
  ];

  for (const c of roleConfigs) {
    await pool.execute(`
      INSERT INTO calendar_role_configs (id, role, calendar_title, default_view, work_start_time, work_end_time, show_others_events, event_type_visibility, quick_create_types, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        calendar_title = VALUES(calendar_title),
        default_view = VALUES(default_view),
        work_start_time = VALUES(work_start_time),
        work_end_time = VALUES(work_end_time),
        show_others_events = VALUES(show_others_events),
        event_type_visibility = VALUES(event_type_visibility),
        quick_create_types = VALUES(quick_create_types),
        is_active = VALUES(is_active)
    `, c);
  }

  console.log('✅ Dynamic calendar migration finished successfully!');
}

// Auto-run if executed directly
if (process.argv[1]?.includes('run_dynamic_calendar.js')) {
  runDynamicCalendarMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
