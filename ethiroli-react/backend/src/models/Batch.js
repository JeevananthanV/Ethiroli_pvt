import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Batch {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      tutor_name: row.tutor_name ? decrypt(row.tutor_name) : null,
      student_name: row.student_name ? decrypt(row.student_name) : null,
      student_email: row.student_email ? decrypt(row.student_email) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, c.name as course_name, c.code as course_code, u.full_name as tutor_name
       FROM batches b
       JOIN courses c ON b.course_id = c.id
       JOIN users u ON b.tutor_id = u.id
       WHERE b.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByCode(batch_code) {
    const [rows] = await pool.execute(
      `SELECT b.*, c.name as course_name, c.code as course_code, u.full_name as tutor_name
       FROM batches b
       JOIN courses c ON b.course_id = c.id
       JOIN users u ON b.tutor_id = u.id
       WHERE b.batch_code = ?`,
      [batch_code]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    course_id,
    tutor_id,
    batch_code,
    name,
    start_date,
    end_date,
    max_capacity = 30,
    is_active = true
  }) {
    await pool.execute(
      `INSERT INTO batches (id, course_id, tutor_id, batch_code, name, start_date, end_date, max_capacity, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, course_id, tutor_id, batch_code, name, start_date, end_date, max_capacity, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.tutor_id !== undefined) { queryParts.push('tutor_id = ?'); values.push(updates.tutor_id); }
    if (updates.start_date !== undefined) { queryParts.push('start_date = ?'); values.push(updates.start_date); }
    if (updates.end_date !== undefined) { queryParts.push('end_date = ?'); values.push(updates.end_date); }
    if (updates.max_capacity !== undefined) { queryParts.push('max_capacity = ?'); values.push(updates.max_capacity); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE batches SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM batches WHERE id = ?', [id]);
  }

  static async list({ course_id, tutor_id, is_active, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT b.*, c.name as course_name, c.code as course_code, u.full_name as tutor_name,
             (SELECT COUNT(*) FROM batch_students bs WHERE bs.batch_id = b.id) as student_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      JOIN users u ON b.tutor_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (course_id) { query += ' AND b.course_id = ?'; values.push(course_id); }
    if (tutor_id) { query += ' AND b.tutor_id = ?'; values.push(tutor_id); }
    if (is_active !== undefined) { query += ' AND b.is_active = ?'; values.push(is_active); }

    query += ' ORDER BY b.start_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(r => this.format(r));
  }

  static async addStudent(batch_id, student_id) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT IGNORE INTO batch_students (id, batch_id, student_id) VALUES (?, ?, ?)`,
      [id, batch_id, student_id]
    );
    return { id, batch_id, student_id };
  }

  static async removeStudent(batch_id, student_id) {
    await pool.execute(
      'DELETE FROM batch_students WHERE batch_id = ? AND student_id = ?',
      [batch_id, student_id]
    );
  }

  static async listStudents(batch_id) {
    const [rows] = await pool.execute(
      `SELECT bs.id as enrollment_id, bs.joined_at, u.id as student_id, u.full_name as student_name, u.email as student_email
       FROM batch_students bs
       JOIN users u ON bs.student_id = u.id
       WHERE bs.batch_id = ?
       ORDER BY bs.joined_at ASC`,
      [batch_id]
    );
    return rows.map(r => this.format(r));
  }

  static async listStudentBatches(student_id) {
    const [rows] = await pool.execute(
      `SELECT b.*, c.name as course_name, c.code as course_code, u.full_name as tutor_name
       FROM batch_students bs
       JOIN batches b ON bs.batch_id = b.id
       JOIN courses c ON b.course_id = c.id
       JOIN users u ON b.tutor_id = u.id
       WHERE bs.student_id = ? AND b.is_active = TRUE
       ORDER BY b.start_date DESC`,
      [student_id]
    );
    return rows.map(r => this.format(r));
  }
}
