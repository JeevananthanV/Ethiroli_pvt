/**
 * Seeds intern accounts into the database and generates SQL for live database execution.
 *
 * Accounts:
 * - gokulrajkumar2006@gmail.com : Intern@123
 * - srinithikumar54@gmail.com    : Intern@123
 * - sloganathan0105@gmail.com   : Intern@123
 * - stephen862k7@gmail.com       : Intern@123
 * - Barathappu777@gmail.com      : Intern@123
 * - knandhinivnr@gmail.com       : Intern@123
 * - mathishree008@gmail.com      : Intern@123
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';
import { encrypt, encryptDeterministic } from '../src/config/encryption.js';
import User from '../src/models/User.js';
import Intern from '../src/models/Intern.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTERN_CREDENTIALS = [
  {
    email: 'gokulrajkumar2006@gmail.com',
    password: 'Intern@123',
    full_name: 'Gokul Rajkumar',
    college: 'Anna University',
    department: 'Software Engineering',
    stipend: 15000
  },
  {
    email: 'srinithikumar54@gmail.com',
    password: 'Intern@123',
    full_name: 'Srinithi Kumar',
    college: 'PSG College of Technology',
    department: 'Full Stack Development',
    stipend: 15000
  },
  {
    email: 'sloganathan0105@gmail.com',
    password: 'Intern@123',
    full_name: 'S Loganathan',
    college: 'Coimbatore Institute of Technology',
    department: 'Web Applications',
    stipend: 15000
  },
  {
    email: 'stephen862k7@gmail.com',
    password: 'Intern@123',
    full_name: 'Stephen',
    college: 'Government College of Technology',
    department: 'Frontend Engineering',
    stipend: 15000
  },
  {
    email: 'Barathappu777@gmail.com',
    password: 'Intern@123',
    full_name: 'Barath Appu',
    college: 'SRM Institute of Science and Technology',
    department: 'Backend Engineering',
    stipend: 15000
  },
  {
    email: 'knandhinivnr@gmail.com',
    password: 'Intern@123',
    full_name: 'Nandhini K',
    college: 'Anna University',
    department: 'Full Stack Web Development',
    stipend: 15000
  },
  {
    email: 'mathishree008@gmail.com',
    password: 'Intern@123',
    full_name: 'Mathishree',
    college: 'PSG College of Technology',
    department: 'Full Stack Web Development',
    stipend: 15000
  }
];

export async function seedInterns() {
  console.log('Seeding intern accounts...\n');

  const sqlStatements = [
    '--',
    '-- Live SQL Seed Script for Intern Accounts',
    `-- Generated on: ${new Date().toISOString()}`,
    '--',
    'SET FOREIGN_KEY_CHECKS = 0;',
    '',
    '-- Ensure essential auth & profile tables exist in production',
    `CREATE TABLE IF NOT EXISTS \`user_credentials\` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    '',
    `CREATE TABLE IF NOT EXISTS \`interns\` (
  \`id\` char(36) NOT NULL,
  \`user_id\` char(36) NOT NULL,
  \`mentor_id\` char(36) DEFAULT NULL,
  \`college_name\` varchar(255) DEFAULT NULL,
  \`stipend\` decimal(10,2) DEFAULT 0.00,
  \`start_date\` date DEFAULT NULL,
  \`end_date\` date DEFAULT NULL,
  \`project_target\` varchar(255) DEFAULT NULL,
  \`progress\` int(11) DEFAULT 0,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_intern_user\` (\`user_id\`),
  KEY \`idx_intern_mentor\` (\`mentor_id\`),
  CONSTRAINT \`fk_intern_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    ''
  ];

  const results = [];

  for (const item of INTERN_CREDENTIALS) {
    const rawEmail = item.email.toLowerCase().trim();
    const encEmail = encryptDeterministic(rawEmail);
    const encFullName = encrypt(item.full_name);
    const passwordHash = await bcrypt.hash(item.password, 12);
    const prefJson = JSON.stringify({
      department: item.department,
      college: item.college,
      seeded: true
    });

    // 1. Check if user already exists
    let existingUser = await User.findByEmail(rawEmail);
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`[UPDATE] User already exists: ${rawEmail} (ID: ${userId})`);

      await pool.execute(
        `UPDATE users 
         SET password_hash = ?, full_name = ?, role = 'INTERN', is_active = 1, preferences = ?
         WHERE id = ?`,
        [passwordHash, encFullName, prefJson, userId]
      );
    } else {
      userId = crypto.randomUUID();
      console.log(`[CREATE] Creating user: ${rawEmail} (ID: ${userId})`);

      await pool.execute(
        `INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
         VALUES (?, ?, ?, ?, NULL, 'INTERN', 1, ?)`,
        [userId, encEmail, passwordHash, encFullName, prefJson]
      );
    }

    // 2. Ensure credentials table record
    await pool.execute(
      `INSERT INTO user_credentials 
       (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
       VALUES (?, ?, 'BCRYPT', NOW(), 0, NULL, 0, ?)
       ON DUPLICATE KEY UPDATE 
         password_hash = VALUES(password_hash),
         password_updated_at = NOW(),
         failed_login_attempts = 0,
         lockout_until = NULL,
         requires_password_change = 0,
         password_history = VALUES(password_history)`,
      [userId, passwordHash, JSON.stringify([passwordHash])]
    );

    // 3. Ensure interns profile record
    const existingIntern = await Intern.findByUserId(userId);
    let internId;
    if (existingIntern) {
      internId = existingIntern.id;
      await pool.execute(
        `UPDATE interns 
         SET college_name = ?, stipend = ?, project_target = 'Full Stack Development', progress = 10
         WHERE id = ?`,
        [item.college, item.stipend, internId]
      );
    } else {
      internId = crypto.randomUUID();
      const startDate = new Date().toISOString().slice(0, 10);
      const endDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
      await pool.execute(
        `INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
         VALUES (?, ?, NULL, ?, ?, ?, ?, 'Full Stack Development', 10)`,
        [internId, userId, item.college, item.stipend, startDate, endDate]
      );
    }

    results.push({
      email: item.email,
      password: item.password,
      userId,
      internId
    });

    // Append SQL for live database
    const escapedEncEmail = encEmail.replace(/'/g, "\\'");
    const escapedEncName = encFullName.replace(/'/g, "\\'");
    const escapedHash = passwordHash.replace(/'/g, "\\'");
    const escapedPref = prefJson.replace(/'/g, "\\'");
    const escapedHistory = JSON.stringify([passwordHash]).replace(/'/g, "\\'");
    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

    sqlStatements.push(`-- Account: ${item.email} (${item.full_name})`);
    sqlStatements.push(`-- Password: ${item.password}`);
    sqlStatements.push(`INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('${userId}', '${escapedEncEmail}', '${escapedHash}', '${escapedEncName}', NULL, 'INTERN', 1, '${escapedPref}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);`);

    sqlStatements.push(`INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('${userId}', '${escapedHash}', 'BCRYPT', NOW(), 0, NULL, 0, '${escapedHistory}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);`);

    sqlStatements.push(`INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('${internId}', '${userId}', NULL, '${item.college}', ${item.stipend}, '${startDate}', '${endDate}', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);\n`);
  }

  sqlStatements.push('SET FOREIGN_KEY_CHECKS = 1;');

  const sqlFilePath = path.join(__dirname, 'seed-interns-live.sql');
  fs.writeFileSync(sqlFilePath, sqlStatements.join('\n'), 'utf8');
  console.log(`\nGenerated Live SQL file at: ${sqlFilePath}`);

  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedInterns()
    .then((results) => {
      console.log('\n--- SEED COMPLETE ---');
      console.table(results.map(r => ({ Email: r.email, Password: r.password, UserID: r.userId })));
      process.exit(0);
    })
    .catch((err) => {
      console.error('\nSeeding failed:', err);
      process.exit(1);
    });
}
