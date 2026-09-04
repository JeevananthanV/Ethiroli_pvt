import crypto from 'crypto';
import pool from '../config/database.js';

export default class CommunicationTemplate {
  static async create({ name, channel, subject = null, body, variables = null, description = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO communication_templates (id, name, channel, subject, body, variables, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, channel, subject, body, variables ? JSON.stringify(variables) : null, description]
    );
    return id;
  }

  static async list({ channel } = {}) {
    let query = 'SELECT * FROM communication_templates';
    const values = [];

    if (channel) {
      query += ' WHERE channel = ?';
      values.push(channel);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM communication_templates WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}