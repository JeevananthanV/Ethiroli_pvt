import pool from '../config/database.js';
import crypto from 'crypto';
import { decrypt } from '../config/encryption.js';

export default class Enrollment {
  static format(row) {
    if (!row) return null;
    const formatted = { ...row };
    if (formatted.student_name) formatted.student_name = decrypt(formatted.student_name) || formatted.student_name;
    if (formatted.student_email) formatted.student_email = decrypt(formatted.student_email) || formatted.student_email;
    if (formatted.assigned_by_tutor_name) formatted.assigned_by_tutor_name = decrypt(formatted.assigned_by_tutor_name) || formatted.assigned_by_tutor_name;
    if (formatted.assigned_by_tutor_email) formatted.assigned_by_tutor_email = decrypt(formatted.assigned_by_tutor_email) || formatted.assigned_by_tutor_email;
    if (formatted.course_instructor_name) formatted.course_instructor_name = decrypt(formatted.course_instructor_name) || formatted.course_instructor_name;
    return formatted;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM enrollments WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByStudentAndCourse(student_id, course_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ student_id, course_id, assigned_by_tutor_id = null, due_date = null, notes = null, status = 'ACTIVE' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO enrollments (id, student_id, course_id, assigned_by_tutor_id, due_date, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         assigned_by_tutor_id = COALESCE(VALUES(assigned_by_tutor_id), enrollments.assigned_by_tutor_id),
         due_date = COALESCE(VALUES(due_date), enrollments.due_date),
         notes = COALESCE(VALUES(notes), enrollments.notes),
         status = VALUES(status),
         updated_at = NOW()`,
      [id, student_id, course_id, assigned_by_tutor_id, due_date, notes, status]
    );
    return id;
  }

  static async assignCourses({ student_id, course_ids, assigned_by_tutor_id, due_date = null, notes = null }) {
    if (!student_id) throw new Error('student_id is required');
    if (!Array.isArray(course_ids) || course_ids.length === 0) {
      throw new Error('course_ids must be a non-empty array of course IDs');
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Verify student exists
      const [students] = await connection.execute(
        'SELECT id, role, is_active FROM users WHERE id = ?',
        [student_id]
      );
      if (students.length === 0) {
        throw new Error('Student user not found');
      }

      // 2. Verify all courses exist
      const placeholders = course_ids.map(() => '?').join(',');
      const [courses] = await connection.query(
        `SELECT id, name, code FROM courses WHERE id IN (${placeholders})`,
        course_ids
      );

      if (courses.length !== course_ids.length) {
        const foundIds = new Set(courses.map(c => c.id));
        const missing = course_ids.filter(id => !foundIds.has(id));
        throw new Error(`One or more courses not found: ${missing.join(', ')}`);
      }

      // 3. Batch assign courses idempotently
      for (const course_id of course_ids) {
        const id = crypto.randomUUID();
        await connection.execute(
          `INSERT INTO enrollments (id, student_id, course_id, assigned_by_tutor_id, due_date, notes, status)
           VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
           ON DUPLICATE KEY UPDATE
             assigned_by_tutor_id = VALUES(assigned_by_tutor_id),
             due_date = VALUES(due_date),
             notes = VALUES(notes),
             status = 'ACTIVE',
             updated_at = NOW()`,
          [id, student_id, course_id, assigned_by_tutor_id, due_date, notes]
        );
      }

      await connection.commit();

      // Return the updated list of enrollments for this student
      return await this.list({ student_id, limit: 1000 });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.progress_percentage !== undefined) { queryParts.push('progress_percentage = ?'); values.push(updates.progress_percentage); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.completed_at !== undefined) { queryParts.push('completed_at = ?'); values.push(updates.completed_at); }
    if (updates.due_date !== undefined) { queryParts.push('due_date = ?'); values.push(updates.due_date); }
    if (updates.notes !== undefined) { queryParts.push('notes = ?'); values.push(updates.notes); }
    if (updates.assigned_by_tutor_id !== undefined) { queryParts.push('assigned_by_tutor_id = ?'); values.push(updates.assigned_by_tutor_id); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE enrollments SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM enrollments WHERE id = ?', [id]);
  }

  static async list({ student_id, course_id, assigned_by_tutor_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT 
        e.*, 
        c.name as course_name, 
        c.code as course_code,
        c.description as course_description,
        c.duration_days as course_duration_days,
        c.fee as course_fee,
        u.full_name as student_name, 
        u.email as student_email,
        t.full_name as assigned_by_tutor_name,
        t.email as assigned_by_tutor_email,
        instructor.full_name as course_instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.student_id = u.id
      LEFT JOIN users t ON e.assigned_by_tutor_id = t.id
      LEFT JOIN users instructor ON c.tutor_id = instructor.id
      WHERE 1=1
    `;
    const values = [];

    if (student_id) { query += ' AND e.student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND e.course_id = ?'; values.push(course_id); }
    if (assigned_by_tutor_id) { query += ' AND e.assigned_by_tutor_id = ?'; values.push(assigned_by_tutor_id); }
    if (status) { query += ' AND e.status = ?'; values.push(status); }

    query += ' ORDER BY e.enrolled_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ student_id, course_id, assigned_by_tutor_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM enrollments WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (assigned_by_tutor_id) { query += ' AND assigned_by_tutor_id = ?'; values.push(assigned_by_tutor_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async enroll({ student_id, course_id, assigned_by_tutor_id = null, due_date = null, notes = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO enrollments (id, student_id, course_id, assigned_by_tutor_id, due_date, notes)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         assigned_by_tutor_id = COALESCE(VALUES(assigned_by_tutor_id), enrollments.assigned_by_tutor_id),
         due_date = COALESCE(VALUES(due_date), enrollments.due_date),
         notes = COALESCE(VALUES(notes), enrollments.notes),
         updated_at = NOW()`,
      [id, student_id, course_id, assigned_by_tutor_id, due_date, notes]
    );
    return id;
  }

  static async updateProgress(id, progress) {
    await pool.execute(
      `UPDATE enrollments SET progress_percentage = ? WHERE id = ?`,
      [progress, id]
    );
  }

  static async listByStudentId(studentId, { status, limit = 1000, offset = 0 } = {}) {
    return this.list({ student_id: studentId, status, limit, offset });
  }

  static async listByCourseId(courseId, { status, limit = 1000, offset = 0 } = {}) {
    return this.list({ course_id: courseId, status, limit, offset });
  }

  static async listByTutorId(tutorId, { status, limit = 1000, offset = 0 } = {}) {
    return this.list({ assigned_by_tutor_id: tutorId, status, limit, offset });
  }
}
