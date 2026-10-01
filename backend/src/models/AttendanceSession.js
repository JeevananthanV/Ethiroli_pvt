import crypto from 'crypto';
import pool from '../config/database.js';
import { BUSINESS_TIMEZONE } from '../config/timezone.js';

/**
 * AttendanceSession - one work session (a punch-in / punch-out pair).
 *
 * An employee may work several sessions in a day. Daily worked time is the SUM
 * of session durations, so un-punched breaks between sessions are excluded:
 *
 *   09:00 in -> 13:00 out   = 4h
 *   14:00 in -> 18:00 out   = 4h
 *   daily total              = 8h   (13:00-14:00 was a break, not work)
 */
export default class AttendanceSession {
  /** Shape a row for the API. Keeps the raw work_date as `YYYY-MM-DD`. */
  static format(row) {
    if (!row) return null;
    const checkIn = row.check_in_time;
    const checkOut = row.check_out_time;
    const workedMinutes = Number(row.worked_minutes ?? 0);
    return {
      id: row.id,
      user_id: row.user_id,
      work_date: row.work_date,
      check_in_time: checkIn,
      check_out_time: checkOut,
      worked_minutes: workedMinutes,
      duration_minutes: checkOut ? workedMinutes : null,
      status: row.status,
      is_active: row.status === 'ACTIVE',
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /** The employee's currently open session (punched in, not yet punched out). */
  static async getActiveSession(userId) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date,
              check_in_time, check_out_time, worked_minutes, status, created_at, updated_at
       FROM attendance_sessions
       WHERE user_id = ? AND status = 'ACTIVE'
       ORDER BY check_in_time DESC
       LIMIT 1`,
      [userId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  /** All sessions for one user on one business date (oldest first). */
  static async listByUserDate(userId, workDate) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date,
              check_in_time, check_out_time, worked_minutes, status, created_at, updated_at
       FROM attendance_sessions
       WHERE user_id = ? AND work_date = ?
       ORDER BY check_in_time ASC`,
      [userId, workDate]
    );
    return rows.map((r) => this.format(r));
  }

  /** Sessions for a user across a date range (used by history). */
  static async listRange(userId, startDate, endDate) {
    const [rows] = await pool.execute(
      `SELECT id, user_id, DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date,
              check_in_time, check_out_time, worked_minutes, status, created_at, updated_at
       FROM attendance_sessions
       WHERE user_id = ?
         AND work_date BETWEEN ? AND ?
       ORDER BY work_date DESC, check_in_time ASC`,
      [userId, startDate, endDate]
    );
    return rows.map((r) => this.format(r));
  }

  /**
   * Open a new session.
   *
   * Runs in a transaction and takes a row lock on the user (`SELECT ... FOR
   * UPDATE` on an existing row, or a gap lock via the parent) so two rapid
   * requests (e.g. a double-click) cannot both insert an ACTIVE session. MySQL
   * cannot index a generated column derived from an FK column, so the one-open
   * -session invariant is enforced here rather than by a unique index.
   *
   * @throws {Error} code ALREADY_PUNCHED_IN when a session is already open.
   */
  static async startSession({ userId, workDate, checkInTime }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [existing] = await conn.execute(
        `SELECT id FROM attendance_sessions
         WHERE user_id = ? AND status = 'ACTIVE'
         LIMIT 1
         FOR UPDATE`,
        [userId]
      );
      if (existing.length > 0) {
        await conn.rollback();
        const e = new Error('You are already punched in. Please punch out before starting a new session.');
        e.code = 'ALREADY_PUNCHED_IN';
        throw e;
      }

      const id = crypto.randomUUID();
      await conn.execute(
        `INSERT INTO attendance_sessions (id, user_id, work_date, check_in_time, status)
         VALUES (?, ?, ?, ?, 'ACTIVE')`,
        [id, userId, workDate, checkInTime]
      );

      await conn.commit();
      return this.getActiveSession(userId);
    } catch (err) {
      try { await conn.rollback(); } catch { /* connection already closed */ }
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * Close the employee's open session.
   * @throws {Error} code NO_ACTIVE_SESSION when nothing is open.
   */
  static async endSession({ userId, checkOutTime }) {
    const [result] = await pool.execute(
      `UPDATE attendance_sessions
       SET check_out_time = ?, status = 'COMPLETED'
       WHERE user_id = ? AND status = 'ACTIVE'`,
      [checkOutTime, userId]
    );
    if (result.affectedRows === 0) {
      const e = new Error('You are not currently punched in. Please punch in first.');
      e.code = 'NO_ACTIVE_SESSION';
      throw e;
    }
    return this.getActiveSession(userId);
  }

  /**
   * Per-day rollup for history: session count, worked minutes and the
   * earliest check-in / latest check-out for each day in the range.
   */
  static async dailyRollup(userId, startDate, endDate) {
    const [rows] = await pool.execute(
      `SELECT
         DATE_FORMAT(work_date, '%Y-%m-%d') AS work_date,
         COUNT(*)                                        AS session_count,
         SUM(worked_minutes)                             AS worked_minutes,
         MIN(check_in_time)                              AS first_check_in,
         MAX(IFNULL(check_out_time, check_in_time))      AS last_check_out,
         SUM(status = 'ACTIVE')                          AS active_count
       FROM attendance_sessions
       WHERE user_id = ? AND work_date BETWEEN ? AND ?
       GROUP BY work_date
       ORDER BY work_date DESC`,
      [userId, startDate, endDate]
    );

    return rows.map((r) => {
      const isOpen = Number(r.active_count) > 0;
      return {
        work_date: r.work_date,
        session_count: Number(r.session_count || 0),
        worked_minutes: Number(r.worked_minutes || 0),
        first_check_in: r.first_check_in,
        last_check_out: isOpen ? null : r.last_check_out,
        is_open: isOpen,
      };
    });
  }

  /** Total minutes for one user/business-date (used by dashboard). */
  static async workedMinutesFor(userId, workDate) {
    const [rows] = await pool.execute(
      `SELECT COALESCE(SUM(worked_minutes), 0) AS total,
              COUNT(*) AS session_count,
              SUM(status = 'ACTIVE') AS active_count
       FROM attendance_sessions
       WHERE user_id = ? AND work_date = ?`,
      [userId, workDate]
    );
    return {
      worked_minutes: Number(rows[0].total || 0),
      session_count: Number(rows[0].session_count || 0),
      is_open: Number(rows[0].active_count || 0) > 0,
    };
  }

  static get timezone() {
    return BUSINESS_TIMEZONE;
  }
}
