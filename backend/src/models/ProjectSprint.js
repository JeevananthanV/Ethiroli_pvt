import crypto from 'crypto';
import pool from '../config/database.js';

export default class ProjectSprint {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      target_velocity: parseInt(row.target_velocity || 0, 10),
      actual_velocity: parseInt(row.actual_velocity || 0, 10)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT s.*, p.name as project_name 
       FROM project_sprints s
       JOIN student_projects p ON s.project_id = p.id
       WHERE s.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    project_id,
    sprint_number,
    sprint_name,
    goal = null,
    start_date,
    end_date,
    target_velocity = 0,
    status = 'PLANNING'
  }) {
    await pool.execute(
      `INSERT INTO project_sprints
       (id, project_id, sprint_number, sprint_name, goal, start_date, end_date, target_velocity, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project_id, sprint_number, sprint_name, goal, start_date, end_date, target_velocity, status]
    );
    return { id, sprint_number, status };
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.sprint_name !== undefined) { queryParts.push('sprint_name = ?'); values.push(updates.sprint_name); }
    if (updates.goal !== undefined) { queryParts.push('goal = ?'); values.push(updates.goal); }
    if (updates.start_date !== undefined) { queryParts.push('start_date = ?'); values.push(updates.start_date); }
    if (updates.end_date !== undefined) { queryParts.push('end_date = ?'); values.push(updates.end_date); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.target_velocity !== undefined) { queryParts.push('target_velocity = ?'); values.push(updates.target_velocity); }
    if (updates.actual_velocity !== undefined) { queryParts.push('actual_velocity = ?'); values.push(updates.actual_velocity); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE project_sprints SET ${queryParts.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async startSprint(id) {
    await pool.execute(
      `UPDATE project_sprints SET status = 'ACTIVE' WHERE id = ?`,
      [id]
    );
    return this.findById(id);
  }

  static async completeSprint(id, actual_velocity = 0) {
    await pool.execute(
      `UPDATE project_sprints SET status = 'COMPLETED', actual_velocity = ? WHERE id = ?`,
      [actual_velocity, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM project_sprints WHERE id = ?', [id]);
  }

  static async list({ project_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT s.*, p.name as project_name
      FROM project_sprints s
      JOIN student_projects p ON s.project_id = p.id
      WHERE 1=1
    `;
    const values = [];

    if (project_id) { query += ' AND s.project_id = ?'; values.push(project_id); }
    if (status) { query += ' AND s.status = ?'; values.push(status); }

    query += ' ORDER BY s.sprint_number DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}
