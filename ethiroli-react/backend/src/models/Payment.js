import pool from '../config/database.js';

export default class Payment {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      gateway_response: row.gateway_response ? JSON.parse(row.gateway_response) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ invoice_id, amount, payment_date, method, reference_number = null, status = 'PENDING', gateway_response = null }) {
    const [result] = await pool.execute(
      `INSERT INTO payments (invoice_id, amount, payment_date, method, reference_number, status, gateway_response)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [invoice_id, amount, payment_date, method, reference_number, status, gateway_response ? JSON.stringify(gateway_response) : null]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.reference_number !== undefined) { queryParts.push('reference_number = ?'); values.push(updates.reference_number); }
    if (updates.gateway_response !== undefined) { queryParts.push('gateway_response = ?'); values.push(updates.gateway_response ? JSON.stringify(updates.gateway_response) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE payments SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM payments WHERE id = ?', [id]);
  }

  static async list({ invoice_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM payments WHERE 1=1';
    const values = [];

    if (invoice_id) { query += ' AND invoice_id = ?'; values.push(invoice_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY payment_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ invoice_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM payments WHERE 1=1';
    const values = [];

    if (invoice_id) { query += ' AND invoice_id = ?'; values.push(invoice_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
