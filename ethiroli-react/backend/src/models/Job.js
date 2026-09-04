import crypto from 'crypto';
import pool from '../config/database.js';

export default class Job {
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
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }

    if (queryParts.length === 0) return;
    values.push(id);

    await pool.execute(`UPDATE jobs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM jobs ORDER BY created_at DESC');
    return rows;
  }
}