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

  static async create({ job_id, name, email, phone = null, resume_url = null, source = 'MANUAL', indeed_candidate_id = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO candidates (id, job_id, name, email, phone, resume_url, source, indeed_candidate_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, job_id, encrypt(name), encrypt(email), phone ? encrypt(phone) : null, resume_url, source, indeed_candidate_id]
    );
    return id;
  }

  static async updateStatus(id, status) {
    await pool.execute('UPDATE candidates SET status = ? WHERE id = ?', [status, id]);
  }

  static async list({ job_id, status } = {}) {
    let query = 'SELECT * FROM candidates WHERE 1=1';
    const values = [];

    if (job_id) {
      query += ' AND job_id = ?';
      values.push(job_id);
    }
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}