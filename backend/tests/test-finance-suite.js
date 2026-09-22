import FinancialRefund from '../src/models/FinancialRefund.js';
import FinancialBudget from '../src/models/FinancialBudget.js';
import TaxFiling from '../src/models/TaxFiling.js';
import * as financeController from '../src/controllers/financeController.js';
import financeRoutes from '../src/routes/financeRoutes.js';
import pool from '../src/config/database.js';

async function runTests() {
  console.log('=== Starting Finance Dashboard Architecture & Model Test Suite ===\n');

  // 1. Verify models
  console.log('1. Verifying Finance models...');
  if (!FinancialRefund || !FinancialBudget || !TaxFiling) {
    throw new Error('Failed to load Finance models');
  }
  console.log('✅ FinancialRefund, FinancialBudget, TaxFiling models loaded successfully\n');

  // 2. Test FinancialRefund formatting
  console.log('2. Testing FinancialRefund.format...');
  const sampleRefund = FinancialRefund.format({
    id: 'test-123',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul@example.com',
    amount: '4500.50',
    reason: 'Duplicate payment',
    status: 'PENDING'
  });
  if (typeof sampleRefund.amount !== 'number' || sampleRefund.amount !== 4500.50) {
    throw new Error('FinancialRefund amount formatting failed');
  }
  console.log('✅ FinancialRefund.format correctly cast numeric amount\n');

  // 3. Test FinancialBudget formatting & variance calculation
  console.log('3. Testing FinancialBudget.format...');
  const sampleBudget = FinancialBudget.format({
    id: 'budget-123',
    fiscal_year: '2026-27',
    quarter: 'Q2',
    department: 'ENGINEERING',
    category: 'Cloud Infrastructure',
    allocated_amount: '500000',
    spent_amount: '350000'
  });
  if (sampleBudget.variance !== 150000 || sampleBudget.utilization_percentage !== 70.0) {
    throw new Error('FinancialBudget variance/utilization calculation failed');
  }
  console.log('✅ FinancialBudget.format correctly computed variance and 70% utilization\n');

  // 4. Test TaxFiling formatting
  console.log('4. Testing TaxFiling.format...');
  const sampleTax = TaxFiling.format({
    id: 'tax-123',
    return_type: 'GSTR1',
    filing_period: 'August 2026',
    due_date: '2026-09-11',
    tax_payable: '184500',
    tax_paid: '184500',
    status: 'FILED'
  });
  if (sampleTax.tax_payable !== 184500 || sampleTax.tax_paid !== 184500) {
    throw new Error('TaxFiling decimal parsing failed');
  }
  console.log('✅ TaxFiling.format correctly processed statutory tax figures\n');

  // 5. Verify financeController exports
  console.log('5. Verifying financeController exports...');
  const requiredMethods = [
    'getDashboardSummary',
    'getDashboardTrends',
    'listTransactions',
    'createTransaction',
    'getCashFlowForecast',
    'getReceivablesAging',
    'getPayables',
    'listRefunds',
    'createRefund',
    'processRefund',
    'getClientLedger',
    'listBudgets',
    'createBudget',
    'getTaxSummary',
    'recordTaxFiling',
    'getFinancialReports'
  ];

  requiredMethods.forEach(method => {
    if (typeof financeController[method] !== 'function') {
      throw new Error(`financeController is missing method: ${method}`);
    }
  });
  console.log(`✅ All ${requiredMethods.length} financeController methods exported properly\n`);

  // 6. Verify financeRoutes router instance
  console.log('6. Verifying financeRoutes router instance...');
  if (!financeRoutes || typeof financeRoutes !== 'function') {
    throw new Error('financeRoutes router export is invalid');
  }
  console.log('✅ financeRoutes express router ready for gateway mount\n');

  // 7. Verify database connection
  console.log('7. Verifying database pool connectivity...');
  const [dbResult] = await pool.query('SELECT 1 as is_connected');
  if (!dbResult || dbResult[0]?.is_connected !== 1) {
    throw new Error('Database ping check failed');
  }
  console.log('✅ MySQL Database pool verified and responsive\n');

  console.log('====================================================');
  console.log('ALL FINANCIAL MANAGEMENT DASHBOARD UNIT & ARCHITECTURE CHECKS PASSED!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
