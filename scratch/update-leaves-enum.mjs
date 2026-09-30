import pool from '../backend/src/config/database.js';

async function main() {
  try {
    await pool.execute("ALTER TABLE leaves MODIFY COLUMN status ENUM('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING'");
    console.log('Successfully updated leaves status column to include CANCELLED');
  } catch (err) {
    console.error('Error updating leaves table:', err);
  } finally {
    process.exit(0);
  }
}

main();
