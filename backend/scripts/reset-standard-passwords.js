import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import CredentialService from '../src/services/credentialService.js';
import bcrypt from 'bcryptjs';

const ROLE_PASSWORDS = {
  SUPER_ADMIN: 'Admin@123',
  ADMIN: 'Admin@123',
  HR: 'Hr@123',
  TUTOR: 'Tutor@123',
  INTERN: 'Intern@123',
  STUDENT: 'Student@123',
  EMPLOYEE: 'Employee@123',
  PROJECT_MANAGER: 'Pm@123',
  FINANCE: 'Finance@123',
  SALES: 'Sales@123',
  RECEPTION: 'Reception@123'
};

async function resetAllPasswords() {
  console.log('--- RESETTING ALL ROLE PASSWORDS ---');
  await CredentialService.ensureTable();

  // Clear all lockouts
  await pool.query('UPDATE user_credentials SET failed_login_attempts = 0, lockout_until = NULL');
  console.log('Cleared all account lockouts in user_credentials.');

  const [users] = await pool.query('SELECT id, email, role, full_name FROM users');
  for (const u of users) {
    const userFmt = User.format(u);
    const pass = ROLE_PASSWORDS[u.role] || 'Ethiroli@123';
    const hash = await bcrypt.hash(pass, 10);

    // Update users table
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, u.id]);

    // Update user_credentials table
    await pool.query(
      `INSERT INTO user_credentials 
       (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
       VALUES (?, ?, 'BCRYPT', NOW(), 0, NULL, FALSE, ?)
       ON DUPLICATE KEY UPDATE 
         password_hash = VALUES(password_hash),
         failed_login_attempts = 0,
         lockout_until = NULL,
         requires_password_change = FALSE`,
      [u.id, hash, JSON.stringify([hash])]
    );

    console.log(`Updated user ${userFmt.email || u.email} (${u.role}) -> Password: ${pass}`);
  }

  // Ensure standard clean accounts exist
  const standardAccounts = [
    { email: 'admin@ethiroli.com', role: 'SUPER_ADMIN', name: 'Super Administrator', pass: 'Admin@123' },
    { email: 'hr@ethiroli.com', role: 'HR', name: 'HR Manager', pass: 'Hr@123' },
    { email: 'tutor@ethiroli.com', role: 'TUTOR', name: 'Lead Tutor', pass: 'Tutor@123' },
    { email: 'intern@ethiroli.com', role: 'INTERN', name: 'Software Intern', pass: 'Intern@123' },
    { email: 'student@ethiroli.com', role: 'STUDENT', name: 'Ethiroli Student', pass: 'Student@123' },
    { email: 'employee@ethiroli.com', role: 'EMPLOYEE', name: 'Senior Developer', pass: 'Employee@123' },
    { email: 'pm@ethiroli.com', role: 'PROJECT_MANAGER', name: 'Project Manager', pass: 'Pm@123' },
    { email: 'finance@ethiroli.com', role: 'FINANCE', name: 'Finance Lead', pass: 'Finance@123' },
    { email: 'sales@ethiroli.com', role: 'SALES', name: 'Sales Director', pass: 'Sales@123' },
    { email: 'reception@ethiroli.com', role: 'RECEPTION', name: 'Front Desk', pass: 'Reception@123' }
  ];

  for (const acc of standardAccounts) {
    const existing = await User.findByEmail(acc.email);
    const hash = await bcrypt.hash(acc.pass, 10);
    if (existing) {
      await pool.query('UPDATE users SET password_hash = ?, is_active = 1 WHERE id = ?', [hash, existing.id]);
      await pool.query(
        `UPDATE user_credentials SET password_hash = ?, failed_login_attempts = 0, lockout_until = NULL WHERE user_id = ?`,
        [hash, existing.id]
      );
    } else {
      await User.create({
        email: acc.email,
        password_hash: hash,
        full_name: acc.name,
        role: acc.role
      });
    }
    console.log(`Verified Standard Account: ${acc.email} / ${acc.pass} [${acc.role}]`);
  }

  console.log('--- ALL PASSWORDS SUCCESSFULLY RESET ---');
  process.exit(0);
}

resetAllPasswords().catch(err => {
  console.error('Reset failed:', err);
  process.exit(1);
});
