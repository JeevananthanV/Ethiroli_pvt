import crypto from 'crypto';
import pool from '../config/database.js';

export default class Job {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      required_skills: row.required_skills
        ? (() => { try { return JSON.parse(row.required_skills); } catch { return row.required_skills; } })()
        : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ title, description, department = null, location = null, salary_range = null, required_skills = null, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO jobs (id, title, description, department, location, salary_range, required_skills, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description, department, location, salary_range, required_skills ? JSON.stringify(required_skills) : null, created_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.department !== undefined) { queryParts.push('department = ?'); values.push(updates.department); }
    if (updates.location !== undefined) { queryParts.push('location = ?'); values.push(updates.location); }
    if (updates.salary_range !== undefined) { queryParts.push('salary_range = ?'); values.push(updates.salary_range); }
    if (updates.required_skills !== undefined) { queryParts.push('required_skills = ?'); values.push(updates.required_skills ? JSON.stringify(updates.required_skills) : null); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.posted_at !== undefined) { queryParts.push('posted_at = ?'); values.push(updates.posted_at); }
    if (updates.closed_at !== undefined) { queryParts.push('closed_at = ?'); values.push(updates.closed_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE jobs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);
  }

  static async list({ status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const values = [];

    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM jobs WHERE 1=1';
    const values = [];

    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
