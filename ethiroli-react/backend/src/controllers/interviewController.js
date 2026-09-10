import Interview from '../models/Interview.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listInterviews = asyncHandler(async (req, res) => {
  const { interviewer_id, candidate_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Interview.list({ interviewer_id, candidate_id, status, limit: parseInt(limit), offset }),
    Interview.count({ interviewer_id, candidate_id, status })
  ]);

  return success(res, 200, items, 'Interviews retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const scheduleInterview = asyncHandler(async (req, res) => {
  const id = await Interview.create({ ...req.body, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'SCHEDULE_INTERVIEW',
    entity_type: 'INTERVIEW',
    entity_id: id,
    new_value: { ...req.body, created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'interview_scheduled', { id, candidate_id: req.body.candidate_id });
  return success(res, 201, { id }, 'Interview scheduled successfully');
});

export const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) throw new NotFoundError('Interview not found');
  return success(res, 200, interview, 'Interview retrieved');
});

export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) throw new NotFoundError('Interview not found');
  await Interview.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_INTERVIEW',
    entity_type: 'INTERVIEW',
    entity_id: req.params.id,
    old_value: interview,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'interview_updated', { id: req.params.id });
  return success(res, 200, null, 'Interview updated successfully');
});

export const submitFeedback = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) throw new NotFoundError('Interview not found');
  await Interview.update(req.params.id, {
    feedback: req.body.feedback,
    rating: req.body.rating,
    status: req.body.status || 'COMPLETED'
  });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'SUBMIT_INTERVIEW_FEEDBACK',
    entity_type: 'INTERVIEW',
    entity_id: req.params.id,
    old_value: interview,
    new_value: { feedback: req.body.feedback, rating: req.body.rating, status: req.body.status || 'COMPLETED' },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'interview_feedback_submitted', { id: req.params.id });
  return success(res, 200, null, 'Interview feedback submitted');
});
