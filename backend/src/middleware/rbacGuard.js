import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import { error } from '../utils/response.js';
import { logger } from '../config/logger.js';

export const ROLE_RANKS = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  FINANCE: 60,
  HR: 60,
  TUTOR: 40,
  PM: 40,
  EMPLOYEE: 20,
  INTERN: 20,
  STUDENT: 10
};

// In-memory cache for role permissions to achieve <1ms lookup
let permissionsCache = null;
let lastCacheUpdate = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const getRolePermissions = async (roleCode) => {
  const now = Date.now();
  if (!permissionsCache || (now - lastCacheUpdate) > CACHE_TTL_MS) {
    const [rows] = await pool.query(`
      SELECT r.code as role_code, p.code as permission_code
      FROM roles r
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
    `);

    const newCache = {};
    for (const row of rows) {
      if (!newCache[row.role_code]) {
        newCache[row.role_code] = new Set();
      }
      newCache[row.role_code].add(row.permission_code);
    }
    permissionsCache = newCache;
    lastCacheUpdate = now;
  }

  return permissionsCache[roleCode] || new Set();
};

export const invalidatePermissionsCache = () => {
  permissionsCache = null;
  lastCacheUpdate = 0;
};

/**
 * Enterprise Authorization Middleware
 * Enforces coarse-grained RBAC permission check with optional runtime ABAC predicate validation
 *
 * @param {string} permissionCode - Granular permission required (e.g. 'payroll:dispute_resolve')
 * @param {Function} [abacPredicate] - Optional runtime contextual predicate (req, user, callerRank) => boolean | Promise<boolean>
 */
export const authorize = (permissionCode, abacPredicate = null) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !user.role) {
        return error(res, 401, 'Unauthenticated user context');
      }

      const callerRank = ROLE_RANKS[user.role] || 0;

      // 1. Super Admin has universal functional access unless a strict ABAC dual-control/predicate is explicitly required
      if (user.role === 'SUPER_ADMIN' && !abacPredicate) {
        return next();
      }

      // 2. Fetch Granular Permissions for Caller Role
      const rolePerms = await getRolePermissions(user.role);
      const hasPermission = user.role === 'SUPER_ADMIN' || rolePerms.has(permissionCode);

      if (!hasPermission) {
        logger.warn('RBAC Access Denied: Missing Permission', {
          userId: user.id,
          role: user.role,
          requiredPermission: permissionCode,
          route: req.originalUrl
        });

        await AuditLog.create({
          user_id: user.id,
          action: 'SECURITY_ACCESS_DENIED_MISSING_PERMISSION',
          entity_type: 'SYSTEM',
          entity_id: permissionCode,
          new_value: { role: user.role, route: req.originalUrl },
          ip_address: req.ip || '127.0.0.1'
        });

        return error(res, 403, `Forbidden: Missing required permission '${permissionCode}'`);
      }

      // 3. ABAC Contextual Predicate Evaluation
      if (abacPredicate && typeof abacPredicate === 'function') {
        const isAllowed = await abacPredicate(req, user, callerRank);
        if (!isAllowed) {
          logger.warn('ABAC Policy Denial: Context Predicate Failed', {
            userId: user.id,
            role: user.role,
            permission: permissionCode
          });

          return error(res, 403, 'Forbidden: Operation rejected by contextual policy guard');
        }
      }

      next();
    } catch (err) {
      logger.error('RBAC Authorization Error', { error: err.message });
      next(err);
    }
  };
};

/**
 * Anti-Privilege Escalation Guard
 * Programmatically enforces the Hierarchical Authority Boundary:
 * 1. Caller cannot assign a role with rank >= caller rank.
 * 2. Caller cannot modify, lock, or deprovision an account with rank >= caller rank.
 * 3. Caller cannot modify their own security attributes (self-privilege escalation).
 */
export const enforcePrivilegeHierarchy = async (req, res, next) => {
  try {
    const caller = req.user;
    if (!caller || !caller.role) {
      return error(res, 401, 'Unauthenticated user context');
    }

    const callerRank = ROLE_RANKS[caller.role] || 0;

    // Super Admin has root rank (100) and can manage all tiers
    if (caller.role === 'SUPER_ADMIN') {
      return next();
    }

    const targetUserId = req.params.id || req.body.userId;
    const targetRoleCode = req.body.role;

    // 1. Prevent Self-Privilege Escalation
    if (targetUserId && targetUserId === caller.id && targetRoleCode && targetRoleCode !== caller.role) {
      await AuditLog.create({
        user_id: caller.id,
        action: 'SECURITY_VIOLATION_SELF_PRIVILEGE_ESCALATION',
        entity_type: 'USER',
        entity_id: caller.id,
        new_value: { attemptedRole: targetRoleCode },
        ip_address: req.ip || '127.0.0.1'
      });

      return error(res, 403, 'Security Policy Violation: You cannot alter your own assigned role or administrative permissions');
    }

    // 2. Validate Role Assignment Rank Ceiling
    if (targetRoleCode) {
      const assignedRank = ROLE_RANKS[targetRoleCode] || 0;
      if (assignedRank >= callerRank) {
        await AuditLog.create({
          user_id: caller.id,
          action: 'SECURITY_VIOLATION_ATTEMPTED_ROLE_ESCALATION',
          entity_type: 'USER',
          entity_id: targetUserId || 'NEW_USER',
          new_value: {
            callerRole: caller.role,
            callerRank,
            attemptedRole: targetRoleCode,
            assignedRank
          },
          ip_address: req.ip || '127.0.0.1'
        });

        return error(
          res,
          403,
          `Privilege Escalation Blocked: Role '${caller.role}' cannot assign role '${targetRoleCode}' (Target rank ${assignedRank} >= Caller rank ${callerRank})`
        );
      }
    }

    // 3. Validate Target User Modification Boundary
    if (targetUserId && targetUserId !== caller.id) {
      const [targetRows] = await pool.query(
        `SELECT id, role, full_name FROM users WHERE id = ?`,
        [targetUserId]
      );

      if (targetRows.length > 0) {
        const targetUser = targetRows[0];
        const targetRank = ROLE_RANKS[targetUser.role] || 0;

        if (targetRank >= callerRank) {
          await AuditLog.create({
            user_id: caller.id,
            action: 'SECURITY_VIOLATION_VERTICAL_MODIFICATION_BLOCKED',
            entity_type: 'USER',
            entity_id: targetUserId,
            new_value: {
              callerRole: caller.role,
              callerRank,
              targetRole: targetUser.role,
              targetRank
            },
            ip_address: req.ip || '127.0.0.1'
          });

          return error(
            res,
            403,
            `Access Denied: You cannot modify or manage account '${targetUser.full_name || targetUser.id}' with role '${targetUser.role}' (Target rank ${targetRank} >= Caller rank ${callerRank})`
          );
        }
      }
    }

    next();
  } catch (err) {
    logger.error('Privilege Hierarchy Guard Failed', { error: err.message });
    next(err);
  }
};
