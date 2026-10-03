import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Attendance {
  static format(row) {
    if (!row) return null;
    const name = row.full_name ? decrypt(row.full_name) : (row.name || null);
    // 12-hour clock with an AM/PM marker. toLocaleTimeString without
    // `hour12` follows the machine locale and produced 24-hour "railway" times
    // (13:57) on non-US regions.
    const formatTime = (ts) => {
      if (!ts) return '—';
      try {
        const d = new Date(ts);
        if (Number.isNaN(d.getTime())) return String(ts);
        const hours24 = d.getHours();
        const period = hours24 >= 12 ? 'PM' : 'AM';
        const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
        return `${hour12}:${String(d.getMinutes()).padStart(2, '0')} ${period}`;
      } catch {
        return String(ts);
      }
    };
    // `date` is a DATE column, but mysql2 hands back a JS Date in local time.
    // Normalise it to YYYY-MM-DD so the client can match it against a
    // toISOString().slice(0,10) key without an off-by-one-day mismatch.
    const formatDate = (d) => {
      if (!d) return null;
      if (typeof d === 'string') return d.slice(0, 10);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    return {
      ...row,
      date: formatDate(row.date),
      full_name: name,
      employee_name: name,
      user_name: name,
      email: row.email ? decrypt(row.email) : null,
      clock_in: formatTime(row.check_in_time),
      clock_out: formatTime(row.check_out_time),
      hours: row.total_hours != null ? Number(row.total_hours) : null,
      work_mode: row.work_mode || null
    };
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

  static async create({ id = crypto.randomUUID(), user_id, date, check_in_time = null, check_out_time = null, status = 'ABSENT', is_late = false, work_mode = null }) {
    await pool.execute(
      `INSERT INTO attendance (id, user_id, date, check_in_time, check_out_time, status, is_late, work_mode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, date, check_in_time, check_out_time, status, is_late, work_mode]
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
    if (updates.work_mode !== undefined) { queryParts.push('work_mode = ?'); values.push(updates.work_mode); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE attendance SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM attendance WHERE id = ?', [id]);
  }

  static async list({ user_id, role, start_date, end_date, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT a.*, u.full_name, u.email, u.role as user_role, e.department, e.employee_code 
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

  /**
   * Local calendar day (YYYY-MM-DD).
   *
   * toISOString() converts to UTC, so for anyone east of Greenwich it rolls
   * over to tomorrow after ~18:00 local and writes tomorrow's date. Every
   * punch in/out for that evening lands on the wrong day's row.
   */
  static today() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  static async checkIn(user_id, customDate = null, customStatus = 'PRESENT', workMode = null) {
    const date = customDate || this.today();
    const now = new Date();
    // Late = arrived after 09:00. The previous `getMinutes() > 0` test made
    // 10:00 sharp count as on-time and 09:01 late.
    const isLate = (now.getHours() * 60 + now.getMinutes()) > 9 * 60;
    const statusVal = String(customStatus).toUpperCase();
    const mode = workMode && ['REMOTE', 'OFFICE'].includes(String(workMode).toUpperCase())
      ? String(workMode).toUpperCase()
      : null;

    // On a duplicate punch the existing row wins: the first check-in time and
    // the work mode chosen at that moment are kept, so a repeat press cannot
    // rewrite a shift that is already open.
    await pool.execute(
      `INSERT INTO attendance (user_id, date, check_in_time, status, is_late, work_mode)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         check_in_time = COALESCE(check_in_time, VALUES(check_in_time)),
         status = VALUES(status)`,
      [user_id, date, now, statusVal, isLate ? 1 : 0, mode]
    );
  }

  static async checkOut(user_id) {
    const today = this.today();
    const now = new Date();

    const [result] = await pool.execute(
      `UPDATE attendance
       SET check_out_time = ?
       WHERE user_id = ? AND date = ? AND check_in_time IS NOT NULL AND check_out_time IS NULL`,
      [now, user_id, today]
    );
    return result.affectedRows > 0;
  }

  static async manualCorrect(id, { check_in_time, check_out_time, status, work_mode }) {
    await pool.execute(
      `UPDATE attendance
       SET check_in_time = ?, check_out_time = ?, status = ?, work_mode = ?
       WHERE id = ?`,
      [check_in_time, check_out_time, status, work_mode || null, id]
    );
  }
}
