import Certificate from '../models/Certificate.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listCertificates = asyncHandler(async (req, res) => {
  const { student_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Certificate.list({ student_id: student_id || req.user.id, limit: parseInt(limit), offset }),
    Certificate.count({ student_id: student_id || req.user.id })
  ]);

  return success(res, 200, items, 'Certificates retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const generateCertificate = asyncHandler(async (req, res) => {
  const id = await Certificate.create({ ...req.body, student_id: req.body.student_id || req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'GENERATE_CERTIFICATE',
    entity_type: 'CERTIFICATE',
    entity_id: id,
    new_value: { ...req.body, student_id: req.body.student_id || req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'certificate_generated', { id });
  return success(res, 201, { id }, 'Certificate generated successfully');
});

export const getCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) throw new NotFoundError('Certificate not found');
  return success(res, 200, certificate, 'Certificate retrieved');
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByCode(req.params.code);
  if (!certificate) throw new NotFoundError('Invalid certificate code');
  return success(res, 200, certificate, 'Certificate verified');
});

export const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) throw new NotFoundError('Certificate not found');
  return success(res, 200, { download_url: `/certificates/${req.params.id}/download` }, 'Download link generated');
});
