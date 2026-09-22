import pool from '../src/config/database.js';
import ProjectMilestone from '../src/models/ProjectMilestone.js';
import ProjectSprint from '../src/models/ProjectSprint.js';
import ProjectFile from '../src/models/ProjectFile.js';
import ProjectExpense from '../src/models/ProjectExpense.js';
import * as pmController from '../src/controllers/pmController.js';
import pmRoutes from '../src/routes/pmRoutes.js';

async function runPMSuiteTests() {
  console.log('=== Starting Project Management Dashboard Architecture & Model Test Suite ===\n');
  let failures = 0;

  // 1. Verify model imports
  try {
    console.log('1. Verifying PM models...');
    if (ProjectMilestone && ProjectSprint && ProjectFile && ProjectExpense) {
      console.log('✅ ProjectMilestone, ProjectSprint, ProjectFile, ProjectExpense models loaded successfully');
    } else {
      console.error('❌ Failed to load one or more PM models');
      failures++;
    }
  } catch (err) {
    console.error('❌ Model import error:', err);
    failures++;
  }

  // 2. Test ProjectMilestone format
  try {
    console.log('\n2. Testing ProjectMilestone.format...');
    const formatted = ProjectMilestone.format({
      id: 'm-1',
      title: 'Alpha Release',
      budget_allocated: '50000.00',
      status: 'PENDING'
    });
    if (formatted && formatted.budget_allocated === 50000 && formatted.title === 'Alpha Release') {
      console.log('✅ ProjectMilestone.format correctly cast numeric budget');
    } else {
      console.error('❌ ProjectMilestone.format unexpected output:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('❌ ProjectMilestone.format error:', err);
    failures++;
  }

  // 3. Test ProjectSprint format
  try {
    console.log('\n3. Testing ProjectSprint.format...');
    const formatted = ProjectSprint.format({
      id: 's-1',
      sprint_number: '14',
      target_velocity: '45',
      actual_velocity: '38',
      status: 'ACTIVE'
    });
    if (formatted && formatted.target_velocity === 45 && formatted.actual_velocity === 38) {
      console.log('✅ ProjectSprint.format correctly processed velocity metrics');
    } else {
      console.error('❌ ProjectSprint.format unexpected output:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('❌ ProjectSprint.format error:', err);
    failures++;
  }

  // 4. Test ProjectFile format
  try {
    console.log('\n4. Testing ProjectFile.format...');
    const formatted = ProjectFile.format({
      id: 'f-1',
      file_name: 'arch.pdf',
      file_size_bytes: 4194304, // 4 MB
      category: 'SPECIFICATION'
    });
    if (formatted && formatted.file_size_formatted === '4.00 MB') {
      console.log('✅ ProjectFile.format correctly converted byte count to readable string');
    } else {
      console.error('❌ ProjectFile.format unexpected output:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('❌ ProjectFile.format error:', err);
    failures++;
  }

  // 5. Test ProjectExpense format
  try {
    console.log('\n5. Testing ProjectExpense.format...');
    const formatted = ProjectExpense.format({
      id: 'e-1',
      description: 'AWS Cluster',
      amount: '12500.50',
      category: 'CLOUD_INFRA'
    });
    if (formatted && formatted.amount === 12500.5) {
      console.log('✅ ProjectExpense.format correctly parsed decimal amount');
    } else {
      console.error('❌ ProjectExpense.format unexpected output:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('❌ ProjectExpense.format error:', err);
    failures++;
  }

  // 6. Verify controller exports
  try {
    console.log('\n6. Verifying pmController exports...');
    const expectedMethods = [
      'listProjects',
      'getProjectDetails',
      'createProject',
      'listMilestones',
      'createMilestone',
      'signoffMilestone',
      'listSprints',
      'createSprint',
      'startSprint',
      'completeSprint',
      'listFiles',
      'createFile',
      'deleteFile',
      'listExpenses',
      'createExpense',
      'approveExpense',
      'rejectExpense',
      'getPerformanceKPIs'
    ];
    let allValid = true;
    for (const m of expectedMethods) {
      if (typeof pmController[m] !== 'function') {
        console.error(`❌ Missing pmController method: ${m}`);
        allValid = false;
        failures++;
      }
    }
    if (allValid) {
      console.log(`✅ All ${expectedMethods.length} pmController methods exported properly`);
    }
  } catch (err) {
    console.error('❌ Controller export verification error:', err);
    failures++;
  }

  // 7. Verify pmRoutes router
  try {
    console.log('\n7. Verifying pmRoutes router instance...');
    if (pmRoutes && typeof pmRoutes === 'function') {
      console.log('✅ pmRoutes express router ready for gateway mount');
    } else {
      console.error('❌ pmRoutes is not a valid express router');
      failures++;
    }
  } catch (err) {
    console.error('❌ Router error:', err);
    failures++;
  }

  // 8. Database pool check
  try {
    console.log('\n8. Verifying database pool connectivity...');
    const [rows] = await pool.execute('SELECT 1 as connected');
    if (rows[0].connected === 1) {
      console.log('✅ MySQL Database pool verified and responsive');
    }
  } catch (err) {
    console.warn('⚠️ Database pool note:', err.message);
  }

  console.log('\n====================================================');
  if (failures === 0) {
    console.log('ALL PROJECT MANAGEMENT DASHBOARD UNIT & ARCHITECTURE CHECKS PASSED!');
  } else {
    console.error(`PM SUITE FAILED WITH ${failures} ERROR(S)`);
    process.exit(1);
  }

  try {
    await pool.end();
  } catch (e) {}
}

runPMSuiteTests().catch(err => {
  console.error('Fatal PM suite test execution failure:', err);
  process.exit(1);
});
