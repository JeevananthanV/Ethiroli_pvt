import pool from './src/config/database.js';

async function clear() {
  await pool.execute('DELETE FROM users');
  console.log('Cleared users table.');
  process.exit(0);
}

clear().catch(err => {
  console.error(err);
  process.exit(1);
});
