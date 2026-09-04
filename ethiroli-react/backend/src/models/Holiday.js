import crypto from 'crypto';
import pool from '../config/database.js';

export default class Holiday {
  static async create({ name, date, is_restricted = false, restricted_to = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO holidays (id, name, date, is_restricted, restricted_to)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, date, is_restricted, restricted_to ? JSON.stringify(restricted_to) : null]
    );
    return id;
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM holidays ORDER BY date ASC');
    return rows;
  }
}