import crypto from 'crypto';
import pool from '../config/database.js';
import Certificate from '../models/Certificate.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors.js';

const LEARNER_ROLES = new Set(['STUDENT', 'INTERN', 'EMPLOYEE']);
const DEFAULT_PAGE_SIZE = 50;

const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: limit > 0 ? Math.ceil(total / limit) : 1
});

export const listCertificates = asyncHandler(async (req, res) => {
  const { student_id, course_id, page = 1, limit = DEFAULT_PAGE_SIZE } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limitNum;

  // Learners may only ever list their own certificates.
  const ownerId = LEARNER_ROLES.has(req.user.role) ? req.user.id : (student_id || req.user.id);

  const [items, total] = await Promise.all([
    Certificate.listWithDetails({ student_id: ownerId, course_id, limit: limitNum, offset }),
    Certificate.count({ student_id: ownerId, course_id })
  ]);

  res.locals.meta = buildMeta(pageNum, limitNum, total);
  return success(res, 200, items, 'Certificates retrieved');
});

export const generateCertificate = asyncHandler(async (req, res) => {
  const studentId = req.body.student_id || req.user.id;
  const courseId = req.body.course_id;

  if (!courseId) throw new ValidationError('course_id is required');

  const alreadyIssued = await Certificate.findByStudentAndCourse(studentId, courseId);
  if (alreadyIssued) {
    return success(res, 200, alreadyIssued, 'Certificate already issued for this course');
  }

  // Resolve the enrollment the certificate hangs off (required by the schema).
  const [enrollmentRows] = await pool.execute(
    `SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?`,
    [studentId, courseId]
  );
  if (enrollmentRows.length === 0) {
    throw new ValidationError('Learner is not enrolled in this course');
  }

  const certificateNumber = req.body.certificate_number
    || `ETH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const id = await Certificate.create({
    enrollment_id: enrollmentRows[0].id,
    student_id: studentId,
    course_id: courseId,
    certificate_number: certificateNumber,
    issue_date: req.body.issue_date || new Date().toISOString().slice(0, 10),
    expiry_date: req.body.expiry_date || null,
    pdf_url: req.body.pdf_url || `certificates/${certificateNumber}.pdf`,
    qr_code_url: req.body.qr_code_url || null,
    is_verified: req.body.is_verified !== false
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'GENERATE_CERTIFICATE',
    entity_type: 'CERTIFICATE',
    entity_id: id,
    new_value: { student_id: studentId, course_id: courseId, certificate_number: certificateNumber },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('TUTOR', 'certificate_generated', { id });
  broadcastToRole('STUDENT', 'certificate_issued', { certificate_id: id, course_id: courseId, student_id: studentId });

  const certificate = await Certificate.findByIdWithDetails(id);
  return success(res, 201, certificate, 'Certificate generated successfully');
});

export const getCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByIdWithDetails(req.params.id);
  if (!certificate) throw new NotFoundError('Certificate not found');

  if (LEARNER_ROLES.has(req.user.role) && certificate.student_id !== req.user.id) {
    throw new AuthorizationError('You can only view your own certificates');
  }

  return success(res, 200, certificate, 'Certificate retrieved');
});

/**
 * Public registry lookup - registered ahead of `authenticate` so shareable
 * verification links work without a session. Returns a sanitized payload
 * (no contact details) so a certificate number cannot be used to harvest PII.
 */
export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByCodeWithDetails(req.params.code);
  if (!certificate) throw new NotFoundError('Invalid certificate code');

  return success(res, 200, {
    certificate_number: certificate.certificate_number,
    is_authentic: Boolean(certificate.is_verified),
    issue_date: certificate.issue_date,
    expiry_date: certificate.expiry_date,
    course_name: certificate.course_name,
    course_code: certificate.course_code,
    student_name: certificate.student_name,
    tutor_name: certificate.tutor_name,
    verified_at: new Date().toISOString()
  }, 'Certificate verified');
});

export const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByIdWithDetails(req.params.id);
  if (!certificate) throw new NotFoundError('Certificate not found');

  if (LEARNER_ROLES.has(req.user.role) && certificate.student_id !== req.user.id) {
    throw new AuthorizationError('You can only download your own certificates');
  }

  // The certificate is rendered client-side from this payload (print-to-PDF),
  // so the download is always available even when no stored file exists.
  return success(
    res,
    200,
    {
      ...certificate,
      download_url: `/api/v1/certificates/${certificate.id}/download`,
      verification_url: `/api/v1/certificates/verify/${certificate.certificate_number}`,
      issued_on: certificate.issue_date
        ? new Date(certificate.issue_date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
          })
        : null
    },
    'Download link generated'
  );
});
