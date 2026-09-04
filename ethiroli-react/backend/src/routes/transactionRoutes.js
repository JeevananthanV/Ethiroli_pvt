import express from 'express';
import { listTransactions, logIncome, logExpense } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/transactions', requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN'), listTransactions);
router.post('/transactions/income', requireRole('FINANCE'), logIncome);
router.post('/transactions/expense', requireRole('FINANCE'), logExpense);

export default router;
