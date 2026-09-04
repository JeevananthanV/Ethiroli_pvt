import pool from '../config/database.js';

export default class Badge {
  static async create({ name, description, icon, criteria }) {
    await pool.execute(
      'INSERT INTO badges (name, description, icon, criteria) VALUES (?, ?, ?, ?)',
      [name, description, icon, JSON.stringify(criteria)]
    );
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM badges WHERE is_active = TRUE');
    return rows;
  }
}