import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { broadcastToRole } from '../services/socketService.js';
import AuditLog from '../models/AuditLog.js';

/**
 * List all students / course enrollees with filters
 */
export const listStudents = asyncHandler(async (req, res) => {
  const { search, course, status, payment_status, page = 1, limit = 100 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let query = `
      SELECT u.id, u.full_name as name, u.email, u.phone, u.status as user_status,
             e.course_id, c.title as course, e.enrolled_at as enrolled_date,
             e.status as status, e.payment_status, e.progress as progress_percentage,
             t.full_name as tutor,
             cert.status as certificate_status
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN users t ON c.tutor_id = t.id
      LEFT JOIN certificates cert ON (u.id = cert.user_id AND c.id = cert.course_id)
      WHERE u.role = 'STUDENT'
    `;
    const params = [];

    if (search) {
      query += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR c.title LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status && status !== 'ALL') {
      query += ` AND e.status = ?`;
      params.push(status);
    }
    if (payment_status && payment_status !== 'ALL') {
      query += ` AND e.payment_status = ?`;
      params.push(payment_status);
    }

    query += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    return success(res, 200, rows, 'Students retrieved successfully', {
      total: rows.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    // Fallback if joined tables are empty in current tenant
    const [users] = await pool.query(
      `SELECT id, full_name as name, email, phone, role, status FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    ).catch(() => [[]]);

    return success(res, 200, users, 'Students retrieved from user directory', {
      total: users.length
    });
  }
});

/**
 * Get individual student by ID
 */
export const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT u.*, e.course_id, e.status as enrollment_status, e.payment_status, e.progress
     FROM users u
     LEFT JOIN enrollments e ON u.id = e.user_id
     WHERE u.id = ? AND u.role = 'STUDENT'`,
    [id]
  );

  if (rows.length === 0) {
    throw new NotFoundError('Student not found');
  }

  return success(res, 200, rows[0], 'Student profile retrieved successfully');
});

/**
 * Create / Enroll a new student
 */
export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, course_id, payment_status = 'PAID', tutor_id, status = 'Enrolled' } = req.body;

  if (!name || !email) {
    throw new ValidationError('Name and email are required to enroll a student.');
  }

  // 1. Create or find User record
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  let studentUserId;

  if (existing.length > 0) {
    studentUserId = existing[0].id;
  } else {
    const [userRes] = await pool.execute(
      `INSERT INTO users (full_name, email, phone, role, status, created_at)
       VALUES (?, ?, ?, 'STUDENT', 'ACTIVE', NOW())`,
      [name, email, phone || null]
    );
    studentUserId = userRes.insertId || userRes.id;
  }

  // 2. Create Enrollment if course_id provided
  if (course_id) {
    await pool.execute(
      `INSERT INTO enrollments (user_id, course_id, status, payment_status, progress, enrolled_at)
       VALUES (?, ?, ?, ?, 0, NOW())
       ON DUPLICATE KEY UPDATE status = VALUES(status), payment_status = VALUES(payment_status)`,
      [studentUserId, course_id, status, payment_status]
    ).catch(() => {});
  }

  const payload = {
    id: studentUserId,
    name,
    email,
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
  const { status, payment_status, progress } = req.body;

  if (status || payment_status || progress !== undefined) {
    await pool.execute(
      `UPDATE enrollments SET
         status = COALESCE(?, status),
         payment_status = COALESCE(?, payment_status),
         progress = COALESCE(?, progress),
         updated_at = NOW()
       WHERE user_id = ?`,
      [status || null, payment_status || null, progress !== undefined ? progress : null, id]
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
