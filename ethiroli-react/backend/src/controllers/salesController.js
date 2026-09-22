import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import SalesDeal from '../models/SalesDeal.js';
import SalesProposal from '../models/SalesProposal.js';
import SalesActivity from '../models/SalesActivity.js';
import SalesTarget from '../models/SalesTarget.js';
import CustomerHandover from '../models/CustomerHandover.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { decrypt } from '../config/encryption.js';

// ==========================================
// 1. CORE DASHBOARD & VISUALIZATION
// ==========================================

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id;
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);

  // 1. Leads overview
  const [leadStats] = await pool.query(`
    SELECT 
      COUNT(*) as total_leads,
      COUNT(CASE WHEN status = 'NEW' THEN 1 END) as new_leads,
      COUNT(CASE WHEN status = 'QUALIFIED' THEN 1 END) as qualified_leads,
      COUNT(CASE WHEN status = 'CONVERTED' THEN 1 END) as converted_leads
    FROM leads
  `);

  // 2. Deals overview
  let dealsSql = `
    SELECT 
      COUNT(*) as total_deals,
      COUNT(CASE WHEN stage NOT IN ('CLOSED_WON', 'CLOSED_LOST') THEN 1 END) as open_deals,
      COUNT(CASE WHEN stage = 'CLOSED_WON' THEN 1 END) as won_deals,
      COUNT(CASE WHEN stage = 'CLOSED_LOST' THEN 1 END) as lost_deals,
      COALESCE(SUM(CASE WHEN stage NOT IN ('CLOSED_WON', 'CLOSED_LOST') THEN deal_value ELSE 0 END), 0) as pipeline_value,
      COALESCE(SUM(CASE WHEN stage NOT IN ('CLOSED_WON', 'CLOSED_LOST') THEN (deal_value * probability / 100) ELSE 0 END), 0) as weighted_pipeline_value,
      COALESCE(SUM(CASE WHEN stage = 'CLOSED_WON' THEN deal_value ELSE 0 END), 0) as won_revenue
    FROM sales_deals
  `;
  const dealParams = [];
  if (!isManagement && currentUserId) {
    dealsSql += ` WHERE owner_id = ?`;
    dealParams.push(currentUserId);
  }
  const [dealStats] = await pool.query(dealsSql, dealParams);

  // 3. Proposals overview
  const [proposalStats] = await pool.query(`
    SELECT 
      COUNT(*) as total_proposals,
      COUNT(CASE WHEN status = 'SENT' THEN 1 END) as sent_proposals,
      COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as accepted_proposals,
      COALESCE(SUM(CASE WHEN status = 'ACCEPTED' THEN total_amount ELSE 0 END), 0) as accepted_value
    FROM sales_proposals
  `);

  // 4. Upcoming activities count
  let actSql = `
    SELECT 
      COUNT(*) as upcoming_count,
      COUNT(CASE WHEN activity_type = 'CALL' THEN 1 END) as pending_calls,
      COUNT(CASE WHEN activity_type = 'MEETING' THEN 1 END) as scheduled_meetings
    FROM sales_activities
    WHERE scheduled_at >= NOW() AND scheduled_at <= DATE_ADD(NOW(), INTERVAL 7 DAY)
  `;
  const actParams = [];
  if (!isManagement && currentUserId) {
    actSql += ` AND performed_by = ?`;
    actParams.push(currentUserId);
  }
  const [actStats] = await pool.query(actSql, actParams);

  // 5. Active Subscriptions MRR
  const [subStats] = await pool.query(`
    SELECT 
      COUNT(*) as active_subscriptions,
      COALESCE(SUM(monthly_fee), 0) as mrr
    FROM subscriptions
    WHERE is_active = 1
  `);

  // 6. Quota Target summary
  let targetSql = `
    SELECT 
      COALESCE(SUM(target_revenue), 0) as total_target,
      COALESCE(SUM(achieved_revenue), 0) as total_achieved,
      COALESCE(SUM(deals_target), 0) as total_deals_target,
      COALESCE(SUM(deals_won), 0) as total_deals_won
    FROM sales_targets
    WHERE fiscal_year = '2026-27'
  `;
  const targetParams = [];
  if (!isManagement && currentUserId) {
    targetSql += ` AND user_id = ?`;
    targetParams.push(currentUserId);
  }
  const [targetStats] = await pool.query(targetSql, targetParams);

  // 7. Recent won deals for ticker
  const [recentDeals] = await pool.query(`
    SELECT d.id, d.title, d.deal_value, d.stage, d.expected_close_date,
           c.company_name as client_name
    FROM sales_deals d
    LEFT JOIN clients c ON d.client_id = c.id
    ORDER BY d.created_at DESC
    LIMIT 5
  `);

  const totalTarget = parseFloat(targetStats[0]?.total_target || 0);
  const totalAchieved = parseFloat(targetStats[0]?.total_achieved || 0);
  const quotaAttainment = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 1000) / 10 : 0;

  return success(res, 200, {
    leads: {
      total: leadStats[0]?.total_leads || 0,
      new: leadStats[0]?.new_leads || 0,
      qualified: leadStats[0]?.qualified_leads || 0,
      converted: leadStats[0]?.converted_leads || 0
    },
    deals: {
      total: dealStats[0]?.total_deals || 0,
      open: dealStats[0]?.open_deals || 0,
      won: dealStats[0]?.won_deals || 0,
      lost: dealStats[0]?.lost_deals || 0,
      pipeline_value: parseFloat(dealStats[0]?.pipeline_value || 0),
      weighted_pipeline_value: parseFloat(dealStats[0]?.weighted_pipeline_value || 0),
      won_revenue: parseFloat(dealStats[0]?.won_revenue || 0)
    },
    proposals: {
      total: proposalStats[0]?.total_proposals || 0,
      sent: proposalStats[0]?.sent_proposals || 0,
      accepted: proposalStats[0]?.accepted_proposals || 0,
      accepted_value: parseFloat(proposalStats[0]?.accepted_value || 0)
    },
    activities: {
      upcoming_total: actStats[0]?.upcoming_count || 0,
      pending_calls: actStats[0]?.pending_calls || 0,
      scheduled_meetings: actStats[0]?.scheduled_meetings || 0
    },
    revenue: {
      mrr: parseFloat(subStats[0]?.mrr || 0),
      arr: parseFloat(subStats[0]?.mrr || 0) * 12,
      active_subscriptions: subStats[0]?.active_subscriptions || 0
    },
    quota: {
      target_revenue: totalTarget,
      achieved_revenue: totalAchieved,
      deals_target: parseInt(targetStats[0]?.total_deals_target || 0, 10),
      deals_won: parseInt(targetStats[0]?.total_deals_won || 0, 10),
      attainment_percentage: quotaAttainment
    },
    recent_deals: recentDeals.map(d => ({
      ...d,
      deal_value: parseFloat(d.deal_value || 0)
    }))
  }, 'Sales dashboard summary retrieved');
});

