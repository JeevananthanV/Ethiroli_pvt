import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class Employee {
  static format(row) {
    if (!row) return null;
    const fullName = row.full_name ? decrypt(row.full_name) : (row.name || null);
    const email = row.email ? decrypt(row.email) : null;
    // Defence in depth: if `decrypt` ever throws (it currently swallows its own
    // errors and returns the input unchanged, which is what lets legacy plaintext
    // rows keep working), the profile request must still render rather than 500.
    const safeDecrypt = (v) => {
      if (!v) return null;
      try { return decrypt(v); } catch { return null; }
    };
    return {
      ...row,
      full_name: fullName,
      name: fullName,
      email,
      pan: safeDecrypt(row.pan),
      bank_account: safeDecrypt(row.bank_account),
      pf_number: safeDecrypt(row.pf_number),
      // uan was added encrypted by migration 013 but was never decrypted here, so
      // the Employee Profile's "PF / UAN" row would have rendered the raw
      // ciphertext to the employee once HR populated it.
      uan: safeDecrypt(row.uan),
      // bank_name / bank_ifsc are public branch identifiers (printed on a cheque
      // book and in every UPI id) and are stored in plain text by migration 016.
      // blood_group / emergency_contact / address are self-service plain text,
      // consistent with users.phone.
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.full_name, u.is_active, u.role 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.id = ?`,
      [id]
    );
    if (rows.length > 0) return this.format(rows[0]);
    const [raw] = await pool.execute('SELECT * FROM employees WHERE id = ?', [id]);
    return raw.length > 0 ? this.format(raw[0]) : null;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.full_name, u.is_active, u.role 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.user_id = ?`,
      [userId]
    );
    if (rows.length > 0) return this.format(rows[0]);
    const [raw] = await pool.execute('SELECT * FROM employees WHERE user_id = ?', [userId]);
    return raw.length > 0 ? this.format(raw[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), user_id, employee_code, department, designation, date_of_joining, pan = null, bank_account = null, pf_number = null }) {
    await pool.execute(
      `INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining, pan, bank_account, pf_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, employee_code, department, designation, date_of_joining, pan ? encrypt(pan) : null, bank_account ? encrypt(bank_account) : null, pf_number ? encrypt(pf_number) : null]
    );
    return id;
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
    if (updates.salary_structure_id !== undefined) {
      queryParts.push('salary_structure_id = ?');
      values.push(updates.salary_structure_id);
    }
    if (updates.employee_code !== undefined) {
      queryParts.push('employee_code = ?');
      values.push(updates.employee_code);
    }
    if (updates.date_of_joining !== undefined) {
      queryParts.push('date_of_joining = ?');
      values.push(updates.date_of_joining);
    }

    // Self-service personal information (migration 017). Plain text, matching
    // users.phone. Validation lives in the controller that accepts them, so that
    // the same rules apply whether the value arrives from the employee portal or
    // an HR write.
    if (updates.blood_group !== undefined) {
      queryParts.push('blood_group = ?');
      values.push(updates.blood_group || null);
    }
    if (updates.emergency_contact !== undefined) {
      queryParts.push('emergency_contact = ?');
      values.push(updates.emergency_contact || null);
    }
    if (updates.address !== undefined) {
      queryParts.push('address = ?');
      values.push(updates.address || null);
    }

    if (queryParts.length === 0) return;
    values.push(id);

    await pool.execute(
      `UPDATE employees SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.email, u.full_name, u.is_active, u.role 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(row => this.format(row));
  }

  static async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM employees');
    return rows[0].total;
  }
}
