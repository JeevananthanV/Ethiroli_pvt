import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Certificate {
  static format(row) {
    if (!row) return null;
    // Joined user identity is encrypted at rest - decrypt before rendering
    // the certificate (learner name, email and issuing tutor).
    const formatted = { ...row };
    for (const field of ['student_name', 'student_email', 'tutor_name']) {
      if (formatted[field]) formatted[field] = decrypt(formatted[field]) || formatted[field];
    }
    return formatted;
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

  /** Lookup by certificate number, regardless of verification state. */
  static async findByCode(certificateNumber) {
    const [rows] = await pool.execute(
      'SELECT * FROM certificates WHERE certificate_number = ?',
      [certificateNumber]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  /** Idempotency guard: has this learner already earned this course's certificate? */
  static async findByStudentAndCourse(studentId, courseId) {
    const [rows] = await pool.execute(
      `SELECT * FROM certificates
        WHERE student_id = ? AND course_id = ?
        ORDER BY issue_date DESC, created_at DESC
        LIMIT 1`,
      [studentId, courseId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static detailSelect() {
    return `SELECT cert.*,
                   u.full_name AS student_name,
                   u.email AS student_email,
                   c.name AS course_name,
                   c.code AS course_code,
                   c.duration_days AS course_duration_days,
                   t.full_name AS tutor_name,
                   e.progress_percentage AS enrollment_progress
              FROM certificates cert
              JOIN users u ON u.id = cert.student_id
              JOIN courses c ON c.id = cert.course_id
              LEFT JOIN enrollments e ON e.id = cert.enrollment_id
              LEFT JOIN users t ON t.id = c.tutor_id`;
  }

  /** Certificate joined with learner + course identity (what the UI renders). */
  static async findByIdWithDetails(id) {
    const [rows] = await pool.execute(`${this.detailSelect()} WHERE cert.id = ?`, [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByCodeWithDetails(certificateNumber) {
    const [rows] = await pool.execute(`${this.detailSelect()} WHERE cert.certificate_number = ?`, [certificateNumber]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async listWithDetails({ student_id, course_id, limit = 50, offset = 0 } = {}) {
    let query = `${this.detailSelect()} WHERE 1=1`;
    const values = [];

    if (student_id) { query += ' AND cert.student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND cert.course_id = ?'; values.push(course_id); }

    query += ' ORDER BY cert.issue_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  /** True when the given user owns the certificate (ownership check for downloads). */
  static async isOwnedBy(certificate, userId) {
    if (!certificate) return false;
    if (certificate.student_id === userId) return true;
    return false;
  }
}
