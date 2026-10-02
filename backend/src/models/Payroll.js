import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Payroll {
  /**
   * `payroll.month_year` is a MySQL DATE column. The driver materialises it as
   * a JS Date at midnight in the *connection* timezone, which serialises to
   * e.g. "2026-08-31T18:30:00.000Z" on a UTC+5:30 server - so the real pay
   * month (September) would render as August. Callers therefore pass the raw
   * `YYYY-MM-DD` string selected via DATE_FORMAT, which needs no timezone
   * guesswork at all.
   * Purely additive: `month_year` is untouched so the Finance / payroll
   * screens keep their existing behaviour.
   */
  static monthYearLabel(value) {
    if (!value) return null;
    // Prefer an explicit YYYY-MM-DD string (unambiguous).
    const asText = value instanceof Date ? null : String(value);
    if (asText && /^\d{4}-\d{2}-\d{2}/.test(asText)) {
      const [y, m] = asText.split('-').map(Number);
      return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-GB', {
        month: 'long', year: 'numeric', timeZone: 'UTC',
      });
    }
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }

  static format(row) {
    if (!row) return null;
    const name = row.full_name ? decrypt(row.full_name) : (row.employee_name || null);
    const basicVal = parseFloat(row.basic || 0);
    const hraVal = parseFloat(row.hra || 0);
    const daVal = parseFloat(row.da || 0);
    const grossVal = parseFloat(row.gross_salary || (basicVal + hraVal + daVal));
    const deductionsVal = parseFloat(row.total_deductions || 0);
    const netVal = parseFloat(row.net_salary || (grossVal - deductionsVal));
    const allowancesVal = hraVal + daVal;

    return {
      ...row,
      full_name: name,
      employee_name: name,
      user_name: name,
      month_year_label: this.monthYearLabel(row.month_year_date || row.month_year),
      basicSalary: basicVal,
      allowances: allowancesVal,
      deductions: deductionsVal,
      netPay: netVal,
      email: row.email ? decrypt(row.email) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, DATE_FORMAT(p.month_year, '%Y-%m-%d') AS month_year_date,
              u.full_name, u.email, e.employee_code, e.department, e.designation
       FROM payroll p
       JOIN employees e ON p.employee_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ employee_id, month_year, basic, hra, da = 0, pf_employee = 0, pf_employer = 0, esi_employee = 0, esi_employer = 0, tds = 0, gross_salary, net_salary, total_deductions, status = 'DRAFT' }) {
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
    let query = `
      SELECT p.*, DATE_FORMAT(p.month_year, '%Y-%m-%d') AS month_year_date,
             u.full_name, u.email, e.employee_code, e.department, e.designation
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (employee_id) { query += ' AND p.employee_id = ?'; values.push(employee_id); }
    if (status) { query += ' AND p.status = ?'; values.push(status); }

    query += ' ORDER BY p.month_year DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, status } = {}) {
    let query = `
      SELECT COUNT(*) as total 
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      WHERE 1=1
    `;
    const values = [];

    if (employee_id) { query += ' AND p.employee_id = ?'; values.push(employee_id); }
    if (status) { query += ' AND p.status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
