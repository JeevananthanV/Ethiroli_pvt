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

import pool from '../config/database.js';

const safeCount = async (sql, params = []) => {
  try {
    const [rows] = await pool.query(sql, params);
    return rows[0]?.count ?? rows[0]?.c ?? rows[0]?.total ?? rows[0]?.sum ?? 0;
  } catch {
    return 0;
  }
};

router.get('/dashboard', asyncHandler(async (req, res) => {
  const role = req.user.role;

  // Real-time live counts queried directly from MySQL
  const [
    usersCount,
    tenantsCount,
    activeTenantsCount,
    alertsCount,
    coursesCount,
    jobsCount,
    candidatesCount,
    workflowsCount,
    invoicesCount,
    transactionsCount,
    attendanceCount,
    studentProjectsCount,
    contactMessagesCount
  ] = await Promise.all([
    safeCount('SELECT COUNT(*) as c FROM users'),
    safeCount('SELECT COUNT(*) as c FROM tenants'),
    safeCount('SELECT COUNT(*) as c FROM tenants WHERE is_active = 1'),
    safeCount('SELECT COUNT(*) as c FROM system_error_logs'),
    safeCount('SELECT COUNT(*) as c FROM courses'),
    safeCount('SELECT COUNT(*) as c FROM jobs'),
    safeCount('SELECT COUNT(*) as c FROM candidates'),
    safeCount('SELECT COUNT(*) as c FROM automation_workflows'),
    safeCount('SELECT COUNT(*) as c FROM invoices'),
    safeCount('SELECT COUNT(*) as c FROM transactions'),
    safeCount('SELECT COUNT(*) as c FROM attendance'),
    safeCount('SELECT COUNT(*) as c FROM student_projects'),
    safeCount('SELECT COUNT(*) as c FROM contact_messages')
  ]);

  const roleConfig = {
    [ROLES.SUPER_ADMIN]: { 
      title: 'Super Admin Dashboard', 
      stats: { 
        users: Number(usersCount), 
        tenants: Number(tenantsCount), 
        activeTenants: Number(activeTenantsCount),
        alerts: Number(alertsCount),
        workflows: Number(workflowsCount),
        invoices: Number(invoicesCount)
      } 
    },
    [ROLES.ADMIN]: { 
      title: 'Admin Dashboard', 
      stats: { 
        team: Number(usersCount), 
        courses: Number(coursesCount), 
        jobs: Number(jobsCount),
        candidates: Number(candidatesCount),
        projects: Number(studentProjectsCount)
      } 
    },
    [ROLES.HR]: { 
      title: 'HR Dashboard', 
      stats: { 
        employees: Number(usersCount), 
        candidates: Number(candidatesCount), 
        jobs: Number(jobsCount),
        attendance: Number(attendanceCount)
      } 
    },
    [ROLES.TUTOR]: { 
      title: 'Tutor Dashboard', 
      stats: { 
        courses: Number(coursesCount), 
        projects: Number(studentProjectsCount), 
        students: Number(usersCount) 
      } 
    },
    [ROLES.PROJECT_MANAGER]: { 
      title: 'PM Dashboard', 
      stats: { 
        projects: Number(studentProjectsCount), 
        workflows: Number(workflowsCount), 
        team: Number(usersCount) 
      } 
    },
    [ROLES.FINANCE]: { 
      title: 'Finance Dashboard', 
      stats: { 
        invoices: Number(invoicesCount), 
        transactions: Number(transactionsCount), 
        revenue: '₹' + (invoicesCount * 1250).toLocaleString() 
      } 
    },
    [ROLES.SALES]: { 
      title: 'Sales Dashboard', 
      stats: { 
        leads: Number(candidatesCount), 
        transactions: Number(transactionsCount), 
        tenants: Number(tenantsCount) 
      } 
    },
    [ROLES.RECEPTION]: { 
      title: 'Reception Dashboard', 
      stats: { 
        visitors: Number(contactMessagesCount), 
        candidates: Number(candidatesCount), 
        inquiries: Number(contactMessagesCount + candidatesCount) 
      } 
    },
    [ROLES.EMPLOYEE]: { 
      title: 'Employee Dashboard', 
      stats: { 
        attendance: Number(attendanceCount), 
        projects: Number(studentProjectsCount) 
      } 
    },
    [ROLES.STUDENT]: { 
      title: 'Student Dashboard', 
      stats: { 
        courses: Number(coursesCount), 
        projects: Number(studentProjectsCount) 
      } 
    },
    [ROLES.INTERN]: { 
      title: 'Intern Dashboard', 
      stats: { 
        attendance: Number(attendanceCount), 
        projects: Number(studentProjectsCount) 
      } 
    },
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
