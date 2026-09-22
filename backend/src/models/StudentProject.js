import crypto from 'crypto';
import pool from '../config/database.js';

export default class StudentProject {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      repo_structure: row.repo_structure ? JSON.parse(row.repo_structure) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM student_projects WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ student_id, name, description = null, github_repo_url, repo_owner = null, repo_name = null, branch = 'main', is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO student_projects (id, student_id, name, description, github_repo_url, repo_owner, repo_name, branch, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, student_id, name, description, github_repo_url, repo_owner, repo_name, branch, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.github_repo_url !== undefined) { queryParts.push('github_repo_url = ?'); values.push(updates.github_repo_url); }
    if (updates.repo_owner !== undefined) { queryParts.push('repo_owner = ?'); values.push(updates.repo_owner); }
    if (updates.repo_name !== undefined) { queryParts.push('repo_name = ?'); values.push(updates.repo_name); }
    if (updates.branch !== undefined) { queryParts.push('branch = ?'); values.push(updates.branch); }
    if (updates.last_commit_hash !== undefined) { queryParts.push('last_commit_hash = ?'); values.push(updates.last_commit_hash); }
    if (updates.repo_structure !== undefined) { queryParts.push('repo_structure = ?'); values.push(updates.repo_structure ? JSON.stringify(updates.repo_structure) : null); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE student_projects SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM student_projects WHERE id = ?', [id]);
  }

  static async list({ student_id, is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM student_projects WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ student_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM student_projects WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
