import express from 'express';
import { listTransactions, logIncome, logExpense, getTransaction } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/transactions', requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN'), listTransactions);
router.post('/transactions/income', requireRole('FINANCE'), validateBody('createTransaction'), logIncome);
router.post('/transactions/expense', requireRole('FINANCE'), validateBody('createTransaction'), logExpense);
router.get('/transactions/:id', requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN'), getTransaction);

export default router;
