import express from 'express';
import {
  listVisitors,
  createVisitor,
  checkoutVisitor,
  deleteVisitor,
  listTimesheets,
  createTimesheet,
  approveTimesheet,
  rejectTimesheet,
  getSalesOverview,
  getFinanceOverview,
  getReceptionOverview
} from '../controllers/operationsController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

// Visitor Management
router.get(
  '/visitors',
  requireRole('RECEPTION', 'ADMIN', 'SUPER_ADMIN', 'HR'),
  listVisitors
);
router.post(
  '/visitors',
  requireRole('RECEPTION', 'ADMIN', 'SUPER_ADMIN', 'HR'),
  createVisitor
);
router.put(
  '/visitors/:id/checkout',
  requireRole('RECEPTION', 'ADMIN', 'SUPER_ADMIN', 'HR'),
  checkoutVisitor
);
router.delete(
  '/visitors/:id',
  requireRole('RECEPTION', 'ADMIN', 'SUPER_ADMIN'),
  deleteVisitor
);

// Timesheets
router.get(
  '/timesheets',
  requireRole('PROJECT_MANAGER', 'EMPLOYEE', 'INTERN', 'ADMIN', 'SUPER_ADMIN'),
  listTimesheets
);
router.post(
  '/timesheets',
  requireRole('PROJECT_MANAGER', 'EMPLOYEE', 'INTERN', 'ADMIN', 'SUPER_ADMIN'),
  createTimesheet
);
router.put(
  '/timesheets/:id/approve',
  requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'),
  approveTimesheet
);
router.put(
  '/timesheets/:id/reject',
  requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'),
  rejectTimesheet
);

// High-level operational summaries for role dashboards
router.get(
  '/sales/overview',
  requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'),
  getSalesOverview
);

router.get(
  '/finance/overview',
  requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN'),
  getFinanceOverview
);

router.get(
  '/reception/overview',
  requireRole('RECEPTION', 'ADMIN', 'SUPER_ADMIN'),
  getReceptionOverview
);

export default router;
