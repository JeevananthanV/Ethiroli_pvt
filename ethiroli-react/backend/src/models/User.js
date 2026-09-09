import pool from '../config/database.js';
import { encrypt, decrypt, encryptDeterministic } from '../config/encryption.js';

export default class User {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      email: decrypt(row.email),
      full_name: decrypt(row.full_name),
      phone: row.phone ? decrypt(row.phone) : null,
      preferences: row.preferences ? JSON.parse(row.preferences) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByEmail(email) {
    const hashedEmail = encryptDeterministic(email.toLowerCase().trim());
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [hashedEmail]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ email, password_hash, full_name, phone, role, preferences = null }) {
    const encEmail = encryptDeterministic(email.toLowerCase().trim());
    const encFullName = encrypt(full_name);
    const encPhone = phone ? encrypt(phone) : null;
    const prefJson = preferences ? JSON.stringify(preferences) : null;

    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, full_name, phone, role, preferences) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [encEmail, password_hash, encFullName, encPhone, role, prefJson]
    );

    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.email !== undefined) {
      queryParts.push('email = ?');
      values.push(encryptDeterministic(updates.email.toLowerCase().trim()));
    }
    if (updates.full_name !== undefined) {
      queryParts.push('full_name = ?');
      values.push(encrypt(updates.full_name));
    }
    if (updates.phone !== undefined) {
      queryParts.push('phone = ?');
      values.push(updates.phone ? encrypt(updates.phone) : null);
    }
    if (updates.password_hash !== undefined) {
      queryParts.push('password_hash = ?');
      values.push(updates.password_hash);
    }
    if (updates.role !== undefined) {
      queryParts.push('role = ?');
      values.push(updates.role);
    }
    if (updates.is_active !== undefined) {
      queryParts.push('is_active = ?');
      values.push(updates.is_active);
    }
    if (updates.preferences !== undefined) {
      queryParts.push('preferences = ?');
      values.push(updates.preferences ? JSON.stringify(updates.preferences) : null);
    }
    if (updates.last_login_at !== undefined) {
      queryParts.push('last_login_at = ?');
      values.push(updates.last_login_at);
    }
    if (updates.avatar_url !== undefined) {
      queryParts.push('avatar_url = ?');
      values.push(updates.avatar_url);
    }

    if (queryParts.length === 0) return;

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  }

  static async list({ role, is_active, search, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values = [];

    if (role) {
      query += ' AND role = ?';
      values.push(role);
    }
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      values.push(is_active);
    }
    if (search) {
      query += ' AND full_name LIKE ?';
      values.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ role, is_active, search } = {}) {
    let query = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const values = [];

    if (role) {
      query += ' AND role = ?';
      values.push(role);
    }
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      values.push(is_active);
    }
    if (search) {
      query += ' AND full_name LIKE ?';
      values.push(`%${search}%`);
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async softDelete(id) {
    await pool.execute(
      'UPDATE users SET is_active = FALSE WHERE id = ?',
      [id]
    );
  }
}
