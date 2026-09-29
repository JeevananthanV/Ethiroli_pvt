import express from 'express';
import { listEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/employees', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listEmployees);
router.post('/employees', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createEmployee'), createEmployee);
router.get('/employees/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getEmployee);
router.put('/employees/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateEmployee'), updateEmployee);
router.patch('/employees/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateEmployee'), updateEmployee);
router.delete('/employees/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteEmployee);

export default router;
