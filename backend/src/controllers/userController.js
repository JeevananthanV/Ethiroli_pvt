import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import CredentialService from '../services/credentialService.js';

const normalizeRole = (role) => {
  if (!role) return 'EMPLOYEE';
  const upper = String(role).trim().toUpperCase();
  const map = {
    USER: 'EMPLOYEE',
    MANAGER: 'PROJECT_MANAGER',
    SUPERADMIN: 'SUPER_ADMIN'
  };
  return map[upper] || upper;
};

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  const { password_hash, ...safeUser } = user;
  return success(res, 200, safeUser);
});

/**
 * Self-service profile update. Only non-privileged fields are accepted here -
 * role, email and account status stay behind the admin-only routes below.
 */
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { full_name, phone } = req.body;
  const updates = {};

  if (full_name !== undefined) {
    const name = String(full_name).trim();
    if (name.length < 2) throw new ValidationError('full_name must be at least 2 characters.');
    updates.full_name = name;
  }

  if (phone !== undefined) {
    updates.phone = phone ? String(phone).trim() : null;
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError('Nothing to update. Send full_name and/or phone.');
  }

  await User.update(req.user.id, updates);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_PROFILE',
    entity_type: 'USER',
    entity_id: req.user.id,
    new_value: updates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const user = await User.findById(req.user.id);
  const { password_hash, ...safeUser } = user;
  return success(res, 200, safeUser, 'Profile updated successfully');
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role, is_active, status, search, limit = 50, offset = 0 } = req.query;

  // Tutors may only enumerate learners (the assign-courses dropdown); they
  // must not be able to read admin/staff accounts through the same endpoint.
  const callerRole = req.user.role;
  const scopedRole = callerRole === 'TUTOR' ? 'STUDENT' : role;

  let activeFilter = undefined;
  if (is_active !== undefined) {
    activeFilter = is_active === 'true' || is_active === '1' || is_active === true;
  } else if (status !== undefined) {
    activeFilter = status === 'active';
  }

  const users = await User.list({
    role: scopedRole,
    is_active: activeFilter,
    search,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });

  let safeUsers = users.map(u => {
    const { password_hash, ...safe } = u;
    return safe;
  });

  // HR clearance boundary: HR staff (rank 60) can only view personnel strictly below clearance rank 60
  if (callerRole === 'HR') {
    const allowedRoles = new Set(['TUTOR', 'SENIOR_TUTOR', 'PM', 'PROJECT_MANAGER', 'EMPLOYEE', 'INTERN', 'STUDENT']);
    safeUsers = safeUsers.filter(u => allowedRoles.has(u.role));
  }

  return success(res, 200, safeUsers);
});

