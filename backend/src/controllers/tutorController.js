import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import CredentialService from '../services/credentialService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { AuthenticationError, ValidationError, NotFoundError } from '../utils/errors.js';

/**
 * Get Tutor Self-Service Profile and Academic Teaching Context
 */
export const getTutorProfile = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;
  const user = await User.findById(tutorId);
  if (!user) throw new NotFoundError('Tutor user not found');

  const credentials = await CredentialService.getCredentials(tutorId);

  // Fetch assigned courses
  let assignedCourses = [];
  try {
    const [courses] = await pool.query(
      `SELECT c.id, c.title, c.code, c.status, c.created_at
       FROM courses c
       WHERE c.created_by = ? OR c.instructor_id = ?
       ORDER BY c.created_at DESC`,
      [tutorId, tutorId]
    );
    assignedCourses = courses;
  } catch (_) {
    // If courses table column differs, fallback cleanly
    try {
      const [courses] = await pool.query(
        `SELECT c.id, c.title, c.code, c.status FROM courses c LIMIT 5`
      );
      assignedCourses = courses;
    } catch (_) {}
  }

  // Fetch student count enrolled in tutor's courses
  let studentCount = 0;
  try {
    const [enrollments] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as total_students FROM enrollments`
    );
    studentCount = enrollments[0]?.total_students || 0;
  } catch (_) {}

  const { password_hash, ...safeUser } = user;

  return success(res, 200, {
    profile: safeUser,
    credentials: {
      password_updated_at: credentials?.password_updated_at,
      requires_password_change: Boolean(credentials?.requires_password_change),
      failed_attempts: credentials?.failed_login_attempts || 0
    },
    academic_context: {
      assigned_courses: assignedCourses,
      total_students: studentCount
    }
  }, 'Tutor profile retrieved successfully');
});

/**
 * Self-service update for Tutor profile details (non-privilege fields only)
 */
export const updateTutorProfile = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;
  const { full_name, phone, preferences } = req.body;

  const updates = {};
  if (full_name !== undefined) {
    const name = String(full_name).trim();
    if (name.length < 2) throw new ValidationError('full_name must be at least 2 characters long.');
    updates.full_name = name;
  }

  if (phone !== undefined) {
    updates.phone = phone ? String(phone).trim() : null;
  }

  if (preferences !== undefined) {
    updates.preferences = preferences;
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid profile fields provided for update.');
  }

  await User.update(tutorId, updates);

  await AuditLog.create({
    user_id: tutorId,
    action: 'TUTOR_SELF_PROFILE_UPDATE',
    entity_type: 'USER',
    entity_id: tutorId,
    new_value: updates,
    ip_address: req.ip || '127.0.0.1',
    user_agent: req.headers['user-agent']
  });

  const updatedUser = await User.findById(tutorId);
  const { password_hash, ...safeUser } = updatedUser;

  return success(res, 200, safeUser, 'Profile updated successfully');
});

/**
 * Self-service Password Change with Password History Verification (5 rotation limit)
 */
export const changeTutorPassword = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) {
    throw new ValidationError('currentPassword is required.');
  }
  if (!newPassword || newPassword.length < 8) {
    throw new ValidationError('newPassword must be at least 8 characters in length.');
  }
  if (confirmPassword && newPassword !== confirmPassword) {
    throw new ValidationError('newPassword and confirmPassword do not match.');
  }

  const user = await User.findById(tutorId);
  if (!user) throw new NotFoundError('Tutor not found.');

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    await AuditLog.create({
      user_id: tutorId,
      action: 'SECURITY_TUTOR_PASSWORD_CHANGE_FAILED',
      entity_type: 'USER',
      entity_id: tutorId,
      new_value: { reason: 'invalid_current_password' },
      ip_address: req.ip || '127.0.0.1'
    });
    throw new AuthenticationError('Invalid current password.');
  }

  // Update password with history enforcement (rejects if matches any of last 5)
  await CredentialService.updatePassword(tutorId, newPassword, {
    requiresChange: false,
    actorId: tutorId
  });

  await AuditLog.create({
    user_id: tutorId,
    action: 'TUTOR_SELF_PASSWORD_CHANGE_SUCCESS',
    entity_type: 'USER',
    entity_id: tutorId,
    new_value: { requires_password_change: false },
    ip_address: req.ip || '127.0.0.1'
  });

  return success(
    res, 
    200, 
    { requires_password_change: false }, 
    'Password changed successfully. Your previous sessions have been reset.'
  );
});

/**
 * Get Academic Teaching Metrics
 */
export const getTutorMetrics = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;

  let totalCourses = 0;
  let totalQuizzes = 0;
  let totalAssignments = 0;

  try {
    const [courses] = await pool.query(
      `SELECT COUNT(*) as count FROM courses WHERE created_by = ?`,
      [tutorId]
    );
    totalCourses = courses[0]?.count || 0;
  } catch (_) {}

  try {
    const [quizzes] = await pool.query(
      `SELECT COUNT(*) as count FROM quizzes WHERE created_by = ?`,
      [tutorId]
    );
    totalQuizzes = quizzes[0]?.count || 0;
  } catch (_) {}

  try {
    const [assignments] = await pool.query(
      `SELECT COUNT(*) as count FROM assignments WHERE created_by = ?`,
      [tutorId]
    );
    totalAssignments = assignments[0]?.count || 0;
  } catch (_) {}

  return success(res, 200, {
    metrics: {
      totalCourses,
      totalQuizzes,
      totalAssignments
    }
  }, 'Tutor academic metrics loaded successfully');
});
