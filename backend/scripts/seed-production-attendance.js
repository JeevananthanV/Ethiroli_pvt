import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pool from '../src/config/database.js';
import { encrypt, decrypt } from '../src/config/encryption.js';

export const INTERNS_DATA = [
  {
    name: 'S. Loganathan',
    aliases: ['S. Loganathan', 'S Loganathan', 'Loganathan'],
    email: 'sloganathan0105@gmail.com',
    joiningDate: '2026-09-24',
    collegeName: 'Coimbatore Institute of Technology',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  },
  {
    name: 'Bharath G',
    aliases: ['Bharath G', 'Barath Appu', 'Bharath'],
    email: 'barathappu777@gmail.com',
    joiningDate: '2026-09-24',
    collegeName: 'SRM Institute of Science and Technology',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  },
  {
    name: 'K. Stephen',
    aliases: ['K. Stephen', 'Stephen'],
    email: 'stephen862k7@gmail.com',
    joiningDate: '2026-09-24',
    collegeName: 'Government College of Technology',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  },
  {
    name: 'K. Srinithi',
    aliases: ['K. Srinithi', 'Srinithi Kumar', 'Srinithi'],
    email: 'srinithikumar54@gmail.com',
    joiningDate: '2026-10-06',
    collegeName: 'PSG College of Technology',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  },
  {
    name: 'K. Gokulraj',
    aliases: ['K. Gokulraj', 'Gokul Rajkumar', 'Gokulraj'],
    email: 'gokulrajkumar2006@gmail.com',
    joiningDate: '2026-10-07',
    collegeName: 'Anna University',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  },
  {
    name: 'S. Mathishree',
    aliases: ['S. Mathishree', 'Mathishree'],
    email: 'mathishree008@gmail.com',
    joiningDate: '2026-10-12',
    collegeName: 'PSG College of Technology',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  },
  {
    name: 'K. Nandhini',
    aliases: ['K. Nandhini', 'Nandhini K', 'Nandhini'],
    email: 'knandhinivnr@gmail.com',
    joiningDate: '2026-10-12',
    collegeName: 'Anna University',
    role: 'INTERN',
    track: 'Full Stack Web Development'
  }
];

export const HR_DATA = {
  name: 'HR Manager',
  email: 'hr@ethiroli.com',
  role: 'HR'
};

export const HOLIDAYS_DATA = [
  { name: 'Saturday Holiday', date: '2026-10-10' },
  { name: 'Sunday Holiday', date: '2026-10-11' }
];

