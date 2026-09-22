import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class Timesheet {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      user_name: row.employee_name ? decrypt(row.employee_name) : null,
      approver_name: row.manager_name ? decrypt(row.manager_name) : null,
      project_name: row.proj_name || 'General Operations',
      task_name: row.task_desc || null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT ts.*, 
              u.full_name as employee_name, u.email as employee_email,
              appr.full_name as manager_name,
              p.name as proj_name,
              t.description as task_desc
       FROM timesheets ts
       JOIN users u ON ts.user_id = u.id
       LEFT JOIN users appr ON ts.approved_by = appr.id
       LEFT JOIN student_projects p ON ts.project_id = p.id
       LEFT JOIN tasks t ON ts.task_id = t.id
       WHERE ts.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    user_id,
    project_id = null,
    task_id = null,
    work_date,
    hours_spent,
    description,
    status = 'SUBMITTED'
  }) {
    await pool.execute(
      `INSERT INTO timesheets 
       (id, user_id, project_id, task_id, work_date, hours_spent, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, project_id, task_id, work_date, hours_spent, description, status]
    );
    return { id, status };
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.project_id !== undefined) { queryParts.push('project_id = ?'); values.push(updates.project_id); }
    if (updates.task_id !== undefined) { queryParts.push('task_id = ?'); values.push(updates.task_id); }
    if (updates.work_date !== undefined) { queryParts.push('work_date = ?'); values.push(updates.work_date); }
    if (updates.hours_spent !== undefined) { queryParts.push('hours_spent = ?'); values.push(updates.hours_spent); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.approved_by !== undefined) { queryParts.push('approved_by = ?'); values.push(updates.approved_by); }
    if (updates.rejection_reason !== undefined) { queryParts.push('rejection_reason = ?'); values.push(updates.rejection_reason); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE timesheets SET ${queryParts.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async approve(id, approved_by) {
    await pool.execute(
      `UPDATE timesheets 
       SET status = 'APPROVED', approved_by = ?, approved_at = NOW(), rejection_reason = NULL 
       WHERE id = ?`,
      [approved_by, id]
    );
    return this.findById(id);
  }

  static async reject(id, approved_by, reason = '') {
    await pool.execute(
      `UPDATE timesheets 
       SET status = 'REJECTED', approved_by = ?, approved_at = NOW(), rejection_reason = ? 
       WHERE id = ?`,
      [approved_by, reason, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM timesheets WHERE id = ?', [id]);
  }

  static async list({ user_id, project_id, status, start_date, end_date, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT ts.*, 
             u.full_name as employee_name, u.email as employee_email,
             appr.full_name as manager_name,
             p.name as proj_name,
             t.description as task_desc
      FROM timesheets ts
      JOIN users u ON ts.user_id = u.id
      LEFT JOIN users appr ON ts.approved_by = appr.id
      LEFT JOIN student_projects p ON ts.project_id = p.id
      LEFT JOIN tasks t ON ts.task_id = t.id
      WHERE 1=1
    `;
    const values = [];

    if (user_id) { query += ' AND ts.user_id = ?'; values.push(user_id); }
    if (project_id) { query += ' AND ts.project_id = ?'; values.push(project_id); }
    if (status) { query += ' AND ts.status = ?'; values.push(status); }
    if (start_date) { query += ' AND ts.work_date >= ?'; values.push(start_date); }
    if (end_date) { query += ' AND ts.work_date <= ?'; values.push(end_date); }

    query += ' ORDER BY ts.work_date DESC, ts.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id, project_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM timesheets WHERE 1=1';
    const values = [];
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (project_id) { query += ' AND project_id = ?'; values.push(project_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async getSummary({ user_id, project_id } = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_entries,
        COALESCE(SUM(hours_spent), 0) as total_hours,
        COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN hours_spent ELSE 0 END), 0) as approved_hours,
        COALESCE(SUM(CASE WHEN status = 'SUBMITTED' THEN hours_spent ELSE 0 END), 0) as pending_hours,
        COALESCE(SUM(CASE WHEN status = 'REJECTED' THEN hours_spent ELSE 0 END), 0) as rejected_hours
      FROM timesheets
      WHERE 1=1
    `;
    const values = [];
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (project_id) { query += ' AND project_id = ?'; values.push(project_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0];
  }
}
