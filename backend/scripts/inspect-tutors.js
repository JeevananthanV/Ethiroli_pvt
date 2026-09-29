import pool from '../src/config/database.js';
import User from '../src/models/User.js';

async function listTutors() {
  const [rows] = await pool.query("SELECT id, role, is_active FROM users WHERE role IN ('TUTOR', 'SENIOR_TUTOR')");
  console.log(`Found ${rows.length} tutor(s) in DB:`);
  for (const r of rows) {
    const user = await User.findById(r.id);
    console.log({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      is_active: user.is_active
    });
  }
  process.exit(0);
}

listTutors();
