import 'dotenv/config';
import pool from './src/config/database.js';

async function runVerification() {
  console.log('=== Backend Verification Suite ===\n');
  
  let passed = 0;
  let failed = 0;

  const check = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ ${name}: ${err.message}`);
      failed++;
    }
  };

  await check('Database connection', async () => {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    if (rows[0].result !== 2) throw new Error('DB query failed');
  });

  console.log('\nSummary:');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some checks failed. Review the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed!');
    process.exit(0);
  }
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
