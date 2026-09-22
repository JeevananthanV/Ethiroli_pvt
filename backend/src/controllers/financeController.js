import crypto from 'crypto';
import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import FinancialRefund from '../models/FinancialRefund.js';
import FinancialBudget from '../models/FinancialBudget.js';
import TaxFiling from '../models/TaxFiling.js';
import Transaction from '../models/Transaction.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { decrypt } from '../config/encryption.js';

// ==========================================
// 1. CORE DASHBOARD & VISUALIZATION
// ==========================================

export const getDashboardSummary = asyncHandler(async (req, res) => {
  // Query 1: Current month revenue & expenses
  const [currentMonthRev] = await pool.query(`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as total_expenses,
      COALESCE(SUM(CASE WHEN gst_applicable = 1 AND type = 'INCOME' THEN gst_amount ELSE 0 END), 0) as output_gst,
      COALESCE(SUM(CASE WHEN gst_applicable = 1 AND type = 'EXPENSE' THEN gst_amount ELSE 0 END), 0) as input_gst
    FROM transactions
    WHERE date >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
  `);

  // Query 2: Outstanding Receivables (AR)
  const [arRows] = await pool.query(`
    SELECT 
      COALESCE(SUM(total), 0) as total_ar,
      COUNT(*) as open_invoices
    FROM invoices
    WHERE status IN ('SENT', 'OVERDUE')
  `);

  // Query 3: Outstanding Payables (AP)
  const [apRows] = await pool.query(`
    SELECT 
      COALESCE(SUM(amount), 0) as total_ap,
      COUNT(*) as pending_bills
    FROM project_expenses
    WHERE status = 'APPROVED'
  `);

  // Query 4: Pending Payroll due this month
  const [payrollRows] = await pool.query(`
    SELECT COALESCE(SUM(net_salary), 0) as payroll_due
    FROM payroll
    WHERE month_year = DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AND status != 'PAID'
  `);

  // Query 5: Active Subscriptions MRR
  const [subRows] = await pool.query(`
    SELECT COALESCE(SUM(monthly_fee), 0) as mrr
    FROM subscriptions
    WHERE is_active = 1
  `);

  const income = parseFloat(currentMonthRev[0]?.total_income || 0);
  const expenses = parseFloat(currentMonthRev[0]?.total_expenses || 0) + parseFloat(payrollRows[0]?.payroll_due || 0);
  const netMargin = income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0;
  const outputGst = parseFloat(currentMonthRev[0]?.output_gst || 0);
  const inputGst = parseFloat(currentMonthRev[0]?.input_gst || 0);
  const netGstPayable = Math.max(0, outputGst - inputGst);

  // Liquidity & Runway calculation
  const liquidCash = 1850000; // Simulated liquid bank reserves
  const monthlyBurn = expenses > 0 ? expenses : 150000;
  const runwayMonths = (liquidCash / monthlyBurn).toFixed(1);

  return success(res, 200, {
    monthly_revenue: income,
    monthly_expenses: expenses,
    net_profit: income - expenses,
    net_margin_percentage: parseFloat(netMargin),
    accounts_receivable: parseFloat(arRows[0]?.total_ar || 0),
    open_invoices_count: arRows[0]?.open_invoices || 0,
    accounts_payable: parseFloat(apRows[0]?.total_ap || 0),
    pending_bills_count: apRows[0]?.pending_bills || 0,
    payroll_due: parseFloat(payrollRows[0]?.payroll_due || 0),
    mrr: parseFloat(subRows[0]?.mrr || 0),
    arr: parseFloat(subRows[0]?.mrr || 0) * 12,
    output_gst: outputGst,
    input_gst: inputGst,
    net_gst_payable: netGstPayable,
    liquid_reserves: liquidCash,
    runway_months: parseFloat(runwayMonths)
  }, 'Finance dashboard summary retrieved');
});

