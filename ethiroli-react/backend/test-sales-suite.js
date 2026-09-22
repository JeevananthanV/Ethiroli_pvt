import SalesDeal from './src/models/SalesDeal.js';
import SalesProposal from './src/models/SalesProposal.js';
import SalesActivity from './src/models/SalesActivity.js';
import SalesTarget from './src/models/SalesTarget.js';
import CustomerHandover from './src/models/CustomerHandover.js';
import * as salesController from './src/controllers/salesController.js';
import salesRoutes from './src/routes/salesRoutes.js';
import pool from './src/config/database.js';

async function runTests() {
  console.log('=== Starting Sales Dashboard Architecture & Model Test Suite ===\n');

  // 1. Verify models
  console.log('1. Verifying Sales models...');
  if (!SalesDeal || !SalesProposal || !SalesActivity || !SalesTarget || !CustomerHandover) {
    throw new Error('Failed to load Sales models');
  }
  console.log('✅ SalesDeal, SalesProposal, SalesActivity, SalesTarget, CustomerHandover loaded successfully\n');

  // 2. Test SalesDeal formatting
  console.log('2. Testing SalesDeal.format...');
  const sampleDeal = SalesDeal.format({
    id: 'deal-101',
    title: 'Enterprise ERP License',
    deal_value: '250000.75',
    probability: '60',
    stage: 'PROPOSAL_SENT',
    owner_name: null,
    owner_email: 'sales@example.com',
    client_name: 'TechCorp Solutions'
  });
  if (typeof sampleDeal.deal_value !== 'number' || sampleDeal.deal_value !== 250000.75 || sampleDeal.probability !== 60) {
    throw new Error('SalesDeal formatting failed for numeric types');
  }
  console.log('✅ SalesDeal.format correctly cast numeric deal_value and probability\n');

  // 3. Test SalesProposal formatting & deliverables serialization
  console.log('3. Testing SalesProposal.format...');
  const sampleProposal = SalesProposal.format({
    id: 'prop-101',
    proposal_number: 'PROP-2026-001',
    title: 'Annual Maintenance Contract',
    total_amount: '450000',
    discount_percentage: '5.5',
    valid_until: '2026-10-30',
    status: 'SENT',
    deliverables: JSON.stringify([{ title: 'Phase 1: Setup', cost: 150000 }, { title: 'Phase 2: Deploy', cost: 300000 }])
  });
  if (sampleProposal.total_amount !== 450000 || sampleProposal.discount_percentage !== 5.5 || sampleProposal.deliverables.length !== 2) {
    throw new Error('SalesProposal deliverables JSON parsing or numeric conversion failed');
  }
  console.log('✅ SalesProposal deliverables and pricing properly parsed\n');

  // 4. Test SalesActivity formatting
  console.log('4. Testing SalesActivity.format...');
  const sampleActivity = SalesActivity.format({
    id: 'act-101',
    activity_type: 'CALL',
    title: 'Discovery call with CTO',
    outcome: 'CONNECTED',
    duration_minutes: '30',
    scheduled_at: '2026-09-12 11:00:00'
  });
  if (sampleActivity.duration_minutes !== 30) {
    throw new Error('SalesActivity duration_minutes casting failed');
  }
  console.log('✅ SalesActivity duration_minutes integer parsing verified\n');

  // 5. Test SalesTarget attainment calculation
  console.log('5. Testing SalesTarget.format and quota attainment...');
  const sampleTarget = SalesTarget.format({
    id: 'target-101',
    fiscal_year: '2026-27',
    period_type: 'QUARTERLY',
    period_label: 'Q2',
    target_revenue: '1000000',
    achieved_revenue: '750000',
    deals_target: '10',
    deals_won: '7'
  });
  if (sampleTarget.achievement_rate !== 75.0 || sampleTarget.deals_won !== 7) {
    throw new Error(`SalesTarget achievement rate calculation failed: expected 75, got ${sampleTarget.achievement_rate}`);
  }
  console.log('✅ SalesTarget accurately calculated 75% quota attainment\n');

  // 6. Test CustomerHandover format
  console.log('6. Testing CustomerHandover.format...');
  const sampleHandover = CustomerHandover.format({
    id: 'handover-101',
    deal_title: 'Global Cloud Migration',
    deal_value: '1200000',
    handover_to: 'PROJECT_MANAGER',
    scope_summary: 'Provisioning multi-region architecture and database sync',
    status: 'PENDING'
  });
  if (sampleHandover.deal_value !== 1200000 || sampleHandover.status !== 'PENDING') {
    throw new Error('CustomerHandover formatting failed');
  }
  console.log('✅ CustomerHandover successfully verified\n');

  // 7. Verify Sales Controller Exports
  console.log('7. Verifying salesController methods...');
  const expectedControllerMethods = [
    'getDashboardSummary',
    'getPipelineSummary',
    'listDeals',
    'getDeal',
    'createDeal',
    'updateDeal',
    'updateDealStage',
    'deleteDeal',
    'listProposals',
    'getProposal',
    'createProposal',
    'updateProposal',
    'updateProposalStatus',
    'deleteProposal',
    'listActivities',
    'getUpcomingActivities',
    'createActivity',
    'updateActivity',
    'deleteActivity',
    'listTargets',
    'createOrUpdateTarget',
    'deleteTarget',
    'listHandovers',
    'getHandover',
    'createHandover',
    'updateHandoverStatus',
    'deleteHandover',
    'getSalesReports'
  ];
  for (const method of expectedControllerMethods) {
    if (typeof salesController[method] !== 'function') {
      throw new Error(`salesController is missing method: ${method}`);
    }
  }
  console.log(`✅ All ${expectedControllerMethods.length} salesController methods verified\n`);

  // 8. Verify salesRoutes router
  console.log('8. Verifying salesRoutes Express router stack...');
  if (!salesRoutes || !salesRoutes.stack || salesRoutes.stack.length === 0) {
    throw new Error('salesRoutes stack is empty or uninitialized');
  }
  console.log(`✅ salesRoutes initialized with ${salesRoutes.stack.length} layers\n`);

  console.log('🎉 ALL SALES DASHBOARD UNIT & ARCHITECTURE TESTS PASSED SUCCESSFULLY! 🎉');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Sales Test Suite Failed:', err);
  process.exit(1);
});
