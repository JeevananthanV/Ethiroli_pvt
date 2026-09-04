import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class CommunicationLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      recipient: decrypt(row.recipient)
    };
  }

  static async create({ channel, template_id = null, sender = null, recipient, subject = null, content, status = 'PENDING', provider_response = null, error_message = null, created_by = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO communication_logs (id, channel, template_id, sender, recipient, subject, content, status, provider_response, error_message, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, channel, template_id, sender, encrypt(recipient), subject, content, status, provider_response, error_message, created_by]
    );
    return id;
  }

  static async list({ channel, status } = {}) {
    let query = 'SELECT * FROM communication_logs WHERE 1=1';
    const values = [];

    if (channel) {
      query += ' AND channel = ?';
      values.push(channel);
    }
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}