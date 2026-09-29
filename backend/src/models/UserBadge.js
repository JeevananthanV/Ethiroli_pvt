import pool from '../config/database.js';

export default class UserBadge {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM user_badges WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async award({ user_id, badge_id }) {
    await pool.execute(
      'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
      [user_id, badge_id]
    );
    return `${user_id}_${badge_id}`;
  }

  static async create({ user_id, badge_id }) {
    return this.award({ user_id, badge_id });
  }


  static async delete(id) {
    await pool.execute('DELETE FROM user_badges WHERE id = ?', [id]);
  }

  static async list({ user_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT ub.*, b.name, b.description, b.icon 
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE 1=1
    `;
    const values = [];

    if (user_id) { query += ' AND ub.user_id = ?'; values.push(user_id); }

    query += ' ORDER BY ub.earned_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM user_badges WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async findByUserId(userId) {
    return this.list({ user_id: userId, limit: 1000 });
  }
}
