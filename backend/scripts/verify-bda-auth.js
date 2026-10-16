import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

async function testAuth() {
  console.log('Testing BDA credentials directly:');
  
  const testUsers = [
    { email: 'mathishree008@gmail.com', role: 'SALES' },
    { email: 'knandhinivnr@gmail.com', role: 'SALES' },
    { email: 'sales@ethiroli.com', role: 'SALES' }
  ];

  for (const t of testUsers) {
    const user = await User.findByEmail(t.email);
    if (!user) {
      console.error(`User not found: ${t.email}`);
      continue;
    }

    const matchSales = await bcrypt.compare('Sales@123', user.password_hash);
    const matchIntern = await bcrypt.compare('Intern@123', user.password_hash);

    console.log(`User: ${t.email}`);
    console.log(`  Role in DB: ${user.role}`);
    console.log(`  Preferences:`, user.preferences);
    console.log(`  Password 'Sales@123' match: ${matchSales}`);
    console.log(`  Password 'Intern@123' match: ${matchIntern}`);
  }

  // Check leads API query directly
  const [leads] = await pool.query('SELECT COUNT(*) as total FROM leads');
  console.log(`\nDirect DB Leads count: ${leads[0].total}`);

  const [sample] = await pool.query('SELECT company_name, first_name, phone, notes FROM leads LIMIT 5');
  console.log('Sample leads from DB:');
  for (const s of sample) {
    console.log(`- ${s.company_name} | ${s.first_name} | ${s.notes}`);
  }

  process.exit(0);
}

testAuth().catch(e => { console.error(e); process.exit(1); });
