import crypto from 'crypto';
import pool from '../config/database.js';

export default class Certificate {
  static async create({ enrollment_id, student_id, course_id, certificate_number, issue_date, pdf_url }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO certificates (id, enrollment_id, student_id, course_id, certificate_number, issue_date, pdf_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, enrollment_id, student_id, course_id, certificate_number, issue_date, pdf_url]
    );
    return id;
  }

  static async list({ student_id } = {}) {
    let query = 'SELECT * FROM certificates';
    const values = [];

    if (student_id) {
      query += ' WHERE student_id = ?';
      values.push(student_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}