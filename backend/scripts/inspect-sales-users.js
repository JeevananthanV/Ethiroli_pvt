import pool from '../src/config/database.js';
import { decrypt } from '../src/config/encryption.js';

async function main() {
  const [users] = await pool.query('SELECT id, full_name, email, role, preferences FROM users');
  console.log(`Total users in DB: ${users.length}`);

  const decryptedUsers = users.map(u => ({
    id: u.id,
    full_name: decrypt(u.full_name),
    email: decrypt(u.email),
    role: u.role,
    preferences: u.preferences
  }));

  const salesRelated = decryptedUsers.filter(u => 
    (u.email && (u.email.includes('mathi') || u.email.includes('nandhini') || u.email.includes('sales'))) ||
    (u.full_name && (u.full_name.toLowerCase().includes('mathi') || u.full_name.toLowerCase().includes('nandhini'))) ||
    u.role === 'SALES'
  );

  console.log('Sales / BDA related users:', JSON.stringify(salesRelated, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
