import pool from '../src/config/database.js';
import Lead from '../src/models/Lead.js';

async function checkLeads() {
  const [rows] = await pool.query('SELECT * FROM leads');
  console.log('Total leads:', rows.length);
  for (const r of rows) {
    console.log('Lead row:', Lead.formatLead(r));
  }
  process.exit(0);
}

checkLeads().catch(e => { console.error(e); process.exit(1); });
