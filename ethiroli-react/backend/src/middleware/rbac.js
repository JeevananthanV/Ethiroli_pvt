import { AuthorizationError } from '../utils/errors.js';
import { ROLES, ROLE_PERMISSIONS } from '../config/constants.js';

const ROLE_URL_MAPPING = {
  'super-admin': ROLES.SUPER_ADMIN,
  'admin': ROLES.ADMIN,
  'hr': ROLES.HR,
  'tutor': ROLES.TUTOR,
  'pm': ROLES.PROJECT_MANAGER,
  'finance': ROLES.FINANCE,
  'sales': ROLES.SALES,
  'reception': ROLES.RECEPTION,
  'employee': ROLES.EMPLOYEE,
  'student': ROLES.STUDENT,
  'intern': ROLES.INTERN,
};

const URL_ROLE_PATTERNS = [
  { pattern: /^\/app\/super-admin/, allowedRole: ROLES.SUPER_ADMIN },
  { pattern: /^\/app\/admin/, allowedRole: ROLES.ADMIN },
  { pattern: /^\/app\/hr/, allowedRole: ROLES.HR },
  { pattern: /^\/app\/tutor/, allowedRole: ROLES.TUTOR },
  { pattern: /^\/app\/pm/, allowedRole: ROLES.PROJECT_MANAGER },
  { pattern: /^\/app\/finance/, allowedRole: ROLES.FINANCE },
  { pattern: /^\/app\/sales/, allowedRole: ROLES.SALES },
  { pattern: /^\/app\/reception/, allowedRole: ROLES.RECEPTION },
  { pattern: /^\/app\/employee/, allowedRole: ROLES.EMPLOYEE },
  { pattern: /^\/app\/student/, allowedRole: ROLES.STUDENT },
  { pattern: /^\/app\/intern/, allowedRole: ROLES.INTERN },
];

const getRoleFromPath = (path) => {
  for (const { pattern, allowedRole } of URL_ROLE_PATTERNS) {
    if (pattern.test(path)) {
      return allowedRole;
    }
  }
  return null;
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Forbidden. Role '${req.user.role}' is not authorized.`,
        { allowedRoles, currentRole: req.user.role }
      );
    }

    next();
  };
};

export const requirePortalRole = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const expectedRole = getRoleFromPath(req.path);
  if (!expectedRole) {
    return next();
  }

  if (req.user.role === ROLES.SUPER_ADMIN || req.user.role === ROLES.ADMIN) {
    return next();
  }

  if (req.user.role !== expectedRole) {
    throw new AuthorizationError(
      `Access denied. This resource requires role '${expectedRole}'.`,
      { requiredRole: expectedRole, currentRole: req.user.role, path: req.path }
    );
  }

  next();
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      return next();
    }

    throw new AuthorizationError(
      `Insufficient permissions. '${permission}' is required.`,
      { requiredPermission: permission, currentRole: req.user.role }
    );
  };
};

export const enforceRoleBasedRoutes = (req, res, next) => {
  const expectedRole = getRoleFromPath(req.path);

  if (!expectedRole) {
    return next();
  }

  if (!req.user) {
    return next();
  }

  if (req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }

  const isAdmin = req.user.role === ROLES.ADMIN;

  if (isAdmin) {
    const adminAllowed = [
      ROLES.ADMIN,
      ROLES.HR,
      ROLES.TUTOR,
      ROLES.FINANCE,
      ROLES.SALES,
      ROLES.RECEPTION,
      ROLES.EMPLOYEE,
      ROLES.STUDENT,
      ROLES.INTERN,
    ];
    if (adminAllowed.includes(expectedRole)) {
      return next();
    }
  }

  if (req.user.role !== expectedRole) {
    throw new AuthorizationError(
      `Access denied. Your role does not match the requested resource.`,
      { requiredRole: expectedRole, currentRole: req.user.role }
    );
  }

  next();
};

export const roleRouteGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Forbidden: Your role (${req.user.role}) is not authorized for this action.`,
        { allowedRoles, currentRole: req.user.role }
      );
    }

    next();
  };
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Access denied. Only ${roles.join(', ')} roles are allowed.`,
        { allowedRoles: roles, currentRole: req.user.role }
      );
    }

    next();
  };
};

export const requireLeadOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required.');
  }

  const allowedRoles = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
  if (allowedRoles.includes(req.user.role)) {
    return next();
  }

  throw new AuthorizationError(
    'Forbidden. You must be an ADMIN or the lead owner to perform this action.',
    { requiredRoles: allowedRoles }
  );
};

export {
  getRoleFromPath,
  ROLE_URL_MAPPING,
  URL_ROLE_PATTERNS,
  ROLES,
};
