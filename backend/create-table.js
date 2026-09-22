import pool from './src/config/database.js';

async function create() {
  const sql = `
    CREATE TABLE IF NOT EXISTS email_daily_quota (
      quota_date DATE NOT NULL,
      emails_sent INT NOT NULL DEFAULT 0,
      max_limit INT NOT NULL DEFAULT 300,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (quota_date)
    ) ENGINE=InnoDB;
  `;
  await pool.query(sql);
  console.log('Successfully created email_daily_quota table!');
  const [desc] = await pool.query('DESCRIBE email_daily_quota');
  console.log(desc.map(c => c.Field + ' (' + c.Type + ')').join(', '));
  process.exit(0);
}

create().catch(err => {
  console.error(err);
  process.exit(1);
});
