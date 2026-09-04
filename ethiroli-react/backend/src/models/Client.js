import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class Client {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      name: decrypt(row.name),
      email: row.email ? decrypt(row.email) : null,
      phone: row.phone ? decrypt(row.phone) : null,
      gst: row.gst ? decrypt(row.gst) : null,
      address: row.address ? decrypt(row.address) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM clients WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, email, phone, gst, address, company_name }) {
    const [result] = await pool.execute(
      `INSERT INTO clients (name, email, phone, gst, address, company_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [encrypt(name), encrypt(email), encrypt(phone), encrypt(gst), encrypt(address), company_name]
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
      values.push(encrypt(updates.email));
    }
    if (updates.phone !== undefined) {
      queryParts.push('phone = ?');
      values.push(encrypt(updates.phone));
    }
    if (updates.gst !== undefined) {
      queryParts.push('gst = ?');
      values.push(encrypt(updates.gst));
    }
    if (updates.address !== undefined) {
      queryParts.push('address = ?');
      values.push(encrypt(updates.address));
    }
    if (updates.company_name !== undefined) {
      queryParts.push('company_name = ?');
      values.push(updates.company_name);
    }

    if (queryParts.length === 0) return;
    values.push(id);

    await pool.execute(
      `UPDATE clients SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute('SELECT * FROM clients LIMIT ? OFFSET ?', [limit, offset]);
    return rows.map(row => this.format(row));
  }
}