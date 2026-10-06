import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

/**
 * Safe decrypt for display strings. Rows written before encryption was enabled
 * (or that fail to decrypt) fall back to a placeholder instead of leaking
 * ciphertext into API responses or notification copy.
 */
const safeDecrypt = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback;
  try {
    const out = decrypt(value);
    return out ?? fallback;
  } catch (_) {
    return fallback;
  }
};

/**
 * Parses the JSON-encoded id list MySQL stores for a project's assigned team.
 * Tolerates a plain array, a JSON string, and null.
 */
const parseIdList = (value) => {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (_) {
    return [];
  }
};

const normalizeIdList = (value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return JSON.stringify(value.filter(Boolean));
  return value;
};

/**
 * Columns that resolve the responsible people for a project by joining users.
 * LEFT JOINs keep projects with no assignee (and orphaned ids) visible.
 */
const WITH_OWNER = `
  SELECT p.*,
         m.full_name AS manager_name,
         m.email     AS manager_email,
         m.role      AS manager_role,
         m.avatar_url AS manager_avatar
  FROM student_projects p
  LEFT JOIN users m ON m.id = p.manager_id
`;

const withOwnerFormatting = (row) => ({
  ...row,
  repo_structure: row.repo_structure ? JSON.parse(row.repo_structure) : null,
  assigned_user_ids: parseIdList(row.assigned_user_ids),
  manager: row.manager_id
    ? {
        id: row.manager_id,
        full_name: safeDecrypt(row.manager_name, 'Unknown user'),
        email: safeDecrypt(row.manager_email, ''),
        role: row.manager_role,
        avatar_url: row.manager_avatar || null
      }
    : null
});

export default class StudentProject {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      repo_structure: row.repo_structure ? JSON.parse(row.repo_structure) : null,
      assigned_user_ids: parseIdList(row.assigned_user_ids)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(`${WITH_OWNER} WHERE p.id = ?`, [id]);
    return rows.length > 0 ? withOwnerFormatting(rows[0]) : null;
  }

  static async create({
    student_id,
    name,
    description = null,
    github_repo_url,
    repo_owner = null,
    repo_name = null,
    branch = 'main',
    is_active = true,
    manager_id = null,
    assigned_user_ids = null,
    priority = 'MEDIUM',
    due_date = null,
    status = 'ACTIVE'
  }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO student_projects
         (id, student_id, name, description, github_repo_url, repo_owner, repo_name, branch, is_active,
          manager_id, assigned_user_ids, priority, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, student_id, name, description, github_repo_url, repo_owner, repo_name, branch, is_active,
        manager_id, normalizeIdList(assigned_user_ids), priority, due_date, status
      ]
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
    if (updates.manager_id !== undefined) { queryParts.push('manager_id = ?'); values.push(updates.manager_id || null); }
    if (updates.assigned_user_ids !== undefined) { queryParts.push('assigned_user_ids = ?'); values.push(normalizeIdList(updates.assigned_user_ids)); }
    if (updates.priority !== undefined) { queryParts.push('priority = ?'); values.push(updates.priority); }
    if (updates.due_date !== undefined) { queryParts.push('due_date = ?'); values.push(updates.due_date || null); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE student_projects SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM student_projects WHERE id = ?', [id]);
  }

  static async list({ student_id, is_active, manager_id, status, limit = 50, offset = 0 } = {}) {
    let query = WITH_OWNER + ' WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND p.student_id = ?'; values.push(student_id); }
    if (is_active !== undefined) { query += ' AND p.is_active = ?'; values.push(is_active); }
    if (manager_id) { query += ' AND p.manager_id = ?'; values.push(manager_id); }
    if (status) { query += ' AND p.status = ?'; values.push(status); }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(withOwnerFormatting);
  }

  static async count({ student_id, is_active, manager_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM student_projects WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }
    if (manager_id) { query += ' AND manager_id = ?'; values.push(manager_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  /**
   * Resolves decrypted display names for a set of user ids so notification copy
   * can address people by name instead of a bare uuid.
   * @returns {Promise<Map<string, {id:string, full_name:string, email:string, role:string}>>}
   */
  static async resolvePeople(ids) {
    const unique = [...new Set((ids || []).filter(Boolean))];
    if (unique.length === 0) return new Map();

    const placeholders = unique.map(() => '?').join(', ');
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, role FROM users WHERE id IN (${placeholders})`,
      unique
    );
    return new Map(rows.map((r) => [r.id, {
      id: r.id,
      full_name: safeDecrypt(r.full_name, 'Unknown user'),
      email: safeDecrypt(r.email, ''),
      role: r.role
    }]));
  }
}
