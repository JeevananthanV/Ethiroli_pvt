import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class Candidate {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      name: decrypt(row.name),
      email: decrypt(row.email),
      phone: row.phone ? decrypt(row.phone) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM candidates WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ job_id, name, email, phone = null, resume_url = null, source = 'MANUAL', indeed_candidate_id = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO candidates (id, job_id, name, email, phone, resume_url, source, indeed_candidate_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, job_id, encrypt(name), encrypt(email), phone ? encrypt(phone) : null, resume_url, source, indeed_candidate_id]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(encrypt(updates.name)); }
    if (updates.email !== undefined) { queryParts.push('email = ?'); values.push(encrypt(updates.email)); }
    if (updates.phone !== undefined) { queryParts.push('phone = ?'); values.push(updates.phone ? encrypt(updates.phone) : null); }
    if (updates.resume_url !== undefined) { queryParts.push('resume_url = ?'); values.push(updates.resume_url); }
    if (updates.source !== undefined) { queryParts.push('source = ?'); values.push(updates.source); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.notes !== undefined) { queryParts.push('notes = ?'); values.push(updates.notes); }
    if (updates.indeed_candidate_id !== undefined) { queryParts.push('indeed_candidate_id = ?'); values.push(updates.indeed_candidate_id); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE candidates SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM candidates WHERE id = ?', [id]);
  }

  static async list({ job_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM candidates WHERE 1=1';
    const values = [];

    if (job_id) { query += ' AND job_id = ?'; values.push(job_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ job_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM candidates WHERE 1=1';
    const values = [];

    if (job_id) { query += ' AND job_id = ?'; values.push(job_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async updateStatus(id, status) {
    await pool.execute('UPDATE candidates SET status = ? WHERE id = ?', [status, id]);
  }
}
