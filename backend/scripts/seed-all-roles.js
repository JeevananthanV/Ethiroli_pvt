/**
 * Master Seed & Verification Script for all 11 Primary Roles + 5 Seeded Intern Accounts (16 accounts total).
 *
 * Excludes extra demo student accounts.
 *
 * Generates:
 *   backend/scripts/seed-all-roles-live.sql
 *
 * Usage:
 *   cd backend
 *   node scripts/seed-all-roles.js
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MASTER_ACCOUNTS = [
  // 1. SUPER_ADMIN
  {
    role: 'SUPER_ADMIN',
    portalUrl: '/auth/super-admin/login',
    dashboardUrl: '/app/super-admin/dashboard',
    email: 'admin@ethiroli.com',
    password: 'Admin@123',
    fullName: 'Super Administrator',
    department: 'Executive Operations'
  },
  // 2. ADMIN
  {
    role: 'ADMIN',
    portalUrl: '/auth/admin/login',
    dashboardUrl: '/app/admin/dashboard',
    email: 'orgadmin@ethiroli.com',
    password: 'Admin@123',
    fullName: 'Organization Admin',
    department: 'Administration'
  },
  // 3. HR
  {
    role: 'HR',
    portalUrl: '/auth/hr/login',
    dashboardUrl: '/app/hr/dashboard',
    email: 'hr@ethiroli.com',
    password: 'Hr@123',
    fullName: 'HR Manager',
    department: 'Human Resources',
    employeeCode: 'EMP-102',
    designation: 'HR Lead & Talent Ops'
  },
  // 4. TUTOR
  {
    role: 'TUTOR',
    portalUrl: '/auth/tutor/login',
    dashboardUrl: '/app/tutor/dashboard',
    email: 'tutor@ethiroli.com',
    password: 'Tutor@123',
    fullName: 'Verified Senior Instructor',
    department: 'Academics & Training'
  },
  // 5. PROJECT_MANAGER
  {
    role: 'PROJECT_MANAGER',
    portalUrl: '/auth/pm/login',
    dashboardUrl: '/app/pm/dashboard',
    email: 'pm@ethiroli.com',
    password: 'Pm@123',
    fullName: 'Project Manager',
    department: 'Project Delivery',
    employeeCode: 'EMP-103',
    designation: 'Technical Project Manager'
  },
  // 6. FINANCE
  {
    role: 'FINANCE',
    portalUrl: '/auth/finance/login',
    dashboardUrl: '/app/finance/dashboard',
    email: 'finance@ethiroli.com',
    password: 'Finance@123',
    fullName: 'Finance Lead',
    department: 'Finance & Accounts',
    employeeCode: 'EMP-104',
    designation: 'Finance & Accounts Specialist'
  },
  // 7. SALES
  {
    role: 'SALES',
    portalUrl: '/auth/sales/login',
    dashboardUrl: '/app/sales/dashboard',
    email: 'sales@ethiroli.com',
    password: 'Sales@123',
    fullName: 'Sales Executive',
    department: 'Sales & Growth',
    employeeCode: 'EMP-105',
    designation: 'Business Development Executive'
  },
  // 8. RECEPTION
  {
    role: 'RECEPTION',
    portalUrl: '/auth/reception/login',
    dashboardUrl: '/app/reception/dashboard',
    email: 'reception@ethiroli.com',
    password: 'Reception@123',
    fullName: 'Front Desk Officer',
    department: 'Front Desk & Operations',
    employeeCode: 'EMP-106',
    designation: 'Front Desk Officer'
  },
  // 9. EMPLOYEE
  {
    role: 'EMPLOYEE',
    portalUrl: '/auth/employee/login',
    dashboardUrl: '/app/employee/dashboard',
    email: 'employee@ethiroli.com',
    password: 'Employee@123',
    fullName: 'Senior Engineer',
    department: 'Engineering',
    employeeCode: 'EMP-101',
    designation: 'Senior Full Stack Developer'
  },
  // 10. STUDENT
  {
    role: 'STUDENT',
    portalUrl: '/auth/student/login',
    dashboardUrl: '/app/student/dashboard',
    email: 'student@ethiroli.com',
    password: 'Student@123',
    fullName: 'Ethiroli Student',
    department: 'Computer Science'
  },
  // 11. INTERN (Default)
  {
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    dashboardUrl: '/app/intern/dashboard',
    email: 'intern@ethiroli.com',
    password: 'Intern@123',
    fullName: 'Software Intern',
    college: 'Anna University, Chennai',
    department: 'Software Engineering',
    stipend: 15000
  },
  // 12. Gokul Rajkumar
  {
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    dashboardUrl: '/app/intern/dashboard',
    email: 'gokulrajkumar2006@gmail.com',
    password: 'CFemE8r!i6K3Od',
    fullName: 'Gokul Rajkumar',
    college: 'Anna University',
    department: 'Software Engineering',
    stipend: 15000
  },
  // 13. Srinithi Kumar
  {
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    dashboardUrl: '/app/intern/dashboard',
    email: 'srinithikumar54@gmail.com',
    password: 'NHCg0ZUU!laqM!',
    fullName: 'Srinithi Kumar',
    college: 'PSG College of Technology',
    department: 'Full Stack Development',
    stipend: 15000
  },
  // 14. S Loganathan
  {
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    dashboardUrl: '/app/intern/dashboard',
    email: 'sloganathan0105@gmail.com',
    password: 'DF&m!RPpGspUGV',
    fullName: 'S Loganathan',
    college: 'Coimbatore Institute of Technology',
    department: 'Web Applications',
    stipend: 15000
  },
  // 15. Stephen
  {
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    dashboardUrl: '/app/intern/dashboard',
    email: 'stephen862k7@gmail.com',
    password: '1c9eN#OFQp73&S',
    fullName: 'Stephen',
    college: 'Government College of Technology',
    department: 'Frontend Engineering',
    stipend: 15000
  },
  // 16. Barath Appu
  {
    role: 'INTERN',
    portalUrl: '/auth/intern/login',
    dashboardUrl: '/app/intern/dashboard',
    email: 'Barathappu777@gmail.com',
    password: 'sKotWmDqMrjpv0',
    fullName: 'Barath Appu',
    college: 'SRM Institute of Science and Technology',
    department: 'Backend Engineering',
    stipend: 15000
  }
];

export async function seedAllRoles() {
  console.log('Starting seed process for 16 primary & intern accounts...\n');

  const sqlStatements = [
    '--',
    '-- Complete Production / Live SQL Seed Script',
    '-- Primary Role Login Credentials (11 Roles) + Seeded Intern Accounts (5 Interns)',
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

  const verificationResults = [];

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

    // 1. Check existing user
    let user = await User.findByEmail(rawEmail);
    let userId;

    if (user) {
      userId = user.id;
      await pool.execute(
        `UPDATE users
         SET password_hash = ?, full_name = ?, role = ?, is_active = 1, preferences = ?
         WHERE id = ?`,
        [passwordHash, encFullName, account.role, prefJson, userId]
      );
    } else {
      userId = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
         VALUES (?, ?, ?, ?, NULL, ?, 1, ?)`,
        [userId, encEmail, passwordHash, encFullName, account.role, prefJson]
      );
    }

    // 2. user_credentials table
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

    // 3. Role-specific child tables
    let internId = null;
    let employeeId = null;

    if (account.role === 'INTERN') {
      const [internRows] = await pool.execute('SELECT id FROM interns WHERE user_id = ?', [userId]);
      const collegeName = account.college || 'Engineering College';
      const stipend = account.stipend || 15000;
      const startDate = new Date().toISOString().slice(0, 10);
      const endDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

      if (internRows.length > 0) {
        internId = internRows[0].id;
        await pool.execute(
          `UPDATE interns 
           SET college_name = ?, stipend = ?, project_target = 'Full Stack Development', progress = 10
           WHERE id = ?`,
          [collegeName, stipend, internId]
        );
      } else {
        internId = crypto.randomUUID();
        await pool.execute(
          `INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
           VALUES (?, ?, NULL, ?, ?, ?, ?, 'Full Stack Development', 10)`,
          [internId, userId, collegeName, stipend, startDate, endDate]
        );
      }
    }

    if (account.employeeCode) {
      const [empRows] = await pool.execute('SELECT id FROM employees WHERE user_id = ?', [userId]);
      const designation = account.designation || 'Staff';
      const dept = account.department || 'Operations';
      if (empRows.length > 0) {
        employeeId = empRows[0].id;
        await pool.execute(
          `UPDATE employees 
           SET employee_code = ?, department = ?, designation = ?
           WHERE id = ?`,
          [account.employeeCode, dept, designation, employeeId]
        );
      } else {
        employeeId = crypto.randomUUID();
        await pool.execute(
          `INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
           VALUES (?, ?, ?, ?, ?, CURDATE())`,
          [employeeId, userId, account.employeeCode, dept, designation]
        );
      }
    }

    // 4. Verification Check
    const verifyUser = await User.findByEmail(rawEmail);
    const passMatch = verifyUser ? await bcrypt.compare(account.password, verifyUser.password_hash) : false;

    verificationResults.push({
      Role: account.role,
      Email: account.email,
      Password: account.password,
      PortalUrl: account.portalUrl,
      DashboardUrl: account.dashboardUrl,
      Status: passMatch ? 'VERIFIED' : 'FAILED',
      UserId: userId
    });

    // 5. Build live SQL snippet
    const escapedEmail = encEmail.replace(/'/g, "\\'");
    const escapedName = encFullName.replace(/'/g, "\\'");
    const escapedHash = passwordHash.replace(/'/g, "\\'");
    const escapedPref = prefJson.replace(/'/g, "\\'");
    const escapedHistory = JSON.stringify([passwordHash]).replace(/'/g, "\\'");

    sqlStatements.push(`-- [${account.role}] ${account.email} (${account.fullName})`);
    sqlStatements.push(`-- Password: ${account.password} | Portal: ${account.portalUrl}`);
    sqlStatements.push(`INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('${userId}', '${escapedEmail}', '${escapedHash}', '${escapedName}', NULL, '${account.role}', 1, '${escapedPref}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = '${account.role}',
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

    if (account.role === 'INTERN') {
      const collegeName = (account.college || 'Engineering College').replace(/'/g, "\\'");
      const stipend = account.stipend || 15000;
      const startDate = new Date().toISOString().slice(0, 10);
      const endDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

      sqlStatements.push(`INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('${internId || crypto.randomUUID()}', '${userId}', NULL, '${collegeName}', ${stipend}, '${startDate}', '${endDate}', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);`);
    }

    if (account.employeeCode) {
      const designation = (account.designation || 'Staff').replace(/'/g, "\\'");
      const dept = (account.department || 'Operations').replace(/'/g, "\\'");
      sqlStatements.push(`INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('${employeeId || crypto.randomUUID()}', '${userId}', '${account.employeeCode}', '${dept}', '${designation}', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);`);
    }

    sqlStatements.push('');
  }

  sqlStatements.push('SET FOREIGN_KEY_CHECKS = 1;');

  const liveSqlPath = path.join(__dirname, 'seed-all-roles-live.sql');
  fs.writeFileSync(liveSqlPath, sqlStatements.join('\n'), 'utf8');
  console.log(`Live SQL script generated at: ${liveSqlPath}\n`);

  return verificationResults;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedAllRoles()
    .then((results) => {
      console.log('=== VERIFICATION SUMMARY ===');
      console.table(results.map(r => ({
        Role: r.Role,
        Email: r.Email,
        Password: r.Password,
        Portal: r.PortalUrl,
        Status: r.Status
      })));
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed execution error:', err);
      process.exit(1);
    });
}
