import pool from '../config/database.js';

export default class Task {
  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ subscription_id, description, due_date, assigned_to = null }) {
    const [result] = await pool.execute(
      `INSERT INTO tasks (subscription_id, description, due_date, assigned_to)
       VALUES (?, ?, ?, ?)`,
      [subscription_id, description, due_date, assigned_to]
    );
    return result.insertId || result.info;
  }

  static async updateStatus(id, status) {
    await pool.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
  }

  static async list({ assigned_to, subscription_id } = {}) {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const values = [];

    if (assigned_to) {
      query += ' AND assigned_to = ?';
      values.push(assigned_to);
    }
    if (subscription_id) {
      query += ' AND subscription_id = ?';
      values.push(subscription_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}