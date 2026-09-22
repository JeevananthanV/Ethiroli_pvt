import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Doubt {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      student_name: row.student_name ? decrypt(row.student_name) : null,
      student_email: row.student_email ? decrypt(row.student_email) : null,
      tutor_name: row.tutor_name ? decrypt(row.tutor_name) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT d.*, c.name as course_name, c.code as course_code,
              u.full_name as student_name, u.email as student_email,
              ut.full_name as tutor_name
       FROM doubts d
       JOIN courses c ON d.course_id = c.id
       JOIN users u ON d.student_id = u.id
       LEFT JOIN users ut ON d.assigned_tutor_id = ut.id
       WHERE d.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    student_id,
    course_id,
    lesson_id = null,
    title,
    description,
    code_snippet = null,
    screenshot_url = null
  }) {
    await pool.execute(
      `INSERT INTO doubts (id, student_id, course_id, lesson_id, title, description, code_snippet, screenshot_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [id, student_id, course_id, lesson_id, title, description, code_snippet, screenshot_url]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.assigned_tutor_id !== undefined) { queryParts.push('assigned_tutor_id = ?'); values.push(updates.assigned_tutor_id); }
    if (updates.resolution_notes !== undefined) { queryParts.push('resolution_notes = ?'); values.push(updates.resolution_notes); }
    if (updates.resolved_at !== undefined) { queryParts.push('resolved_at = ?'); values.push(updates.resolved_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE doubts SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async resolve(id, { assigned_tutor_id, resolution_notes }) {
    await pool.execute(
      `UPDATE doubts 
       SET status = 'RESOLVED', assigned_tutor_id = ?, resolution_notes = ?, resolved_at = NOW()
       WHERE id = ?`,
      [assigned_tutor_id, resolution_notes, id]
    );
  }

  static async list({ student_id, course_id, status, assigned_tutor_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT d.*, c.name as course_name, c.code as course_code,
             u.full_name as student_name, u.email as student_email,
             ut.full_name as tutor_name
      FROM doubts d
      JOIN courses c ON d.course_id = c.id
      JOIN users u ON d.student_id = u.id
      LEFT JOIN users ut ON d.assigned_tutor_id = ut.id
      WHERE 1=1
    `;
    const values = [];

    if (student_id) { query += ' AND d.student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND d.course_id = ?'; values.push(course_id); }
    if (status) { query += ' AND d.status = ?'; values.push(status); }
    if (assigned_tutor_id) { query += ' AND d.assigned_tutor_id = ?'; values.push(assigned_tutor_id); }

    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(r => this.format(r));
  }
}
