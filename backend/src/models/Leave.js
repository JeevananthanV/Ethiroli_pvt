import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Leave {
  static format(row) {
    if (!row) return null;
    const name = row.full_name ? decrypt(row.full_name) : (row.user_name || null);
    return {
      ...row,
      full_name: name,
      user_name: name,
      employee_name: name,
      email: row.email ? decrypt(row.email) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM leaves WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), user_id, leave_type, start_date, end_date, reason }) {
    await pool.execute(
      `INSERT INTO leaves (id, user_id, leave_type, start_date, end_date, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, user_id, leave_type, start_date, end_date, reason]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.leave_type !== undefined) { queryParts.push('leave_type = ?'); values.push(updates.leave_type); }
    if (updates.start_date !== undefined) { queryParts.push('start_date = ?'); values.push(updates.start_date); }
    if (updates.end_date !== undefined) { queryParts.push('end_date = ?'); values.push(updates.end_date); }
    if (updates.reason !== undefined) { queryParts.push('reason = ?'); values.push(updates.reason); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.approved_by !== undefined) { queryParts.push('approved_by = ?'); values.push(updates.approved_by); }
    if (updates.approval_chain_step !== undefined) { queryParts.push('approval_chain_step = ?'); values.push(updates.approval_chain_step); }
    // The reviewer's comment. Recorded so the employee sees WHY a request was
    // declined, rather than only that it was.
    if (updates.review_note !== undefined) { queryParts.push('review_note = ?'); values.push(updates.review_note); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE leaves SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM leaves WHERE id = ?', [id]);
  }

  static async list({ status, user_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT l.*, u.full_name, u.email 
      FROM leaves l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (status) { query += ' AND l.status = ?'; values.push(status); }
    if (user_id) { query += ' AND l.user_id = ?'; values.push(user_id); }

    query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ status, user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM leaves WHERE 1=1';
    const values = [];

    if (status) { query += ' AND status = ?'; values.push(status); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async updateStatus(id, status, approved_by) {
    await pool.execute(
      `UPDATE leaves SET status = ?, approved_by = ? WHERE id = ?`,
      [status, approved_by, id]
    );
  }
}
