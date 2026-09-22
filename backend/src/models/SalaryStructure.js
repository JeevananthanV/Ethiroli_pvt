import crypto from 'crypto';
import pool from '../config/database.js';

export default class SalaryStructure {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM salary_structures WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ employee_id, basic, hra, da = 0.00, pf_percentage = 12.00, esi_percentage = 0.75, tds_percentage = 0.00, effective_from, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO salary_structures (id, employee_id, basic, hra, da, pf_percentage, esi_percentage, tds_percentage, effective_from, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, employee_id, basic, hra, da, pf_percentage, esi_percentage, tds_percentage, effective_from, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.basic !== undefined) { queryParts.push('basic = ?'); values.push(updates.basic); }
    if (updates.hra !== undefined) { queryParts.push('hra = ?'); values.push(updates.hra); }
    if (updates.da !== undefined) { queryParts.push('da = ?'); values.push(updates.da); }
    if (updates.pf_percentage !== undefined) { queryParts.push('pf_percentage = ?'); values.push(updates.pf_percentage); }
    if (updates.esi_percentage !== undefined) { queryParts.push('esi_percentage = ?'); values.push(updates.esi_percentage); }
    if (updates.tds_percentage !== undefined) { queryParts.push('tds_percentage = ?'); values.push(updates.tds_percentage); }
    if (updates.effective_from !== undefined) { queryParts.push('effective_from = ?'); values.push(updates.effective_from); }
    if (updates.effective_to !== undefined) { queryParts.push('effective_to = ?'); values.push(updates.effective_to); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE salary_structures SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM salary_structures WHERE id = ?', [id]);
  }

  static async list({ employee_id, is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM salary_structures WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY effective_from DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM salary_structures WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async findActiveByEmployeeId(employeeId) {
    const [rows] = await pool.execute(
      'SELECT * FROM salary_structures WHERE employee_id = ? AND is_active = TRUE',
      [employeeId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }
}
