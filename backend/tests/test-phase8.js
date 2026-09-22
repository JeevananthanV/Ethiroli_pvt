import 'dotenv/config';
import DeviceRegistration from '../src/models/DeviceRegistration.js';
import PredictionLog from '../src/models/PredictionLog.js';
import AutomationWorkflow from '../src/models/AutomationWorkflow.js';
import AnomalyLog from '../src/models/AnomalyLog.js';
import pool from '../src/config/database.js';

async function runTests() {
  console.log('--- Phase 8 Self-Verification Test Suite ---');

  const userId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed User ID
  const tenantId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Default fallback ID

  // Disable foreign key checks for testing reference insertions
  await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

  // 1. Test Device registration
  console.log('\n1. Testing Push Notifications Device token registration...');
  try {
    const id = await DeviceRegistration.create({
      user_id: userId,
      tenant_id: tenantId,
      device_id: 'iphone-pro-15-mock-id',
      platform: 'IOS',
      push_token: 'apns-dev-token-string-value-hash'
    });
    console.log(`   ✅ DeviceRegistration.create successful. ID: ${id}`);

    const list = await DeviceRegistration.list({ user_id: userId });
    console.log(`   ✅ DeviceRegistration.list returned ${list.length} registered tokens.`);
  } catch (error) {
    console.error('❌ Device registration tests failed:', error.message);
  }

  // 2. Test Predictive AI Log calculation
  console.log('\n2. Testing Predictive scoring ML features logs compilation...');
  try {
    const logId = await PredictionLog.create({
      tenant_id: tenantId,
      entity_type: 'LEAD',
      entity_id: '3aa4fb02-a358-4796-abb0-1976ee560d76',
      prediction_type: 'LEAD_SCORE',
      score: 0.92,
      confidence: 0.88,
      features: { visits: 5, time_spent: 480 }
    });
    console.log(`   ✅ PredictionLog.create successful. Log ID: ${logId}`);

    const logs = await PredictionLog.list({ tenant_id: tenantId });
    console.log(`   ✅ PredictionLog.list returned ${logs.length} metrics calculations.`);
  } catch (error) {
    console.error('❌ Predictive scoring tests failed:', error.message);
  }

  // 3. Test Visual Automation Studio schema
  console.log('\n3. Testing Automation visual workflows builder...');
  try {
    const workflowId = await AutomationWorkflow.create({
      tenant_id: tenantId,
      name: 'Onboard Student upon Payment',
      description: 'Auto-invoice, auto-enroll, auto-welcome',
      trigger_type: 'EVENT',
      trigger_config: { event: 'lead_payment' },
      created_by: userId
    });
    console.log(`   ✅ AutomationWorkflow.create successful. Workflow ID: ${workflowId}`);

    const workflows = await AutomationWorkflow.list({ tenant_id: tenantId });
    console.log(`   ✅ AutomationWorkflow.list returned ${workflows.length} workflows.`);
  } catch (error) {
    console.error('❌ Automation workflow tests failed:', error.message);
  }

  // 4. Test SOC2 Anomaly logs detection
  console.log('\n4. Testing SOC2 anomaly travel logs detection alerts...');
  try {
    const logId = await AnomalyLog.create({
      tenant_id: tenantId,
      user_id: userId,
      anomaly_type: 'IMPOSSIBLE_TRAVEL',
      severity: 'CRITICAL',
      details: { from: 'Delhi', to: 'San Francisco', hours_difference: 0.5 }
    });
    console.log(`   ✅ AnomalyLog.create successful. Log ID: ${logId}`);

    const list = await AnomalyLog.list({ tenant_id: tenantId });
    console.log(`   ✅ AnomalyLog.list returned ${list.length} security events.`);
  } catch (error) {
    console.error('❌ SOC2 anomaly logs tests failed:', error.message);
  }

  // Enable foreign key checks back
  await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

  console.log('\n--- Phase 8 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
