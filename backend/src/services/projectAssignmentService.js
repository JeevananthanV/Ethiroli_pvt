import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

/**
 * Safe decrypt for display strings. Values that are already plaintext (rows
 * written before encryption was enabled) or that fail to decrypt fall back to
 * a stable placeholder rather than leaking ciphertext or throwing.
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

/** Decrypts the identity fields on a raw users row. */
const formatPerson = (row) => (row
  ? {
      id: row.id,
      full_name: safeDecrypt(row.full_name, 'Unknown user'),
      email: safeDecrypt(row.email, ''),
      role: row.role,
      avatar_url: row.avatar_url || null
    }
  : null);

/**
 * Roles that can be made responsible for delivering a project.
 * A project is delivered by delivery people, so STUDENT is excluded.
 */
export const ASSIGNABLE_ROLES = [
  'PROJECT_MANAGER',
  'TUTOR',
  'SENIOR_TUTOR',
  'EMPLOYEE',
  'INTERN',
  'FINANCE',
  'SALES',
  'RECEPTION',
  'HR',
  'ADMIN',
  'SUPER_ADMIN'
];

/** Serialises an id list for the JSON column, or leaves it alone when absent. */
const normalizeIdList = (value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return JSON.stringify(value.filter(Boolean));
  return value;
};

/**
 * Normalises the ownership fields off a request body.
 * `assigned_user_ids` accepts an array, a JSON string, or a comma-separated list.
 *
 * @param {object} body
 * @returns {{manager_id: string|null, assigned_user_ids: string[], priority: string, due_date: string|null, status: string}}
 */
export const readAssignment = (body = {}) => {
  const rawList = body.assigned_user_ids ?? body.assignedUserIds ?? body.team_member_ids ?? [];

  let list;
  if (Array.isArray(rawList)) {
    list = rawList;
  } else if (typeof rawList === 'string' && rawList.trim()) {
    // Could be a JSON array (e.g. read back from the JSON column) or a plain
    // comma-separated id list from a form post.
    try {
      const parsed = JSON.parse(rawList);
      list = Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      list = rawList.split(',').map((s) => s.trim()).filter(Boolean);
    }
  } else {
    list = [];
  }

  return {
    manager_id: body.manager_id ?? body.managerId ?? null,
    assigned_user_ids: list,
    priority: body.priority || 'MEDIUM',
    due_date: body.due_date ?? body.dueDate ?? null,
    status: body.status || 'ACTIVE'
  };
};

/** True when the payload touches any ownership field. */
export const touchesOwnership = (body = {}) =>
  ['manager_id', 'managerId', 'assigned_user_ids', 'assignedUserIds', 'team_member_ids']
    .some((k) => body[k] !== undefined);

/**
 * Builds the ownership patch to persist, containing ONLY the fields the caller
 * actually sent.
 *
 * This matters on partial updates: reassigning just `manager_id` must not wipe
 * the existing team, so the defaults produced by `readAssignment` cannot be
 * written back wholesale.
 *
 * @returns {object} e.g. { manager_id: '...' } or { assigned_user_ids: '[".."]' }
 */
export const buildOwnershipPatch = (body = {}) => {
  const patch = {};

  if (body.manager_id !== undefined || body.managerId !== undefined) {
    patch.manager_id = body.manager_id ?? body.managerId ?? null;
  }

  const hasTeam = body.assigned_user_ids !== undefined
    || body.assignedUserIds !== undefined
    || body.team_member_ids !== undefined;

  if (hasTeam) {
    patch.assigned_user_ids = normalizeIdList(readAssignment(body).assigned_user_ids);
  }

  if (body.priority !== undefined) patch.priority = body.priority;
  if (body.due_date !== undefined) patch.due_date = body.due_date || null;
  if (body.status !== undefined) patch.status = body.status;

  return patch;
};

/**
 * Rejects owner ids that do not exist, are deactivated, or hold a role that
 * cannot own a project — so notifications never target an ineligible account.
 *
 * @throws {Error} with `statusCode = 400` when any id is unusable.
 * @returns {Promise<Map<string, object>>} id -> { id, role, is_active }
 */
export const validateOwners = async (managerId, assignedIds) => {
  const ids = [...new Set([managerId, ...assignedIds].filter(Boolean))];
  if (ids.length === 0) return new Map();

  const placeholders = ids.map(() => '?').join(', ');
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, role, is_active FROM users WHERE id IN (${placeholders})`,
    ids
  );

  const map = new Map(rows.map((r) => [r.id, { ...formatPerson(r), is_active: r.is_active }]));
  const problems = [];

  for (const id of ids) {
    const user = map.get(id);
    if (!user) {
      problems.push(`User ${id} does not exist.`);
    } else if (!ASSIGNABLE_ROLES.includes(user.role)) {
      problems.push(`${user.full_name} has role ${user.role}, which cannot own a project.`);
    } else if (!user.is_active) {
      problems.push(`${user.full_name} is deactivated and cannot be assigned.`);
    }
  }

  if (problems.length > 0) {
    const err = new Error(problems.join(' '));
    err.statusCode = 400;
    throw err;
  }

  return map;
};

/**
 * Active users a project may be handed to. Backs the "Responsible for delivery"
 * picker without exposing the full user directory.
 */
export const fetchAssignableUsers = async () => {
  const placeholders = ASSIGNABLE_ROLES.map(() => '?').join(', ');
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, role, avatar_url, is_active
       FROM users
      WHERE is_active = 1 AND role IN (${placeholders})
      ORDER BY id ASC`,
    ASSIGNABLE_ROLES
  );
  // Sort by decrypted display name so the picker reads alphabetically.
  return rows
    .map(formatPerson)
    .sort((a, b) => String(a.full_name).localeCompare(String(b.full_name)));
};

export default {
  ASSIGNABLE_ROLES,
  readAssignment,
  touchesOwnership,
  buildOwnershipPatch,
  validateOwners,
  fetchAssignableUsers
};
