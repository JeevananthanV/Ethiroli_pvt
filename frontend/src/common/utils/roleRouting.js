/**
 * Ethiroli SaaS Platform — Role Routing Architecture
 * Defines canonical role enums, default home paths, and role resolution utilities.
 */

export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HR: 'HR',
  TUTOR: 'TUTOR',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  FINANCE: 'FINANCE',
  SALES: 'SALES',
  RECEPTION: 'RECEPTION',
  EMPLOYEE: 'EMPLOYEE',
  STUDENT: 'STUDENT',
  INTERN: 'INTERN',
  CLIENT: 'CLIENT',
  VENDOR: 'VENDOR',
});

/**
 * Canonical landing dashboard for each system role
 */
export const ROLE_DEFAULT_ROUTES = Object.freeze({
  [ROLES.SUPER_ADMIN]: '/app/super-admin/dashboard',
  [ROLES.ADMIN]: '/app/admin/dashboard',
  [ROLES.HR]: '/app/hr/dashboard',
  [ROLES.TUTOR]: '/app/tutor/dashboard',
  [ROLES.PROJECT_MANAGER]: '/app/pm/dashboard',
  [ROLES.FINANCE]: '/app/finance/dashboard',
  [ROLES.SALES]: '/app/sales/dashboard',
  [ROLES.RECEPTION]: '/app/reception/dashboard',
  [ROLES.EMPLOYEE]: '/app/employee/dashboard',
  [ROLES.STUDENT]: '/app/student/dashboard',
  [ROLES.INTERN]: '/app/intern/dashboard',
  [ROLES.CLIENT]: '/app/client/dashboard',
  [ROLES.VENDOR]: '/app/vendor/dashboard',
});

/**
 * Returns the default dashboard path for a given role, or fallback to login
 * @param {string} role - The user's assigned role enum
 * @returns {string} The canonical route path
 */
export const getRoleDefaultPath = (role) => {
  if (!role) return '/app/login';
  const normalized = String(role).trim().toUpperCase();
  return ROLE_DEFAULT_ROUTES[normalized] || '/app/login';
};

/**
 * Checks whether a user's role satisfies the allowed roles list
 * @param {string} userRole - The user's role
 * @param {string[]} allowedRoles - List of authorized role enums
 * @returns {boolean}
 */
export const isRoleAuthorized = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole) return false;
  const normalized = String(userRole).trim().toUpperCase();
  // Super Admin has universal platform scope to preview/manage all role portals
  if (normalized === ROLES.SUPER_ADMIN) return true;
  return allowedRoles.includes(normalized);
};