export const ATTENDANCE_RECORDS = [
  // 24 Sep 2026
  { date: '2026-09-24', name: 'K. Stephen', login: '10:30:00', logout: '15:30:00' },
  { date: '2026-09-24', name: 'Bharath G', login: '10:40:00', logout: '15:30:00' },
  { date: '2026-09-24', name: 'S. Loganathan', login: '11:00:00', logout: '15:30:00' },

  // 25 Sep 2026
  { date: '2026-09-25', name: 'S. Loganathan', login: '10:00:00', logout: '15:30:00' },
  { date: '2026-09-25', name: 'K. Stephen', login: '10:20:00', logout: '15:30:00' },
  { date: '2026-09-25', name: 'Bharath G', login: '10:45:00', logout: '15:30:00' },

  // 26 Sep 2026
  { date: '2026-09-26', name: 'K. Stephen', login: '10:20:00', logout: '15:20:00' },
  { date: '2026-09-26', name: 'S. Loganathan', login: '10:20:00', logout: '15:20:00' },
  { date: '2026-09-26', name: 'Bharath G', login: '10:20:00', logout: '15:20:00' },

  // 28 Sep 2026
  { date: '2026-09-28', name: 'K. Stephen', login: '10:15:00', logout: '15:30:00' },
  { date: '2026-09-28', name: 'S. Loganathan', login: '10:15:00', logout: '15:30:00' },
  { date: '2026-09-28', name: 'Bharath G', login: '10:35:00', logout: '15:30:00' },

  // 29 Sep 2026
  { date: '2026-09-29', name: 'S. Loganathan', login: '09:45:00', logout: '15:30:00' },

  // 30 Sep 2026
  { date: '2026-09-30', name: 'S. Loganathan', login: '09:45:00', logout: '15:30:00' },
  { date: '2026-09-30', name: 'K. Stephen', login: '10:15:00', logout: '15:30:00' },

  // 1 Oct 2026
  { date: '2026-10-01', name: 'S. Loganathan', login: '10:00:00', logout: '15:30:00' },
  { date: '2026-10-01', name: 'K. Stephen', login: '10:20:00', logout: '15:30:00' },

  // 2 Oct 2026
  { date: '2026-10-02', name: 'S. Loganathan', login: '09:40:00', logout: '15:30:00' },
  { date: '2026-10-02', name: 'Bharath G', login: '10:10:00', logout: '15:30:00' },
  { date: '2026-10-02', name: 'K. Stephen', login: '10:10:00', logout: '15:30:00' },

  // 3 Oct 2026
  { date: '2026-10-03', name: 'S. Loganathan', login: '09:50:00', logout: '15:37:00' },
  { date: '2026-10-03', name: 'Bharath G', login: '10:10:00', logout: '15:38:00' },
  { date: '2026-10-03', name: 'K. Stephen', login: '10:15:00', logout: '15:38:00' },

  // 5 Oct 2026
  { date: '2026-10-05', name: 'K. Stephen', login: '10:05:00', logout: '15:30:00' },
  { date: '2026-10-05', name: 'Bharath G', login: '10:15:00', logout: '15:30:00' },

  // 6 Oct 2026
  { date: '2026-10-06', name: 'S. Loganathan', login: '09:30:00', logout: '15:50:00' },
  { date: '2026-10-06', name: 'K. Srinithi', login: '10:20:00', logout: '15:50:00' },

  // 7 Oct 2026
  { date: '2026-10-07', name: 'S. Loganathan', login: '10:00:00', logout: '15:30:00' },
  { date: '2026-10-07', name: 'K. Srinithi', login: '10:00:00', logout: '15:30:00' },
  { date: '2026-10-07', name: 'K. Gokulraj', login: '10:30:00', logout: '15:30:00' },

  // 8 Oct 2026
  { date: '2026-10-08', name: 'S. Loganathan', login: '10:00:00', logout: '15:30:00' },
  { date: '2026-10-08', name: 'K. Gokulraj', login: '10:00:00', logout: '15:30:00' },
  { date: '2026-10-08', name: 'K. Srinithi', login: '10:10:00', logout: '15:30:00' },

  // 9 Oct 2026
  { date: '2026-10-09', name: 'K. Srinithi', login: '10:03:00', logout: '16:00:00' },
  { date: '2026-10-09', name: 'S. Loganathan', login: '10:03:00', logout: '16:00:00' },
  { date: '2026-10-09', name: 'K. Stephen', login: '10:15:00', logout: '16:00:00' },
  { date: '2026-10-09', name: 'K. Gokulraj', login: '10:15:00', logout: '16:00:00' },

  // 12 Oct 2026
  { date: '2026-10-12', name: 'K. Nandhini', login: '09:00:00', logout: '12:00:00' },
  { date: '2026-10-12', name: 'S. Mathishree', login: '09:00:00', logout: '12:00:00' },
  { date: '2026-10-12', name: 'K. Srinithi', login: '10:00:00', logout: '15:00:00' },
  { date: '2026-10-12', name: 'K. Gokulraj', login: '10:00:00', logout: '15:20:00' },
  { date: '2026-10-12', name: 'S. Loganathan', login: '10:05:00', logout: '15:30:00' },

  // 13 Oct 2026
  { date: '2026-10-13', name: 'S. Mathishree', login: '09:28:00', logout: '15:00:00' },
  { date: '2026-10-13', name: 'K. Nandhini', login: '09:28:00', logout: '15:00:00' },
  { date: '2026-10-13', name: 'K. Stephen', login: '10:15:00', logout: '15:40:00' },
  { date: '2026-10-13', name: 'K. Gokulraj', login: '10:15:00', logout: '15:40:00' },
  { date: '2026-10-13', name: 'S. Loganathan', login: '10:15:00', logout: '15:40:00' },
  { date: '2026-10-13', name: 'K. Srinithi', login: '10:00:00', logout: '15:30:00' },

  // 14 Oct 2026
  { date: '2026-10-14', name: 'S. Mathishree', login: '09:20:00', logout: '15:00:00' },
  { date: '2026-10-14', name: 'K. Nandhini', login: '09:20:00', logout: '15:00:00' },
  { date: '2026-10-14', name: 'K. Srinithi', login: '09:00:00', logout: '15:00:00' },
  { date: '2026-10-14', name: 'K. Stephen', login: '10:00:00', logout: '15:00:00' },
  { date: '2026-10-14', name: 'Bharath G', login: '10:00:00', logout: '15:00:00' },
  { date: '2026-10-14', name: 'S. Loganathan', login: '10:00:00', logout: '15:10:00' },
  { date: '2026-10-14', name: 'K. Gokulraj', login: '10:00:00', logout: '15:00:00' },

  // 15 Oct 2026
  { date: '2026-10-15', name: 'K. Nandhini', login: '09:25:00', logout: '15:05:00' },
  { date: '2026-10-15', name: 'S. Mathishree', login: '09:25:00', logout: '15:05:00' },
  { date: '2026-10-15', name: 'K. Srinithi', login: '10:00:00', logout: '15:38:00' },
  { date: '2026-10-15', name: 'K. Gokulraj', login: '10:00:00', logout: '15:38:00' },
  { date: '2026-10-15', name: 'K. Stephen', login: '10:20:00', logout: '15:38:00' },
  { date: '2026-10-15', name: 'Bharath G', login: '10:20:00', logout: '15:38:00' },

  // 16 Oct 2026 (Today) - Real-time open shifts
  { date: '2026-10-16', name: 'S. Mathishree', login: '09:35:00', logout: null },
  { date: '2026-10-16', name: 'K. Nandhini', login: '09:35:00', logout: null },
  { date: '2026-10-16', name: 'K. Srinithi', login: '10:00:00', logout: null },
  { date: '2026-10-16', name: 'S. Loganathan', login: '10:00:00', logout: null },
  { date: '2026-10-16', name: 'K. Gokulraj', login: '10:00:00', logout: null }
];

