import EmployeeDocument from '../models/EmployeeDocument.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listDocuments = asyncHandler(async (req, res) => {
  const { employee_id, document_type, status, limit = 50, offset = 0 } = req.query;
  const list = await EmployeeDocument.list({
    employee_id,
    document_type,
    status,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });
  return success(res, 200, list);
});

export const uploadDocument = asyncHandler(async (req, res) => {
  const { employee_id, document_type, title, file_url, file_size_bytes, mime_type } = req.body;
  const id = await EmployeeDocument.create({
    employee_id,
    document_type,
    title,
    file_url,
    file_size_bytes,
    mime_type,
    uploaded_by: req.user.id
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPLOAD_EMPLOYEE_DOCUMENT',
    entity_type: 'DOCUMENT',
    entity_id: id,
    new_value: { employee_id, document_type, title },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, { id }, 'Document uploaded successfully');
});

export const getDocument = asyncHandler(async (req, res) => {
  const doc = await EmployeeDocument.findById(req.params.id);
  if (!doc) throw new NotFoundError('Document not found');
  return success(res, 200, doc);
});

export const verifyDocument = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'VERIFIED' or 'REJECTED'
  const doc = await EmployeeDocument.findById(req.params.id);
  if (!doc) throw new NotFoundError('Document not found');

  await EmployeeDocument.update(req.params.id, {
    status: status || 'VERIFIED',
    verified_by: req.user.id,
    verified_at: new Date()
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'VERIFY_EMPLOYEE_DOCUMENT',
    entity_type: 'DOCUMENT',
    entity_id: req.params.id,
    new_value: { status },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, `Document status updated to ${status || 'VERIFIED'}`);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await EmployeeDocument.findById(req.params.id);
  if (!doc) throw new NotFoundError('Document not found');
  await EmployeeDocument.delete(req.params.id);
  return success(res, 200, null, 'Document deleted successfully');
});

export default {
  listDocuments,
  uploadDocument,
  getDocument,
  verifyDocument,
  deleteDocument
};
