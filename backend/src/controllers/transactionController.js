import Transaction from '../models/Transaction.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listTransactions = asyncHandler(async (req, res) => {
  const { type, category, start_date, end_date, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Transaction.list({ type, category, start_date, end_date, limit: parseInt(limit), offset }),
    Transaction.count({ type, category, start_date, end_date })
  ]);

  return success(res, 200, items, 'Transactions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const logIncome = asyncHandler(async (req, res) => {
  const id = await Transaction.create({ ...req.body, type: 'INCOME', created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_INCOME',
    entity_type: 'TRANSACTION',
    entity_id: id,
    new_value: { ...req.body, type: 'INCOME', created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'transaction_created', { id, type: 'INCOME' });
  return success(res, 201, { id }, 'Income logged successfully');
});

export const logExpense = asyncHandler(async (req, res) => {
  const id = await Transaction.create({ ...req.body, type: 'EXPENSE', created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_EXPENSE',
    entity_type: 'TRANSACTION',
    entity_id: id,
    new_value: { ...req.body, type: 'EXPENSE', created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'transaction_created', { id, type: 'EXPENSE' });
  return success(res, 201, { id }, 'Expense logged successfully');
});

export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) throw new NotFoundError('Transaction not found');
  return success(res, 200, transaction, 'Transaction retrieved');
});