export async function seedProductionData() {
  console.log('--- Starting Production Intern & Attendance Data Seeding ---');

  // 1. Ensure required tables exist
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id CHAR(36) NOT NULL,
      work_date DATE NOT NULL,
      check_in_time DATETIME NOT NULL,
      check_out_time DATETIME DEFAULT NULL,
      worked_minutes INT GENERATED ALWAYS AS (
        IFNULL(TIMESTAMPDIFF(MINUTE, check_in_time, check_out_time), 0)
      ) STORED,
      status ENUM('ACTIVE','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_sessions_user_date (user_id, work_date),
      INDEX idx_sessions_user_status (user_id, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS holidays (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      is_restricted TINYINT(1) DEFAULT 0,
      restricted_to JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_holiday_date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Ensure worked_minutes and session_count columns on attendance
  try {
    await pool.execute(`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS worked_minutes INT NOT NULL DEFAULT 0;`);
  } catch (_) {
    try { await pool.execute(`ALTER TABLE attendance ADD COLUMN worked_minutes INT NOT NULL DEFAULT 0;`); } catch (_) {}
  }
  try {
    await pool.execute(`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS session_count INT NOT NULL DEFAULT 0;`);
  } catch (_) {
    try { await pool.execute(`ALTER TABLE attendance ADD COLUMN session_count INT NOT NULL DEFAULT 0;`); } catch (_) {}
  }

  // 2. Seed / Update HR User
  const defaultHrPasswordHash = await bcrypt.hash('Hr@123', 10);
  const [existingUsers] = await pool.execute('SELECT id, email, full_name, role FROM users');
  const userByEmail = new Map();
  for (const u of existingUsers) {
    let email = u.email;
    try { email = decrypt(u.email); } catch {}
    userByEmail.set(email.toLowerCase(), u);
  }

  let hrUser = userByEmail.get(HR_DATA.email.toLowerCase());
  if (!hrUser) {
    const hrId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [hrId, encrypt(HR_DATA.email), defaultHrPasswordHash, encrypt(HR_DATA.name), 'HR']
    );
    hrUser = { id: hrId, email: HR_DATA.email, full_name: HR_DATA.name, role: 'HR' };
    console.log(`✅ Created HR account: ${HR_DATA.email} / Hr@123`);
  } else {
    await pool.execute(
      `UPDATE users SET password_hash = ?, full_name = ?, is_active = 1 WHERE id = ?`,
      [defaultHrPasswordHash, encrypt(HR_DATA.name), hrUser.id]
    );
    console.log(`✅ Updated HR account credentials: ${HR_DATA.email} / Hr@123`);
  }

  // 3. Seed / Update 7 Intern Users & Interns table
  const defaultInternPasswordHash = await bcrypt.hash('Intern@123', 10);
  const internIdByName = new Map();

  for (const intern of INTERNS_DATA) {
    let user = userByEmail.get(intern.email.toLowerCase());
    let userId;

    if (!user) {
      userId = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [userId, encrypt(intern.email), defaultInternPasswordHash, encrypt(intern.name), 'INTERN']
      );
      console.log(`✅ Created intern user: ${intern.name} (${intern.email})`);
    } else {
      userId = user.id;
      await pool.execute(
        `UPDATE users SET full_name = ?, password_hash = ?, role = 'INTERN', is_active = 1 WHERE id = ?`,
        [encrypt(intern.name), defaultInternPasswordHash, userId]
      );
      console.log(`✅ Updated intern user: ${intern.name} (${intern.email})`);
    }

    // Register mapping by canonical name and aliases
    internIdByName.set(intern.name, userId);
    for (const alias of intern.aliases) {
      internIdByName.set(alias, userId);
    }

    // Upsert into interns table with exact joining date
    const [existingInternRows] = await pool.execute('SELECT id FROM interns WHERE user_id = ?', [userId]);
    const endDate = new Date(new Date(intern.joiningDate).getTime() + 90 * 86400000).toISOString().slice(0, 10);

    if (existingInternRows.length === 0) {
      await pool.execute(
        `INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
         VALUES (?, ?, ?, ?, 15000, ?, ?, ?, 15)`,
        [crypto.randomUUID(), userId, hrUser.id, intern.collegeName, intern.joiningDate, endDate, intern.track]
      );
      console.log(`✅ Seeded intern profile for ${intern.name} with start_date ${intern.joiningDate}`);
    } else {
      await pool.execute(
        `UPDATE interns 
         SET start_date = ?, end_date = ?, college_name = ?, mentor_id = COALESCE(mentor_id, ?), project_target = ?
         WHERE user_id = ?`,
        [intern.joiningDate, endDate, intern.collegeName, hrUser.id, intern.track, userId]
      );
      console.log(`✅ Updated intern profile for ${intern.name} with start_date ${intern.joiningDate}`);
    }
  }

  // 4. Seed Holidays
  for (const holiday of HOLIDAYS_DATA) {
    await pool.execute(
      `INSERT INTO holidays (id, name, date, is_restricted)
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [crypto.randomUUID(), holiday.name, holiday.date]
    );
  }
  console.log('✅ Seeded weekend holidays (Oct 10, Oct 11).');

  // 5. Seed Attendance & Attendance Sessions
  let seededSessions = 0;
  let seededDays = 0;

  for (const record of ATTENDANCE_RECORDS) {
    const userId = internIdByName.get(record.name);
    if (!userId) {
      console.warn(`Could not resolve user ID for: ${record.name}`);
      continue;
    }

    const checkInDateTime = `${record.date} ${record.login}`;
    const checkOutDateTime = record.logout ? `${record.date} ${record.logout}` : null;
    const isToday = record.date === '2026-10-16';
    const isOpenSession = !record.logout;
    const sessionStatus = isOpenSession ? 'ACTIVE' : 'COMPLETED';

    // Calculate worked minutes for completed sessions
    let workedMinutes = 0;
    if (checkOutDateTime) {
      const inTime = new Date(checkInDateTime).getTime();
      const outTime = new Date(checkOutDateTime).getTime();
      workedMinutes = Math.max(0, Math.floor((outTime - inTime) / 60000));
    }

    // Determine late check-in (shift starts at 09:00)
    const [loginH, loginM] = record.login.split(':').map(Number);
    const isLate = (loginH * 60 + loginM) > 9 * 60 ? 1 : 0;

    // Idempotent clean: clear any pre-existing sessions for this user on this date
    await pool.execute(
      `DELETE FROM attendance_sessions WHERE user_id = ? AND work_date = ?`,
      [userId, record.date]
    );

    // Insert attendance session
    const sessionId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO attendance_sessions (id, user_id, work_date, check_in_time, check_out_time, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, userId, record.date, checkInDateTime, checkOutDateTime, sessionStatus]
    );
    seededSessions++;

    // Upsert into attendance summary table
    await pool.execute(
      `INSERT INTO attendance (id, user_id, date, check_in_time, check_out_time, is_late, status, worked_minutes, session_count)
       VALUES (?, ?, ?, ?, ?, ?, 'PRESENT', ?, 1)
       ON DUPLICATE KEY UPDATE
         check_in_time = VALUES(check_in_time),
         check_out_time = VALUES(check_out_time),
         is_late = VALUES(is_late),
         status = 'PRESENT',
         worked_minutes = VALUES(worked_minutes),
         session_count = 1`,
      [crypto.randomUUID(), userId, record.date, checkInDateTime, checkOutDateTime, isLate, workedMinutes]
    );
    seededDays++;
  }

  console.log(`✅ Successfully seeded ${seededSessions} punch sessions across ${seededDays} attendance day summaries.`);
  console.log('--- Production Seed Finished ---');
}

// Allow direct execution via CLI
const isDirectRun = process.argv[1]?.endsWith('seed-production-attendance.js');
if (isDirectRun) {
  seedProductionData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed execution error:', err);
      process.exit(1);
    });
}
