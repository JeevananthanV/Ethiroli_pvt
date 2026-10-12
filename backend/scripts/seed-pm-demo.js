/**
 * Seeds Project Manager demo accounts for the PM portal quick sign-in block.
 *
 * The demo block on the login page lists only what GET /auth/demo-users
 * returns, so without rows of this role the panel shows "No demo accounts are
 * set up right now". Run this after the schema is in place:
 *
 *   node scripts/seed-pm-demo.js
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../src/config/database.js';

const DEMO_PASSWORD = process.env.PM_DEMO_PASSWORD || 'Pm@123';

// A single shared demo account, so the quick sign-in block has exactly one
// "Use" button rather than a list of near-identical people.
const PM_USER = {
  name: 'Meenakshi Iyer',
  email: 'meenakshi.iyer@ethiroli.edu',
  phone: '+91 98401 31001',
  dept: 'Project Delivery'
};

const run = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [PM_USER.email]);

  if (rows.length > 0) {
    // Re-assert the demo password so the seeded account always matches the
    // password the login page pre-fills.
    await pool.execute('UPDATE users SET password_hash = ?, is_active = 1 WHERE email = ?', [
      passwordHash,
      PM_USER.email
    ]);
    await pool.execute(
      `UPDATE user_credentials SET password_hash = ?, requires_password_change = FALSE
       WHERE user_id = ?`,
      [passwordHash, rows[0].id]
    );
    console.log(`\nPM demo account ready: ${PM_USER.email} (password reset to ${DEMO_PASSWORD})`);
    return;
  }

  await pool.execute(
    `INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
     VALUES (?, ?, ?, ?, ?, 'PROJECT_MANAGER', 1, ?)`,
    [
      crypto.randomUUID(),
      PM_USER.email,
      passwordHash,
      PM_USER.name,
      PM_USER.phone,
      JSON.stringify({ department: PM_USER.dept, demo: true })
    ]
  );
  console.log(`\nPM demo account created: ${PM_USER.email} (password ${DEMO_PASSWORD})`);
};

run()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error('PM demo seed failed:', err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  });