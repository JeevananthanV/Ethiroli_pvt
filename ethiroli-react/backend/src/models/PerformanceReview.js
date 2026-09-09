import crypto from 'crypto';
import pool from '../config/database.js';

export default class PerformanceReview {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      feedback: row.feedback ? JSON.parse(row.feedback) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM performance_reviews WHERE id = ?', [id]);
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
    let query = 'SELECT * FROM performance_reviews WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (reviewer_id) { query += ' AND reviewer_id = ?'; values.push(reviewer_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY review_date DESC LIMIT ? OFFSET ?';
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
