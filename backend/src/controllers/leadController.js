import Lead from '../models/Lead.js';
import AuditLog from '../models/AuditLog.js';
import ActivityFeed from '../models/ActivityFeed.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { sendFollowUpEmail } from '../services/emailService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listLeads = asyncHandler(async (req, res) => {
  const { status, source, limit = 50, offset = 0 } = req.query;
  const isSales = req.user.role === 'SALES';

  const leads = await Lead.list({
    assigned_to: isSales ? req.user.id : undefined,
    status,
    source,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });
  return success(res, 200, leads);
});

export const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, source, status, assigned_to, notes, follow_up_date } = req.body;

  const leadId = await Lead.create({
    name,
    email,
    phone,
    source,
    status: status || 'NEW',
    assigned_to,
    notes,
    follow_up_date,
    created_by: req.user.id
  });

  const newLead = { id: leadId, name, email, phone, source: status || 'NEW', assigned_to };

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_LEAD',
    entity_type: 'LEAD',
    entity_id: leadId,
    new_value: newLead,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('SALES', 'lead_created', newLead);
  broadcastToRole('ADMIN', 'lead_created', newLead);
  broadcastToRole('SUPER_ADMIN', 'lead_created', newLead);

  return success(res, 201, { leadId }, 'Lead created successfully');
});

export const createPublicLead = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const notes = `Subject: ${subject || 'No Subject'}\nMessage: ${message || 'No Message'}`;
  const defaultAdmin = '368f5c88-12cd-11ed-861d-0242ac120002';

  const leadId = await Lead.create({
    name,
    email,
    phone,
    source: 'WEBSITE',
    status: 'NEW',
    notes,
    created_by: defaultAdmin
  });

  const newLead = { id: leadId, name, email, phone, source: 'WEBSITE', status: 'NEW' };

  await AuditLog.create({
    user_id: defaultAdmin,
    action: 'CREATE_LEAD_PUBLIC',
    entity_type: 'LEAD',
    entity_id: leadId,
    new_value: newLead,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('SALES', 'lead_created', newLead);
  broadcastToRole('ADMIN', 'lead_created', newLead);
  broadcastToRole('SUPER_ADMIN', 'lead_created', newLead);

  return success(res, 201, { leadId }, 'Lead created successfully');
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, lost_reason } = req.body;

  const lead = await Lead.findById(id);
  if (!lead) throw new NotFoundError('Lead not found');

  const oldStatus = lead.status;
  const updates = { status };
  if (status === 'LOST') {
    updates.lost_reason = lost_reason;
  }
  if (status === 'ADMISSION') {
    updates.converted_at = new Date();
  }

  await Lead.update(id, updates);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_LEAD_STATUS',
    entity_type: 'LEAD',
    entity_id: id,
    old_value: { status: oldStatus },
    new_value: updates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const broadcastPayload = { id, oldStatus, status, leadName: lead.name };
  broadcastToRole('SALES', 'lead_status_changed', broadcastPayload);
  broadcastToRole('ADMIN', 'lead_status_changed', broadcastPayload);
  broadcastToRole('SUPER_ADMIN', 'lead_status_changed', broadcastPayload);

  if (lead.assigned_to) {
    await ActivityFeed.create({
      user_id: lead.assigned_to,
      actor_id: req.user.id,
      event_type: 'LEAD_STATUS_CHANGED',
      entity_type: 'LEAD',
      entity_id: id,
      payload: broadcastPayload
    });
    broadcastToUser(lead.assigned_to, 'new_activity', {
      message: `Lead ${lead.name} status updated to ${status}`
    });
  }

  return success(res, 200, null, 'Lead status updated successfully');
});

export const updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const lead = await Lead.findById(id);
  if (!lead) throw new NotFoundError('Lead not found');

  await Lead.update(id, updates);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_LEAD',
    entity_type: 'LEAD',
    entity_id: id,
    old_value: lead,
    new_value: updates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Lead updated successfully');
});

export const deleteLead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);
  if (!lead) throw new NotFoundError('Lead not found');

  await Lead.delete(id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_LEAD',
    entity_type: 'LEAD',
    entity_id: id,
    old_value: lead,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Lead deleted successfully');
});

export const sendFollowUp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const lead = await Lead.findById(id);
  if (!lead) throw new NotFoundError('Lead not found');

  if (!lead.email) {
    throw new ValidationError('Lead does not have an email address.');
  }

  await sendFollowUpEmail(lead.email, lead.name, message);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'SEND_FOLLOW_UP_EMAIL',
    entity_type: 'LEAD',
    entity_id: id,
    new_value: { message },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Follow-up email sent successfully');
});
