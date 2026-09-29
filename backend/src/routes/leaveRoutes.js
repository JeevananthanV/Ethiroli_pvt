import express from 'express';
import { listLeaves, applyLeave, getLeave, updateLeave, updateLeaveStatus, cancelLeave, deleteLeave } from '../controllers/leaveController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/leaves', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listLeaves);
router.post('/leaves', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN'), validateBody('createLeave'), applyLeave);
router.get('/leaves/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), getLeave);
router.put('/leaves/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), validateBody('updateLeave'), updateLeave);
router.patch('/leaves/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), validateBody('updateLeave'), updateLeave);
router.patch('/leaves/:id/status', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateLeaveStatus'), updateLeaveStatus);
router.patch('/leaves/:id/cancel', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), validateBody('cancelLeave'), cancelLeave);
router.delete('/leaves/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), deleteLeave);

export default router;

