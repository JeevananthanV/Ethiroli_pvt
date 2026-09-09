import Interview from '../models/Interview.js';
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
  return success(res, 200, null, 'Interview feedback submitted');
});
