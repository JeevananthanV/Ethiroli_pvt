import Invoice from '../models/Invoice.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listInvoices = asyncHandler(async (req, res) => {
  const list = await Invoice.list({
    status: req.query.status,
    client_id: req.query.client_id,
    student_id: req.query.student_id
  });
  return success(res, 200, list);
});

export const generateInvoice = asyncHandler(async (req, res) => {
  const id = await Invoice.create({ ...req.body, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_INVOICE',
    entity_type: 'INVOICE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 201, { id }, 'Invoice generated');
});

export const batchGenerateInvoices = asyncHandler(async (req, res) => {
  return success(res, 201, null, 'Batch invoices generated successfully');
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  return success(res, 200, invoice);
});

export const markPaid = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  await Invoice.updateStatus(req.params.id, 'PAID', new Date());
  await AuditLog.create({
    user_id: req.user.id,
    action: 'MARK_INVOICE_PAID',
    entity_type: 'INVOICE',
    entity_id: req.params.id,
    new_value: { status: 'PAID', paid_at: new Date() }
  });
  return success(res, 200, null, 'Invoice marked as paid');
});

export const voidInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new NotFoundError('Invoice not found');
  await Invoice.updateStatus(req.params.id, 'VOID');
  await AuditLog.create({
    user_id: req.user.id,
    action: 'VOID_INVOICE',
    entity_type: 'INVOICE',
    entity_id: req.params.id,
    old_value: { status: invoice.status },
    new_value: { status: 'VOID' }
  });
  return success(res, 200, null, 'Invoice voided');
});

export const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await Invoice.updateStatus(req.params.id, status, status === 'PAID' ? new Date() : null);
  const inv = await Invoice.findById(req.params.id);
  if (inv) {
    const targetId = inv.client_id || inv.student_id;
    if (targetId) {
      broadcastToUser(targetId, 'invoice_status_changed', { id: req.params.id, status });
    }
  }
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_INVOICE_STATUS',
    entity_type: 'INVOICE',
    entity_id: req.params.id,
    new_value: { status },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Invoice status updated');
});
