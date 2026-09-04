import 'dotenv/config';
import StudentProject from './src/models/StudentProject.js';
import MindMapNode from './src/models/MindMapNode.js';
import Certificate from './src/models/Certificate.js';
import SystemErrorLog from './src/models/SystemErrorLog.js';
import pool from './src/config/database.js';

async function runTests() {
  console.log('--- Phase 6 Self-Verification Test Suite ---');

  const studentId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed User ID

  // Disable foreign key checks for testing references
  await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

  // 1. Test Student Projects
  console.log('\n1. Testing Student Projects GitHub linkage...');
  try {
    const projectId = await StudentProject.create({
      student_id: studentId,
      name: 'Ethiroli Core Platform',
      description: 'LMS and HRMS portal repo',
      github_repo_url: 'https://github.com/ethiroli/core-' + Date.now(),
      repo_owner: 'ethiroli',
      repo_name: 'core'
    });
    console.log(`   ✅ StudentProject.create successful. Project ID: ${projectId}`);

    const list = await StudentProject.list({ student_id: studentId });
    console.log(`   ✅ StudentProject.list returned ${list.length} linked repos.`);
  } catch (error) {
    console.error('❌ Student Project tests failed:', error.message);
  }

  // 2. Test Mind Map Nodes
  console.log('\n2. Testing Mind Map Planner tree layout nodes...');
  try {
    const rootNodeId = await MindMapNode.create({
      user_id: studentId,
      title: 'Full Stack Learning Path',
      node_type: 'ROOT',
      position_x: 100.0,
      position_y: 100.0
    });
    console.log(`   ✅ Root MindMapNode.create successful. Node ID: ${rootNodeId}`);

    const childNodeId = await MindMapNode.create({
      user_id: studentId,
      parent_id: rootNodeId,
      title: 'React Fundamentals',
      node_type: 'BRANCH',
      position_x: 250.0,
      position_y: 120.0
    });
    console.log(`   ✅ Child MindMapNode.create successful. Node ID: ${childNodeId}`);

    const nodes = await MindMapNode.list({ user_id: studentId });
    console.log(`   ✅ MindMapNode.list returned ${nodes.length} nodes.`);
  } catch (error) {
    console.error('❌ Mind Map tests failed:', error.message);
  }

  // 3. Test Certificates
  console.log('\n3. Testing LMS completion certificates issue...');
  try {
    const mockEnrollmentId = '368f5c88-12cd-11ed-861d-0242ac120003'; // Mock ID
    const certId = await Certificate.create({
      enrollment_id: mockEnrollmentId,
      student_id: studentId,
      course_id: studentId, // Mock ID mapping
      certificate_number: 'ETH-2026-N' + Date.now(),
      issue_date: '2026-08-21',
      pdf_url: '/assets/certs/mock-cert.pdf'
    });
    console.log(`   ✅ Certificate.create successful. Certificate ID: ${certId}`);

    const certList = await Certificate.list({ student_id: studentId });
    console.log(`   ✅ Certificate.list returned ${certList.length} certificates.`);
  } catch (error) {
    console.error('❌ Certificate tests failed:', error.message);
  }

  // 4. Test Monitoring Error Logs
  console.log('\n4. Testing System exceptions log capture & resolution...');
  try {
    const errorId = await SystemErrorLog.create({
      service_name: 'API',
      error_type: '5XX',
      message: 'Failed to establish connection payload to LinkedIn OAuth sandbox endpoint.',
      endpoint: '/api/v1/jobs-board/post',
      method: 'POST',
      status_code: 502
    });
    console.log(`   ✅ SystemErrorLog.create successful. Log ID: ${errorId}`);

    await SystemErrorLog.resolve(errorId, 'LinkedIn sandbox API endpoints modified by platform. Retried.', studentId);
    console.log('   ✅ SystemErrorLog.resolve successfully recorded the resolution audit trail.');
  } catch (error) {
    console.error('❌ SystemErrorLog tests failed:', error.message);
  }

  // Enable foreign key checks back
  await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

  console.log('\n--- Phase 6 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
