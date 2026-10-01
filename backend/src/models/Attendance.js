import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';
import AttendanceSession from './AttendanceSession.js';

export default class Attendance {
  static format(row) {
    if (!row) return null;
    const name = row.full_name ? decrypt(row.full_name) : (row.name || null);
    const formatTime = (ts) => {
      if (!ts) return '—';
      try {
        const d = new Date(ts);
        return isNaN(d.getTime()) ? String(ts) : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return String(ts);
      }
    };
    return {
      ...row,
      full_name: name,
      employee_name: name,
      user_name: name,
      email: row.email ? decrypt(row.email) : null,
      clock_in: formatTime(row.check_in_time),
      clock_out: formatTime(row.check_out_time),
      hours: row.total_hours != null ? Number(row.total_hours) : null
    };
  }

  /**
   * Build the attendance payload for one user on one business date.
   *
   * `worked_minutes` is the SUM of the day's session durations, so lunch and
   * other un-punched breaks are excluded. It falls back to the legacy
   * `total_hours` generated column for rows recorded before sessions existed.
   */
  static async getDaySummary(userId, workDate) {
    const [rows] = await pool.execute(
      `SELECT DATE_FORMAT(a.date, '%Y-%m-%d') AS work_date,
              a.id, a.date, a.check_in_time, a.check_out_time,
              a.total_hours, a.worked_minutes, a.session_count, a.is_late, a.status
       FROM attendance a
       WHERE a.user_id = ? AND a.date = ?
       LIMIT 1`,
      [userId, workDate]
    );
    const day = rows.length > 0 ? rows[0] : null;

    const [sessions, totals] = await Promise.all([
      AttendanceSession.listByUserDate(userId, workDate),
      AttendanceSession.workedMinutesFor(userId, workDate),
    ]);

    const activeSession = sessions.find((s) => s.is_active) || null;
    const hasSessions = sessions.length > 0;

    // Worked minutes: prefer session rollup. Before sessions existed, derive
    // from the legacy first-in/last-out row so old history still shows hours.
    let workedMinutes;
    if (hasSessions) {
      workedMinutes = totals.worked_minutes;
      // An open session has no check_out_time yet, so add the elapsed time so
      // the daily total is live while the employee is still working.
      if (activeSession) {
        const elapsed = Math.max(
          0,
          Math.floor((Date.now() - new Date(activeSession.check_in_time).getTime()) / 60000)
        );
        workedMinutes += elapsed;
      }
    } else if (day && day.total_hours != null) {
      workedMinutes = Math.round(Number(day.total_hours) * 60);
    } else {
      workedMinutes = 0;
    }

    return {
      work_date: workDate,
      // Legacy day-row fields kept for backwards compatibility with the HR UI.
      check_in_time: day?.check_in_time || null,
      check_out_time: day?.check_out_time || null,
      status: day?.status || null,
      is_late: day ? Boolean(day.is_late) : false,
      is_punched_in: Boolean(activeSession),
      has_sessions: hasSessions,
      session_count: hasSessions ? sessions.length : Number(day?.session_count || 0),
      worked_minutes: workedMinutes,
      worked_hours: Number((workedMinutes / 60).toFixed(2)),
      current_session: activeSession,
      sessions,
    };
  }

  /**
   * Keep the legacy one-row-per-day summary in step with the session data so
   * existing attendance reports (which read check_in/check_out/total_hours)
   * continue to reflect the employee's real day.
   */
  static async syncDayRow(userId, workDate) {
    const totals = await AttendanceSession.workedMinutesFor(userId, workDate);
    const sessions = await AttendanceSession.listByUserDate(userId, workDate);
    if (sessions.length === 0) return null;

    const firstIn = sessions[0].check_in_time;
    const lastOut = totals.is_open ? null : sessions[sessions.length - 1].check_out_time;
    const isLate = await this.computeIsLate(userId, workDate);
    // `total_hours` is a STORED GENERATED column (first-in -> last-out); it
    // cannot be written directly, so store the true sum in `worked_minutes`.
    const sql = `INSERT INTO attendance
        (user_id, date, check_in_time, check_out_time, is_late, status, worked_minutes, session_count)
       VALUES (?, ?, ?, ?, ?, 'PRESENT', ?, ?)
       ON DUPLICATE KEY UPDATE
         check_in_time = VALUES(check_in_time),
         check_out_time = VALUES(check_out_time),
         worked_minutes = VALUES(worked_minutes),
         session_count = VALUES(session_count),
         is_late = VALUES(is_late),
         status = 'PRESENT'`;

    await pool.execute(sql, [
      userId, workDate, firstIn, lastOut, isLate ? 1 : 0, totals.worked_minutes, sessions.length,
    ]);
    return this.getDaySummary(userId, workDate);
  }

