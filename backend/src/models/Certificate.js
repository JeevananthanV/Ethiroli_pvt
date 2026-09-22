import crypto from 'crypto';
import pool from '../config/database.js';

export default class Certificate {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ enrollment_id, student_id, course_id, certificate_number, issue_date, expiry_date = null, pdf_url, qr_code_url = null, is_verified = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO certificates (id, enrollment_id, student_id, course_id, certificate_number, issue_date, expiry_date, pdf_url, qr_code_url, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, enrollment_id, student_id, course_id, certificate_number, issue_date, expiry_date, pdf_url, qr_code_url, is_verified]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.expiry_date !== undefined) { queryParts.push('expiry_date = ?'); values.push(updates.expiry_date); }
    if (updates.pdf_url !== undefined) { queryParts.push('pdf_url = ?'); values.push(updates.pdf_url); }
    if (updates.qr_code_url !== undefined) { queryParts.push('qr_code_url = ?'); values.push(updates.qr_code_url); }
    if (updates.is_verified !== undefined) { queryParts.push('is_verified = ?'); values.push(updates.is_verified); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE certificates SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM certificates WHERE id = ?', [id]);
  }

  static async list({ student_id, course_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM certificates WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    query += ' ORDER BY issue_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ student_id, course_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM certificates WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async generate(certificateId) {
    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [certificateId]);
    if (rows.length === 0) return null;
    return this.format(rows[0]);
  }

  static async verify(certificateNumber) {
    const [rows] = await pool.execute(
      'SELECT * FROM certificates WHERE certificate_number = ? AND is_verified = TRUE',
      [certificateNumber]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }
}
