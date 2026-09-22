import 'dotenv/config';
import { encrypt, decrypt, encryptDeterministic } from '../src/config/encryption.js';
import User from '../src/models/User.js';
import Lead from '../src/models/Lead.js';
import pool from '../src/config/database.js';

async function runTests() {
  console.log('--- Phase 1 Self-Verification Test Suite ---');
  
  // 1. Test Encryption
  console.log('\n1. Testing Encryption & Decryption...');
  const testText = 'Hello World PII Email Address';
  const encryptedRandom = encrypt(testText);
  const decryptedRandom = decrypt(encryptedRandom);
  
  if (decryptedRandom === testText) {
    console.log('✅ Randomized Encryption/Decryption passed.');
  } else {
    console.error('❌ Randomized Encryption/Decryption failed.');
  }

  const deterministic1 = encryptDeterministic(testText);
  const deterministic2 = encryptDeterministic(testText);
  if (deterministic1 === deterministic2) {
    console.log('✅ Deterministic Encryption passed (same outputs for same inputs).');
  } else {
    console.error('❌ Deterministic Encryption failed.');
  }

  // 2. Test DB connection
  console.log('\n2. Testing Database connection pool...');
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    if (rows[0].result === 2) {
      console.log('✅ Database connection pool verified successfully.');
    }
  } catch (error) {
    console.error('❌ Database connection failed. Ensure MySQL is running:', error.message);
  }

  // 3. Test Models
  console.log('\n3. Testing User model...');
  try {
    const superAdmin = await User.findByEmail('admin@ethiroli.com');
    if (superAdmin) {
      console.log('✅ User.findByEmail successfully found the default SUPER_ADMIN.');
      console.log(`   Full Name (decrypted): ${superAdmin.full_name}`);
      console.log(`   Role: ${superAdmin.role}`);
    } else {
      console.log('⚠️ SUPER_ADMIN not found in DB. Seeding may run on server startup.');
    }
  } catch (error) {
    console.error('❌ User model query failed:', error.message);
  }

  console.log('\n--- Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
