import pool from '../config/database.js';
import { encrypt, decrypt, encryptDeterministic } from '../config/encryption.js';

export default class Lead {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      name: decrypt(row.name),
      email: row.email ? decrypt(row.email) : null,
      phone: row.phone ? decrypt(row.phone) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [id]);
    return rows.length > 0 ? this.formatLead(rows[0]) : null;
  }

  static async create({ name, email = null, phone = null, source = 'OTHER', status = 'NEW', assigned_to = null, notes = null, follow_up_date = null, created_by }) {
    const encName = encrypt(name);
    const encEmail = email ? encryptDeterministic(email.toLowerCase().trim()) : null;
    const encPhone = phone ? encrypt(phone) : null;

    const [result] = await pool.execute(
      `INSERT INTO leads (name, email, phone, source, status, assigned_to, notes, follow_up_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [encName, encEmail, encPhone, source, status, assigned_to, notes, follow_up_date, created_by]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) {
      queryParts.push('name = ?');
      values.push(encrypt(updates.name));
    }
    if (updates.email !== undefined) {
      queryParts.push('email = ?');
      values.push(updates.email ? encryptDeterministic(updates.email.toLowerCase().trim()) : null);
    }
    if (updates.phone !== undefined) {
      queryParts.push('phone = ?');
      values.push(updates.phone ? encrypt(updates.phone) : null);
    }
    if (updates.source !== undefined) {
      queryParts.push('source = ?');
      values.push(updates.source);
    }
    if (updates.status !== undefined) {
      queryParts.push('status = ?');
      values.push(updates.status);
    }
    if (updates.assigned_to !== undefined) {
      queryParts.push('assigned_to = ?');
      values.push(updates.assigned_to);
    }
    if (updates.notes !== undefined) {
      queryParts.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.follow_up_date !== undefined) {
      queryParts.push('follow_up_date = ?');
      values.push(updates.follow_up_date);
    }
    if (updates.converted_at !== undefined) {
      queryParts.push('converted_at = ?');
      values.push(updates.converted_at);
    }
    if (updates.lost_reason !== undefined) {
      queryParts.push('lost_reason = ?');
      values.push(updates.lost_reason);
    }

    if (queryParts.length === 0) return;

    values.push(id);
    await pool.execute(
      `UPDATE leads SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
  }

  static async list({ assigned_to, status, source, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const values = [];

    if (assigned_to) {
      query += ' AND assigned_to = ?';
      values.push(assigned_to);
    }
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    if (source) {
      query += ' AND source = ?';
      values.push(source);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.formatLead(row));
  }

  static async count({ assigned_to, status, source } = {}) {
    let query = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const values = [];

    if (assigned_to) {
      query += ' AND assigned_to = ?';
      values.push(assigned_to);
    }
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    if (source) {
      query += ' AND source = ?';
      values.push(source);
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static formatLead(row) {
    if (!row) return null;
    return {
      ...row,
      name: decrypt(row.name),
      email: row.email ? decrypt(row.email) : null,
      phone: row.phone ? decrypt(row.phone) : null
    };
  }
}
