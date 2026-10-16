import pool from '../config/database.js';
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
import { asyncHandler } from '../middleware/errorHandler.js';

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

// 9. BDA Commission Management
router.post(
  '/commissions/calculate',
  authenticate,
  requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const { dealId, bdaId } = req.body;
    const result = await SalesCommission.calculateCommission(dealId, bdaId);
    return success(res, 200, result, 'Commission calculated');
  })
);

router.get(
  '/commissions',
  authenticate,
  requireRole('SALES', 'MANAGER', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    let bda_id = req.query.bda_id;
    const isManagement = ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(req.user?.role);
    if (!isManagement) {
      bda_id = req.user?.id;
    } else if (bda_id === 'me') {
      bda_id = req.user?.id;
    }

    const filters = {
      bda_id,
      status: req.query.status,
      category: req.query.category,
      page: req.query.page || 1,
      limit: req.query.limit || 50,
    };
    const result = await SalesCommission.getCommissions(filters);
    return success(res, 200, result, 'Commissions retrieved');
  })
);

router.get(
  '/commissions/:id',
  authenticate,
  requireRole('SALES', 'MANAGER', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const commission = await SalesCommission.getCommissionById(req.params.id);
    if (!commission) throw new NotFoundError('Commission not found');
    return success(res, 200, commission, 'Commission retrieved');
  })
);

router.patch(
  '/commissions/:id/approve',
  authenticate,
  requireRole('MANAGER', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const approved = await SalesCommission.approveCommission(
      req.params.id,
      req.user?.id,
      req.body?.notes
    );
    if (!approved) throw new ValidationError('Commission not found or cannot be approved');
    return success(res, 200, { approved }, 'Commission approved');
  })
);

router.patch(
  '/commissions/:id/pay',
  authenticate,
  requireRole('FINANCE', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const paid = await SalesCommission.payCommission(
      req.params.id,
      req.user?.id,
      req.body?.paymentReference
    );
    if (!paid) throw new ValidationError('Commission not found or cannot be paid');
    return success(res, 200, { paid }, 'Commission paid');
  })
);

router.patch(
  '/commissions/:id/reject',
  authenticate,
  requireRole('MANAGER', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const rejected = await SalesCommission.rejectCommission(
      req.params.id,
      req.user?.id,
      req.body?.reason
    );
    if (!rejected) throw new ValidationError('Commission not found or cannot be rejected');
    return success(res, 200, { rejected }, 'Commission rejected');
  })
);

// 8. Lead-to-Deal Conversion (atomic transaction with real lead context)
router.post(
  '/leads/:id/convert',
  authenticate,
  requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const { dealValue, stage, title, contact_name, notes, expectedCloseDate } = req.body;
    const leadId = req.params.id;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Retrieve the existing lead
      const [leads] = await connection.execute(
        `SELECT * FROM leads WHERE id = ?`,
        [leadId]
      );
      if (!leads.length) {
        await connection.rollback();
        return res.status(404).json({ message: 'Lead not found' });
      }
      const lead = leads[0];

      const dealTitle = title || `${lead.company_name || 'Clinic'} - Contract Closure`;
      const contactPerson = contact_name || lead.first_name || lead.name || 'Decision Maker';
      const contactPhone = lead.phone || '';
      const contactEmail = lead.email || '';
      const dealStage = stage || 'QUALIFICATION';
      const ownerId = lead.assigned_to || req.user?.id;
      const val = parseFloat(dealValue) || parseFloat(lead.quoted_amount) || 55000;
      const closeDate = expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      // 2. Create the linked deal
      const [dealResult] = await connection.execute(
        `INSERT INTO sales_deals 
          (title, client_id, lead_id, contact_name, contact_email, contact_phone, 
           deal_value, currency, stage, probability, expected_close_date, owner_id, notes)
         VALUES (?, NULL, ?, ?, ?, ?, ?, 'INR', 20, ?, ?, ?)`,
        [
          dealTitle,
          leadId,
          contactPerson,
          contactEmail,
          contactPhone,
          val,
          closeDate,
          ownerId,
          notes || lead.notes || ''
        ]
      );

      const newDealId = dealResult.insertId;

      // 3. Update the lead status to CONVERTED and link the deal
      await connection.execute(
        `UPDATE leads
         SET status = 'CONVERTED',
             pipeline_stage = 'Closed-Won (Onboarding Realization)',
             linked_deal_id = ?,
             converted_at = NOW(),
             updated_at = NOW()
         WHERE id = ?`,
        [newDealId, leadId]
      );

      // 4. Log the activity with correct column names (activity_type, description)
      await connection.execute(
        `INSERT INTO sales_activities
          (activity_type, title, lead_id, deal_id, performed_by, description, created_at)
         VALUES ('NOTE', ?, ?, ?, ?, ?, NOW())`,
        [
          `Lead converted to deal: ${dealTitle}`,
          leadId,
          newDealId,
          req.user?.id,
          `Converted lead to active deal with value ₹${val.toLocaleString()}`
        ]
      );

      await connection.commit();

      // Fetch the created deal with owner info
      const [deal] = await connection.execute(
        `SELECT d.*, u.full_name as owner_name, u.email as owner_email,
                c.company_name as client_name,
                l.company_name as lead_company
         FROM sales_deals d
         LEFT JOIN users u ON d.owner_id = u.id
         LEFT JOIN clients c ON d.client_id = c.id
         LEFT JOIN leads l ON d.lead_id = l.id
         WHERE d.id = ?`,
        [newDealId]
      );

      return res.status(200).json({
        success: true,
        message: 'Lead converted successfully',
        deal: deal[0],
        leadId,
      });
    } catch (error) {
      await connection.rollback();
      console.error('Lead conversion error:', error);
      return res.status(500).json({
        message: 'Failed to convert lead: ' + error.message,
      });
    } finally {
      connection.release();
    }
  })
);

export default router;