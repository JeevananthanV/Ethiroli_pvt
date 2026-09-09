import pool from '../config/database.js';

export default class Course {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ code, name, description, duration_days, fee, tutor_id }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO courses (id, code, name, description, duration_days, fee, tutor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, code, name, description, duration_days, fee, tutor_id]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.code !== undefined) { queryParts.push('code = ?'); values.push(updates.code); }
    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.duration_days !== undefined) { queryParts.push('duration_days = ?'); values.push(updates.duration_days); }
    if (updates.fee !== undefined) { queryParts.push('fee = ?'); values.push(updates.fee); }
    if (updates.tutor_id !== undefined) { queryParts.push('tutor_id = ?'); values.push(updates.tutor_id); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE courses SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
  }

  static async list({ tutor_id, is_active, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT c.*, u.full_name as tutor_name 
      FROM courses c 
      LEFT JOIN users u ON c.tutor_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (tutor_id) { query += ' AND c.tutor_id = ?'; values.push(tutor_id); }
    if (is_active !== undefined) { query += ' AND c.is_active = ?'; values.push(is_active); }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tutor_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM courses WHERE 1=1';
    const values = [];

    if (tutor_id) { query += ' AND tutor_id = ?'; values.push(tutor_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
