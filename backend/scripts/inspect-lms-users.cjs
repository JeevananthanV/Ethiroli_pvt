const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const get = (k, d = '') => (env.match(new RegExp('^' + k + '=(.*)$', 'm'))?.[1] ?? d).trim();

async function checkUsers() {
  const pool = await mysql.createPool({
    host: get('DB_HOST', 'localhost'),
    port: Number(get('DB_PORT', 3306)),
    user: get('DB_USER', 'root'),
    password: get('DB_PASSWORD', ''),
    database: get('DB_NAME', 'ethiroli')
  });

  const [tutors] = await pool.query("SELECT id, full_name, email, role FROM users WHERE role = 'TUTOR'");
  console.log('TUTORS:', tutors);

  const [students] = await pool.query("SELECT id, full_name, email, role FROM users WHERE role = 'STUDENT' LIMIT 15");
  console.log('STUDENTS (count ' + students.length + '):', students.map(s => ({ id: s.id, email: s.email, name: s.full_name })));

  const [existingCourses] = await pool.query("SELECT id, code, name, tutor_id FROM courses");
  console.log('EXISTING COURSES:', existingCourses);

  await pool.end();
}
checkUsers().catch(console.error);
