import crypto from 'crypto';
import pool from '../config/database.js';

export default class CalendarEvent {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      assigned_users: row.assigned_users ? JSON.parse(row.assigned_users) : []
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM calendar_events WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ title, description = null, event_type, start_time, end_time, created_by, assigned_users = [], location = null, is_all_day = false, recurrence_rule = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO calendar_events (id, title, description, event_type, start_time, end_time, created_by, assigned_users, location, is_all_day, recurrence_rule)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, event_type, start_time, end_time, created_by, JSON.stringify(assigned_users), location, is_all_day, recurrence_rule]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.event_type !== undefined) { queryParts.push('event_type = ?'); values.push(updates.event_type); }
    if (updates.start_time !== undefined) { queryParts.push('start_time = ?'); values.push(updates.start_time); }
    if (updates.end_time !== undefined) { queryParts.push('end_time = ?'); values.push(updates.end_time); }
    if (updates.assigned_users !== undefined) { queryParts.push('assigned_users = ?'); values.push(JSON.stringify(updates.assigned_users)); }
    if (updates.location !== undefined) { queryParts.push('location = ?'); values.push(updates.location); }
    if (updates.is_all_day !== undefined) { queryParts.push('is_all_day = ?'); values.push(updates.is_all_day); }
    if (updates.recurrence_rule !== undefined) { queryParts.push('recurrence_rule = ?'); values.push(updates.recurrence_rule); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE calendar_events SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM calendar_events WHERE id = ?', [id]);
  }

  static async list({ start_date, end_date, event_type, created_by, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM calendar_events WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND start_time BETWEEN ? AND ?'; values.push(start_date, end_date); }
    if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
    if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }

    query += ' ORDER BY start_time ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ start_date, end_date, event_type, created_by } = {}) {
    let query = 'SELECT COUNT(*) as total FROM calendar_events WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND start_time BETWEEN ? AND ?'; values.push(start_date, end_date); }
    if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
    if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
