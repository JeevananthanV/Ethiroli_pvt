import pool from '../config/database.js';
import crypto from 'crypto';

export default class Lesson {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM lessons WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ module_id, title, content, video_url = null, lesson_order }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO lessons (id, module_id, title, content, video_url, lesson_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, module_id, title, content, video_url, lesson_order]
    );
    return id;
  }

  static async update(id, { title, content, video_url, lesson_order }) {
    const queryParts = [];
    const values = [];

    if (title !== undefined) { queryParts.push('title = ?'); values.push(title); }
    if (content !== undefined) { queryParts.push('content = ?'); values.push(content); }
    if (video_url !== undefined) { queryParts.push('video_url = ?'); values.push(video_url); }
    if (lesson_order !== undefined) { queryParts.push('lesson_order = ?'); values.push(lesson_order); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE lessons SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM lessons WHERE id = ?', [id]);
  }

  static async list({ module_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM lessons WHERE 1=1';
    const values = [];

    if (module_id) { query += ' AND module_id = ?'; values.push(module_id); }

    query += ' ORDER BY lesson_order ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ module_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM lessons WHERE 1=1';
    const values = [];

    if (module_id) { query += ' AND module_id = ?'; values.push(module_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  /**
   * Lessons for a module. When `studentId` is supplied the result is
   * annotated with that learner's per-lesson completion state, which is what
   * the syllabus tree renders as a tick / grey bullet.
   */
  static async listByModuleId(moduleId, studentId = null) {
    if (!studentId) return this.list({ module_id: moduleId, limit: 1000 });

    const [rows] = await pool.execute(
      `SELECT l.*, lp.id IS NOT NULL AS is_completed, lp.completed_at AS completed_at
         FROM lessons l
         LEFT JOIN lesson_progress lp
                ON lp.lesson_id = l.id
               AND lp.student_id = ?
        WHERE l.module_id = ?
        ORDER BY l.lesson_order ASC`,
      [studentId, moduleId]
    );
    return rows.map(row => ({
      ...this.format(row),
      is_completed: Boolean(row.is_completed)
    }));
  }

  static async reorder(moduleId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute(
          'UPDATE lessons SET lesson_order = ? WHERE id = ? AND module_id = ?',
          [i + 1, orderedIds[i], moduleId]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}
