import { AuthorizationError } from '../utils/errors.js';
import { ROLES } from '../config/constants.js';

const rolePathMap = {
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

export const extractRoleFromPath = (path) => {
  const segments = path.split('/').filter(Boolean);
  const roleSegment = segments[0] || segments[1] || '';
  return rolePathMap[roleSegment] || null;
};

export const validateRolePath = (req, res, next) => {
  const pathRole = extractRoleFromPath(req.originalUrl);
  if (!pathRole) return next();

  if (!req.user) {
    return next(new AuthorizationError('Authentication required.'));
  }

  const userRole = req.user.role;

  if (userRole === ROLES.SUPER_ADMIN) {
    return next();
  }

  if (userRole === ROLES.ADMIN && pathRole !== ROLES.SUPER_ADMIN) {
    return next();
  }

  if (userRole !== pathRole) {
    return next(new AuthorizationError(
      `Access denied. Your role (${userRole}) cannot access ${pathRole} resources.`,
      { requiredRole: pathRole, currentRole: userRole }
    ));
  }

  next();
};

export const allowSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AuthorizationError('Authentication required.'));
  }
  if (req.user.role !== ROLES.SUPER_ADMIN) {
    return next(new AuthorizationError('Only Super Admin can perform this action.'));
  }
  next();
};

export const allowAdminOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AuthorizationError('Authentication required.'));
  }
  if (req.user.role !== ROLES.SUPER_ADMIN && req.user.role !== ROLES.ADMIN) {
    return next(new AuthorizationError('Only Admin or Super Admin can perform this action.'));
  }
  next();
};

export const allowAdminSuperAdminHr = (req, res, next) => {
  if (!req.user) {
    return next(new AuthorizationError('Authentication required.'));
  }
  const allowed = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR];
  if (!allowed.includes(req.user.role)) {
    return next(new AuthorizationError('Access denied. Admin, Super Admin, or HR role required.'));
  }
  next();
};

export const allowManagerOrAbove = (req, res, next) => {
  if (!req.user) {
    return next(new AuthorizationError('Authentication required.'));
  }
  const allowed = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR, ROLES.PROJECT_MANAGER];
  if (!allowed.includes(req.user.role)) {
    return next(new AuthorizationError('Access denied. Manager or higher role required.'));
  }
  next();
};

export default {
  validateRolePath,
  allowSuperAdmin,
  allowAdminOrSuperAdmin,
  allowAdminSuperAdminHr,
  allowManagerOrAbove,
  extractRoleFromPath,
};