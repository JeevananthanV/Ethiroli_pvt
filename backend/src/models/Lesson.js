import pool from '../config/database.js';

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
    const [result] = await pool.execute(
      `INSERT INTO lessons (module_id, title, content, video_url, lesson_order)
       VALUES (?, ?, ?, ?, ?)`,
      [module_id, title, content, video_url, lesson_order]
    );
    return result.insertId || result.info;
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

  static async listByModuleId(moduleId) {
    return this.list({ module_id: moduleId, limit: 1000 });
  }
}
