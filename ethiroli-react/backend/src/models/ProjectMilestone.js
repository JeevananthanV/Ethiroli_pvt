import crypto from 'crypto';
import pool from '../config/database.js';

export default class ProjectMilestone {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      budget_allocated: parseFloat(row.budget_allocated || 0)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT m.*, p.name as project_name 
       FROM project_milestones m
       JOIN student_projects p ON m.project_id = p.id
       WHERE m.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    project_id,
    title,
    description = null,
    target_date,
    deliverable_url = null,
    budget_allocated = 0.0,
    status = 'PENDING'
  }) {
    await pool.execute(
      `INSERT INTO project_milestones
       (id, project_id, title, description, target_date, deliverable_url, budget_allocated, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project_id, title, description, target_date, deliverable_url, budget_allocated, status]
    );
    return { id, status };
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.target_date !== undefined) { queryParts.push('target_date = ?'); values.push(updates.target_date); }
    if (updates.completed_date !== undefined) { queryParts.push('completed_date = ?'); values.push(updates.completed_date); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.deliverable_url !== undefined) { queryParts.push('deliverable_url = ?'); values.push(updates.deliverable_url); }
    if (updates.budget_allocated !== undefined) { queryParts.push('budget_allocated = ?'); values.push(updates.budget_allocated); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE project_milestones SET ${queryParts.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async signoff(id, deliverable_url = null) {
    await pool.execute(
      `UPDATE project_milestones 
       SET status = 'COMPLETED', completed_date = CURDATE(), deliverable_url = COALESCE(?, deliverable_url)
       WHERE id = ?`,
      [deliverable_url, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM project_milestones WHERE id = ?', [id]);
  }

  static async list({ project_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT m.*, p.name as project_name
      FROM project_milestones m
      JOIN student_projects p ON m.project_id = p.id
      WHERE 1=1
    `;
    const values = [];

    if (project_id) { query += ' AND m.project_id = ?'; values.push(project_id); }
    if (status) { query += ' AND m.status = ?'; values.push(status); }

    query += ' ORDER BY m.target_date ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}
