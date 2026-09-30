import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import AuditLog from '../models/AuditLog.js';
import pool from '../config/database.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const listCandidates = asyncHandler(async (req, res) => {
  const { job_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Candidate.list({ job_id, status, limit: parseInt(limit), offset }),
    Candidate.count({ job_id, status })
  ]);

  return success(res, 200, items, 'Candidates retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const listCareerApplications = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM career_applications ORDER BY created_at DESC'
  );

  return success(res, 200, rows, 'Career applications retrieved successfully', {
    total: rows.length
  });
});

export const createCandidate = asyncHandler(async (req, res) => {
  let jobId = req.body.job_id;

  if (!jobId) {
    const rows = await Job.list({ limit: 1 }).catch(() => []);
    if (rows && rows.length > 0) {
      jobId = rows[0].id;
    }
  }

  const fullName = req.body.fullName || req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const role = req.body.role || 'General Application';
  const portfolioUrl = req.body.portfolioUrl || req.body.resume_url || req.body.portfolio_url;
  const experienceLevel = req.body.experienceLevel || req.body.experience_level || 'Entry';
  const message = req.body.message || '';
  const source = req.body.source || 'WEBSITE';

  if (!fullName || !email) {
    throw new ValidationError('Full name and email are required.');
  }

  // 1. Record in career_applications table
  let applicationInsertId = null;
  try {
    const [appResult] = await pool.execute(
      `INSERT INTO career_applications (full_name, email, phone, role, portfolio_url, experience_level, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [fullName, email, phone || null, role, portfolioUrl || null, experienceLevel, message]
    );
    applicationInsertId = appResult.insertId;
  } catch (err) {
    console.error('Error inserting into career_applications:', err.message);
  }

  // 2. Record in candidates table
  let candidateId = null;
  try {
    candidateId = await Candidate.create({
      job_id: jobId || null,
      name: fullName,
      email,
      phone: phone || null,
      resume_url: portfolioUrl || null,
      source
    });
  } catch (err) {
    console.error('Error inserting into candidates:', err.message);
  }

  const candidatePayload = {
    id: candidateId || applicationInsertId,
    applicationId: applicationInsertId,
    name: fullName,
    fullName,
    email,
    phone,
    role,
    portfolioUrl,
    experienceLevel,
    message,
    source,
    created_at: new Date()
  };

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CREATE_CANDIDATE',
    entity_type: 'CANDIDATE',
    entity_id: String(candidateId || applicationInsertId),
    new_value: candidatePayload,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'candidate_created', candidatePayload);
  broadcastToRole('ADMIN', 'candidate_created', candidatePayload);

  return success(res, 201, candidatePayload, 'Application submitted successfully. Our team will contact you soon.');
});

export const getCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw new NotFoundError('Candidate not found');
  return success(res, 200, candidate, 'Candidate retrieved');
});

export const updateCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw new NotFoundError('Candidate not found');
  await Candidate.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'UPDATE_CANDIDATE',
    entity_type: 'CANDIDATE',
    entity_id: req.params.id,
    old_value: candidate,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'candidate_updated', { id: req.params.id });
  return success(res, 200, null, 'Candidate updated successfully');
});

export const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) throw new NotFoundError('Candidate not found');
  await Candidate.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'DELETE_CANDIDATE',
    entity_type: 'CANDIDATE',
    entity_id: req.params.id,
    old_value: candidate,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'candidate_deleted', { id: req.params.id });
  return success(res, 200, null, 'Candidate deleted successfully');
});

export const deleteCareerApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.execute('DELETE FROM career_applications WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new NotFoundError('Career application not found');
  }

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'DELETE_CAREER_APPLICATION',
    entity_type: 'CAREER_APPLICATION',
    entity_id: String(id),
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { id }, 'Career application deleted successfully');
});

export const convertCandidateToEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { designation, department = 'Engineering', manager, joining_date, ctc } = req.body;

  let candidate = await Candidate.findById(id).catch(() => null);
  let candidateName = candidate?.name;
  let candidateEmail = candidate?.email;
  let candidatePhone = candidate?.phone;

  if (!candidateName) {
    const [rows] = await pool.query('SELECT * FROM career_applications WHERE id = ?', [id]).catch(() => [[]]);
    if (rows && rows.length > 0) {
      candidateName = rows[0].full_name;
      candidateEmail = rows[0].email;
      candidatePhone = rows[0].phone;
    }
  }

  const employeePayload = {
    id: `ETH-EMP-${Date.now().toString().slice(-4)}`,
    full_name: candidateName || 'New Employee',
    email: candidateEmail || `emp.${Date.now()}@ethiroli.net`,
    phone: candidatePhone || '',
    department: department || 'Engineering',
    designation: designation || 'Software Engineer',
    manager: manager || 'Karthik Subramanian',
    joining_date: joining_date || new Date().toISOString().split('T')[0],
    ctc: ctc || '₹ 8,00,000 PA',
    status: 'Offer Accepted'
  };

  try {
    await pool.execute(
      `INSERT INTO employees (id, full_name, email, phone, department, designation, manager, joining_date, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Offer Accepted', NOW())`,
      [employeePayload.id, employeePayload.full_name, employeePayload.email, employeePayload.phone, employeePayload.department, employeePayload.designation, employeePayload.manager, employeePayload.joining_date]
    );
  } catch (_) {}

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CONVERT_CANDIDATE_TO_EMPLOYEE',
    entity_type: 'CANDIDATE',
    entity_id: String(id),
    new_value: employeePayload,
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'candidate_converted_employee', employeePayload);

  return success(res, 200, employeePayload, 'Candidate converted to Employee successfully!');
});

export const convertCandidateToIntern = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { college, degree, department = 'Engineering', role, mentor, duration = '3 Months', start_date } = req.body;

  let candidate = await Candidate.findById(id).catch(() => null);
  let candidateName = candidate?.name;
  let candidateEmail = candidate?.email;
  let candidatePhone = candidate?.phone;

  if (!candidateName) {
    const [rows] = await pool.query('SELECT * FROM career_applications WHERE id = ?', [id]).catch(() => [[]]);
    if (rows && rows.length > 0) {
      candidateName = rows[0].full_name;
      candidateEmail = rows[0].email;
      candidatePhone = rows[0].phone;
    }
  }

  const internPayload = {
    id: `INT-2026-${Date.now().toString().slice(-3)}`,
    name: candidateName || 'New Intern',
    email: candidateEmail || `intern.${Date.now()}@gmail.com`,
    phone: candidatePhone || '',
    college: college || 'University Graduate',
    degree: degree || 'B.Tech / B.E.',
    department: department || 'Engineering',
    role: role || 'Software Engineering Intern',
    mentor: mentor || 'Vigneshwaran P.',
    duration: duration || '3 Months',
    start_date: start_date || new Date().toISOString().split('T')[0],
    status: 'Offer'
  };

  try {
    await pool.execute(
      `INSERT INTO interns (id, name, email, phone, college, degree, department, role, mentor, start_date, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Offer', NOW())`,
      [internPayload.id, internPayload.name, internPayload.email, internPayload.phone, internPayload.college, internPayload.degree, internPayload.department, internPayload.role, internPayload.mentor, internPayload.start_date]
    );
  } catch (_) {}

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CONVERT_CANDIDATE_TO_INTERN',
    entity_type: 'CANDIDATE',
    entity_id: String(id),
    new_value: internPayload,
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'candidate_converted_intern', internPayload);

  return success(res, 200, internPayload, 'Candidate converted to Intern successfully!');
});

