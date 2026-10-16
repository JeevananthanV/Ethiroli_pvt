import pool from '../src/config/database.js';
import bcrypt from 'bcryptjs';

async function checkPasswords() {
  const [users] = await pool.query(
    "SELECT id, email, password_hash FROM users WHERE id IN ('66da1638-9a06-4741-9ed2-8054b0417313', 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', 'a25602e3-ecd5-4fbf-a833-284bf9d36909')"
  );

  const testPasswords = ['Intern@123', 'Sales@123', 'Employee@123', 'Admin@123'];
  for (const u of users) {
    console.log(`Checking user ID ${u.id}...`);
    for (const p of testPasswords) {
      const match = await bcrypt.compare(p, u.password_hash);
      if (match) {
        console.log(`  MATCH: ${p}`);
      }
    }
  }
  process.exit(0);
}

checkPasswords().catch(e => { console.error(e); process.exit(1); });
