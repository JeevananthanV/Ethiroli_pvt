import crypto from 'crypto';
import pool from '../config/database.js';

export default class CommunicationTemplate {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      variables: row.variables ? JSON.parse(row.variables) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM communication_templates WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, channel, subject = null, body, variables = null, description = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO communication_templates (id, name, channel, subject, body, variables, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, channel, subject, body, variables ? JSON.stringify(variables) : null, description]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.channel !== undefined) { queryParts.push('channel = ?'); values.push(updates.channel); }
    if (updates.subject !== undefined) { queryParts.push('subject = ?'); values.push(updates.subject); }
    if (updates.body !== undefined) { queryParts.push('body = ?'); values.push(updates.body); }
    if (updates.variables !== undefined) { queryParts.push('variables = ?'); values.push(updates.variables ? JSON.stringify(updates.variables) : null); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE communication_templates SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM communication_templates WHERE id = ?', [id]);
  }

  static async list({ channel, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM communication_templates WHERE 1=1';
    const values = [];

    if (channel) { query += ' AND channel = ?'; values.push(channel); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ channel } = {}) {
    let query = 'SELECT COUNT(*) as total FROM communication_templates WHERE 1=1';
    const values = [];

    if (channel) { query += ' AND channel = ?'; values.push(channel); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
