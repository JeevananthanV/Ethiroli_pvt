import pool from '../config/database.js';

export default class ForumReply {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM forum_replies WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ post_id, author_id, content, is_best_answer = false }) {
    const [result] = await pool.execute(
      `INSERT INTO forum_replies (post_id, author_id, content, is_best_answer)
       VALUES (?, ?, ?, ?)`,
      [post_id, author_id, content, is_best_answer]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.content !== undefined) { queryParts.push('content = ?'); values.push(updates.content); }
    if (updates.is_best_answer !== undefined) { queryParts.push('is_best_answer = ?'); values.push(updates.is_best_answer); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE forum_replies SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM forum_replies WHERE id = ?', [id]);
  }

  static async list({ post_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT r.*, u.full_name as author_name 
      FROM forum_replies r
      JOIN users u ON r.author_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (post_id) { query += ' AND r.post_id = ?'; values.push(post_id); }

    query += ' ORDER BY r.created_at ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ post_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM forum_replies WHERE 1=1';
    const values = [];

    if (post_id) { query += ' AND post_id = ?'; values.push(post_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByPostId(postId) {
    return this.list({ post_id: postId, limit: 1000 });
  }
}
