import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class PerformanceReview {
  static format(row) {
    if (!row) return null;
    const empName = row.employee_full_name ? decrypt(row.employee_full_name) : (row.employee_name || null);
    const revName = row.reviewer_full_name ? decrypt(row.reviewer_full_name) : (row.reviewer_name || null);
    return {
      ...row,
      feedback: row.feedback ? (typeof row.feedback === 'string' ? JSON.parse(row.feedback) : row.feedback) : null,
      employee_name: empName,
      reviewer_name: revName,
      employee_email: row.employee_email ? decrypt(row.employee_email) : null,
      reviewer_email: row.reviewer_email ? decrypt(row.reviewer_email) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT pr.*, 
              ue.full_name AS employee_full_name, ue.email AS employee_email, e.employee_code, e.department, e.designation,
              ur.full_name AS reviewer_full_name, ur.email AS reviewer_email
       FROM performance_reviews pr
       JOIN employees e ON pr.employee_id = e.id
       JOIN users ue ON e.user_id = ue.id
       LEFT JOIN users ur ON pr.reviewer_id = ur.id
       WHERE pr.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ employee_id, reviewer_id, review_date, rating, feedback, overall_comment, status = 'DRAFT' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO performance_reviews (id, employee_id, reviewer_id, review_date, rating, feedback, overall_comment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, employee_id, reviewer_id, review_date, rating, JSON.stringify(feedback), overall_comment, status]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.rating !== undefined) { queryParts.push('rating = ?'); values.push(updates.rating); }
    if (updates.feedback !== undefined) { queryParts.push('feedback = ?'); values.push(updates.feedback ? JSON.stringify(updates.feedback) : null); }
    if (updates.overall_comment !== undefined) { queryParts.push('overall_comment = ?'); values.push(updates.overall_comment); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.review_date !== undefined) { queryParts.push('review_date = ?'); values.push(updates.review_date); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE performance_reviews SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM performance_reviews WHERE id = ?', [id]);
  }

  static async list({ employee_id, reviewer_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT pr.*, 
             ue.full_name AS employee_full_name, ue.email AS employee_email, e.employee_code, e.department, e.designation,
             ur.full_name AS reviewer_full_name, ur.email AS reviewer_email
      FROM performance_reviews pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN users ue ON e.user_id = ue.id
      LEFT JOIN users ur ON pr.reviewer_id = ur.id
      WHERE 1=1
    `;
    const values = [];

    if (employee_id) { query += ' AND pr.employee_id = ?'; values.push(employee_id); }
    if (reviewer_id) { query += ' AND pr.reviewer_id = ?'; values.push(reviewer_id); }
    if (status) { query += ' AND pr.status = ?'; values.push(status); }

    query += ' ORDER BY pr.review_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, reviewer_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM performance_reviews WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (reviewer_id) { query += ' AND reviewer_id = ?'; values.push(reviewer_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
