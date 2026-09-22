import express from 'express';
import {
  getDashboardSummary,
  getDashboardTrends,
  listTransactions,
  createTransaction,
  getCashFlowForecast,
  getReceivablesAging,
  getPayables,
  listRefunds,
  createRefund,
  processRefund,
  getClientLedger,
  listBudgets,
  createBudget,
  getTaxSummary,
  recordTaxFiling,
  getFinancialReports
} from '../controllers/financeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN'));

// 1. Dashboard & Visualizations
router.get('/dashboard/summary', getDashboardSummary);
router.get('/dashboard/trends', getDashboardTrends);

// 2. Cash Flow & General Ledger
router.get('/transactions', listTransactions);
router.post('/transactions', createTransaction);
router.get('/cash-flow/forecast', getCashFlowForecast);

// 3. Accounts Receivable & Payable
router.get('/receivables/aging', getReceivablesAging);
router.get('/payables', getPayables);

// 4. Refunds & Settlements
router.get('/refunds', listRefunds);
router.post('/refunds', createRefund);
router.post('/refunds/:id/process', processRefund);

// 5. Client Financial 360
router.get('/clients/:id/ledger', getClientLedger);

// 6. Budgets
router.get('/budgets', listBudgets);
router.post('/budgets', createBudget);

// 7. Taxes & Compliance
router.get('/tax/summary', getTaxSummary);
router.post('/tax/filings', recordTaxFiling);

// 8. Reports (P&L, Balance Sheet)
router.get('/reports', getFinancialReports);

export default router;
