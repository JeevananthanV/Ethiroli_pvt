import pool from '../src/config/database.js';
import { decrypt } from '../src/config/encryption.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function checkStudents() {
  const [students] = await pool.execute("SELECT id, email, role, full_name, is_active FROM users WHERE role = 'STUDENT' LIMIT 5");
  
  if (students.length === 0) {
    console.log('No student user found. Creating dedicated student account student@ethiroli.com ...');
    const passwordHash = await bcrypt.hash('Student@123', 12);
    const studentId = crypto.randomUUID();
    await pool.execute(
      "INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 'STUDENT', 1)",
      [studentId, 'student@ethiroli.com', passwordHash, 'Ethiroli Student']
    );
    console.log('Created student@ethiroli.com / Student@123');
  } else {
    console.log('Existing Student Accounts:');
    for (const s of students) {
      let decEmail = s.email;
      let decName = s.full_name;
      try { decEmail = decrypt(s.email) || s.email; } catch {}
      try { decName = decrypt(s.full_name) || s.full_name; } catch {}
      console.log(`- Email: ${decEmail} | Name: ${decName} | Active: ${s.is_active}`);
    }

    // Ensure student@ethiroli.com exists with password Student@123 for convenient testing
    const [demo] = await pool.execute("SELECT id FROM users WHERE email = 'student@ethiroli.com'");
    if (demo.length === 0) {
      const passwordHash = await bcrypt.hash('Student@123', 12);
      const studentId = crypto.randomUUID();
      await pool.execute(
        "INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 'STUDENT', 1)",
        [studentId, 'student@ethiroli.com', passwordHash, 'Ethiroli Student']
      );
      console.log('Also seeded demo student: student@ethiroli.com / Student@123');
    }
  }

  process.exit(0);
}

checkStudents().catch(err => {
  console.error(err);
  process.exit(1);
});