  /**
   * The employee is late when their first punch-in of the day is after the
   * configured shift start (SHIFT_START, default 09:00 business time).
   */
  static async computeIsLate(userId, workDate) {
    const shiftStart = process.env.SHIFT_START || '09:00';
    const [rows] = await pool.execute(
      `SELECT TIME(MIN(check_in_time)) AS first_in
       FROM attendance_sessions
       WHERE user_id = ? AND work_date = ?`,
      [userId, workDate]
    );
    if (rows.length === 0 || !rows[0].first_in) return false;
    return rows[0].first_in > shiftStart;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT a.*, u.full_name, u.email, u.role as user_role, e.department, e.employee_code 
       FROM attendance a 
       JOIN users u ON a.user_id = u.id 
       LEFT JOIN employees e ON a.user_id = e.user_id 
       WHERE a.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), user_id, date, check_in_time = null, check_out_time = null, status = 'ABSENT', is_late = false }) {
    await pool.execute(
      `INSERT INTO attendance (id, user_id, date, check_in_time, check_out_time, status, is_late)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, date, check_in_time, check_out_time, status, is_late]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.check_in_time !== undefined) { queryParts.push('check_in_time = ?'); values.push(updates.check_in_time); }
    if (updates.check_out_time !== undefined) { queryParts.push('check_out_time = ?'); values.push(updates.check_out_time); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.is_late !== undefined) { queryParts.push('is_late = ?'); values.push(updates.is_late); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE attendance SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM attendance WHERE id = ?', [id]);
  }

  static async list({ user_id, role, start_date, end_date, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT a.*, DATE_FORMAT(a.date, '%Y-%m-%d') AS work_date,
             u.full_name, u.email, u.role as user_role, e.department, e.employee_code
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN employees e ON a.user_id = e.user_id
      WHERE 1=1
    `;
    const values = [];

    if (user_id) { query += ' AND a.user_id = ?'; values.push(user_id); }
    if (role) { query += ' AND u.role = ?'; values.push(role); }
    if (start_date && end_date) { query += ' AND a.date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    query += ' ORDER BY a.date DESC, a.check_in_time DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id, role, start_date, end_date } = {}) {
    let query = `
      SELECT COUNT(*) as total 
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (user_id) { query += ' AND a.user_id = ?'; values.push(user_id); }
    if (role) { query += ' AND u.role = ?'; values.push(role); }
    if (start_date && end_date) { query += ' AND a.date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async checkIn(user_id, customDate = null, customStatus = 'PRESENT') {
    const date = customDate || new Date().toISOString().slice(0, 10);
    const now = new Date();
    const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
    const statusVal = String(customStatus).toUpperCase();

    await pool.execute(
      `INSERT INTO attendance (user_id, date, check_in_time, status, is_late)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE check_in_time = COALESCE(check_in_time, VALUES(check_in_time)), status = VALUES(status)`,
      [user_id, date, now, statusVal, isLate]
    );
  }

  static async checkOut(user_id) {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();

    await pool.execute(
      `UPDATE attendance 
       SET check_out_time = ? 
       WHERE user_id = ? AND date = ?`,
      [now, user_id, today]
    );
  }

  static async manualCorrect(id, { check_in_time, check_out_time, status }) {
    await pool.execute(
      `UPDATE attendance 
       SET check_in_time = ?, check_out_time = ?, status = ? 
       WHERE id = ?`,
      [check_in_time, check_out_time, status, id]
    );
  }
}