// ==========================================
// 2. SALES PIPELINE & DEALS
// ==========================================

export const getPipelineSummary = asyncHandler(async (req, res) => {
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
  const ownerId = isManagement ? null : req.user?.id;
  const summary = await SalesDeal.getPipelineSummary(ownerId);
  return success(res, 200, summary, 'Pipeline summary retrieved');
});

export const listDeals = asyncHandler(async (req, res) => {
  const { stage, owner_id, client_id, lead_id, search, page = 1, limit = 50 } = req.query;
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
  const filterOwner = isManagement ? owner_id : req.user?.id;

  const deals = await SalesDeal.list({
    stage,
    owner_id: filterOwner,
    client_id,
    lead_id,
    search,
    page,
    limit
  });

  const total = await SalesDeal.count({
    stage,
    owner_id: filterOwner,
    client_id,
    lead_id,
    search
  });

  return success(res, 200, {
    items: deals,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Sales deals retrieved');
});

export const getDeal = asyncHandler(async (req, res) => {
  const deal = await SalesDeal.findById(req.params.id);
  if (!deal) throw new NotFoundError('Sales deal not found');
  return success(res, 200, deal, 'Sales deal retrieved');
});

export const createDeal = asyncHandler(async (req, res) => {
  const { title, deal_value, expected_close_date, contact_name } = req.body;
  if (!title || !deal_value || !expected_close_date || !contact_name) {
    throw new ValidationError('Title, deal value, contact name, and expected close date are required');
  }

  const dealData = {
    ...req.body,
    owner_id: req.body.owner_id || req.user?.id
  };

  const newDeal = await SalesDeal.create(dealData);

  // Log activity & audit
  await AuditLog.log({
    userId: req.user?.id,
    action: 'CREATE',
    entityType: 'SALES_DEAL',
    entityId: newDeal.id,
    details: { title: newDeal.title, value: newDeal.deal_value },
    ipAddress: req.ip
  });

  broadcastToRole('SALES', 'deal:created', newDeal);
  return success(res, 201, newDeal, 'Sales deal created successfully');
});

export const updateDeal = asyncHandler(async (req, res) => {
  const existing = await SalesDeal.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales deal not found');

  const updated = await SalesDeal.update(req.params.id, req.body);

  await AuditLog.log({
    userId: req.user?.id,
    action: 'UPDATE',
    entityType: 'SALES_DEAL',
    entityId: req.params.id,
    details: { changes: req.body },
    ipAddress: req.ip
  });

  broadcastToRole('SALES', 'deal:updated', updated);
  return success(res, 200, updated, 'Sales deal updated successfully');
});

export const updateDealStage = asyncHandler(async (req, res) => {
  const { stage, loss_reason } = req.body;
  if (!stage) throw new ValidationError('Stage is required');

  const existing = await SalesDeal.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales deal not found');

  const updated = await SalesDeal.updateStage(req.params.id, stage, loss_reason);

  // If deal moved to CLOSED_WON, increment rep's quota achievement
  if (stage === 'CLOSED_WON' && existing.stage !== 'CLOSED_WON') {
    await SalesTarget.recordDealWon(existing.owner_id, existing.deal_value);
  }

  broadcastToRole('SALES', 'deal:stage_changed', updated);
  return success(res, 200, updated, 'Sales deal stage updated successfully');
});

export const deleteDeal = asyncHandler(async (req, res) => {
  const existing = await SalesDeal.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales deal not found');

  await SalesDeal.delete(req.params.id);
  broadcastToRole('SALES', 'deal:deleted', { id: req.params.id });
  return success(res, 200, { id: req.params.id }, 'Sales deal deleted successfully');
});

// ==========================================
// 3. PROPOSALS & QUOTATIONS
// ==========================================

export const listProposals = asyncHandler(async (req, res) => {
  const { status, deal_id, client_id, page = 1, limit = 50 } = req.query;
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
  const createdBy = isManagement ? null : req.user?.id;

  const proposals = await SalesProposal.list({
    status,
    deal_id,
    client_id,
    created_by: createdBy,
    page,
    limit
  });

  const total = await SalesProposal.count({
    status,
    deal_id,
    client_id,
    created_by: createdBy
  });

  return success(res, 200, {
    items: proposals,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Sales proposals retrieved');
});

export const getProposal = asyncHandler(async (req, res) => {
  const proposal = await SalesProposal.findById(req.params.id);
  if (!proposal) throw new NotFoundError('Sales proposal not found');
  return success(res, 200, proposal, 'Sales proposal retrieved');
});

export const createProposal = asyncHandler(async (req, res) => {
  const { title, total_amount, valid_until } = req.body;
  if (!title || total_amount === undefined || !valid_until) {
    throw new ValidationError('Title, total amount, and valid until date are required');
  }

  const proposalData = {
    ...req.body,
    created_by: req.user?.id
  };

  const newProposal = await SalesProposal.create(proposalData);

  // If tied to a deal and status is SENT, update deal stage to PROPOSAL_SENT
  if (newProposal.deal_id && (newProposal.status === 'SENT' || req.body.status === 'SENT')) {
    await SalesDeal.updateStage(newProposal.deal_id, 'PROPOSAL_SENT');
  }

  return success(res, 201, newProposal, 'Sales proposal created successfully');
});

export const updateProposal = asyncHandler(async (req, res) => {
  const existing = await SalesProposal.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales proposal not found');

  const updated = await SalesProposal.update(req.params.id, req.body);
  return success(res, 200, updated, 'Sales proposal updated successfully');
});

export const updateProposalStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new ValidationError('Status is required');

  const existing = await SalesProposal.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales proposal not found');

  const updated = await SalesProposal.updateStatus(req.params.id, status);

  // If proposal ACCEPTED and deal linked, advance deal
  if (status === 'ACCEPTED' && existing.deal_id) {
    await SalesDeal.updateStage(existing.deal_id, 'NEGOTIATION');
  }

  return success(res, 200, updated, 'Sales proposal status updated successfully');
});

export const deleteProposal = asyncHandler(async (req, res) => {
  const existing = await SalesProposal.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales proposal not found');

  await SalesProposal.delete(req.params.id);
  return success(res, 200, { id: req.params.id }, 'Sales proposal deleted successfully');
});

// ==========================================
// 4. ACTIVITIES, CALLS, MEETINGS, CALENDAR
// ==========================================

export const listActivities = asyncHandler(async (req, res) => {
  const { activity_type, deal_id, lead_id, start_date, end_date, outcome, page = 1, limit = 50 } = req.query;
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
  const performedBy = isManagement ? req.query.performed_by : req.user?.id;

  const activities = await SalesActivity.list({
    activity_type,
    deal_id,
    lead_id,
    performed_by: performedBy,
    start_date,
    end_date,
    outcome,
    page,
    limit
  });

  const total = await SalesActivity.count({
    activity_type,
    deal_id,
    lead_id,
    performed_by: performedBy,
    start_date,
    end_date,
    outcome
  });

  return success(res, 200, {
    items: activities,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Sales activities retrieved');
});

export const getUpcomingActivities = asyncHandler(async (req, res) => {
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
  const performedBy = isManagement ? null : req.user?.id;
  const upcoming = await SalesActivity.getUpcoming({ performed_by: performedBy, limit: req.query.limit || 10 });
  return success(res, 200, upcoming, 'Upcoming activities retrieved');
});

export const createActivity = asyncHandler(async (req, res) => {
  const { activity_type, title, scheduled_at } = req.body;
  if (!activity_type || !title || !scheduled_at) {
    throw new ValidationError('Activity type, title, and scheduled time are required');
  }

  const activityData = {
    ...req.body,
    performed_by: req.user?.id
  };

  const newActivity = await SalesActivity.create(activityData);
  return success(res, 201, newActivity, 'Activity logged successfully');
});

export const updateActivity = asyncHandler(async (req, res) => {
  const existing = await SalesActivity.findById(req.params.id);
  if (!existing) throw new NotFoundError('Activity not found');

  const updated = await SalesActivity.update(req.params.id, req.body);
  return success(res, 200, updated, 'Activity updated successfully');
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const existing = await SalesActivity.findById(req.params.id);
  if (!existing) throw new NotFoundError('Activity not found');

  await SalesActivity.delete(req.params.id);
  return success(res, 200, { id: req.params.id }, 'Activity deleted successfully');
});

// ==========================================
// 5. TARGETS & ATTAINMENT
// ==========================================

export const listTargets = asyncHandler(async (req, res) => {
  const { fiscal_year, period_type, page = 1, limit = 50 } = req.query;
  const isManagement = ['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role);
  const targetUserId = isManagement ? req.query.user_id : req.user?.id;

  const targets = await SalesTarget.list({
    user_id: targetUserId,
    fiscal_year,
    period_type,
    page,
    limit
  });

  const total = await SalesTarget.count({
    user_id: targetUserId,
    fiscal_year,
    period_type
  });

  return success(res, 200, {
    items: targets,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Sales targets retrieved');
});

export const createOrUpdateTarget = asyncHandler(async (req, res) => {
  const { fiscal_year, period_label, target_revenue } = req.body;
  if (!fiscal_year || !period_label || target_revenue === undefined) {
    throw new ValidationError('Fiscal year, period label, and target revenue are required');
  }

  const userId = req.body.user_id || req.user?.id;
  const target = await SalesTarget.createOrUpdate({
    ...req.body,
    user_id: userId
  });

  return success(res, 200, target, 'Sales target saved successfully');
});

export const deleteTarget = asyncHandler(async (req, res) => {
  const existing = await SalesTarget.findById(req.params.id);
  if (!existing) throw new NotFoundError('Sales target not found');

  await SalesTarget.delete(req.params.id);
  return success(res, 200, { id: req.params.id }, 'Sales target deleted successfully');
});

// ==========================================
// 6. CUSTOMER HANDOVERS (Won Deal -> PM/Ops)
// ==========================================

export const listHandovers = asyncHandler(async (req, res) => {
  const { status, handover_to, assigned_person_id, client_id, deal_id, page = 1, limit = 50 } = req.query;

  const handovers = await CustomerHandover.list({
    status,
    handover_to,
    assigned_person_id,
    client_id,
    deal_id,
    page,
    limit
  });

  const total = await CustomerHandover.count({
    status,
    handover_to,
    assigned_person_id,
    client_id,
    deal_id
  });

  return success(res, 200, {
    items: handovers,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Customer handovers retrieved');
});

export const getHandover = asyncHandler(async (req, res) => {
  const handover = await CustomerHandover.findById(req.params.id);
  if (!handover) throw new NotFoundError('Customer handover not found');
  return success(res, 200, handover, 'Customer handover retrieved');
});

export const createHandover = asyncHandler(async (req, res) => {
  const { deal_id, client_id, handover_to, scope_summary, kickoff_date } = req.body;
  if (!deal_id || !client_id || !handover_to || !scope_summary || !kickoff_date) {
    throw new ValidationError('Deal ID, client ID, handover destination, scope summary, and kickoff date are required');
  }

  const newHandover = await CustomerHandover.create({
    ...req.body,
    handover_by: req.user?.id
  });

  broadcastToRole('PROJECT_MANAGER', 'handover:received', newHandover);
  return success(res, 201, newHandover, 'Customer handover initiated successfully');
});

export const updateHandoverStatus = asyncHandler(async (req, res) => {
  const { status, assigned_person_id } = req.body;
  if (!status) throw new ValidationError('Status is required');

  const existing = await CustomerHandover.findById(req.params.id);
  if (!existing) throw new NotFoundError('Customer handover not found');

  const updated = await CustomerHandover.updateStatus(req.params.id, status, assigned_person_id);
  return success(res, 200, updated, 'Customer handover status updated successfully');
});

export const deleteHandover = asyncHandler(async (req, res) => {
  const existing = await CustomerHandover.findById(req.params.id);
  if (!existing) throw new NotFoundError('Customer handover not found');

  await CustomerHandover.delete(req.params.id);
  return success(res, 200, { id: req.params.id }, 'Customer handover deleted successfully');
});

// ==========================================
// 7. REPORTS & ANALYTICS
// ==========================================

export const getSalesReports = asyncHandler(async (req, res) => {
  // 1. Monthly deal closures (last 6 months)
  const [closureRows] = await pool.query(`
    SELECT 
      DATE_FORMAT(expected_close_date, '%Y-%m') as month,
      COUNT(CASE WHEN stage = 'CLOSED_WON' THEN 1 END) as won_count,
      COALESCE(SUM(CASE WHEN stage = 'CLOSED_WON' THEN deal_value ELSE 0 END), 0) as won_volume,
      COUNT(CASE WHEN stage = 'CLOSED_LOST' THEN 1 END) as lost_count,
      COALESCE(SUM(CASE WHEN stage = 'CLOSED_LOST' THEN deal_value ELSE 0 END), 0) as lost_volume
    FROM sales_deals
    WHERE expected_close_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(expected_close_date, '%Y-%m')
    ORDER BY month ASC
  `);

  // 2. Lead conversion funnel
  const [funnelRows] = await pool.query(`
    SELECT status, COUNT(*) as count
    FROM leads
    GROUP BY status
  `);

  // 3. Rep Leaderboard
  const [repRows] = await pool.query(`
    SELECT 
      u.id as rep_id,
      u.full_name,
      u.email,
      COUNT(CASE WHEN d.stage = 'CLOSED_WON' THEN 1 END) as deals_won,
      COALESCE(SUM(CASE WHEN d.stage = 'CLOSED_WON' THEN d.deal_value ELSE 0 END), 0) as closed_revenue
    FROM users u
    INNER JOIN sales_deals d ON d.owner_id = u.id
    GROUP BY u.id, u.full_name, u.email
    ORDER BY closed_revenue DESC
    LIMIT 10
  `);

  const formattedRepLeaderboard = repRows.map(r => ({
    rep_id: r.rep_id,
    name: r.full_name ? decrypt(r.full_name) : r.email,
    deals_won: parseInt(r.deals_won, 10),
    closed_revenue: parseFloat(r.closed_revenue || 0)
  }));

  // 4. Stage distribution
  const [stageRows] = await pool.query(`
    SELECT stage, COUNT(*) as count, COALESCE(SUM(deal_value), 0) as value
    FROM sales_deals
    GROUP BY stage
  `);

  return success(res, 200, {
    monthly_performance: closureRows.map(r => ({
      month: r.month,
      won_count: parseInt(r.won_count, 10),
      won_volume: parseFloat(r.won_volume),
      lost_count: parseInt(r.lost_count, 10),
      lost_volume: parseFloat(r.lost_volume)
    })),
    lead_funnel: funnelRows.map(f => ({
      status: f.status,
      count: parseInt(f.count, 10)
    })),
    rep_leaderboard: formattedRepLeaderboard,
    stage_distribution: stageRows.map(s => ({
      stage: s.stage,
      count: parseInt(s.count, 10),
      value: parseFloat(s.value)
    }))
  }, 'Sales reports and analytics retrieved');
});
