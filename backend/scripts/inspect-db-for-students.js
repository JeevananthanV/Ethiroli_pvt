import 'dotenv/config';
import pool from '../src/config/database.js';
import User from '../src/models/User.js';

async function main() {
  try {
    const [courses] = await pool.execute('SELECT * FROM courses LIMIT 10');
    console.log('Courses count:', courses.length);
    console.log('Sample courses:', courses.slice(0, 3));

    const [tutors] = await pool.execute("SELECT id, full_name, email FROM users WHERE role = 'TUTOR'");
    console.log('Tutors count:', tutors.length);
    for (const t of tutors) {
      console.log(' - Tutor:', User.format(t));
    }

    const [existingStudents] = await pool.execute("SELECT id, full_name, email FROM users WHERE role = 'STUDENT'");
    console.log('Existing students count:', existingStudents.length);
    for (const s of existingStudents) {
      const formatted = User.format(s);
      console.log(' - Student:', formatted.full_name, formatted.email);
    }

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
