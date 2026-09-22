import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Message {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      sender_name: row.sender_name ? decrypt(row.sender_name) : null,
      recipient_name: row.recipient_name ? decrypt(row.recipient_name) : null
    };
  }

  static async create({ id = crypto.randomUUID(), sender_id, recipient_id = null, channel_name = null, message_content, attachment_url = null }) {
    await pool.execute(
      `INSERT INTO messages (id, sender_id, recipient_id, channel_name, message_content, attachment_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, sender_id, recipient_id, channel_name, message_content, attachment_url]
    );
    return { id, sender_id, recipient_id, channel_name, message_content, attachment_url };
  }

  static async listUserMessages(userId, { channel_name, other_user_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT m.*, 
             s.full_name as sender_name, s.email as sender_email,
             r.full_name as recipient_name, r.email as recipient_email
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      LEFT JOIN users r ON m.recipient_id = r.id
      WHERE 1=1
    `;
    const values = [];

    if (channel_name) {
      query += ` AND m.channel_name = ?`;
      values.push(channel_name);
    } else if (other_user_id) {
      query += ` AND ((m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?))`;
      values.push(userId, other_user_id, other_user_id, userId);
    } else {
      query += ` AND (m.sender_id = ? OR m.recipient_id = ? OR m.channel_name = 'GENERAL')`;
      values.push(userId, userId);
    }

    query += ` ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(r => this.format(r));
  }

  static async markAsRead(messageIds, userId) {
    if (!messageIds || messageIds.length === 0) return;
    const placeholders = messageIds.map(() => '?').join(',');
    await pool.execute(
      `UPDATE messages SET is_read = TRUE, read_at = NOW() WHERE id IN (${placeholders}) AND recipient_id = ?`,
      [...messageIds, userId]
    );
  }
}
