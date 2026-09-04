import express from 'express';
import { listInvoices, generateInvoice, batchGenerateInvoices, updateInvoiceStatus } from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/invoices', listInvoices);
router.post('/invoices', generateInvoice);
router.post('/invoices/batch', batchGenerateInvoices);
router.patch('/invoices/:id/status', updateInvoiceStatus);

export default router;
