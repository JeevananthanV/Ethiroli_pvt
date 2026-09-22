import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class VisitorLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      person_to_meet_full_name: row.staff_name ? decrypt(row.staff_name) : (row.person_to_meet_name || null)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT vl.*, u.full_name as staff_name, u.email as staff_email
       FROM visitor_logs vl
       LEFT JOIN users u ON vl.person_to_meet = u.id
       WHERE vl.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    visitor_name,
    phone,
    email = null,
    company = null,
    purpose,
    person_to_meet = null,
    person_to_meet_name = null,
    badge_number = null,
    notes = null,
    status = 'CHECKED_IN'
  }) {
    const badge = badge_number || `V-${Date.now().toString().slice(-4)}`;
    await pool.execute(
      `INSERT INTO visitor_logs 
       (id, visitor_name, phone, email, company, purpose, person_to_meet, person_to_meet_name, badge_number, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, visitor_name, phone, email, company, purpose, person_to_meet, person_to_meet_name, badge, status, notes]
    );
    return { id, badge_number: badge };
  }

  static async checkOut(id) {
    await pool.execute(
      `UPDATE visitor_logs SET status = 'CHECKED_OUT', check_out_time = NOW() WHERE id = ?`,
      [id]
    );
    return this.findById(id);
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.visitor_name !== undefined) { queryParts.push('visitor_name = ?'); values.push(updates.visitor_name); }
    if (updates.phone !== undefined) { queryParts.push('phone = ?'); values.push(updates.phone); }
    if (updates.email !== undefined) { queryParts.push('email = ?'); values.push(updates.email); }
    if (updates.company !== undefined) { queryParts.push('company = ?'); values.push(updates.company); }
    if (updates.purpose !== undefined) { queryParts.push('purpose = ?'); values.push(updates.purpose); }
    if (updates.person_to_meet !== undefined) { queryParts.push('person_to_meet = ?'); values.push(updates.person_to_meet); }
    if (updates.person_to_meet_name !== undefined) { queryParts.push('person_to_meet_name = ?'); values.push(updates.person_to_meet_name); }
    if (updates.badge_number !== undefined) { queryParts.push('badge_number = ?'); values.push(updates.badge_number); }
    if (updates.status !== undefined) { 
      queryParts.push('status = ?'); 
      values.push(updates.status);
      if (updates.status === 'CHECKED_OUT') {
        queryParts.push('check_out_time = NOW()');
      }
    }
    if (updates.notes !== undefined) { queryParts.push('notes = ?'); values.push(updates.notes); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE visitor_logs SET ${queryParts.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM visitor_logs WHERE id = ?', [id]);
  }

  static async list({ status, search, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT vl.*, u.full_name as staff_name, u.email as staff_email
      FROM visitor_logs vl
      LEFT JOIN users u ON vl.person_to_meet = u.id
      WHERE 1=1
    `;
    const values = [];

    if (status) {
      query += ' AND vl.status = ?';
      values.push(status);
    }

    if (search) {
      query += ' AND (vl.visitor_name LIKE ? OR vl.phone LIKE ? OR vl.company LIKE ? OR vl.badge_number LIKE ?)';
      const term = `%${search}%`;
      values.push(term, term, term, term);
    }

    query += ' ORDER BY vl.check_in_time DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM visitor_logs WHERE 1=1';
    const values = [];
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async getTodayStats() {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_today,
        SUM(CASE WHEN status = 'CHECKED_IN' THEN 1 ELSE 0 END) as checked_in,
        SUM(CASE WHEN status = 'CHECKED_OUT' THEN 1 ELSE 0 END) as checked_out,
        SUM(CASE WHEN status = 'EXPECTED' THEN 1 ELSE 0 END) as expected
      FROM visitor_logs
      WHERE DATE(check_in_time) = CURDATE()
    `);
    return rows[0] || { total_today: 0, checked_in: 0, checked_out: 0, expected: 0 };
  }
}
