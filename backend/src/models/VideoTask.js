import pool from '../config/database.js';
import crypto from 'crypto';

export default class VideoTask {
  static async createTask(data) {
    const {
      project_id,
      title,
      video_type,
      assigned_editor,
      priority,
      estimated_hours,
      start_date,
      deadline,
      source_files,
      notes,
    } = data;

    const id = crypto.randomUUID();
    const estimated = parseFloat(estimated_hours) || 2.00;
    const actual = parseFloat(data.actual_hours) || 0;

    const [result] = await pool.execute(
      `INSERT INTO video_tasks 
        (id, project_id, title, video_type, assigned_editor, status, priority, 
         estimated_hours, actual_hours, start_date, deadline, source_files, notes, created_by)
       VALUES (?, ?, ?, ?, ?, 'Assigned', ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        project_id,
        title,
        video_type,
        assigned_editor,
        priority || 'Medium',
        estimated,
        actual,
        start_date,
        deadline,
        JSON.stringify(source_files || []),
        notes || '',
      ]
    );

    return this.getTaskById(id);
  }

  static async getTasks(filters = {}) {
    const {
      status,
      priority,
      assigned_editor,
      project_id,
      page = 1,
      limit = 20,
    } = filters;

    let sql = `
      VT.id, VT.title, VT.video_type, VT.status, VT.priority, 
      VT.estimated_hours, VT.actual_hours, VT.deadline,
      V.full_name as editor_name, P.title as project_title, P.client_name
      FROM video_tasks VT
      LEFT JOIN users V ON VT.assigned_editor = V.id
      LEFT JOIN video_projects P ON VT.project_id = P.id
      WHERE 1=1
    `;
    let countSql = `SELECT COUNT(*) as total FROM video_tasks VT LEFT JOIN video_projects P ON VT.project_id = P.id WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (status) {
      sql += ' AND VT.status = ?';
      params.push(status);
      countSql += ' AND VT.status = ?';
      countParams.push(status);
    }

    if (priority) {
      sql += ' AND VT.priority = ?';
      params.push(priority);
      countSql += ' AND VT.priority = ?';
      countParams.push(priority);
    }

    if (assigned_editor) {
      sql += ' AND VT.assigned_editor = ?';
      params.push(assigned_editor);
      countSql += ' AND VT.assigned_editor = ?';
      countParams.push(assigned_editor);
    }

    if (project_id) {
      sql += ' AND VT.project_id = ?';
      params.push(project_id);
      countSql += ' AND VT.project_id = ?';
      countParams.push(project_id);
    }

    sql += ' ORDER BY VT.created_at DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return { items: rows, total, page, limit };
  }

  static async getTaskById(id) {
    const [rows] = await pool.execute(
      `SELECT VT.*, P.title as project_title, P.client_name,
              V.full_name as editor_name, V.email as editor_email
       FROM video_tasks VT
       LEFT JOIN video_projects P ON VT.project_id = P.id
       LEFT JOIN users V ON VT.assigned_editor = V.id
       WHERE VT.id = ?`,
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async updateTaskStatus(id, newStatus, editorId) {
    const [result] = await pool.execute(
      `UPDATE video_tasks SET status = ?, updated_at = NOW() WHERE id = ? AND assigned_editor = ?`,
      [newStatus, id, editorId]
    );

    return result.affectedRows > 0;
  }

  static async updateTask(id, data) {
    const fields = [];
    const values = [];

    const allowed = [
      'title', 'video_type', 'priority', 'status', 'estimated_hours',
      'actual_hours', 'start_date', 'deadline', 'source_files', 'notes'
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    await pool.execute(`UPDATE video_tasks SET ${fields.join(', ')} WHERE id = ?`, values);

    return this.getTaskById(id);
  }

  static async deleteTask(id, softDelete = true) {
    if (softDelete) {
      const [res] = await pool.execute(
        `UPDATE video_tasks SET is_deleted = 1, updated_at = NOW() WHERE id = ?`,
        [id]
      );
      return res.affectedRows > 0;
    } else {
      const [res] = await pool.execute('DELETE FROM video_tasks WHERE id = ?', [id]);
      return res.affectedRows > 0;
    }
  }
}