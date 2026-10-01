const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const get = (k, d = '') => (env.match(new RegExp('^' + k + '=(.*)$', 'm'))?.[1] ?? d).trim();

async function checkAllUsers() {
  const pool = await mysql.createPool({
    host: get('DB_HOST', 'localhost'),
    port: Number(get('DB_PORT', 3306)),
    user: get('DB_USER', 'root'),
    password: get('DB_PASSWORD', ''),
    database: get('DB_NAME', 'ethiroli')
  });

  const [users] = await pool.query("SELECT id, email, full_name, role, is_active FROM users ORDER BY role");
  console.log('TOTAL USERS:', users.length);
  console.log(users);

  await pool.end();
}
checkAllUsers().catch(console.error);
