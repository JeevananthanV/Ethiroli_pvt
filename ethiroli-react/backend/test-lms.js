import pool from './src/config/database.js';
import Batch from './src/models/Batch.js';
import Doubt from './src/models/Doubt.js';
import Course from './src/models/Course.js';
import User from './src/models/User.js';

async function runLMSTests() {
  console.log('=== Starting LMS Backend Architecture & Model Test Suite ===\n');
  let failures = 0;

  // 1. Verify models load
  try {
    console.log('1. Verifying model imports...');
    if (Batch && Doubt && Course && User) {
      console.log('✅ Batch, Doubt, Course, User models loaded successfully');
    } else {
      console.error('❌ Failed to load models');
      failures++;
    }
  } catch (err) {
    console.error('❌ Model import error:', err);
    failures++;
  }

  // 2. Test Batch format logic
  try {
    console.log('\n2. Testing Batch.format logic...');
    const formattedBatch = Batch.format({
      id: 'batch-test-1',
      batch_code: 'BATCH-2026-TEST',
      name: 'Full-Stack Test Batch',
      max_capacity: 30
    });
    if (formattedBatch && formattedBatch.batch_code === 'BATCH-2026-TEST') {
      console.log('✅ Batch.format correctly structured batch object');
    } else {
      console.error('❌ Batch.format returned invalid structure:', formattedBatch);
      failures++;
    }
  } catch (err) {
    console.error('❌ Batch.format error:', err);
    failures++;
  }

  // 3. Test Doubt format logic
  try {
    console.log('\n3. Testing Doubt.format logic...');
    const formattedDoubt = Doubt.format({
      id: 'doubt-test-1',
      title: 'Redux Toolkit Async Thunk Error',
      description: 'Unhandled promise rejection in slice',
      status: 'OPEN'
    });
    if (formattedDoubt && formattedDoubt.title === 'Redux Toolkit Async Thunk Error') {
      console.log('✅ Doubt.format correctly structured doubt object');
    } else {
      console.error('❌ Doubt.format returned invalid structure:', formattedDoubt);
      failures++;
    }
  } catch (err) {
    console.error('❌ Doubt.format error:', err);
    failures++;
  }

  // 4. Verify Database connectivity
  try {
    console.log('\n4. Verifying database connection pool...');
    const [rows] = await pool.execute('SELECT 1 as test');
    if (rows[0].test === 1) {
      console.log('✅ Database connection verified');
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    failures++;
  }

  console.log('\n====================================================');
  if (failures === 0) {
    console.log('ALL LMS UNIT & ARCHITECTURAL CHECKS PASSED SUCCESSFULLY!');
  } else {
    console.error(`LMS TEST SUITE FAILED WITH ${failures} ERROR(S)`);
    process.exit(1);
  }

  await pool.end();
}

runLMSTests().catch(err => {
  console.error('Fatal LMS test execution failure:', err);
  process.exit(1);
});
