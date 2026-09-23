import pool from '../config/database.js';
import crypto from 'crypto';

export default class LessonBlock {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      content_payload: typeof row.content_payload === 'string'
        ? JSON.parse(row.content_payload)
        : row.content_payload,
      is_interactive: Boolean(row.is_interactive)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM lesson_blocks WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async listByLessonId(lessonId) {
    const [rows] = await pool.execute(
      'SELECT * FROM lesson_blocks WHERE lesson_id = ? ORDER BY block_order ASC',
      [lessonId]
    );
    return rows.map(r => this.format(r));
  }

  static async create({
    lesson_id,
    block_type,
    block_order = 1,
    content_payload = {},
    is_interactive = false
  }) {
    const id = crypto.randomUUID();
    const payloadStr = JSON.stringify(content_payload);

    await pool.execute(
      `INSERT INTO lesson_blocks (id, lesson_id, block_type, block_order, content_payload, is_interactive)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, lesson_id, block_type, block_order, payloadStr, is_interactive]
    );

    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.block_type !== undefined) { queryParts.push('block_type = ?'); values.push(updates.block_type); }
    if (updates.block_order !== undefined) { queryParts.push('block_order = ?'); values.push(updates.block_order); }
    if (updates.content_payload !== undefined) {
      queryParts.push('content_payload = ?');
      values.push(JSON.stringify(updates.content_payload));
    }
    if (updates.is_interactive !== undefined) { queryParts.push('is_interactive = ?'); values.push(updates.is_interactive); }

    if (queryParts.length === 0) return;
    values.push(id);

    await pool.execute(`UPDATE lesson_blocks SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM lesson_blocks WHERE id = ?', [id]);
  }

  static async reorder(lessonId, orderedIds) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute(
          'UPDATE lesson_blocks SET block_order = ? WHERE id = ? AND lesson_id = ?',
          [i + 1, orderedIds[i], lessonId]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}