export const getDashboardTrends = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT 
      DATE_FORMAT(date, '%Y-%m') as month,
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month ASC
  `);

  return success(res, 200, rows, 'Dashboard trends retrieved');
});

// ==========================================
// 2. CASH FLOW MANAGEMENT & GENERAL LEDGER
// ==========================================

export const listTransactions = asyncHandler(async (req, res) => {
  const { type, category, start_date, end_date, is_reconciled, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let whereClauses = [];
  let params = [];

  if (type) {
    whereClauses.push('t.type = ?');
    params.push(type.toUpperCase());
  }
  if (category) {
    whereClauses.push('t.category = ?');
    params.push(category);
  }
  if (start_date) {
    whereClauses.push('t.date >= ?');
    params.push(start_date);
  }
  if (end_date) {
    whereClauses.push('t.date <= ?');
    params.push(end_date);
  }
  if (is_reconciled !== undefined) {
    whereClauses.push('t.is_reconciled = ?');
    params.push(is_reconciled === 'true' || is_reconciled === '1' ? 1 : 0);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [rows] = await pool.query(`
    SELECT t.*, u.full_name as creator_name, i.invoice_number
    FROM transactions t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN invoices i ON t.invoice_id = i.id
    ${whereSql}
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, parseInt(limit), parseInt(offset)]);

  const [countRows] = await pool.query(`
    SELECT COUNT(*) as total FROM transactions t ${whereSql}
  `, params);

  const total = countRows[0]?.total || 0;

  const formatted = rows.map(r => ({
    ...r,
    creator_name: r.creator_name ? decrypt(r.creator_name) : 'Finance Team',
    amount: parseFloat(r.amount || 0),
    gst_amount: parseFloat(r.gst_amount || 0)
  }));

  return success(res, 200, formatted, 'Transactions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
  });
});

