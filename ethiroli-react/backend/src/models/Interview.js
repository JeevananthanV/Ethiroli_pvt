import crypto from 'crypto';
import pool from '../config/database.js';

export default class Interview {
  static async create({ candidate_id, round, interviewer_id = null, scheduled_at, duration_minutes = 60, meeting_link = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO interviews (id, candidate_id, round, interviewer_id, scheduled_at, duration_minutes, meeting_link)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, candidate_id, round, interviewer_id, scheduled_at, duration_minutes, meeting_link]
    );
    return id;
  }

  static async update(id, { feedback, rating, status }) {
    await pool.execute(
      'UPDATE interviews SET feedback = ?, rating = ?, status = ? WHERE id = ?',
      [feedback, rating, status, id]
    );
  }

  static async list({ interviewer_id } = {}) {
    let query = 'SELECT * FROM interviews';
    const values = [];

    if (interviewer_id) {
      query += ' WHERE interviewer_id = ?';
      values.push(interviewer_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}