import pool from '../config/database.js';

export default class Lesson {
  static async listByModuleId(moduleId) {
    const [rows] = await pool.execute(
      'SELECT * FROM lessons WHERE module_id = ? ORDER BY lesson_order ASC',
      [moduleId]
    );
    return rows;
  }

  static async create({ module_id, title, content, video_url = null, lesson_order }) {
    await pool.execute(
      `INSERT INTO lessons (module_id, title, content, video_url, lesson_order)
       VALUES (?, ?, ?, ?, ?)`,
      [module_id, title, content, video_url, lesson_order]
    );
  }

  static async update(id, { title, content, video_url, lesson_order }) {
    await pool.execute(
      `UPDATE lessons SET title = ?, content = ?, video_url = ?, lesson_order = ? 
       WHERE id = ?`,
      [title, content, video_url, lesson_order, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM lessons WHERE id = ?', [id]);
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM lessons WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}