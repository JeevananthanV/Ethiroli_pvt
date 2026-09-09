import crypto from 'crypto';
import pool from '../config/database.js';

/**
 * @typedef {Object} LiveQuizSession
 * @property {string} id
 * @property {string} quiz_id
 * @property {string} tutor_id
 * @property {Date} started_at
 * @property {Date|null} ended_at
 * @property {boolean} is_active
 * @property {number} total_participants
 * @property {Date} created_at
 * @property {Date} updated_at
 */

export default class LiveQuizSession {
  /**
   * Create a new live quiz session.
   * @param {Object} params
   * @param {string} params.quiz_id
   * @param {string} params.tutor_id
   * @returns {Promise<string>}
   */
  static async create({ quiz_id, tutor_id }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO live_quiz_sessions (id, quiz_id, tutor_id) VALUES (?, ?, ?)`,
      [id, quiz_id, tutor_id]
    );
    return id;
  }

  /**
   * Find live quiz session by ID.
   * @param {string} id
   * @returns {Promise<LiveQuizSession|null>}
   */
  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM live_quiz_sessions WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * List active live quiz sessions.
   * @returns {Promise<LiveQuizSession[]>}
   */
  static async listActive() {
    const [rows] = await pool.execute(
      'SELECT * FROM live_quiz_sessions WHERE is_active = TRUE ORDER BY started_at DESC'
    );
    return rows;
  }

  /**
   * List sessions by quiz ID.
   * @param {string} quizId
   * @returns {Promise<LiveQuizSession[]>}
   */
  static async listByQuizId(quizId) {
    const [rows] = await pool.execute(
      'SELECT * FROM live_quiz_sessions WHERE quiz_id = ? ORDER BY started_at DESC',
      [quizId]
    );
    return rows;
  }

  /**
   * Update live quiz session.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<void>}
   */
  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.ended_at !== undefined) {
      queryParts.push('ended_at = ?');
      values.push(updates.ended_at);
    }
    if (updates.is_active !== undefined) {
      queryParts.push('is_active = ?');
      values.push(updates.is_active);
    }
    if (updates.total_participants !== undefined) {
      queryParts.push('total_participants = ?');
      values.push(updates.total_participants);
    }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(
      `UPDATE live_quiz_sessions SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  /**
   * Increment participant count.
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async incrementParticipants(id) {
    await pool.execute(
      'UPDATE live_quiz_sessions SET total_participants = total_participants + 1 WHERE id = ?',
      [id]
    );
  }

  /**
   * Delete live quiz session.
   * @param {string} id
   * @returns {Promise<void>}
   */
  static async delete(id) {
    await pool.execute('DELETE FROM live_quiz_sessions WHERE id = ?', [id]);
  }
}
