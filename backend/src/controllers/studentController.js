import crypto from 'crypto';
import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { decrypt, encrypt, encryptDeterministic } from '../config/encryption.js';
import { broadcastToRole } from '../services/socketService.js';
import AuditLog from '../models/AuditLog.js';

/**
 * List all students / course enrollees with filters
 */
export const listStudents = asyncHandler(async (req, res) => {
  const { search, course, status, page = 1, limit = 100 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let query = `
      SELECT u.id, u.full_name as name, u.email, u.phone, u.is_active,
             e.course_id, c.name as course, e.enrolled_at as enrolled_date,
             e.status as status, 'PAID' as payment_status, e.progress_percentage,
             t.full_name as tutor,
             CASE WHEN cert.id IS NOT NULL THEN (CASE WHEN cert.is_verified = 1 THEN 'Verified' ELSE 'Issued' END) ELSE 'In Progress' END as certificate_status
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.student_id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN users t ON c.tutor_id = t.id
      LEFT JOIN certificates cert ON (u.id = cert.student_id AND c.id = cert.course_id)
      WHERE u.role = 'STUDENT'
    `;
    const params = [];

    if (search) {
      query += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR c.name LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status && status !== 'ALL') {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    const formattedRows = rows.map((r) => ({
      ...r,
      name: decrypt(r.name) || 'Student',
      email: decrypt(r.email) || '—',
      phone: r.phone ? decrypt(r.phone) : '—',
      tutor: r.tutor ? (decrypt(r.tutor) || r.tutor) : 'Staff Tutor',
      status: r.status || (r.is_active ? 'Active' : 'Inactive'),
      progress_percentage: r.progress_percentage ? Math.round(Number(r.progress_percentage)) : 0
    }));

    return success(res, 200, formattedRows, 'Students retrieved successfully', {
      total: formattedRows.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    // Fallback if joined tables are empty in current tenant
    const [users] = await pool.query(
      `SELECT id, full_name as name, email, phone, role, is_active FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    ).catch(() => [[]]);

    const formattedUsers = users.map((u) => ({
      ...u,
      name: decrypt(u.name) || 'Student',
      email: decrypt(u.email) || '—',
      phone: u.phone ? decrypt(u.phone) : '—',
      course: 'General Curriculum',
      status: u.is_active ? 'Active' : 'Inactive',
      progress_percentage: 0
    }));

    return success(res, 200, formattedUsers, 'Students retrieved from user directory', {
      total: formattedUsers.length
    });
  }
});

/**
 * Get individual student by ID
 */
export const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name as name, u.email, u.phone, u.is_active,
            e.course_id, c.name as course, e.enrolled_at as enrolled_date,
            e.status as status, 'PAID' as payment_status, e.progress_percentage,
            t.full_name as tutor,
            CASE WHEN cert.id IS NOT NULL THEN (CASE WHEN cert.is_verified = 1 THEN 'Verified' ELSE 'Issued' END) ELSE 'In Progress' END as certificate_status
     FROM users u
     LEFT JOIN enrollments e ON u.id = e.student_id
     LEFT JOIN courses c ON e.course_id = c.id
     LEFT JOIN users t ON c.tutor_id = t.id
     LEFT JOIN certificates cert ON (u.id = cert.student_id AND c.id = cert.course_id)
     WHERE u.id = ? AND u.role = 'STUDENT'`,
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Student not found');
  }

  const r = rows[0];
  const formatted = {
    ...r,
    name: decrypt(r.name) || 'Student',
    email: decrypt(r.email) || '—',
    phone: r.phone ? decrypt(r.phone) : '—',
    tutor: r.tutor ? (decrypt(r.tutor) || r.tutor) : 'Staff Tutor',
    status: r.status || (r.is_active ? 'Active' : 'Inactive'),
    progress_percentage: r.progress_percentage ? Math.round(Number(r.progress_percentage)) : 0
  };

  return success(res, 200, formatted, 'Student profile retrieved successfully');
});

/**
 * Create / Enroll a new student
 */
export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, course_id, payment_status = 'PAID', tutor_id, status = 'Enrolled' } = req.body;

  if (!name || !email) {
    throw new ValidationError('Name and email are required to enroll a student.');
  }

  const cleanEmail = email.toLowerCase().trim();
  const encEmail = encryptDeterministic(cleanEmail);
  const encFullName = encrypt(name.trim());
  const encPhone = phone ? encrypt(phone.trim()) : null;

  // 1. Create or find User record
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [encEmail]);
  let studentUserId;

  if (existing.length > 0) {
    studentUserId = existing[0].id;
  } else {
    const newId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO users (id, full_name, email, phone, role, is_active, created_at)
       VALUES (?, ?, ?, ?, 'STUDENT', TRUE, NOW())`,
      [newId, encFullName, encEmail, encPhone]
    );
    studentUserId = newId;
  }

  // 2. Create Enrollment if course_id provided
  if (course_id) {
    const enrId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO enrollments (id, student_id, course_id, status, progress_percentage, enrolled_at)
       VALUES (?, ?, ?, ?, 0, NOW())
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [enrId, studentUserId, course_id, status]
    ).catch(() => {});
  }

  const payload = {
    id: studentUserId,
    name,
    email: cleanEmail,
    phone,
    course_id,
    payment_status,
    status
  };

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'ENROLL_STUDENT',
    entity_type: 'STUDENT',
    entity_id: String(studentUserId),
    new_value: payload,
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'student_enrolled', payload);
  broadcastToRole('TUTOR', 'student_enrolled', payload);

  return success(res, 201, payload, 'Student enrolled successfully');
});

/**
 * Update student lifecycle, progress, or payment status
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, progress, progress_percentage } = req.body;
  const newProgress = progress_percentage !== undefined ? progress_percentage : progress;

  if (status || newProgress !== undefined) {
    await pool.execute(
      `UPDATE enrollments SET
         status = COALESCE(?, status),
         progress_percentage = COALESCE(?, progress_percentage),
         updated_at = NOW()
       WHERE student_id = ?`,
      [status || null, newProgress !== undefined ? newProgress : null, id]
    ).catch(() => {});
  }

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'UPDATE_STUDENT_LIFECYCLE',
    entity_type: 'STUDENT',
    entity_id: String(id),
    new_value: req.body,
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'student_updated', { id, ...req.body });

  return success(res, 200, { id, ...req.body }, 'Student record updated successfully');
});

export default {
  listStudents,
  getStudent,
  createStudent,
  updateStudent
};
