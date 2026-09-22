import express from 'express';
import {
  getDashboardSummary,
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  listReceipts,
  getReceipt,
  createReceipt,
  getReceiptStats,
  searchDirectory,
  getReceptionAnalytics
} from '../controllers/receptionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('RECEPTION', 'ADMIN', 'SUPER_ADMIN'));

// 1. Dashboard Overview
router.get('/dashboard/summary', getDashboardSummary);
router.get('/analytics', getReceptionAnalytics);

// 2. Appointments & Scheduled Visits
router.get('/appointments', listAppointments);
router.post('/appointments', createAppointment);
router.get('/appointments/:id', getAppointment);
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.delete('/appointments/:id', deleteAppointment);

// 3. Receipts & Fee Counter
router.get('/receipts', listReceipts);
router.post('/receipts', createReceipt);
router.get('/receipts/stats', getReceiptStats);
router.get('/receipts/:id', getReceipt);

// 4. Fast Directory Search
router.get('/directory/search', searchDirectory);

export default router;
