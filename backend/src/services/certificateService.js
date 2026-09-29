import crypto from 'crypto';
import pool from '../config/database.js';
import logger from '../config/logger.js';
import Certificate from '../models/Certificate.js';
import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';
import { broadcastToRole } from './socketService.js';

/** Badge definitions that the completion pipeline can award automatically. */
export const BADGES = {
  COURSE_COMPLETED: {
    name: 'Course Completed',
    description: 'Finished every lesson in a course from start to finish.',
    icon: 'workspace_premium',
    criteria: { type: 'COURSE_COMPLETION', courses: 1 }
  },
  FIRST_LESSON: {
    name: 'First Lesson',
    description: 'Completed your very first lesson.',
    icon: 'flag',
    criteria: { type: 'LESSON_COMPLETION', lessons: 1 }
  }
};

/** Resolve a badge id by name, creating the definition on first use. */
export async function ensureBadge(definition) {
  const [rows] = await pool.execute('SELECT id FROM badges WHERE name = ?', [definition.name]);
  if (rows.length > 0) return rows[0].id;
  return Badge.create(definition);
}

/**
 * Award a badge to a user. Safe to call repeatedly - `user_badges` has a
 * unique (user, badge) key and `Badge.awardTo` is an INSERT IGNORE.
 * Returns the badge id, or null if the award could not be persisted.
 */
export async function awardBadge(userId, definition) {
  try {
    const badgeId = await ensureBadge(definition);
    await UserBadge.award({ user_id: userId, badge_id: badgeId });
    return badgeId;
  } catch (err) {
    logger.warn('Badge award failed', { userId, badge: definition.name, error: err.message });
    return null;
  }
}

function buildCertificateNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `ETH-${stamp}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Issue the course-completion certificate for a learner, once.
 *
 * Called automatically when a lesson completion rolls a course up to 100%.
 * Idempotent: re-running returns the existing certificate instead of
 * minting a duplicate. Never throws - certificate issuance must not be able
 * to fail a learner's "mark as complete" action.
 *
 * @returns {Promise<{certificate: object|null, badgeId: string|null, alreadyIssued: boolean}>}
 */
export async function issueCourseCompletionCertificate({ studentId, courseId }) {
  try {
    if (!studentId || !courseId) return { certificate: null, badgeId: null, alreadyIssued: false };

    const existing = await Certificate.findByStudentAndCourse(studentId, courseId);
    if (existing) {
      return { certificate: existing, badgeId: null, alreadyIssued: true };
    }

    const [contextRows] = await pool.execute(
      `SELECT c.code, c.name, e.id AS enrollment_id, e.progress_percentage
         FROM courses c
         LEFT JOIN enrollments e ON e.course_id = c.id AND e.student_id = ?
        WHERE c.id = ?`,
      [studentId, courseId]
    );
    if (contextRows.length === 0) return { certificate: null, badgeId: null, alreadyIssued: false };

    const { code, name: courseName, enrollment_id: enrollmentId, progress_percentage: progress } = contextRows[0];
    if (!enrollmentId) {
      logger.warn('Certificate skipped: learner has no enrollment', { studentId, courseId });
      return { certificate: null, badgeId: null, alreadyIssued: false };
    }
    if (Number(progress) < 100) return { certificate: null, badgeId: null, alreadyIssued: false };

    const certificateNumber = buildCertificateNumber();
    const id = await Certificate.create({
      enrollment_id: enrollmentId,
      student_id: studentId,
      course_id: courseId,
      certificate_number: certificateNumber,
      issue_date: new Date().toISOString().slice(0, 10),
      expiry_date: null,
      pdf_url: `certificates/${certificateNumber}.pdf`,
      qr_code_url: null,
      is_verified: true
    });

    const badgeId = await awardBadge(studentId, BADGES.COURSE_COMPLETED);

    const certificate = await Certificate.findByIdWithDetails(id);
    broadcastToRole('STUDENT', 'certificate_issued', {
      certificate_id: id,
      certificate_number: certificateNumber,
      course_id: courseId,
      course_name: courseName,
      course_code: code,
      student_id: studentId
    });
    broadcastToRole('TUTOR', 'certificate_issued', {
      certificate_id: id,
      course_id: courseId,
      student_id: studentId
    });

    return { certificate, badgeId, alreadyIssued: false };
  } catch (err) {
    logger.error('Course completion certificate issuance failed', {
      studentId,
      courseId,
      error: err.message
    });
    return { certificate: null, badgeId: null, alreadyIssued: false };
  }
}
