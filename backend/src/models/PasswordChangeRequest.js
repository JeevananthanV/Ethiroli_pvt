import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

/**
 * PasswordChangeRequest - an employee's request to change their own password.
 *
 * The request alone grants nothing. An authorised reviewer must approve it, and
 * the resulting authorisation is:
 *   - tied to one user_id (an employee can never spend another employee's grant),
 *   - short lived (grant_expires_at),
 *   - single use (grant_used_at, then the row becomes COMPLETED).
 *
 * No password and no password hash is ever written here.
 */
export default class PasswordChangeRequest {
  static format(row) {
    if (!row) return null;
    return {
      id: row.id,
      user_id: row.user_id,
      status: row.status,
      reason: row.reason,
      requested_at: row.requested_at,
      reviewed_at: row.reviewed_at,
      review_note: row.review_note,
      grant_expires_at: row.grant_expires_at,
      grant_used_at: row.grant_used_at,
      completed_at: row.completed_at
      // reviewed_by is deliberately exposed to reviewers only, via listForReview.
    };
  }

  static async create({ userId, reason = null }) {
    // The id is generated here and the row read back by that exact id. Selecting
    // "the latest row" instead was ambiguous when a previous request shared the
    // same second, which could return an older request as if it were the new one.
    const id = crypto.randomUUID();
    await pool.execute(
      'INSERT INTO password_change_requests (id, user_id, reason) VALUES (?, ?, ?)',
      [id, userId, reason]
    );
    return this.findById(id);
  }

  static async findLatestForUser(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM password_change_requests WHERE user_id = ? ORDER BY requested_at DESC, created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM password_change_requests WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Requests awaiting review, for ADMIN / SUPER_ADMIN / HR.
   *
   * `users.full_name` and `users.email` are encrypted at rest, so they are
   * decrypted here - otherwise the reviewer queue renders raw ciphertext as the
   * requester's name and address, which makes the queue unusable.
   */
  static async listForReview({ status = 'PENDING', limit = 50 } = {}) {
    const [rows] = await pool.execute(
      `SELECT pcr.*, u.full_name, u.email, u.role AS user_role,
              e.employee_code, e.department, e.designation
         FROM password_change_requests pcr
         JOIN users u ON u.id = pcr.user_id
         LEFT JOIN employees e ON e.user_id = pcr.user_id
        WHERE pcr.status = ?
        ORDER BY pcr.requested_at ASC
        LIMIT ?`,
      [status, Math.min(200, Math.max(1, parseInt(limit, 10) || 50))]
    );
    return rows.map((r) => ({
      ...this.format(r),
      reviewed_by: r.reviewed_by,
      user_full_name: r.full_name ? decrypt(r.full_name) : null,
      user_email: r.email ? decrypt(r.email) : null,
      user_role: r.user_role,
      // Semi-public identifiers the reviewer uses to confirm they are approving
      // the right person before granting a password reset.
      employee_code: r.employee_code,
      department: r.department,
      designation: r.designation
    }));
  }

  /**
   * Approve with a short authorisation window. Refuses to approve an already
   * resolved request so an approval cannot be replayed.
   */
  static async approve(id, reviewerId, note = null, windowMinutes = 30) {
    const [result] = await pool.execute(
      `UPDATE password_change_requests
          SET status = 'APPROVED',
              reviewed_by = ?,
              reviewed_at = NOW(),
              review_note = ?,
              grant_expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE)
        WHERE id = ? AND status = 'PENDING'`,
      [reviewerId, note, windowMinutes, id]
    );
    return result.affectedRows > 0;
  }

  static async reject(id, reviewerId, note = null) {
    const [result] = await pool.execute(
      `UPDATE password_change_requests
          SET status = 'REJECTED', reviewed_by = ?, reviewed_at = NOW(), review_note = ?
        WHERE id = ? AND status = 'PENDING'`,
      [reviewerId, note, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * The grant this user may spend right now, or null. Expiry is evaluated in
   * SQL so an expired window can never be honoured, and a spent grant
   * (grant_used_at set) never matches.
   */
  static async findUsableGrant(userId) {
    const [rows] = await pool.execute(
      `SELECT * FROM password_change_requests
        WHERE user_id = ?
          AND status = 'APPROVED'
          AND grant_used_at IS NULL
          AND grant_expires_at IS NOT NULL
          AND grant_expires_at > NOW()
        ORDER BY reviewed_at DESC
        LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  }

  /** Consume the grant. The WHERE clause is the single-use guard. */
  static async consumeGrant(id) {
    const [result] = await pool.execute(
      `UPDATE password_change_requests
          SET grant_used_at = NOW(), status = 'COMPLETED', completed_at = NOW()
        WHERE id = ? AND grant_used_at IS NULL AND grant_expires_at > NOW()`,
      [id]
    );
    return result.affectedRows > 0;
  }

  /** Flag PENDING/approved rows whose window has passed, for truthful status. */
  static async expireStale() {
    const [result] = await pool.execute(
      `UPDATE password_change_requests
          SET status = 'EXPIRED'
        WHERE status IN ('PENDING','APPROVED')
          AND requested_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    return result.affectedRows;
  }
}
