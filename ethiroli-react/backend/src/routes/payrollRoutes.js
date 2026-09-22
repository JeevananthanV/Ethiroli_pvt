import express from 'express';
import { listSalaryStructures, createSalaryStructure, processPayroll, runPayrollForAll, listPayrollHistory, generatePayslip } from '../controllers/payrollController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/payroll/salary-structures', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'FINANCE'), listSalaryStructures);
router.post('/payroll/salary-structures', requireRole('HR', 'ADMIN', 'FINANCE'), validateBody('createSalaryStructure'), createSalaryStructure);
router.post('/payroll/process', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'FINANCE'), validateBody('processPayroll'), processPayroll);
router.post('/payroll/run-all', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'FINANCE'), validateBody('runPayrollForAll'), runPayrollForAll);
router.get('/payroll/history', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'FINANCE'), listPayrollHistory);
router.get('/payroll/:id/payslip', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'FINANCE'), generatePayslip);

export default router;
