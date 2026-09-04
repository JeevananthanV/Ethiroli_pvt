import crypto from 'crypto';
import pool from '../config/database.js';

export default class Workflow {
  static async create({ name, entity_type, description = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO workflows (id, name, entity_type, description) VALUES (?, ?, ?, ?)`,
      [id, name, entity_type, description]
    );
    return id;
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM workflows');
    return rows;
  }
}