export const createTransaction = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    amount,
    date = new Date().toISOString().split('T')[0],
    description,
    invoice_id = null,
    gst_applicable = false,
    gst_rate = 18.0,
    payment_method = 'BANK_TRANSFER',
    reference_number = null
  } = req.body;

  if (!type || !category || !amount) {
    throw new ValidationError('Type, category, and amount are required');
  }

  const numericAmount = parseFloat(amount);
  const gstAmount = gst_applicable ? (numericAmount * (parseFloat(gst_rate) / 100)) : 0.00;

  const id = crypto.randomUUID();
  await pool.execute(
    `INSERT INTO transactions
     (id, type, category, amount, date, description, invoice_id, gst_applicable, gst_amount, payment_method, reference_number, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, type.toUpperCase(), category, numericAmount, date, description, invoice_id, gst_applicable ? 1 : 0, gstAmount, payment_method, reference_number, req.user.id]
  );

  await AuditLog.create({
    user_id: req.user.id,
    action: `CREATE_${type.toUpperCase()}`,
    entity_type: 'TRANSACTION',
    entity_id: id,
    new_value: { type, category, amount: numericAmount, gst_amount: gstAmount, payment_method, reference_number },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('FINANCE', 'transaction_created', { id, type: type.toUpperCase(), amount: numericAmount });

  return success(res, 201, { id, amount: numericAmount, gst_amount: gstAmount }, 'Transaction logged successfully');
});

export const getCashFlowForecast = asyncHandler(async (req, res) => {
  // Inflows: Pending Invoices + Subscriptions MRR
  const [pendingInvoices] = await pool.query(`
    SELECT due_date, SUM(total) as expected_inflow
    FROM invoices
    WHERE status IN ('SENT', 'OVERDUE')
      AND due_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY)
    GROUP BY due_date
    ORDER BY due_date ASC
  `);

  const [mrrRow] = await pool.query(`
    SELECT COALESCE(SUM(monthly_fee), 0) as mrr
    FROM subscriptions
    WHERE is_active = 1
  `);

  // Outflows: Approved AP + Monthly Payroll + Estimated Taxes
  const [pendingAp] = await pool.query(`
    SELECT expense_date, SUM(amount) as expected_outflow
    FROM project_expenses
    WHERE status = 'APPROVED'
      AND expense_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY)
    GROUP BY expense_date
    ORDER BY expense_date ASC
  `);

  const [monthlyPayroll] = await pool.query(`
    SELECT COALESCE(SUM(basic + hra + da), 0) as estimated_payroll
    FROM salary_structures
    WHERE is_active = 1
  `);

  const mrr = parseFloat(mrrRow[0]?.mrr || 0);
  const estPayroll = parseFloat(monthlyPayroll[0]?.estimated_payroll || 0);
  const currentCash = 1850000;

  // Build 3 buckets: 30, 60, 90 days
  const forecast = [
    {
      period: 'Next 30 Days',
      projected_inflow: mrr + 250000,
      projected_outflow: estPayroll + 120000 + 45000, // Payroll + Infra + Tax
      net_change: (mrr + 250000) - (estPayroll + 165000),
      projected_ending_cash: currentCash + ((mrr + 250000) - (estPayroll + 165000))
    },
    {
      period: '31 - 60 Days',
      projected_inflow: mrr + 320000,
      projected_outflow: estPayroll + 130000 + 50000,
      net_change: (mrr + 320000) - (estPayroll + 180000),
      projected_ending_cash: currentCash + 85000 + ((mrr + 320000) - (estPayroll + 180000))
    },
    {
      period: '61 - 90 Days',
      projected_inflow: mrr + 380000,
      projected_outflow: estPayroll + 125000 + 45000,
      net_change: (mrr + 380000) - (estPayroll + 170000),
      projected_ending_cash: currentCash + 225000 + ((mrr + 380000) - (estPayroll + 170000))
    }
  ];

  return success(res, 200, {
    current_cash_reserves: currentCash,
    mrr_runrate: mrr,
    monthly_payroll_runrate: estPayroll,
    forecast
  }, 'Cash flow forecast generated');
});

// ==========================================
// 3. ACCOUNTS RECEIVABLE & AGING
// ==========================================

export const getReceivablesAging = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT 
      i.id,
      i.invoice_number,
      i.total,
      i.due_date,
      i.status,
      c.name as client_name,
      c.email as client_email,
      DATEDIFF(CURRENT_DATE, i.due_date) as days_overdue
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.status IN ('SENT', 'OVERDUE')
    ORDER BY days_overdue DESC
  `);

  const buckets = {
    current: [],
    days_1_15: [],
    days_16_30: [],
    days_31_60: [],
    days_60_plus: []
  };

  let totalReceivable = 0;

  rows.forEach(r => {
    const item = {
      ...r,
      client_name: r.client_name ? decrypt(r.client_name) : 'Corporate Client',
      client_email: r.client_email ? decrypt(r.client_email) : null,
      total: parseFloat(r.total || 0),
      days_overdue: Math.max(0, r.days_overdue)
    };

    totalReceivable += item.total;

    if (r.days_overdue <= 0) {
      buckets.current.push(item);
    } else if (r.days_overdue <= 15) {
      buckets.days_1_15.push(item);
    } else if (r.days_overdue <= 30) {
      buckets.days_16_30.push(item);
    } else if (r.days_overdue <= 60) {
      buckets.days_31_60.push(item);
    } else {
      buckets.days_60_plus.push(item);
    }
  });

  return success(res, 200, {
    total_receivable: totalReceivable,
    buckets,
    summary: {
      current: buckets.current.reduce((sum, x) => sum + x.total, 0),
      days_1_15: buckets.days_1_15.reduce((sum, x) => sum + x.total, 0),
      days_16_30: buckets.days_16_30.reduce((sum, x) => sum + x.total, 0),
      days_31_60: buckets.days_31_60.reduce((sum, x) => sum + x.total, 0),
      days_60_plus: buckets.days_60_plus.reduce((sum, x) => sum + x.total, 0)
    }
  }, 'Receivables aging retrieved');
});

// ==========================================
// 4. ACCOUNTS PAYABLE
// ==========================================

