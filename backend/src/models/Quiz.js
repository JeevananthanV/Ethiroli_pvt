import pool from '../config/database.js';
import crypto from 'crypto';

export default class Quiz {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ course_id, title, description, time_limit_minutes = 10, passing_score = 70, is_published = false }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO quizzes (id, course_id, title, description, time_limit_minutes, passing_score, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, course_id, title, description, time_limit_minutes, passing_score, is_published]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.time_limit_minutes !== undefined) { queryParts.push('time_limit_minutes = ?'); values.push(updates.time_limit_minutes); }
    if (updates.passing_score !== undefined) { queryParts.push('passing_score = ?'); values.push(updates.passing_score); }
    if (updates.is_published !== undefined) { queryParts.push('is_published = ?'); values.push(updates.is_published); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE quizzes SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM quizzes WHERE id = ?', [id]);
  }

  static async list({ course_id, is_published, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM quizzes WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (is_published !== undefined) { query += ' AND is_published = ?'; values.push(is_published); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ course_id, is_published } = {}) {
    let query = 'SELECT COUNT(*) as total FROM quizzes WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (is_published !== undefined) { query += ' AND is_published = ?'; values.push(is_published); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByCourseId(courseId) {
    return this.list({ course_id: courseId, limit: 1000 });
  }

  static async attachQuestions(quizId, questionIds) {
    if (!Array.isArray(questionIds) || questionIds.length === 0) return;
    for (let i = 0; i < questionIds.length; i++) {
      const qId = questionIds[i];
      const linkId = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO quiz_questions (id, quiz_id, question_id, question_order)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE question_order = ?`,
        [linkId, quizId, qId, i + 1, i + 1]
      );
    }
  }

  static async detachQuestion(quizId, questionId) {
    await pool.execute(
      'DELETE FROM quiz_questions WHERE quiz_id = ? AND question_id = ?',
      [quizId, questionId]
    );
  }

  static async getQuestionsForStudent(quizId) {
    // Queries questions and options but strictly excludes `is_correct`
    const [qRows] = await pool.execute(
      `SELECT qb.id, qb.topic, qb.difficulty, qb.question_type, qb.question_text, 
              qb.code_snippet, qq.points, qq.question_order
       FROM quiz_questions qq
       JOIN question_bank qb ON qq.question_id = qb.id
       WHERE qq.quiz_id = ? AND qb.is_active = TRUE
       ORDER BY qq.question_order ASC`,
      [quizId]
    );

    const questions = await Promise.all(
      qRows.map(async (q) => {
        const [optRows] = await pool.execute(
          `SELECT id, option_text, display_order 
           FROM question_options 
           WHERE question_id = ? 
           ORDER BY display_order ASC`,
          [q.id]
        );
        return {
          ...q,
          options: optRows
        };
      })
    );

    return questions;
  }

  static async getQuestionsWithAnswers(quizId) {
    // Includes `is_correct` for server-side grading and tutor review
    const [qRows] = await pool.execute(
      `SELECT qb.id, qb.topic, qb.difficulty, qb.question_type, qb.question_text, 
              qb.code_snippet, qb.explanation, qq.points, qq.question_order
       FROM quiz_questions qq
       JOIN question_bank qb ON qq.question_id = qb.id
       WHERE qq.quiz_id = ?
       ORDER BY qq.question_order ASC`,
      [quizId]
    );

    const questions = await Promise.all(
      qRows.map(async (q) => {
        const [optRows] = await pool.execute(
          `SELECT id, option_text, is_correct, display_order 
           FROM question_options 
           WHERE question_id = ? 
           ORDER BY display_order ASC`,
          [q.id]
        );
        return {
          ...q,
          options: optRows.map(o => ({ ...o, is_correct: Boolean(o.is_correct) }))
        };
      })
    );

    return questions;
  }
}
