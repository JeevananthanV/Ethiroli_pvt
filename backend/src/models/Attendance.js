import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

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