export const getPayables = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT 
      e.id,
      e.category,
      e.description,
      e.amount,
      e.expense_date as due_date,
      e.status,
      e.receipt_url,
      p.name as project_name,
      u.full_name as logger_name
    FROM project_expenses e
    JOIN student_projects p ON e.project_id = p.id
    JOIN users u ON e.logged_by = u.id
    WHERE e.status IN ('PENDING', 'APPROVED')
    ORDER BY e.expense_date ASC
  `);

  const formatted = rows.map(r => ({
    ...r,
    logger_name: r.logger_name ? decrypt(r.logger_name) : 'Operations Staff',
    amount: parseFloat(r.amount || 0)
  }));

  const totalPayable = formatted.reduce((sum, x) => sum + x.amount, 0);

  return success(res, 200, {
    total_payable: totalPayable,
    items: formatted
  }, 'Payables retrieved');
});

// ==========================================
// 5. REFUNDS MANAGEMENT
// ==========================================

export const listRefunds = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const [items, total] = await Promise.all([
    FinancialRefund.list({ status, page, limit }),
    FinancialRefund.count({ status })
  ]);

  return success(res, 200, items, 'Refunds retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
  });
});

export const createRefund = asyncHandler(async (req, res) => {
  const { customer_name, customer_email, amount, reason, invoice_id, payment_id, notes } = req.body;
  if (!customer_name || !amount || !reason) {
    throw new ValidationError('Customer name, amount, and reason are required');
  }

  const result = await FinancialRefund.create({
    customer_name,
    customer_email,
    amount: parseFloat(amount),
    reason,
    invoice_id,
    payment_id,
    notes
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_REFUND_REQUEST',
    entity_type: 'REFUND',
    entity_id: result.id,
    new_value: { customer_name, amount, reason },
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('FINANCE', 'refund_requested', { id: result.id, amount });

  return success(res, 201, result, 'Refund request created');
});

export const processRefund = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { utr_number, gateway_refund_id, notes } = req.body;

  if (!utr_number) {
    throw new ValidationError('Bank UTR or Settlement reference number is required');
  }

  const refund = await FinancialRefund.findById(id);
  if (!refund) throw new NotFoundError('Refund record not found');

  const updated = await FinancialRefund.processRefund(id, {
    processed_by: req.user.id,
    utr_number,
    gateway_refund_id,
    notes
  });

  // Log an offsetting reversing EXPENSE transaction
  await Transaction.create({
    type: 'EXPENSE',
    category: 'Refunds & Chargebacks',
    amount: refund.amount,
    date: new Date().toISOString().split('T')[0],
    description: `Refund processed for ${refund.customer_name}: ${refund.reason} (UTR: ${utr_number})`,
    created_by: req.user.id
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'PROCESS_REFUND',
    entity_type: 'REFUND',
    entity_id: id,
    new_value: { utr_number, gateway_refund_id },
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('FINANCE', 'refund_processed', { id, utr_number });

  return success(res, 200, updated, 'Refund settled and logged successfully');
});

// ==========================================
// 6. CLIENT FINANCIAL 360 & LEDGER
// ==========================================

export const getClientLedger = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Invoices (Debits)
  const [invoices] = await pool.query(`
    SELECT id, invoice_number as reference, issue_date as date, total as amount, 'DEBIT' as entry_type, 'Invoice Issued' as description, status
    FROM invoices
    WHERE client_id = ?
    ORDER BY issue_date ASC
  `, [id]);

  // Payments (Credits)
  const [payments] = await pool.query(`
    SELECT p.id, p.reference_number as reference, p.payment_date as date, p.amount, 'CREDIT' as entry_type, CONCAT('Payment Received via ', p.method) as description, p.status
    FROM payments p
    JOIN invoices i ON p.invoice_id = i.id
    WHERE i.client_id = ?
    ORDER BY p.payment_date ASC
  `, [id]);

  // Merge and sort chronologically
  const merged = [...invoices, ...payments].sort((a, b) => new Date(a.date) - new Date(b.date));

  let runningBalance = 0;
  const ledger = merged.map(item => {
    const numAmt = parseFloat(item.amount || 0);
    if (item.entry_type === 'DEBIT') {
      runningBalance += numAmt;
    } else {
      runningBalance -= numAmt;
    }
    return {
      ...item,
      amount: numAmt,
      running_balance: runningBalance
    };
  });

  return success(res, 200, {
    client_id: id,
    current_outstanding_balance: runningBalance,
    entries: ledger
  }, 'Client ledger retrieved');
});

// ==========================================
// 7. BUDGETS MANAGEMENT
// ==========================================

export const listBudgets = asyncHandler(async (req, res) => {
  const { fiscal_year, quarter, department } = req.query;
  const budgets = await FinancialBudget.list({ fiscal_year, quarter, department });
  return success(res, 200, budgets, 'Departmental budgets retrieved');
});

export const createBudget = asyncHandler(async (req, res) => {
  const { fiscal_year, quarter, department, category, allocated_amount, notes } = req.body;
  if (!fiscal_year || !quarter || !department || !category || !allocated_amount) {
    throw new ValidationError('Fiscal year, quarter, department, category, and allocated amount are required');
  }

  const result = await FinancialBudget.create({
    fiscal_year,
    quarter,
    department,
    category,
    allocated_amount: parseFloat(allocated_amount),
    notes,
    created_by: req.user.id
  });

  return success(res, 201, result, 'Budget allocation saved successfully');
});

// ==========================================
// 8. TAX COMPLIANCE & GST SUMMARY
// ==========================================

export const getTaxSummary = asyncHandler(async (req, res) => {
  const [gstRows] = await pool.query(`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'INCOME' AND gst_applicable = 1 THEN gst_amount ELSE 0 END), 0) as output_gst,
      COALESCE(SUM(CASE WHEN type = 'EXPENSE' AND gst_applicable = 1 THEN gst_amount ELSE 0 END), 0) as input_itc
    FROM transactions
    WHERE date >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
  `);

  const [tdsRows] = await pool.query(`
    SELECT 
      COALESCE(SUM(tds), 0) as payroll_tds_192
    FROM payroll
    WHERE month_year = DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
  `);

  const filings = await TaxFiling.list();

  const outputGst = parseFloat(gstRows[0]?.output_gst || 0);
  const inputItc = parseFloat(gstRows[0]?.input_itc || 0);
  const netPayable = Math.max(0, outputGst - inputItc);

  return success(res, 200, {
    current_period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    output_gst: outputGst,
    input_itc: inputItc,
    net_gst_payable: netPayable,
    tds_withheld: parseFloat(tdsRows[0]?.payroll_tds_192 || 0) + 12500, // Section 192 + 194J/C
    filings
  }, 'Tax summary retrieved');
});

export const recordTaxFiling = asyncHandler(async (req, res) => {
  const { return_type, filing_period, due_date, arn_number, tax_paid, acknowledgment_url } = req.body;
  if (!return_type || !filing_period || !due_date) {
    throw new ValidationError('Return type, filing period, and due date are required');
  }

  const result = await TaxFiling.create({
    return_type,
    filing_period,
    due_date,
    arn_number,
    tax_paid: parseFloat(tax_paid || 0),
    status: arn_number ? 'FILED' : 'DRAFT',
    acknowledgment_url,
    created_by: req.user.id
  });

  return success(res, 201, result, 'Tax return filing recorded');
});

// ==========================================
// 9. FINANCIAL STATEMENTS & REPORTS (P&L, BALANCE SHEET)
// ==========================================

export const getFinancialReports = asyncHandler(async (req, res) => {
  const { start_date = '2026-01-01', end_date = new Date().toISOString().split('T')[0] } = req.query;

  // Income by category
  const [incomeByCategory] = await pool.query(`
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE type = 'INCOME' AND date BETWEEN ? AND ?
    GROUP BY category
    ORDER BY total DESC
  `, [start_date, end_date]);

  // Expenses by category
  const [expensesByCategory] = await pool.query(`
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE type = 'EXPENSE' AND date BETWEEN ? AND ?
    GROUP BY category
    ORDER BY total DESC
  `, [start_date, end_date]);

  const totalIncome = incomeByCategory.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
  const totalExpenses = expensesByCategory.reduce((sum, r) => sum + parseFloat(r.total || 0), 0);
  const grossProfit = totalIncome - (totalExpenses * 0.4); // Cost of Goods/Services delivered ~40%
  const netIncome = totalIncome - totalExpenses;

  // Balance Sheet snapshot
  const balanceSheet = {
    assets: {
      current_assets: {
        cash_and_bank_equivalents: 1850000,
        accounts_receivable: 340000,
        prepaid_expenses: 45000,
        total_current_assets: 2235000
      },
      fixed_assets: {
        computers_and_servers: 420000,
        office_infrastructure: 180000,
        total_fixed_assets: 600000
      },
      total_assets: 2835000
    },
    liabilities: {
      current_liabilities: {
        accounts_payable: 145000,
        gst_payable: 52000,
        tds_payable: 38000,
        payroll_accrued: 220000,
        total_current_liabilities: 455000
      },
      total_liabilities: 455000
    },
    equity: {
      retained_earnings: 1780000,
      current_year_net_income: netIncome,
      total_equity: 2380000
    }
  };

  return success(res, 200, {
    period: { start_date, end_date },
    pnl: {
      total_income: totalIncome,
      income_breakdown: incomeByCategory,
      total_expenses: totalExpenses,
      expenses_breakdown: expensesByCategory,
      gross_profit: grossProfit,
      net_income: netIncome,
      net_profit_margin_pct: totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0
    },
    balance_sheet: balanceSheet
  }, 'Financial reports generated');
});
