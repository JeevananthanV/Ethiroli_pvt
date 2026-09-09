import pool from '../config/database.js';

export default class Task {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ subscription_id, description, due_date, assigned_to = null, status = 'PENDING' }) {
    const [result] = await pool.execute(
      `INSERT INTO tasks (subscription_id, description, due_date, assigned_to, status)
       VALUES (?, ?, ?, ?, ?)`,
      [subscription_id, description, due_date, assigned_to, status]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.due_date !== undefined) { queryParts.push('due_date = ?'); values.push(updates.due_date); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.assigned_to !== undefined) { queryParts.push('assigned_to = ?'); values.push(updates.assigned_to); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE tasks SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
  }

  static async list({ assigned_to, subscription_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const values = [];

    if (assigned_to) { query += ' AND assigned_to = ?'; values.push(assigned_to); }
    if (subscription_id) { query += ' AND subscription_id = ?'; values.push(subscription_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY due_date ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ assigned_to, subscription_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM tasks WHERE 1=1';
    const values = [];

    if (assigned_to) { query += ' AND assigned_to = ?'; values.push(assigned_to); }
    if (subscription_id) { query += ' AND subscription_id = ?'; values.push(subscription_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async updateStatus(id, status) {
    await pool.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
  }
}
