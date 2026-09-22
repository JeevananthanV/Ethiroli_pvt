import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class EmployeeDocument {
  static format(row) {
    if (!row) return null;
    const name = row.full_name ? decrypt(row.full_name) : (row.employee_name || null);
    return {
      ...row,
      employee_name: name,
      user_name: name,
      email: row.email ? decrypt(row.email) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT ed.*, u.full_name, u.email, e.employee_code, e.department, e.designation 
       FROM employee_documents ed 
       JOIN employees e ON ed.employee_id = e.id 
       JOIN users u ON e.user_id = u.id 
       WHERE ed.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), employee_id, document_type, title, file_url, file_size_bytes = null, mime_type = null, uploaded_by, status = 'PENDING' }) {
    await pool.execute(
      `INSERT INTO employee_documents (id, employee_id, document_type, title, file_url, file_size_bytes, mime_type, uploaded_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, employee_id, document_type, title, file_url, file_size_bytes, mime_type, uploaded_by, status]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.verified_by !== undefined) { queryParts.push('verified_by = ?'); values.push(updates.verified_by); }
    if (updates.verified_at !== undefined) { queryParts.push('verified_at = ?'); values.push(updates.verified_at); }
    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE employee_documents SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM employee_documents WHERE id = ?', [id]);
  }

  static async list({ employee_id, document_type, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT ed.*, u.full_name, u.email, e.employee_code, e.department, e.designation 
      FROM employee_documents ed 
      JOIN employees e ON ed.employee_id = e.id 
      JOIN users u ON e.user_id = u.id 
      WHERE 1=1
    `;
    const values = [];

    if (employee_id) { query += ' AND ed.employee_id = ?'; values.push(employee_id); }
    if (document_type) { query += ' AND ed.document_type = ?'; values.push(document_type); }
    if (status) { query += ' AND ed.status = ?'; values.push(status); }

    query += ' ORDER BY ed.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, document_type, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM employee_documents ed WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND ed.employee_id = ?'; values.push(employee_id); }
    if (document_type) { query += ' AND ed.document_type = ?'; values.push(document_type); }
    if (status) { query += ' AND ed.status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
