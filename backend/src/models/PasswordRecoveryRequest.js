import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

/**
 * PasswordRecoveryRequest - the public, unauthenticated half of the employee
 * password-recovery workflow.
 *
 * Flow:
 *   1. A locked-out employee submits email + employee_code on the sign-in
 *      screen. A row lands here.
 *   2. HR / ADMIN / SUPER_ADMIN reviews it and approves it, which creates the
 *      real approval grant in `password_change_requests` for that user.
 *   3. The employee returns to the sign-in screen and sets a new password against
 *      the approved, unexpired, unused grant.
 *
 * Why the pair of credentials: `employee_code` alone is guessable (EMP001,
 * EMP002, ...) and email alone is public, so neither proves identity on its own.
 * Requiring both means an attacker needs the exact code HR issued to that person.
 * This is still a recovery path, not an authentication path - the admin approval
 * step is the real gate, which is why every endpoint here is rate limited and
 * every attempt is recorded.
 *
 * No password and no password hash is ever stored in this table.
 */

/** Stable, non-reversible index for the encrypted email column. */
export const hashEmail = (email) =>
  crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex');

export default class PasswordRecoveryRequest {
  static format(row) {
    if (!row) return null;
    return {
      id: row.id,
      user_id: row.user_id,
      status: row.status,
      reason: row.reason,
      requested_at: row.requested_at,
      resolved_at: row.resolved_at
      // email_hash / employee_code / requested_ip are never returned to the
      // public caller - see toPublicView.
    };
  }

  static async create({ email, employeeCode, userId = null, reason = null, ip = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO password_recovery_requests
         (id, email_hash, employee_code, user_id, reason, requested_ip)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, hashEmail(email), String(employeeCode).trim().toUpperCase(), userId, reason, ip]
    );
    return this.findById(id);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM password_recovery_requests WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * The most recent recovery attempt matching this email + employee code.
   * This is what the public status endpoint reads, so it must match on BOTH
   * fields - matching on the email alone would let anyone watch a stranger's
   * request status.
   */
  static async findLatestForCredentials(email, employeeCode) {
    const [rows] = await pool.execute(
      `SELECT * FROM password_recovery_requests
        WHERE email_hash = ? AND employee_code = ?
        ORDER BY requested_at DESC, created_at DESC
        LIMIT 1`,
      [hashEmail(email), String(employeeCode).trim().toUpperCase()]
    );
    return rows[0] || null;
  }

  /**
   * Attempts against the same email + code inside the window. Used to refuse a
   * second request while one is already open, and to throttle guessing.
   */
  static async countRecentForCredentials(email, employeeCode, minutes = 60) {
    const [[row]] = await pool.execute(
      `SELECT COUNT(*) AS n FROM password_recovery_requests
        WHERE email_hash = ? AND employee_code = ?
          AND requested_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
      [hashEmail(email), String(employeeCode).trim().toUpperCase(), minutes]
    );
    return Number(row?.n || 0);
  }

  /** Link a recovery request to the resolved user once HR approved it. */
  static async markResolved(id, userId = null) {
    await pool.execute(
      `UPDATE password_recovery_requests
          SET status = 'COMPLETED', user_id = COALESCE(?, user_id), resolved_at = NOW()
        WHERE id = ?`,
      [userId, id]
    );
  }

  /**
   * Reviewer queue. Includes the decrypted identity so the reviewer can confirm
   * they are approving the right person.
   */
  static async listForReview({ status = 'PENDING', limit = 50 } = {}) {
    const [rows] = await pool.execute(
      `SELECT prr.*, u.full_name, u.email, u.role AS user_role,
              e.employee_code AS matched_employee_code
         FROM password_recovery_requests prr
         LEFT JOIN users u ON u.id = prr.user_id
         LEFT JOIN employees e ON e.user_id = prr.user_id
        WHERE prr.status = ?
        ORDER BY prr.requested_at ASC
        LIMIT ?`,
      [status, Math.min(200, Math.max(1, parseInt(limit, 10) || 50))]
    );
    return rows.map((r) => ({
      ...this.format(r),
      employee_code: r.employee_code,
      // users.full_name / users.email are encrypted at rest.
      user_full_name: r.full_name ? decrypt(r.full_name) : null,
      user_email: r.email ? decrypt(r.email) : null,
      user_role: r.user_role
    }));
  }
}
