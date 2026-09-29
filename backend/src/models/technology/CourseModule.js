import pool from '../../config/database.js';

export default class CourseModule {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async create({ course_id, module_id, module_order, is_optional, custom_duration_days }) {
    const id = crypto.randomUUID();
    await pool.execute(
      'INSERT INTO course_modules (id, course_id, module_id, module_order, is_optional, custom_duration_days) VALUES (?, ?, ?, ?, ?, ?)',
      [id, course_id, module_id, module_order, is_optional ? 1 : 0, custom_duration_days || null]
    );
    return id;
  }

  static async delete(id) {
    await pool.execute('DELETE FROM course_modules WHERE id = ?', [id]);
  }

  static async listByCourseId(courseId) {
    const [rows] = await pool.execute(
      'SELECT * FROM course_modules WHERE course_id = ? ORDER BY module_order',
      [courseId]
    );
    return rows.map(row => this.format(row));
  }

  static async reorder(courseId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute('UPDATE course_modules SET module_order = ? WHERE module_id = ? AND course_id = ?', [i + 1, orderedIds[i], courseId]);
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
