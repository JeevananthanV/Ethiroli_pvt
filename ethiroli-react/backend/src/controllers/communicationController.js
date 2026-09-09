import CommunicationLog from '../models/CommunicationLog.js';
import CommunicationTemplate from '../models/CommunicationTemplate.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { channel, recipient, content, template_id } = req.body;
  let finalContent = content;

  if (template_id) {
    const template = await CommunicationTemplate.findById(template_id);
    if (template) finalContent = template.content;
  }

  const id = await CommunicationLog.create({
    channel,
    recipient,
    content: finalContent,
    created_by: req.user.id,
    status: 'SENT'
  });

  broadcastToUser(req.user.id, 'communication_sent', { id, recipient });
  return success(res, 200, { id }, 'Message sent successfully');
});

export const sendBulkMessages = asyncHandler(async (req, res) => {
  const { recipients, channel, content } = req.body;
  for (const recipient of recipients.slice(0, 100)) {
    await CommunicationLog.create({ channel, recipient, content, created_by: req.user.id, status: 'SENT' });
  }
  return success(res, 200, null, 'Bulk messages processed successfully');
});

export const listLogs = asyncHandler(async (req, res) => {
  const { channel, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    CommunicationLog.list({ channel, status, limit: parseInt(limit), offset }),
    CommunicationLog.count({ channel, status })
  ]);

  return success(res, 200, items, 'Communication logs retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const scheduleMessage = asyncHandler(async (req, res) => {
  const id = await CommunicationLog.create({
    ...req.body,
    created_by: req.user.id,
    status: 'SCHEDULED',
    scheduled_at: req.body.scheduled_at
  });
  return success(res, 201, { id }, 'Message scheduled');
});
