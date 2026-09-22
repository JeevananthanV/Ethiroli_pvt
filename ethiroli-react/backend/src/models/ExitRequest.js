import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ExitRequest {
  static format(row) {
    if (!row) return null;
    const name = row.full_name ? decrypt(row.full_name) : (row.employee_name || null);
    return {
      ...row,
      employee_name: name,
      user_name: name,
      email: row.email ? decrypt(row.email) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT er.*, u.full_name, u.email, e.employee_code, e.department, e.designation 
       FROM exit_requests er 
       JOIN employees e ON er.employee_id = e.id 
       JOIN users u ON e.user_id = u.id 
       WHERE er.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), employee_id, resignation_date, requested_last_day, reason, notice_period_days = 30 }) {
    await pool.execute(
      `INSERT INTO exit_requests (id, employee_id, resignation_date, requested_last_day, reason, notice_period_days, status)
       VALUES (?, ?, ?, ?, ?, ?, 'SUBMITTED')`,
      [id, employee_id, resignation_date, requested_last_day, reason, notice_period_days]
    );

    // Automatically seed standard offboarding checklist items
    const standardTasks = [
      { dept: 'IT', task: 'Revoke email, SSO, and VPN access' },
      { dept: 'IT', task: 'Collect company laptop and peripheral devices' },
      { dept: 'HR', task: 'Conduct exit interview and document feedback' },
      { dept: 'HR', task: 'Collect ID badge and company access cards' },
      { dept: 'FINANCE', task: 'Process final settlement and encashment' },
      { dept: 'FINANCE', task: 'Verify loan/advance recovery and issue Form 16' },
      { dept: 'OPERATIONS', task: 'Project knowledge transfer sign-off' }
    ];

    for (const t of standardTasks) {
      await pool.execute(
        `INSERT INTO offboarding_checklists (id, exit_request_id, department, task_name, is_cleared)
         VALUES (UUID(), ?, ?, ?, FALSE)`,
        [id, t.dept, t.task]
      );
    }

    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.approved_last_day !== undefined) { queryParts.push('approved_last_day = ?'); values.push(updates.approved_last_day); }
    if (updates.exit_interview_notes !== undefined) { queryParts.push('exit_interview_notes = ?'); values.push(updates.exit_interview_notes); }
    if (updates.approved_by !== undefined) { queryParts.push('approved_by = ?'); values.push(updates.approved_by); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE exit_requests SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async list({ status, employee_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT er.*, u.full_name, u.email, e.employee_code, e.department, e.designation 
      FROM exit_requests er 
      JOIN employees e ON er.employee_id = e.id 
      JOIN users u ON e.user_id = u.id 
      WHERE 1=1
    `;
    const values = [];

    if (status) { query += ' AND er.status = ?'; values.push(status); }
    if (employee_id) { query += ' AND er.employee_id = ?'; values.push(employee_id); }

    query += ' ORDER BY er.resignation_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async getChecklist(exit_request_id) {
    const [rows] = await pool.execute(
      `SELECT oc.*, u.full_name as cleared_by_name 
       FROM offboarding_checklists oc 
       LEFT JOIN users u ON oc.cleared_by = u.id 
       WHERE oc.exit_request_id = ? 
       ORDER BY oc.department, oc.task_name`,
      [exit_request_id]
    );
    return rows;
  }

  static async updateChecklistTask(taskId, { is_cleared, cleared_by, remarks }) {
    await pool.execute(
      `UPDATE offboarding_checklists 
       SET is_cleared = ?, cleared_by = ?, cleared_at = NOW(), remarks = ? 
       WHERE id = ?`,
      [is_cleared, cleared_by, remarks, taskId]
    );
  }
}
