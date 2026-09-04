import pool from '../config/database.js';

export default class Module {
  static async listByCourseId(courseId) {
    const [rows] = await pool.execute(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY module_order ASC',
      [courseId]
    );
    return rows;
  }

  static async create({ course_id, title, module_order }) {
    await pool.execute(
      `INSERT INTO modules (course_id, title, module_order) VALUES (?, ?, ?)`,
      [course_id, title, module_order]
    );
  }

  static async update(id, { title, module_order }) {
    await pool.execute(
      `UPDATE modules SET title = ?, module_order = ? WHERE id = ?`,
      [title, module_order, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM modules WHERE id = ?', [id]);
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM modules WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}