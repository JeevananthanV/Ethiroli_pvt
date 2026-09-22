import express from 'express';
import {
  getDashboardSummary,
  getPipelineSummary,
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  listProposals,
  getProposal,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
  listActivities,
  getUpcomingActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  listTargets,
  createOrUpdateTarget,
  deleteTarget,
  listHandovers,
  getHandover,
  createHandover,
  updateHandoverStatus,
  deleteHandover,
  getSalesReports
} from '../controllers/salesController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'));

// 1. Dashboard & Pipeline Overview
router.get('/dashboard/summary', getDashboardSummary);
router.get('/pipeline/summary', getPipelineSummary);

// 2. Deals Management
router.get('/deals', listDeals);
router.post('/deals', createDeal);
router.get('/deals/:id', getDeal);
router.put('/deals/:id', updateDeal);
router.patch('/deals/:id/stage', updateDealStage);
router.delete('/deals/:id', deleteDeal);

// 3. Proposals & Quotations
router.get('/proposals', listProposals);
router.post('/proposals', createProposal);
router.get('/proposals/:id', getProposal);
router.put('/proposals/:id', updateProposal);
router.patch('/proposals/:id/status', updateProposalStatus);
router.delete('/proposals/:id', deleteProposal);

// 4. Activities, Calls, Meetings & Calendar
router.get('/activities', listActivities);
router.get('/activities/upcoming', getUpcomingActivities);
router.post('/activities', createActivity);
router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity);

// 5. Targets & Quotas
router.get('/targets', listTargets);
router.post('/targets', createOrUpdateTarget);
router.delete('/targets/:id', deleteTarget);

// 6. Customer Handovers (Sales -> PM/Ops)
router.get('/handovers', listHandovers);
router.post('/handovers', createHandover);
router.get('/handovers/:id', getHandover);
router.patch('/handovers/:id/status', updateHandoverStatus);
router.delete('/handovers/:id', deleteHandover);

// 7. Analytics & Reports
router.get('/reports', getSalesReports);

export default router;
