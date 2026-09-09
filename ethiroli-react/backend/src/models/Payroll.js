import crypto from 'crypto';
import pool from '../config/database.js';

export default class Payroll {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM payroll WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status = 'DRAFT' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO payroll (id, employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.basic !== undefined) { queryParts.push('basic = ?'); values.push(updates.basic); }
    if (updates.hra !== undefined) { queryParts.push('hra = ?'); values.push(updates.hra); }
    if (updates.da !== undefined) { queryParts.push('da = ?'); values.push(updates.da); }
    if (updates.pf_employee !== undefined) { queryParts.push('pf_employee = ?'); values.push(updates.pf_employee); }
    if (updates.pf_employer !== undefined) { queryParts.push('pf_employer = ?'); values.push(updates.pf_employer); }
    if (updates.esi_employee !== undefined) { queryParts.push('esi_employee = ?'); values.push(updates.esi_employee); }
    if (updates.esi_employer !== undefined) { queryParts.push('esi_employer = ?'); values.push(updates.esi_employer); }
    if (updates.tds !== undefined) { queryParts.push('tds = ?'); values.push(updates.tds); }
    if (updates.gross_salary !== undefined) { queryParts.push('gross_salary = ?'); values.push(updates.gross_salary); }
    if (updates.net_salary !== undefined) { queryParts.push('net_salary = ?'); values.push(updates.net_salary); }
    if (updates.total_deductions !== undefined) { queryParts.push('total_deductions = ?'); values.push(updates.total_deductions); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.bank_transfer_ref !== undefined) { queryParts.push('bank_transfer_ref = ?'); values.push(updates.bank_transfer_ref); }
    if (updates.payslip_pdf_url !== undefined) { queryParts.push('payslip_pdf_url = ?'); values.push(updates.payslip_pdf_url); }
    if (updates.processed_by !== undefined) { queryParts.push('processed_by = ?'); values.push(updates.processed_by); }
    if (updates.processed_at !== undefined) { queryParts.push('processed_at = ?'); values.push(updates.processed_at); }
    if (updates.paid_at !== undefined) { queryParts.push('paid_at = ?'); values.push(updates.paid_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE payroll SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM payroll WHERE id = ?', [id]);
  }

  static async list({ employee_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM payroll WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY month_year DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM payroll WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
