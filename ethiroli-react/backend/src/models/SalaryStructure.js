import crypto from 'crypto';
import pool from '../config/database.js';

export default class SalaryStructure {
  static async create({ employee_id, basic, hra, da = 0.00, pf_percentage = 12.00, esi_percentage = 0.75, tds_percentage = 0.00, effective_from }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO salary_structures (id, employee_id, basic, hra, da, pf_percentage, esi_percentage, tds_percentage, effective_from)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, employee_id, basic, hra, da, pf_percentage, esi_percentage, tds_percentage, effective_from]
    );
    return id;
  }

  static async findActiveByEmployeeId(employeeId) {
    const [rows] = await pool.execute(
      'SELECT * FROM salary_structures WHERE employee_id = ? AND is_active = TRUE',
      [employeeId]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}