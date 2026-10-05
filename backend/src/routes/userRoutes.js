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
import {
  listPasswordChangeRequests,
  approvePasswordChangeRequest,
  rejectPasswordChangeRequest
} from '../controllers/passwordChangeController.js';
import PasswordRecoveryRequest from '../models/PasswordRecoveryRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

/**
 * GET /v1/users/password-recovery-requests
 *
 * The public recovery attempts (raised from the sign-in screen) that still need
 * a decision. Separate from /password-change-requests, which lists the approval
 * grants themselves: this one shows what came in from outside a session.
 */
const listPasswordRecoveryRequests = asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'PENDING').toUpperCase();
  const rows = await PasswordRecoveryRequest.listForReview({
    status,
    limit: req.query.limit
  });
  return success(res, 200, rows, 'Password recovery requests retrieved');
});

const router = express.Router();

router.use(authenticate);

// Specific routes before parameterized /:id
router.get('/filters', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), getUserFilters);

// Password-change review queue. Same reviewer roles as /:id/reset-password, so
// this adds no new privileged role; the four-eyes check lives in the controller.
router.get('/password-change-requests', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), listPasswordChangeRequests);
// Attempts raised from the public sign-in screen. Approving one is done through
// /password-change-requests/:id/approve, because that is what actually creates
// the grant; this route only surfaces what is waiting.
router.get('/password-recovery-requests', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), listPasswordRecoveryRequests);
router.post('/password-change-requests/:id/approve', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), approvePasswordChangeRequest);
router.post('/password-change-requests/:id/reject', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'), rejectPasswordChangeRequest);

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
