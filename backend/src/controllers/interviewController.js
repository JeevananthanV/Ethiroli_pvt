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

import Candidate from '../models/Candidate.js';
import pool from '../config/database.js';

export const scheduleInterview = asyncHandler(async (req, res) => {
  let candidateId = req.body.candidate_id;
  if (!candidateId) {
    const candName = req.body.candidate_name || 'Candidate';
    const candEmail = req.body.candidate_email || `candidate.${Date.now()}@ethiroli.com`;
    let jobId = req.body.job_id;
    if (!jobId) {
      const [jobs] = await pool.query('SELECT id FROM jobs LIMIT 1');
      jobId = jobs[0]?.id;
    }
    candidateId = await Candidate.create({
      job_id: jobId,
      name: candName,
      email: candEmail,
      source: 'MANUAL'
    });
  }

  const scheduledAt = req.body.scheduled_at || req.body.interview_date || new Date(Date.now() + 86400000).toISOString().slice(0, 19).replace('T', ' ');

  const payload = {
    ...req.body,
    candidate_id: candidateId,
    scheduled_at: scheduledAt,
    created_by: req.user.id
  };

  const id = await Interview.create(payload);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'SCHEDULE_INTERVIEW',
    entity_type: 'INTERVIEW',
    entity_id: id,
    new_value: payload,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'interview_scheduled', { id, candidate_id: candidateId });

  // Auto-create calendar event for the scheduled interview
  try {
    const CalendarEvent = (await import('../models/CalendarEvent.js')).default;
    const notificationRouter = (await import('../services/notificationRouter.js')).default;

    const startTime = scheduledAt;
    const durationMin = parseInt(req.body.duration_minutes || req.body.duration || 45, 10);
    const endTime = new Date(new Date(startTime).getTime() + durationMin * 60000).toISOString().slice(0, 19).replace('T', ' ');

    const calEventId = await CalendarEvent.create({
      title: `Interview: ${req.body.candidate_name || 'Candidate'} - ${req.body.round || 'Round 1'}`,
      description: `Interview for ${req.body.position || 'Open Role'} with ${req.body.interviewer_name || 'Interviewer'}. ${req.body.meeting_link ? 'Link: ' + req.body.meeting_link : ''}`,
      event_type: 'INTERVIEW',
      event_type_id: 'evt_interview',
      start_time: startTime,
      end_time: endTime,
      created_by: req.user.id,
      meeting_link: req.body.meeting_link || null,
      assigned_users: req.body.interviewer_id ? [req.body.interviewer_id] : [req.user.id],
      status: 'scheduled',
      role: 'HR'
    });

    const calEvent = await CalendarEvent.findById(calEventId);
    await notificationRouter.route('created', calEvent, req.user.id, req.user.role);
  } catch (calErr) {
    console.error('Failed to auto-create calendar event for interview:', calErr);
  }

  return success(res, 201, { id, candidate_id: candidateId }, 'Interview scheduled successfully');
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
