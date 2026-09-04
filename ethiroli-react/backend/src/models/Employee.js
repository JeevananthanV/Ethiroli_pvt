import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class Employee {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      pan: row.pan ? decrypt(row.pan) : null,
      bank_account: row.bank_account ? decrypt(row.bank_account) : null,
      pf_number: row.pf_number ? decrypt(row.pf_number) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM employees WHERE user_id = ?', [userId]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, employee_code, department, designation, date_of_joining, pan = null, bank_account = null, pf_number = null }) {
    const [result] = await pool.execute(
      `INSERT INTO employees (user_id, employee_code, department, designation, date_of_joining, pan, bank_account, pf_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, employee_code, department, designation, date_of_joining, pan ? encrypt(pan) : null, bank_account ? encrypt(bank_account) : null, pf_number ? encrypt(pf_number) : null]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.department !== undefined) {
      queryParts.push('department = ?');
      values.push(updates.department);
    }
    if (updates.designation !== undefined) {
      queryParts.push('designation = ?');
      values.push(updates.designation);
    }
    if (updates.pan !== undefined) {
      queryParts.push('pan = ?');
      values.push(updates.pan ? encrypt(updates.pan) : null);
    }
    if (updates.bank_account !== undefined) {
      queryParts.push('bank_account = ?');
      values.push(updates.bank_account ? encrypt(updates.bank_account) : null);
    }
    if (updates.pf_number !== undefined) {
      queryParts.push('pf_number = ?');
      values.push(updates.pf_number ? encrypt(updates.pf_number) : null);
    }

    if (queryParts.length === 0) return;
    values.push(id);

    await pool.execute(
      `UPDATE employees SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.full_name, u.is_active 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(row => this.format(row));
  }
}