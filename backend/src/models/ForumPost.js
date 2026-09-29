import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ForumPost {
  static format(row) {
    if (!row) return null;
    const formatted = { ...row };
    if (formatted.author_name) formatted.author_name = decrypt(formatted.author_name) || formatted.author_name;
    if (formatted.author_email) formatted.author_email = decrypt(formatted.author_email) || formatted.author_email;
    return formatted;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM forum_posts WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ course_id = null, author_id, title, content, category = 'general', is_pinned = false, is_locked = false }) {
    const [result] = await pool.execute(
      `INSERT INTO forum_posts (course_id, author_id, title, content, category, is_pinned, is_locked)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [course_id, author_id, title, content, category || 'general', is_pinned, is_locked]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.content !== undefined) { queryParts.push('content = ?'); values.push(updates.content); }
    if (updates.category !== undefined) { queryParts.push('category = ?'); values.push(updates.category || 'general'); }
    if (updates.is_pinned !== undefined) { queryParts.push('is_pinned = ?'); values.push(updates.is_pinned); }
    if (updates.is_locked !== undefined) { queryParts.push('is_locked = ?'); values.push(updates.is_locked); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE forum_posts SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM forum_posts WHERE id = ?', [id]);
  }

  static async list({ course_id, category, is_pinned, is_locked, viewer_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT p.*,
             u.full_name as author_name,
             (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) AS reply_count,
             (SELECT COUNT(*) FROM forum_post_votes v WHERE v.post_id = p.id) AS upvotes,
             ${viewer_id ? '(SELECT COUNT(*) FROM forum_post_votes v WHERE v.post_id = p.id AND v.user_id = ?)' : '0'} AS viewer_has_voted
      FROM forum_posts p
      JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (viewer_id) values.push(viewer_id);
    if (course_id) { query += ' AND p.course_id = ?'; values.push(course_id); }
    if (category) { query += ' AND p.category = ?'; values.push(category); }
    if (is_pinned !== undefined) { query += ' AND p.is_pinned = ?'; values.push(is_pinned); }
    if (is_locked !== undefined) { query += ' AND p.is_locked = ?'; values.push(is_locked); }

    query += ' ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ course_id, category, is_pinned, is_locked } = {}) {
    let query = 'SELECT COUNT(*) as total FROM forum_posts WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (category) { query += ' AND category = ?'; values.push(category); }
    if (is_pinned !== undefined) { query += ' AND is_pinned = ?'; values.push(is_pinned); }
    if (is_locked !== undefined) { query += ' AND is_locked = ?'; values.push(is_locked); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  /**
   * Toggle the calling user's upvote on a post.
   * Returns `{ voted, upvotes }` for the post after the change.
   */
  static async toggleVote(postId, userId) {
    const [existing] = await pool.execute(
      'SELECT id FROM forum_post_votes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      await pool.execute('DELETE FROM forum_post_votes WHERE id = ?', [existing[0].id]);
    } else {
      await pool.execute(
        'INSERT INTO forum_post_votes (id, post_id, user_id, vote) VALUES (?, ?, ?, 1)',
        [crypto.randomUUID(), postId, userId]
      );
    }

    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM forum_post_votes WHERE post_id = ?',
      [postId]
    );

    return { voted: existing.length === 0, upvotes: Number(total) || 0 };
  }

  static async updatePin(id, is_pinned) {
    await pool.execute('UPDATE forum_posts SET is_pinned = ? WHERE id = ?', [is_pinned, id]);
  }

  static async updateLock(id, is_locked) {
    await pool.execute('UPDATE forum_posts SET is_locked = ? WHERE id = ?', [is_locked, id]);
  }
}
