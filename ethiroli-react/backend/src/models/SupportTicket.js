import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class SupportTicket {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      user_name: row.full_name ? decrypt(row.full_name) : (row.user_name || null),
      assigned_to_name: row.assigned_to_name ? decrypt(row.assigned_to_name) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT st.*, u.full_name, u.email, ua.full_name as assigned_to_name 
       FROM support_tickets st 
       JOIN users u ON st.user_id = u.id 
       LEFT JOIN users ua ON st.assigned_to = ua.id 
       WHERE st.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), user_id, category, priority = 'MEDIUM', subject, description, attachment_url = null }) {
    const ticketNumber = `TICK-${Date.now().toString().slice(-6)}`;
    await pool.execute(
      `INSERT INTO support_tickets (id, ticket_number, user_id, category, priority, subject, description, attachment_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [id, ticketNumber, user_id, category, priority, subject, description, attachment_url]
    );
    return { id, ticket_number: ticketNumber };
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.assigned_to !== undefined) { queryParts.push('assigned_to = ?'); values.push(updates.assigned_to); }
    if (updates.priority !== undefined) { queryParts.push('priority = ?'); values.push(updates.priority); }
    if (updates.status === 'RESOLVED' || updates.status === 'CLOSED') {
      queryParts.push('resolved_at = NOW()');
    }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE support_tickets SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async list({ user_id, category, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT st.*, u.full_name, u.email 
      FROM support_tickets st 
      JOIN users u ON st.user_id = u.id 
      WHERE 1=1
    `;
    const values = [];

    if (user_id) { query += ' AND st.user_id = ?'; values.push(user_id); }
    if (category) { query += ' AND st.category = ?'; values.push(category); }
    if (status) { query += ' AND st.status = ?'; values.push(status); }

    query += ' ORDER BY st.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}
