import crypto from 'crypto';
import pool from '../config/database.js';

/**
 * @typedef {Object} RecurringSchedule
 * @property {string} id
 * @property {string|null} client_id
 * @property {string|null} student_id
 * @property {'MONTHLY'|'QUARTERLY'|'YEARLY'} frequency
 * @property {Date} next_generation_date
 * @property {Date|null} last_generated_at
 * @property {boolean} is_active
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export default class RecurringSchedule {
  /**
   * Create a new recurring schedule.
   * @param {Object} params
   * @param {string} params.frequency
   * @param {string} params.next_generation_date
   * @param {string} [params.client_id]
   * @param {string} [params.student_id]
   * @returns {Promise<string>}
   */
  static async create({ frequency, next_generation_date, client_id = null, student_id = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO recurring_schedules (id, client_id, student_id, frequency, next_generation_date)
       VALUES (?, ?, ?, ?, ?)`,
      [id, client_id, student_id, frequency, next_generation_date]
    );
    return id;
  }

  /**
   * Find recurring schedule by ID.
   * @param {string} id
   * @returns {Promise<RecurringSchedule|null>}
   */
  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM recurring_schedules WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * List recurring schedules with optional filters.
   * @param {Object} [filters]
   * @param {string} [filters.client_id]
   * @param {string} [filters.student_id]
   * @param {boolean} [filters.is_active]
   * @returns {Promise<RecurringSchedule[]>}
   */
  static async list({ client_id, student_id, is_active } = {}) {
    let query = 'SELECT * FROM recurring_schedules WHERE 1=1';
    const values = [];

    if (client_id) {
      query += ' AND client_id = ?';
      values.push(client_id);
    }
    if (student_id) {
      query += ' AND student_id = ?';
      values.push(student_id);
    }
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      values.push(is_active);
    }

    query += ' ORDER BY next_generation_date ASC';
    const [rows] = await pool.execute(query, values);
    return rows;
  }

  /**
   * Update recurring schedule.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<void>}
   */
  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.frequency !== undefined) {
      queryParts.push('frequency = ?');
      values.push(updates.frequency);
    }
    if (updates.next_generation_date !== undefined) {
      queryParts.push('next_generation_date = ?');
      values.push(updates.next_generation_date);
    }
    if (updates.last_generated_at !== undefined) {
      queryParts.push('last_generated_at = ?');
      values.push(updates.last_generated_at);
    }
    if (updates.is_active !== undefined) {
      queryParts.push('is_active = ?');
      values.push(updates.is_active);
    }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(
      `UPDATE recurring_schedules SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  /**
   * Delete recurring schedule.
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async delete(id) {
    await pool.execute('DELETE FROM recurring_schedules WHERE id = ?', [id]);
  }

  /**
   * List active schedules due for generation.
   * @param {string} date
   * @returns {Promise<RecurringSchedule[]>}
   */
  static async listDue(date) {
    const [rows] = await pool.execute(
      'SELECT * FROM recurring_schedules WHERE is_active = TRUE AND next_generation_date <= ? ORDER BY next_generation_date ASC',
      [date]
    );
    return rows;
  }
}
