import crypto from 'crypto';
import pool from '../config/database.js';

export default class Payroll {
  static async create({ employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status = 'DRAFT' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO payroll (id, employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE basic=VALUES(basic), hra=VALUES(hra), da=VALUES(da), gross_salary=VALUES(gross_salary), net_salary=VALUES(net_salary)`,
      [id, employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status]
    );
    return id;
  }

  static async list({ employee_id } = {}) {
    let query = 'SELECT * FROM payroll WHERE 1=1';
    const values = [];

    if (employee_id) {
      query += ' AND employee_id = ?';
      values.push(employee_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}