import pool from '../config/database.js';

export default class ForumReply {
  static async create({ post_id, author_id, content }) {
    await pool.execute(
      'INSERT INTO forum_replies (post_id, author_id, content) VALUES (?, ?, ?)',
      [post_id, author_id, content]
    );
  }

  static async listByPostId(postId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.full_name as author_name 
       FROM forum_replies r
       JOIN users u ON r.author_id = u.id
       WHERE r.post_id = ? 
       ORDER BY r.created_at ASC`,
      [postId]
    );
    return rows;
  }
}