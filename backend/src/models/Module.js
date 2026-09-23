import pool from '../config/database.js';
import crypto from 'crypto';

export default class Module {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM modules WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ course_id, title, module_order }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO modules (id, course_id, title, module_order) VALUES (?, ?, ?, ?)`,
      [id, course_id, title, module_order]
    );
    return id;
  }

  static async update(id, { title, module_order }) {
    const queryParts = [];
    const values = [];

    if (title !== undefined) { queryParts.push('title = ?'); values.push(title); }
    if (module_order !== undefined) { queryParts.push('module_order = ?'); values.push(module_order); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE modules SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM modules WHERE id = ?', [id]);
  }

  static async list({ course_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM modules WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    query += ' ORDER BY module_order ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ course_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM modules WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByCourseId(courseId) {
    return this.list({ course_id: courseId, limit: 1000 });
  }

  static async reorder(courseId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute(
          'UPDATE modules SET module_order = ? WHERE id = ? AND course_id = ?',
          [i + 1, orderedIds[i], courseId]
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
