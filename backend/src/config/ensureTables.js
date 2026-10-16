import pool from './database.js';

export const ensureEssentialTables = async () => {
  try {
    // 1. contact_messages
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        subject VARCHAR(255) DEFAULT 'Website Inquiry',
        message TEXT DEFAULT NULL,
        source VARCHAR(100) DEFAULT 'WEBSITE',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. career_applications
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS career_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        role VARCHAR(255) DEFAULT 'General Application',
        portfolio_url VARCHAR(500) DEFAULT NULL,
        experience_level VARCHAR(100) DEFAULT 'Entry',
        message TEXT DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. candidates
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS candidates (
        id CHAR(36) PRIMARY KEY,
        job_id CHAR(36) DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) DEFAULT NULL,
        resume_url VARCHAR(500) DEFAULT NULL,
        source VARCHAR(50) DEFAULT 'WEBSITE',
        status ENUM('NEW', 'CONTACTED', 'SCREENING', 'INTERVIEWING', 'OFFER', 'HIRED', 'REJECTED') DEFAULT 'NEW',
        notes TEXT DEFAULT NULL,
        indeed_candidate_id VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_job_id (job_id),
        INDEX idx_status (status),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. contact_inquiries
    await pool.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Ensure avatar_url column on users table
    try {
      await pool.execute(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url MEDIUMTEXT DEFAULT NULL;
      `);
    } catch (colErr) {
      try {
        await pool.execute(`ALTER TABLE users MODIFY COLUMN avatar_url MEDIUMTEXT DEFAULT NULL;`);
      } catch (_) {}
    }

    // Ensure status column on interns table
    try {
      const [internStatusCol] = await pool.query(`
        SELECT COLUMN_NAME FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'interns' AND COLUMN_NAME = 'status'
      `);
      if (internStatusCol.length === 0) {
        await pool.query("ALTER TABLE interns ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE'");
      }
    } catch (_) {}

    // 6. In-app notification inbox.
    //    pushNotificationService.js and projectNotificationService.js both
    //    INSERT here, but no schema file ever declared the table, so every
    //    push/in-app notification was silently dropped. Created here so the
    //    existing push service starts working too.
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS push_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        data JSON DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        read_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pn_user (user_id),
        INDEX idx_pn_user_unread (user_id, is_read),
        INDEX idx_pn_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Project ownership columns on student_projects.
    //    The PM portal stores its projects in this table, so the person
    //    responsible for delivering a project lives here alongside it.
    for (const ddl of [
      `ALTER TABLE student_projects ADD COLUMN IF NOT EXISTS manager_id CHAR(36) DEFAULT NULL`,
      `ALTER TABLE student_projects ADD COLUMN IF NOT EXISTS assigned_user_ids JSON DEFAULT NULL`,
      `ALTER TABLE student_projects ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'MEDIUM'`,
      `ALTER TABLE student_projects ADD COLUMN IF NOT EXISTS due_date DATE DEFAULT NULL`,
      `ALTER TABLE student_projects ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'ACTIVE'`
    ]) {
      try {
        await pool.execute(ddl);
      } catch (colErr) {
        // Older MySQL without ADD COLUMN IF NOT EXISTS: probe and add if absent.
        try {
          await pool.execute(ddl.replace('ADD COLUMN IF NOT EXISTS', 'ADD COLUMN'));
        } catch (_) {}
      }
    }

    try {
      await pool.execute('CREATE INDEX idx_projects_manager ON student_projects (manager_id)');
    } catch (_) {}

    // 8. Intern-head flag on users.
    //    Session.findByToken selects u.is_intern_head, and requireInternHead.js
    //    reads req.user.is_intern_head. No schema file ever added the column, so
    //    the SELECT raised "Unknown column 'u.is_intern_head'", which surfaced as
    //    a 401 "Authentication required" on EVERY authenticated request - the
    //    activity feed and /auth/me included. Added here so the existing
    //    intern-head guard works.
    for (const ddl of [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_intern_head TINYINT(1) NOT NULL DEFAULT 0`
    ]) {
      try {
        await pool.execute(ddl);
      } catch (colErr) {
        // Older MySQL without ADD COLUMN IF NOT EXISTS: probe and add if absent.
        try {
          await pool.execute(ddl.replace('ADD COLUMN IF NOT EXISTS', 'ADD COLUMN'));
        } catch (_) {}
      }
    }

    // 9. Ensure attendance status enum includes LEAVE
    try {
      await pool.execute(`
        ALTER TABLE attendance MODIFY COLUMN status ENUM('PRESENT','ABSENT','HALF_DAY','LEAVE') NOT NULL DEFAULT 'PRESENT'
      `);
    } catch (_) {}

    // 10. Ensure leaves table exists
    await pool.execute(`
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
        review_note TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_dates (start_date, end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 11. Ensure leave_balances table exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS leave_balances (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        leave_type ENUM('CASUAL','SICK','EARNED') NOT NULL,
        total_credited INT NOT NULL DEFAULT 12,
        consumed INT NOT NULL DEFAULT 0,
        balance INT GENERATED ALWAYS AS (total_credited - consumed) STORED,
        financial_year VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_leave_year (user_id, leave_type, financial_year),
        INDEX idx_user_year (user_id, financial_year)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 12. Ensure category and status columns exist on contact_messages
    for (const ddl of [
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General'`,
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'NEW'`
    ]) {
      try {
        await pool.execute(ddl);
      } catch (colErr) {
        try {
          await pool.execute(ddl.replace('ADD COLUMN IF NOT EXISTS', 'ADD COLUMN'));
        } catch (_) {}
      }
    }

    // Ensure representative inquiries across categories for funnel routing
    try {
      const [existingInq] = await pool.query('SELECT COUNT(*) as cnt FROM contact_messages');
      if (existingInq[0]?.cnt < 4) {
        await pool.execute(`
          INSERT INTO contact_messages (name, email, phone, subject, category, message, status, source, created_at)
          VALUES
          ('Saravanan Muthu', 'saravanan.m@gmail.com', '+91 98405 11223', 'Inquiry regarding Full Stack Web Development course fees and weekend batch timings', 'Course Enquiry', 'Hello, I am currently working in tech support and want to transition into Full Stack MERN development. Could you please share the syllabus, fees structure, and schedule for the upcoming weekend batch?', 'NEW', 'WEBSITE', '2026-09-29 10:30:00'),
          ('Nandhini Jayaraman', 'nandhini.j@outlook.com', '+91 97901 88990', 'Summer Internship Opportunity for CSE 3rd Year students', 'Internship', 'Respected HR team, our university is commencing semester break and I am seeking a 3-month internship in React.js / Frontend. I have attached my GitHub portfolio link.', 'NEW', 'WEBSITE', '2026-09-28 14:15:00'),
          ('Ganesh Pandian', 'ganesh.p@gmail.com', '+91 94440 22334', 'Application for Senior DevOps / AWS Architect role', 'Job Enquiry', 'Hi HR team, I noticed your opening on LinkedIn for DevOps. I have 5 years experience in Terraform, AWS ECS, and Docker. Can I submit my resume directly?', 'CONVERTED', 'WEBSITE', '2026-09-26 11:00:00')
        `);
      }
    } catch (_) {}

    // 13. Ensure hr_requests table exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS hr_requests (
        id VARCHAR(50) PRIMARY KEY,
        requester_id CHAR(36) DEFAULT NULL,
        requester_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'EMPLOYEE',
        request_type VARCHAR(100) NOT NULL,
        priority VARCHAR(50) DEFAULT 'MEDIUM',
        details TEXT DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        remarks TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_req_status (status),
        INDEX idx_req_type (request_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Essential tables (contact_messages, career_applications, candidates, contact_inquiries, users.avatar_url, users.is_intern_head, push_notifications, student_projects ownership, attendance.status LEAVE, leaves, leave_balances, hr_requests) verified/created.');

    try {
      const { seedProductionData } = await import('../../scripts/seed-production-attendance.js');
      await seedProductionData();
    } catch (seedErr) {
      console.warn('Production attendance seed skipped or failed:', seedErr.message);
    }
  } catch (err) {
    console.warn('Warning checking essential tables on startup:', err.message);
  }
};