export const getUserFilters = asyncHandler(async (req, res) => {
  const roles = [
    'SUPER_ADMIN',
    'HR_SUPERADMIN',
    'ADMIN',
    'HR',
    'SENIOR_TUTOR',
    'TUTOR',
    'PROJECT_MANAGER',
    'FINANCE',
    'SALES',
    'RECEPTION',
    'EMPLOYEE',
    'STUDENT',
    'INTERN'
  ];
  return success(res, 200, {
    roles,
    statuses: ['active', 'inactive', 'pending']
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, full_name, name, phone, role, is_active } = req.body;

  const resolvedName = full_name || name;
  if (!resolvedName) {
    throw new ValidationError('full_name or name is required.');
  }

  const normalizedRole = normalizeRole(role);

  const existing = await User.findByEmail(email);
  if (existing) {
    throw new ValidationError('User with this email already exists.');
  }

  const rawPassword = password && password.trim() ? password.trim() : 'Ethiroli@123';
  const passwordHash = await bcrypt.hash(rawPassword, 10);
  const userId = await User.create({
    email,
    password_hash: passwordHash,
    full_name: resolvedName,
    phone: phone || null,
    role: normalizedRole
  });

  if (is_active !== undefined && !is_active) {
    await User.update(userId, { is_active: false });
  }

  // Sync to user_roles table if role exists
  try {
    const [roles] = await pool.query('SELECT id FROM roles WHERE code = ?', [normalizedRole]);
    if (roles.length > 0) {
      await pool.query(
        `INSERT IGNORE INTO user_roles (id, user_id, role_id, assigned_by) VALUES (?, ?, ?, ?)`,
        [crypto.randomUUID(), userId, roles[0].id, req.user?.id || 'SYSTEM']
      );
    }
  } catch (_) {
    // Non-blocking fallback
  }

  // Populate user_credentials
  try {
    await pool.query(
      `INSERT INTO user_credentials 
       (user_id, password_hash, password_algo, password_history, requires_password_change)
       VALUES (?, ?, 'BCRYPT', ?, FALSE)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [userId, passwordHash, JSON.stringify([passwordHash])]
    );
  } catch (_) {
    // Non-blocking fallback
  }

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_USER',
    entity_type: 'USER',
    entity_id: userId,
    new_value: { email, full_name: resolvedName, role: normalizedRole },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, { id: userId, email, full_name: resolvedName, role: normalizedRole, is_active: is_active !== false }, 'User created successfully');
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, name, email, phone, role, is_active, status, password } = req.body;

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  const oldValues = {
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_active: user.is_active
  };

  const updates = {};
  const resolvedName = full_name !== undefined ? full_name : name;
  if (resolvedName !== undefined) updates.full_name = resolvedName;
  if (phone !== undefined) updates.phone = phone;

  if (email && email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
    const existing = await User.findByEmail(email);
    if (existing && existing.id !== id) {
      throw new ValidationError('Email is already taken by another user.');
    }
    updates.email = email;
  }

  if (role) {
    updates.role = normalizeRole(role);
  }

  if (is_active !== undefined) {
    updates.is_active = Boolean(is_active);
  } else if (status !== undefined) {
    updates.is_active = status === 'active';
  }

  if (password && typeof password === 'string' && password.trim().length >= 6) {
    updates.password_hash = await bcrypt.hash(password.trim(), 10);
  }

  await User.update(id, updates);

  // Sync role update into user_roles table
  if (updates.role && updates.role !== user.role) {
    try {
      const [roles] = await pool.query('SELECT id FROM roles WHERE code = ?', [updates.role]);
      if (roles.length > 0) {
        await pool.query(
          `INSERT INTO user_roles (id, user_id, role_id, assigned_by) 
           VALUES (?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), assigned_by = VALUES(assigned_by)`,
          [crypto.randomUUID(), id, roles[0].id, req.user?.id || 'SYSTEM']
        );
      }
    } catch (_) {}
  }

  const { password_hash, ...safeUpdates } = updates;

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_USER',
    entity_type: 'USER',
    entity_id: id,
    old_value: oldValues,
    new_value: safeUpdates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { id, ...oldValues, ...safeUpdates }, 'User updated successfully');
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, is_active } = req.body;

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  const active = is_active !== undefined ? Boolean(is_active) : (status === 'active');
  await User.update(id, { is_active: active });

  if (!active) {
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [id]);
  }

  await AuditLog.create({
    user_id: req.user.id,
    action: active ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
    entity_type: 'USER',
    entity_id: id,
    new_value: { is_active: active },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { id, is_active: active }, `User ${active ? 'activated' : 'deactivated'} successfully`);
});

export const assignUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) throw new ValidationError('role is required');

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  const normalizedRole = normalizeRole(role);
  await User.update(id, { role: normalizedRole });

  try {
    const [roles] = await pool.query('SELECT id FROM roles WHERE code = ?', [normalizedRole]);
    if (roles.length > 0) {
      await pool.query(
        `INSERT INTO user_roles (id, user_id, role_id, assigned_by) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), assigned_by = VALUES(assigned_by)`,
        [crypto.randomUUID(), id, roles[0].id, req.user?.id || 'SYSTEM']
      );
    }
  } catch (_) {}

  await AuditLog.create({
    user_id: req.user.id,
    action: 'ASSIGN_ROLE',
    entity_type: 'USER',
    entity_id: id,
    old_value: { role: user.role },
    new_value: { role: normalizedRole },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { id, role: normalizedRole }, 'Role assigned successfully');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword, requiresPasswordChange } = req.body;

  if (!newPassword || newPassword.length < 8) {
    throw new ValidationError('newPassword must be at least 8 characters long.');
  }

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  await CredentialService.updatePassword(id, newPassword, {
    requiresChange: Boolean(requiresPasswordChange),
    actorId: req.user.id
  });

  return success(res, 200, { userId: id, requiresPasswordChange: Boolean(requiresPasswordChange) }, 'User password reset successfully and active sessions invalidated');
});

export const rotateCredentials = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { temporaryPassword } = req.body;

  const result = await CredentialService.administrativeRotateCredentials({
    targetUserId: id,
    temporaryPassword,
    actorId: req.user.id,
    actorRole: req.user.role
  });

  return success(res, 200, result, 'Credentials rotated successfully with temporary credentials issued');
});

export const restoreUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  await User.restore(id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'RESTORE_USER',
    entity_type: 'USER',
    entity_id: id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { id, is_active: true }, 'User restored successfully');
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isPermanent = req.query.permanent === 'true';

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  if (isPermanent) {
    if (req.user?.role !== 'SUPER_ADMIN') {
      return error(res, 403, 'Permanent account deletion requires Super Admin rank');
    }
    await User.delete(id);
    await AuditLog.create({
      user_id: req.user.id,
      action: 'HARD_DELETE_USER',
      entity_type: 'USER',
      entity_id: id,
      new_value: { user },
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent']
    });
    return success(res, 200, null, 'User permanently purged successfully');
  }

  await User.softDelete(id);
  await pool.query('DELETE FROM sessions WHERE user_id = ?', [id]);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'SOFT_DELETE_USER',
    entity_type: 'USER',
    entity_id: id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'User soft-deleted successfully');
});
