import Lead from '../models/Lead.js';
import AuditLog from '../models/AuditLog.js';
import ActivityFeed from '../models/ActivityFeed.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { sendFollowUpEmail } from '../services/emailService.js';

export const listLeads = async (req, res) => {
  const { status, source, limit = 50, offset = 0 } = req.query;
  const isSales = req.user.role === 'SALES';

  try {
    const leads = await Lead.list({
      assigned_to: isSales ? req.user.id : undefined,
      status,
      source,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    res.status(200).json(leads);
  } catch (error) {
    console.error('List leads error:', error);
    res.status(500).json({ message: 'Failed to list leads.' });
  }
};

export const createLead = async (req, res) => {
  const { name, email, phone, source, status, assigned_to, notes, follow_up_date } = req.body;

  try {
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

    const newLead = { id: leadId, name, email, phone, source, status: status || 'NEW', assigned_to };

    // Audit Log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'CREATE_LEAD',
      entity_type: 'LEAD',
      entity_id: leadId,
      new_value: newLead,
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent']
    });

    // Real-time broadcast
    broadcastToRole('SALES', 'lead_created', newLead);
    broadcastToRole('ADMIN', 'lead_created', newLead);
    broadcastToRole('SUPER_ADMIN', 'lead_created', newLead);

    res.status(201).json({ message: 'Lead created successfully.', leadId });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Failed to create lead.' });
  }
};

export const createPublicLead = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const notes = `Subject: ${subject || 'No Subject'}\nMessage: ${message || 'No Message'}`;
  const defaultAdmin = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed Super Admin

  try {
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

    // Audit Log
    await AuditLog.create({
      user_id: defaultAdmin,
      action: 'CREATE_LEAD_PUBLIC',
      entity_type: 'LEAD',
      entity_id: leadId,
      new_value: newLead,
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent']
    });

    // Real-time broadcast
    broadcastToRole('SALES', 'lead_created', newLead);
    broadcastToRole('ADMIN', 'lead_created', newLead);
    broadcastToRole('SUPER_ADMIN', 'lead_created', newLead);

    res.status(201).json({ message: 'Lead created successfully.', leadId });
  } catch (error) {
    console.error('Create public lead error:', error);
    res.status(500).json({ message: 'Failed to submit contact request.' });
  }
};


export const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status, lost_reason } = req.body;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    const oldStatus = lead.status;
    const updates = { status };
    if (status === 'LOST') {
      updates.lost_reason = lost_reason;
    }
    if (status === 'ADMISSION') {
      updates.converted_at = new Date();
    }

    await Lead.update(id, updates);

    // Audit Log
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

    // Real-time broadcast
    const broadcastPayload = { id, oldStatus, status, leadName: lead.name };
    broadcastToRole('SALES', 'lead_status_changed', broadcastPayload);
    broadcastToRole('ADMIN', 'lead_status_changed', broadcastPayload);
    broadcastToRole('SUPER_ADMIN', 'lead_status_changed', broadcastPayload);

    // If assigned to a user, create activity feed & notify them
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

    res.status(200).json({ message: 'Lead status updated successfully.' });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ message: 'Failed to update lead status.' });
  }
};

export const updateLead = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

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

    res.status(200).json({ message: 'Lead updated successfully.' });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Failed to update lead.' });
  }
};

export const deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

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

    res.status(200).json({ message: 'Lead deleted successfully.' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Failed to delete lead.' });
  }
};

export const sendFollowUp = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    if (!lead.email) {
      return res.status(400).json({ message: 'Lead does not have an email address.' });
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

    res.status(200).json({ message: 'Follow-up email sent successfully.' });
  } catch (error) {
    console.error('Send follow up email error:', error);
    res.status(500).json({ message: 'Failed to send follow-up email.' });
  }
};
