import express from 'express';
import { listEmployees, createEmployee, getEmployee, updateEmployee } from '../controllers/employeeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/employees', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listEmployees);
router.post('/employees', requireRole('HR', 'ADMIN'), createEmployee);
router.get('/employees/:id', getEmployee);
router.patch('/employees/:id', requireRole('HR', 'ADMIN'), updateEmployee);

export default router;
