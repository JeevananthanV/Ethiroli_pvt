import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePortalRole, checkPermission, restrictTo } from '../middleware/rbac.js';
import { validateRolePath, allowSuperAdmin, allowAdminOrSuperAdmin, allowAdminSuperAdminHr, allowManagerOrAbove } from '../middleware/rolePathGuard.js';
import { ROLES } from '../config/constants.js';
import { getNavigationForRole } from '../config/navigationConfig.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { notFound } from '../utils/errors.js';

const router = express.Router();

const ROLE_MAPPING = {
  SUPER_ADMIN: '/app/super-admin',
  ADMIN: '/app/admin',
  HR: '/app/hr',
  TUTOR: '/app/tutor',
  PROJECT_MANAGER: '/app/pm',
  FINANCE: '/app/finance',
  SALES: '/app/sales',
  RECEPTION: '/app/reception',
  EMPLOYEE: '/app/employee',
  STUDENT: '/app/student',
  INTERN: '/app/intern',
};

router.use(authenticate);
router.use(validateRolePath);

router.get('/dashboard', asyncHandler(async (req, res) => {
  const role = req.user.role;
  const roleConfig = {
    [ROLES.SUPER_ADMIN]: { title: 'Super Admin Dashboard', stats: { users: 1234, tenants: 45, approvals: 12, alerts: 3 } },
    [ROLES.ADMIN]: { title: 'Admin Dashboard', stats: { team: 87, projects: 24, tickets: 8 } },
    [ROLES.HR]: { title: 'HR Dashboard', stats: { employees: 312, interns: 42, onLeave: 18 } },
    [ROLES.TUTOR]: { title: 'Tutor Dashboard', stats: { courses: 8, students: 156, reviews: 23 } },
    [ROLES.PROJECT_MANAGER]: { title: 'PM Dashboard', stats: { projects: 12, onTime: '68%', meetings: 4 } },
    [ROLES.FINANCE]: { title: 'Finance Dashboard', stats: { revenue: '$45,678', invoices: 23, ratio: '34%', payroll: '$12,345' } },
    [ROLES.SALES]: { title: 'Sales Dashboard', stats: { leads: 56, conversion: '18%', revenue: '$23,456' } },
    [ROLES.RECEPTION]: { title: 'Reception Dashboard', stats: { visitors: 32, checkins: 148, calls: 7 } },
    [ROLES.EMPLOYEE]: { title: 'Employee Dashboard', stats: { tasks: 9, leaveBalance: '14 days' } },
    [ROLES.STUDENT]: { title: 'Student Dashboard', stats: { courses: 5, progress: '68%', certificates: 3 } },
    [ROLES.INTERN]: { title: 'Intern Dashboard', stats: { tasks: 12, projects: 3, meetings: 2 } },
  };

  const config = roleConfig[role] || roleConfig[ROLES.ADMIN];
  return success(res, 200, { role, dashboard: config }, 'Dashboard retrieved successfully');
}));

router.get('/profile', asyncHandler(async (req, res) => {
  const profile = {
    id: req.user.id,
    email: req.user.email,
    full_name: req.user.full_name,
    role: req.user.role,
    is_active: req.user.is_active,
    tenant_id: req.user.tenant_id,
  };
  return success(res, 200, { profile }, 'Profile retrieved successfully');
}));

router.get('/permissions', asyncHandler(async (req, res) => {
  const { ROLE_PERMISSIONS } = await import('../config/constants.js');
  const permissions = ROLE_PERMISSIONS[req.user.role] || [];
  return success(res, 200, { role: req.user.role, permissions }, 'Permissions retrieved successfully');
}));

router.get('/navigation', asyncHandler(async (req, res) => {
  const navItems = getNavigationForRole(req.user.role);
  return success(res, 200, { role: req.user.role, navigation: navItems }, 'Navigation retrieved successfully');
}));

router.get('/me', asyncHandler(async (req, res) => {
  return success(res, 200, { user: req.user }, 'User data retrieved successfully');
}));

export default router;
