import Payroll from '../models/Payroll.js';
import SalaryStructure from '../models/SalaryStructure.js';
import AuditLog from '../models/AuditLog.js';
import pool from '../config/database.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listSalaryStructures = asyncHandler(async (req, res) => {
  if (req.query.employee_id) {
    const active = await SalaryStructure.findActiveByEmployeeId(req.query.employee_id);
    return success(res, 200, active ? [active] : [], 'Salary structures retrieved');
  }
  const all = await SalaryStructure.list();
  return success(res, 200, all, 'Salary structures retrieved');
});

export const createSalaryStructure = asyncHandler(async (req, res) => {
  const id = await SalaryStructure.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_SALARY_STRUCTURE',
    entity_type: 'SALARY_STRUCTURE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'salary_structure_created', { id });
  success(res, 201, { id }, 'Salary structure created');
});

export const processPayroll = asyncHandler(async (req, res) => {
  const { employee_id, month_year, basic, hra, da = 0, pf_employee = 0, pf_employer = 0, esi_employee = 0, esi_employer = 0, tds = 0 } = req.body;
  const gross = parseFloat(basic) + parseFloat(hra) + parseFloat(da);
  const totalDeductions = parseFloat(pf_employee) + parseFloat(esi_employee) + parseFloat(tds);
  const net = gross - totalDeductions;

  const id = await Payroll.create({
    employee_id, month_year, basic, hra, da,
    pf_employee, pf_employer, esi_employee, esi_employer, tds,
    gross_salary: gross, net_salary: net, total_deductions: totalDeductions,
    status: 'PROCESSED'
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'PROCESS_PAYROLL',
    entity_type: 'PAYROLL',
    entity_id: id,
    new_value: { employee_id, month_year, gross, net, total_deductions },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'payroll_processed', { id, employee_id, month_year });
  success(res, 201, { id }, 'Payroll processed');
});

export const runPayrollForAll = asyncHandler(async (req, res) => {
  const { month_year } = req.body;
  await AuditLog.create({
    user_id: req.user.id,
    action: 'RUN_PAYROLL_FOR_ALL',
    entity_type: 'PAYROLL',
    new_value: { month_year },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'bulk_payroll_run', { month_year });
  success(res, 200, { processed: 0, month_year }, 'Bulk payroll run initiated');
});

export const listPayrollHistory = asyncHandler(async (req, res) => {
  const { employee_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Payroll.list({ employee_id, limit: parseInt(limit), offset }),
    Payroll.count({ employee_id })
  ]);

  success(res, 200, items, 'Payroll history retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const generatePayslip = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findById(req.params.id);
  if (!payroll) throw new NotFoundError('Payroll record not found');

  await AuditLog.create({
    user_id: req.user.id,
    action: 'GENERATE_PAYSLIP',
    entity_type: 'PAYROLL',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'payslip_generated', { id: req.params.id });
  success(res, 200, { id: req.params.id }, 'Payslip generated successfully');
});

export const disputePayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = 'Discrepancy in hours/attendance' } = req.body;

  const payroll = await Payroll.findById(id);
  if (!payroll) throw new NotFoundError('Payroll record not found');

  await pool.query(
    `UPDATE payroll 
     SET status = 'DISPUTED', 
         dispute_reason = ?, 
         disputed_by = ?, 
         disputed_at = NOW() 
     WHERE id = ?`,
    [reason, req.user?.id || 'SYSTEM', id]
  );

  await AuditLog.create({
    user_id: req.user.id,
    action: 'DISPUTE_PAYROLL',
    entity_type: 'PAYROLL',
    entity_id: id,
    new_value: { reason, disputed_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('ADMIN', 'payroll_dispute_escalated', { id, reason, employee_id: payroll.employee_id });
  broadcastToRole('FINANCE', 'payroll_dispute_escalated', { id, reason, employee_id: payroll.employee_id });

  success(res, 200, { id, status: 'DISPUTED', reason }, 'Payroll record flagged as disputed and escalated to Admin');
});

export const resolveDispute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { adjustmentAmount = 0, resolutionNotes = 'Hours verified and adjusted by Admin' } = req.body;

  const payroll = await Payroll.findById(id);
  if (!payroll) throw new NotFoundError('Payroll record not found');

  const adj = parseFloat(adjustmentAmount) || 0;

  // ABAC Threshold Safeguard: Adjustments exceeding ₹25,000 require Super Admin authority
  if (Math.abs(adj) > 25000 && req.user?.role !== 'SUPER_ADMIN') {
    return error(
      res,
      403,
      `Threshold Policy Breach: Dispute adjustment of ₹${adj.toLocaleString()} exceeds the maximum Standard Admin approval limit of ₹25,000. Super Admin authorization required.`
    );
  }

  const newGross = parseFloat(payroll.gross_salary || 0) + adj;
  const newNet = parseFloat(payroll.net_salary || 0) + adj;

  await pool.query(
    `UPDATE payroll 
     SET status = 'PROCESSED', 
         adjustment_amount = ?, 
         gross_salary = ?, 
         net_salary = ?, 
         resolved_at = NOW() 
     WHERE id = ?`,
    [adj, newGross, newNet, id]
  );

  await AuditLog.create({
    user_id: req.user.id,
    action: 'RESOLVE_PAYROLL_DISPUTE',
    entity_type: 'PAYROLL',
    entity_id: id,
    new_value: { adjustmentAmount: adj, resolutionNotes, newGross, newNet, resolved_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('FINANCE', 'payroll_dispute_resolved', { id, adjustmentAmount: adj, newNet });
  broadcastToRole('ADMIN', 'payroll_dispute_resolved', { id, adjustmentAmount: adj, newNet });

  success(res, 200, { id, status: 'PROCESSED', adjustmentAmount: adj, newGross, newNet }, 'Payroll dispute resolved and ledger adjusted');
});

export const listDisputes = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, u.full_name as employee_name, u.email as employee_email 
     FROM payroll p 
     LEFT JOIN employees e ON p.employee_id = e.id 
     LEFT JOIN users u ON e.user_id = u.id 
     WHERE p.status = 'DISPUTED' 
     ORDER BY p.disputed_at DESC`
  );
  success(res, 200, rows, 'Disputed payroll records retrieved');
});

