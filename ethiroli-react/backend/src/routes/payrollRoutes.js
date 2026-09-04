import express from 'express';
import { listSalaryStructures, createSalaryStructure, processPayroll, listPayrollHistory } from '../controllers/payrollController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/payroll/salary-structures', listSalaryStructures);
router.post('/payroll/salary-structures', createSalaryStructure);
router.post('/payroll/process', processPayroll);
router.get('/payroll/history', listPayrollHistory);

export default router;
