import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ProjectFile {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      uploader_name: row.full_name ? decrypt(row.full_name) : 'Team Member',
      file_size_formatted: (row.file_size_bytes / (1024 * 1024)).toFixed(2) + ' MB'
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT f.*, u.full_name, u.email as uploader_email, p.name as project_name
       FROM project_files f
       JOIN users u ON f.uploaded_by = u.id
       JOIN student_projects p ON f.project_id = p.id
       WHERE f.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    project_id,
    uploaded_by,
    file_name,
    file_url,
    file_size_bytes = 0,
    mime_type = 'application/octet-stream',
    version = '1.0',
    category = 'SPECIFICATION'
  }) {
    await pool.execute(
      `INSERT INTO project_files
       (id, project_id, uploaded_by, file_name, file_url, file_size_bytes, mime_type, version, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project_id, uploaded_by, file_name, file_url, file_size_bytes, mime_type, version, category]
    );
    return { id, file_name };
  }

  static async delete(id) {
    await pool.execute('DELETE FROM project_files WHERE id = ?', [id]);
  }

  static async list({ project_id, category, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT f.*, u.full_name, u.email as uploader_email, p.name as project_name
      FROM project_files f
      JOIN users u ON f.uploaded_by = u.id
      JOIN student_projects p ON f.project_id = p.id
      WHERE 1=1
    `;
    const values = [];

    if (project_id) { query += ' AND f.project_id = ?'; values.push(project_id); }
    if (category) { query += ' AND f.category = ?'; values.push(category); }

    query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}
