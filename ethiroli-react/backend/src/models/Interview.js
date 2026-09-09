import crypto from 'crypto';
import pool from '../config/database.js';

export default class Interview {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM interviews WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ candidate_id, round, interviewer_id = null, scheduled_at, duration_minutes = 60, meeting_link = null, status = 'SCHEDULED' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO interviews (id, candidate_id, round, interviewer_id, scheduled_at, duration_minutes, meeting_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, candidate_id, round, interviewer_id, scheduled_at, duration_minutes, meeting_link, status]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.feedback !== undefined) { queryParts.push('feedback = ?'); values.push(updates.feedback); }
    if (updates.rating !== undefined) { queryParts.push('rating = ?'); values.push(updates.rating); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.interviewer_id !== undefined) { queryParts.push('interviewer_id = ?'); values.push(updates.interviewer_id); }
    if (updates.scheduled_at !== undefined) { queryParts.push('scheduled_at = ?'); values.push(updates.scheduled_at); }
    if (updates.duration_minutes !== undefined) { queryParts.push('duration_minutes = ?'); values.push(updates.duration_minutes); }
    if (updates.meeting_link !== undefined) { queryParts.push('meeting_link = ?'); values.push(updates.meeting_link); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE interviews SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM interviews WHERE id = ?', [id]);
  }

  static async list({ candidate_id, interviewer_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM interviews WHERE 1=1';
    const values = [];

    if (candidate_id) { query += ' AND candidate_id = ?'; values.push(candidate_id); }
    if (interviewer_id) { query += ' AND interviewer_id = ?'; values.push(interviewer_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY scheduled_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ candidate_id, interviewer_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM interviews WHERE 1=1';
    const values = [];

    if (candidate_id) { query += ' AND candidate_id = ?'; values.push(candidate_id); }
    if (interviewer_id) { query += ' AND interviewer_id = ?'; values.push(interviewer_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
