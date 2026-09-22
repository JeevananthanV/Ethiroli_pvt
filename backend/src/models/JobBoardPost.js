import crypto from 'crypto';
import pool from '../config/database.js';

export default class JobBoardPost {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      platform_response: row.platform_response ? JSON.parse(row.platform_response) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM job_board_posts WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ job_id, platform, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO job_board_posts (id, job_id, platform, created_by)
       VALUES (?, ?, ?, ?)`,
      [id, job_id, platform, created_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.platform !== undefined) { queryParts.push('platform = ?'); values.push(updates.platform); }
    if (updates.external_post_id !== undefined) { queryParts.push('external_post_id = ?'); values.push(updates.external_post_id); }
    if (updates.posted_at !== undefined) { queryParts.push('posted_at = ?'); values.push(updates.posted_at); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.error_message !== undefined) { queryParts.push('error_message = ?'); values.push(updates.error_message); }
    if (updates.platform_response !== undefined) { queryParts.push('platform_response = ?'); values.push(updates.platform_response ? JSON.stringify(updates.platform_response) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE job_board_posts SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM job_board_posts WHERE id = ?', [id]);
  }

  static async list({ job_id, platform, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM job_board_posts WHERE 1=1';
    const values = [];

    if (job_id) { query += ' AND job_id = ?'; values.push(job_id); }
    if (platform) { query += ' AND platform = ?'; values.push(platform); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ job_id, platform, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM job_board_posts WHERE 1=1';
    const values = [];

    if (job_id) { query += ' AND job_id = ?'; values.push(job_id); }
    if (platform) { query += ' AND platform = ?'; values.push(platform); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
