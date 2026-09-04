import pool from '../config/database.js';

export default class Course {
  static async list({ tutor_id } = {}) {
    let query = `
      SELECT c.*, u.full_name as tutor_name 
      FROM courses c 
      LEFT JOIN users u ON c.tutor_id = u.id
    `;
    const values = [];
    if (tutor_id) {
      query += ' WHERE c.tutor_id = ?';
      values.push(tutor_id);
    }
    const [rows] = await pool.execute(query, values);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ code, name, description, duration_days, fee, tutor_id }) {
    const [result] = await pool.execute(
      `INSERT INTO courses (code, name, description, duration_days, fee, tutor_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, name, description, duration_days, fee, tutor_id]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];
    if (updates.name !== undefined) {
      queryParts.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      queryParts.push('description = ?');
      values.push(updates.description);
    }
    if (updates.duration_days !== undefined) {
      queryParts.push('duration_days = ?');
      values.push(updates.duration_days);
    }
    if (updates.fee !== undefined) {
      queryParts.push('fee = ?');
      values.push(updates.fee);
    }
    if (updates.tutor_id !== undefined) {
      queryParts.push('tutor_id = ?');
      values.push(updates.tutor_id);
    }
    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE courses SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
  }
}