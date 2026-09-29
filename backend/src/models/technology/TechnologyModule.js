import pool from '../../config/database.js';
import crypto from 'crypto';

export default class TechnologyModule {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      topics: row.topics ? JSON.parse(row.topics) : null,
      technologies: row.technologies ? JSON.parse(row.technologies) : null,
      practicals: row.practicals ? JSON.parse(row.practicals) : null,
      projects: row.projects ? JSON.parse(row.projects) : null,
      prerequisites: row.prerequisites ? JSON.parse(row.prerequisites) : null,
      learning_outcomes: row.learning_outcomes ? JSON.parse(row.learning_outcomes) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM technology_modules WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute('SELECT * FROM technology_modules WHERE code = ?', [code]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create(data) {
    const id = crypto.randomUUID();
    const { code, title, category, level, duration_hours, description, topics, technologies, practicals, projects, prerequisites, learning_outcomes } = data;
    await pool.execute(
      `INSERT INTO technology_modules (id, code, title, category, level, duration_hours, description, topics, technologies, practicals, projects, prerequisites, learning_outcomes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, code, title, category, level, duration_hours, description, topics ? JSON.stringify(topics) : null, technologies ? JSON.stringify(technologies) : null, practicals ? JSON.stringify(practicals) : null, projects ? JSON.stringify(projects) : null, prerequisites ? JSON.stringify(prerequisites) : null, learning_outcomes ? JSON.stringify(learning_outcomes) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];
    const jsonFields = ['topics', 'technologies', 'practicals', 'projects', 'prerequisites', 'learning_outcomes'];
    const textFields = ['code', 'title', 'category', 'level', 'duration_hours', 'description'];
    const allFields = [...textFields, ...jsonFields];
    for (const field of allFields) {
      if (updates[field] !== undefined) {
        queryParts.push(`${field} = ?`);
        values.push(jsonFields.includes(field) ? JSON.stringify(updates[field]) : updates[field]);
      }
    }
    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE technology_modules SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM technology_modules WHERE id = ?', [id]);
  }

  static async list({ category, level, is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM technology_modules WHERE 1=1';
    const values = [];
    if (category) { query += ' AND category = ?'; values.push(category); }
    if (level) { query += ' AND level = ?'; values.push(level); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ category, level, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM technology_modules WHERE 1=1';
    const values = [];
    if (category) { query += ' AND category = ?'; values.push(category); }
    if (level) { query += ' AND level = ?'; values.push(level); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }
    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByCourseId(courseId) {
    const [rows] = await pool.execute(
      'SELECT tm.* FROM technology_modules tm JOIN course_modules cm ON tm.id = cm.module_id WHERE cm.course_id = ? ORDER BY cm.module_order',
      [courseId]
    );
    return rows.map(row => this.format(row));
  }

  static async listByProgramId(programId) {
    const [rows] = await pool.execute(
      'SELECT tm.* FROM technology_modules tm JOIN program_modules pm ON tm.id = pm.module_id WHERE pm.program_id = ? ORDER BY pm.module_order',
      [programId]
    );
    return rows.map(row => this.format(row));
  }

  static async reorderInCourse(courseId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute('UPDATE course_modules SET module_order = ? WHERE module_id = ? AND course_id = ?', [i + 1, orderedIds[i], courseId]);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async reorderInProgram(programId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute('UPDATE program_modules SET module_order = ? WHERE module_id = ? AND program_id = ?', [i + 1, orderedIds[i], programId]);
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
