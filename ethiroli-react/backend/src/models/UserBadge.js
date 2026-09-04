import pool from '../config/database.js';

export default class UserBadge {
  static async award({ user_id, badge_id }) {
    await pool.execute(
      'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
      [user_id, badge_id]
    );
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT ub.*, b.name, b.description, b.icon 
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = ?`,
      [userId]
    );
    return rows;
  }
}