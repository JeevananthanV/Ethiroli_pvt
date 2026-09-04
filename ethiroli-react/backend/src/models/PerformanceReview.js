import crypto from 'crypto';
import pool from '../config/database.js';

export default class PerformanceReview {
  static async create({ employee_id, reviewer_id, review_date, rating, feedback, overall_comment }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO performance_reviews (id, employee_id, reviewer_id, review_date, rating, feedback, overall_comment)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, employee_id, reviewer_id, review_date, rating, JSON.stringify(feedback), overall_comment]
    );
    return id;
  }

  static async list({ employee_id } = {}) {
    let query = 'SELECT * FROM performance_reviews';
    const values = [];

    if (employee_id) {
      query += ' WHERE employee_id = ?';
      values.push(employee_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}