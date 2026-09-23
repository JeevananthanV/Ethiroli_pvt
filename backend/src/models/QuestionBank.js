import pool from '../config/database.js';
import crypto from 'crypto';

export default class QuestionBank {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      is_active: Boolean(row.is_active)
    };
  }

  static async findById(id, includeAnswers = true) {
    const [rows] = await pool.execute('SELECT * FROM question_bank WHERE id = ?', [id]);
    if (rows.length === 0) return null;

    const question = this.format(rows[0]);
    const options = await this.getOptions(id, includeAnswers);
    return { ...question, options };
  }

  static async getOptions(questionId, includeAnswers = true) {
    const selectFields = includeAnswers
      ? 'id, question_id, option_text, is_correct, display_order'
      : 'id, question_id, option_text, display_order';

    const [rows] = await pool.execute(
      `SELECT ${selectFields} FROM question_options WHERE question_id = ? ORDER BY display_order ASC`,
      [questionId]
    );

    return rows.map(r => ({
      ...r,
      ...(includeAnswers ? { is_correct: Boolean(r.is_correct) } : {})
    }));
  }

  static async create({
    course_id = null,
    module_id = null,
    topic,
    difficulty = 'MEDIUM',
    question_type = 'MCQ',
    question_text,
    code_snippet = null,
    explanation = null,
    created_by,
    options = []
  }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const questionId = crypto.randomUUID();
      await conn.execute(
        `INSERT INTO question_bank 
          (id, course_id, module_id, topic, difficulty, question_type, question_text, code_snippet, explanation, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [questionId, course_id, module_id, topic, difficulty, question_type, question_text, code_snippet, explanation, created_by]
      );

      if (Array.isArray(options) && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          const optionId = crypto.randomUUID();
          await conn.execute(
            `INSERT INTO question_options (id, question_id, option_text, is_correct, display_order)
             VALUES (?, ?, ?, ?, ?)`,
            [optionId, questionId, opt.option_text || opt.text, Boolean(opt.is_correct), i + 1]
          );
        }
      }

      await conn.commit();
      return questionId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async bulkCreate(questions, created_by) {
    const createdIds = [];
    for (const q of questions) {
      const id = await this.create({ ...q, created_by });
      createdIds.push(id);
    }
    return createdIds;
  }

  static async list({
    course_id,
    module_id,
    topic,
    difficulty,
    question_type,
    search,
    limit = 50,
    offset = 0
  } = {}) {
    let query = 'SELECT * FROM question_bank WHERE is_active = TRUE';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (module_id) { query += ' AND module_id = ?'; values.push(module_id); }
    if (topic) { query += ' AND topic = ?'; values.push(topic); }
    if (difficulty) { query += ' AND difficulty = ?'; values.push(difficulty); }
    if (question_type) { query += ' AND question_type = ?'; values.push(question_type); }
    if (search) {
      query += ' AND (question_text LIKE ? OR topic LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);

    // Fetch options for each question
    const results = await Promise.all(
      rows.map(async (row) => {
        const q = this.format(row);
        const options = await this.getOptions(q.id, true);
        return { ...q, options };
      })
    );

    return results;
  }

  static async count({
    course_id,
    module_id,
    topic,
    difficulty,
    question_type,
    search
  } = {}) {
    let query = 'SELECT COUNT(*) as total FROM question_bank WHERE is_active = TRUE';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (module_id) { query += ' AND module_id = ?'; values.push(module_id); }
    if (topic) { query += ' AND topic = ?'; values.push(topic); }
    if (difficulty) { query += ' AND difficulty = ?'; values.push(difficulty); }
    if (question_type) { query += ' AND question_type = ?'; values.push(question_type); }
    if (search) {
      query += ' AND (question_text LIKE ? OR topic LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async delete(id) {
    await pool.execute('DELETE FROM question_bank WHERE id = ?', [id]);
  }
}
