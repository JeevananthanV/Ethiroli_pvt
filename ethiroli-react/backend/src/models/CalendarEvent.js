import crypto from 'crypto';
import pool from '../config/database.js';

export default class CalendarEvent {
  static async create({ title, description = null, event_type, start_time, end_time, assigned_users = null, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO calendar_events (id, title, description, event_type, start_time, end_time, assigned_users, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, event_type, start_time, end_time, assigned_users ? JSON.stringify(assigned_users) : null, created_by]
    );
    return id;
  }

  static async list({ start, end } = {}) {
    let query = 'SELECT * FROM calendar_events WHERE 1=1';
    const values = [];

    if (start && end) {
      query += ' AND start_time BETWEEN ? AND ?';
      values.push(start, end);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}