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

    console.log('Essential tables (contact_messages, career_applications, candidates, contact_inquiries, users.avatar_url, push_notifications, student_projects ownership) verified/created.');
  } catch (err) {
    console.warn('Warning checking essential tables on startup:', err.message);
  }
};
