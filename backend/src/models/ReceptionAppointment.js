import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ReceptionAppointment {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      host_name: row.host_name ? decrypt(row.host_name) : (row.person_to_meet_name || 'Host')
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT a.*, 
              u.full_name as host_name, u.email as host_email
       FROM reception_appointments a
       LEFT JOIN users u ON a.person_to_meet = u.id
       WHERE a.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ status, appointment_date, person_to_meet, search, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT a.*, 
             u.full_name as host_name, u.email as host_email
      FROM reception_appointments a
      LEFT JOIN users u ON a.person_to_meet = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }
    if (appointment_date) {
      sql += ' AND a.appointment_date = ?';
      params.push(appointment_date);
    }
    if (person_to_meet) {
      sql += ' AND a.person_to_meet = ?';
      params.push(person_to_meet);
    }
    if (search) {
      sql += ' AND (a.visitor_name LIKE ? OR a.phone LIKE ? OR a.company LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ status, appointment_date, person_to_meet, search } = {}) {
    let sql = `SELECT COUNT(*) as count FROM reception_appointments a WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }
    if (appointment_date) {
      sql += ' AND a.appointment_date = ?';
      params.push(appointment_date);
    }
    if (person_to_meet) {
      sql += ' AND a.person_to_meet = ?';
      params.push(person_to_meet);
    }
    if (search) {
      sql += ' AND (a.visitor_name LIKE ? OR a.phone LIKE ? OR a.company LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async create(data) {
    const id = data.id || crypto.randomUUID();
    await pool.execute(
      `INSERT INTO reception_appointments 
        (id, visitor_name, phone, email, company, purpose, person_to_meet, person_to_meet_name, 
         appointment_date, appointment_time, status, badge_number, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.visitor_name,
        data.phone,
        data.email || null,
        data.company || null,
        data.purpose,
        data.person_to_meet || null,
        data.person_to_meet_name || null,
        data.appointment_date,
        data.appointment_time,
        data.status || 'SCHEDULED',
        data.badge_number || null,
        data.notes || null
      ]
    );

    return this.findById(id);
  }

  static async updateStatus(id, status, badge_number = null) {
    let sql = 'UPDATE reception_appointments SET status = ?';
    const params = [status];

    if (badge_number !== null) {
      sql += ', badge_number = ?';
      params.push(badge_number);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await pool.execute(sql, params);
    return this.findById(id);
  }

  static async delete(id) {
    const [res] = await pool.execute('DELETE FROM reception_appointments WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }

  static async getTodayAppointments() {
    const [rows] = await pool.query(
      `SELECT a.*, 
              u.full_name as host_name
       FROM reception_appointments a
       LEFT JOIN users u ON a.person_to_meet = u.id
       WHERE a.appointment_date = CURRENT_DATE
       ORDER BY a.appointment_time ASC`
    );
    return rows.map(r => this.format(r));
  }
}
