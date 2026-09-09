import express from 'express';
import { listSalaryStructures, createSalaryStructure, processPayroll, runPayrollForAll, listPayrollHistory, generatePayslip } from '../controllers/payrollController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/payroll/salary-structures', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listSalaryStructures);
router.post('/payroll/salary-structures', requireRole('HR', 'ADMIN'), validateBody('createSalaryStructure'), createSalaryStructure);
router.post('/payroll/process', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('processPayroll'), processPayroll);
router.post('/payroll/run-all', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('runPayrollForAll'), runPayrollForAll);
router.get('/payroll/history', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), listPayrollHistory);
router.get('/payroll/:id/payslip', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), generatePayslip);

export default router;
