import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ProjectMember {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      user_name: row.full_name ? decrypt(row.full_name) : (row.user_name || null),
      user_email: row.email ? decrypt(row.email) : (row.user_email || null)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT pm.*, u.full_name, u.email, sp.name as project_name, sp.description as project_description, sp.github_repo_url
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       LEFT JOIN student_projects sp ON pm.project_id = sp.id
       WHERE pm.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async addMember({ id = crypto.randomUUID(), project_id, user_id, project_role = 'MEMBER' }) {
    await pool.execute(
      `INSERT INTO project_members (id, project_id, user_id, project_role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE project_role = VALUES(project_role)`,
      [id, project_id, user_id, project_role]
    );
    return { id, project_id, user_id, project_role };
  }

  static async removeMember(project_id, user_id) {
    await pool.execute(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [project_id, user_id]
    );
  }

  static async listUserProjects(userId, { limit = 50, offset = 0 } = {}) {
    // repo_owner / repo_name / last_commit_hash / repo_structure were selected as
    // `sp.*` before, but the explicit column list below is what the employee's
    // project detail dialog actually renders. The extra fields are included so
    // the dialog can show the real repository metadata instead of a bare name.
    const [rows] = await pool.execute(
      `SELECT pm.id AS membership_id, pm.project_role, pm.joined_at,
              sp.id AS project_id, sp.name, sp.description, sp.github_repo_url,
              sp.repo_owner, sp.repo_name, sp.branch, sp.last_commit_hash,
              sp.repo_structure, sp.is_active, sp.created_at, sp.updated_at
       FROM project_members pm
       JOIN student_projects sp ON pm.project_id = sp.id
       WHERE pm.user_id = ?
       ORDER BY pm.joined_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async listProjectMembers(projectId) {
    const [rows] = await pool.execute(
      `SELECT pm.*, u.full_name, u.email, u.avatar_url
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?
       ORDER BY pm.joined_at ASC`,
      [projectId]
    );
    return rows.map(r => this.format(r));
  }
}
