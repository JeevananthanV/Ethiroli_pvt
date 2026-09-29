import express from 'express';
import { 
  listUsers, 
  createUser, 
  getUser, 
  updateMyProfile,
  updateUser, 
  deleteUser, 
  resetPassword,
  rotateCredentials,
  getUserFilters,
  updateUserStatus,
  assignUserRole,
  restoreUser
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { enforcePrivilegeHierarchy } from '../middleware/rbacGuard.js';

const router = express.Router();

router.use(authenticate);

// Specific routes before parameterized /:id
router.get('/filters', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), getUserFilters);

// Self-service (any authenticated role) - must precede /:id
router.patch('/me', updateMyProfile);

// User collection routes - HR and Admins can manage within clearance; Tutors can enumerate students
router.get('/', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN', 'TUTOR'), listUsers);
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), validateBody('createUser'), enforcePrivilegeHierarchy, createUser);

// User individual resource routes
router.get('/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), getUser);
router.put('/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), validateBody('updateUser'), enforcePrivilegeHierarchy, updateUser);
router.patch('/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), validateBody('updateUser'), enforcePrivilegeHierarchy, updateUser);
router.patch('/:id/status', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), enforcePrivilegeHierarchy, updateUserStatus);
router.patch('/:id/role', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), enforcePrivilegeHierarchy, assignUserRole);
router.post('/:id/reset-password', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), enforcePrivilegeHierarchy, resetPassword);
router.post('/:id/rotate-credentials', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), enforcePrivilegeHierarchy, rotateCredentials);
router.post('/:id/restore', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), enforcePrivilegeHierarchy, restoreUser);
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), enforcePrivilegeHierarchy, deleteUser);

export default router;
