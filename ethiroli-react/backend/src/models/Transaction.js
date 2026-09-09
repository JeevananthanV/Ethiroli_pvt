import pool from '../config/database.js';

export default class Transaction {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ type, category, amount, date, description = null, invoice_id = null, gst_applicable = false, gst_amount = 0.00, created_by }) {
    const [result] = await pool.execute(
      `INSERT INTO transactions (type, category, amount, date, description, invoice_id, gst_applicable, gst_amount, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, category, amount, date, description, invoice_id, gst_applicable, gst_amount, created_by]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.type !== undefined) { queryParts.push('type = ?'); values.push(updates.type); }
    if (updates.category !== undefined) { queryParts.push('category = ?'); values.push(updates.category); }
    if (updates.amount !== undefined) { queryParts.push('amount = ?'); values.push(updates.amount); }
    if (updates.date !== undefined) { queryParts.push('date = ?'); values.push(updates.date); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.gst_applicable !== undefined) { queryParts.push('gst_applicable = ?'); values.push(updates.gst_applicable); }
    if (updates.gst_amount !== undefined) { queryParts.push('gst_amount = ?'); values.push(updates.gst_amount); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE transactions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM transactions WHERE id = ?', [id]);
  }

  static async list({ type, category, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const values = [];

    if (type) { query += ' AND type = ?'; values.push(type); }
    if (category) { query += ' AND category = ?'; values.push(category); }

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ type, category } = {}) {
    let query = 'SELECT COUNT(*) as total FROM transactions WHERE 1=1';
    const values = [];

    if (type) { query += ' AND type = ?'; values.push(type); }
    if (category) { query += ' AND category = ?'; values.push(category); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
