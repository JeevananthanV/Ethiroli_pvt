import crypto from 'crypto';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';
import { success, error } from '../utils/response.js';
import { getN8nConfig } from '../services/n8nService.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import Candidate from '../models/Candidate.js';

/**
 * Handle incoming callback action from n8n workflow
 */
export const handleN8nAction = async (req, res) => {
  const secretHeader = req.headers['x-n8n-webhook-secret'] || req.headers['authorization']?.replace('Bearer ', '');
  const config = await getN8nConfig();

  // Validate shared secret
  if (config.secret && secretHeader !== config.secret) {
    logger.warn('Unauthorized n8n inbound webhook attempt', { ip: req.ip });
    return error(res, 401, 'Invalid or missing X-N8N-Webhook-Secret header');
  }

  const { action, candidateId, leadId, status, note, role, title, body, data } = req.body;
  const logId = crypto.randomUUID();

  try {
    // Record incoming webhook execution
    await pool.execute(
      `INSERT INTO incoming_webhook_logs (id, source, event, payload, status)
       VALUES (?, 'N8N', ?, ?, 'PROCESSED')`,
      [logId, action || 'UNKNOWN', JSON.stringify(req.body)]
    );

    let result = { processed: true, action };

    switch (action) {
      case 'update_candidate_status': {
        if (!candidateId) return error(res, 400, 'candidateId is required for update_candidate_status');
        const updates = {};
        if (status) updates.status = status;
        if (note) updates.notes = note;

        await Candidate.update(candidateId, updates);
        broadcastToRole('HR', 'candidate_updated', { id: candidateId, status, note, source: 'n8n' });
        result.details = { candidateId, status, note };
        break;
      }

      case 'add_candidate_note': {
        if (!candidateId || !note) return error(res, 400, 'candidateId and note are required');
        const candidate = await Candidate.findById(candidateId);
        if (candidate) {
          const updatedNotes = candidate.notes ? `${candidate.notes}\n[n8n Automation]: ${note}` : `[n8n Automation]: ${note}`;
          await Candidate.update(candidateId, { notes: updatedNotes });
          broadcastToRole('HR', 'candidate_updated', { id: candidateId, notes: updatedNotes, source: 'n8n' });
          result.details = { candidateId, noteAdded: true };
        }
        break;
      }

      case 'update_lead_score': {
        if (!leadId) return error(res, 400, 'leadId is required');
        const queryParts = [];
        const values = [];
        if (status) { queryParts.push('status = ?'); values.push(status); }
        if (req.body.score !== undefined) { queryParts.push('score = ?'); values.push(req.body.score); }

        if (queryParts.length > 0) {
          values.push(leadId);
          await pool.execute(`UPDATE leads SET ${queryParts.join(', ')} WHERE id = ?`, values);
          broadcastToRole('SALES', 'lead_updated', { id: leadId, status, score: req.body.score, source: 'n8n' });
        }
        result.details = { leadId, updated: true };
        break;
      }

      case 'trigger_notification': {
        const notifTitle = title || 'Workflow Notification';
        const notifBody = body || 'An n8n automation workflow completed successfully.';
        if (role) {
          broadcastToRole(role, 'push_notification', {
            title: notifTitle,
            body: notifBody,
            data: data || {},
            createdAt: new Date().toISOString()
          });
        }
        result.details = { notificationSent: true, target: role || 'all' };
        break;
      }

      default:
        result.message = `Action '${action}' accepted and logged.`;
    }

    logger.info('n8n incoming action executed successfully', { action, logId });
    return success(res, 200, result, 'n8n action executed successfully');
  } catch (err) {
    logger.error('Failed to process n8n action', { action, error: err.message, logId });
    await pool.execute(
      `UPDATE incoming_webhook_logs SET status = 'FAILED', error_message = ? WHERE id = ?`,
      [err.message, logId]
    );
    return error(res, 500, `Action execution failed: ${err.message}`);
  }
};
