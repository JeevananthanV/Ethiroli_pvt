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

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM communication_logs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
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

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.provider_response !== undefined) { queryParts.push('provider_response = ?'); values.push(updates.provider_response); }
    if (updates.error_message !== undefined) { queryParts.push('error_message = ?'); values.push(updates.error_message); }
    if (updates.sent_at !== undefined) { queryParts.push('sent_at = ?'); values.push(updates.sent_at); }
    if (updates.delivered_at !== undefined) { queryParts.push('delivered_at = ?'); values.push(updates.delivered_at); }
    if (updates.read_at !== undefined) { queryParts.push('read_at = ?'); values.push(updates.read_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE communication_logs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM communication_logs WHERE id = ?', [id]);
  }

  static async list({ channel, status, template_id, user_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM communication_logs WHERE 1=1';
    const values = [];

    if (channel) { query += ' AND channel = ?'; values.push(channel); }
    if (status) { query += ' AND status = ?'; values.push(status); }
    if (template_id) { query += ' AND template_id = ?'; values.push(template_id); }
    if (user_id) { query += ' AND created_by = ?'; values.push(user_id); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ channel, status, template_id, user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM communication_logs WHERE 1=1';
    const values = [];

    if (channel) { query += ' AND channel = ?'; values.push(channel); }
    if (status) { query += ' AND status = ?'; values.push(status); }
    if (template_id) { query += ' AND template_id = ?'; values.push(template_id); }
    if (user_id) { query += ' AND created_by = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
