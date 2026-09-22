import JobBoardPost from '../models/JobBoardPost.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { generateIndeedJobFeedXml, processIndeedApplication } from '../services/indeedService.js';

export const listJobBoardPosts = asyncHandler(async (req, res) => {
  const { platform, is_published, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    JobBoardPost.list({ platform, is_published, limit: parseInt(limit), offset }),
    JobBoardPost.count({ platform, is_published })
  ]);

  return success(res, 200, items, 'Job board posts retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createJobBoardPost = asyncHandler(async (req, res) => {
  const id = await JobBoardPost.create({ ...req.body, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_JOB_BOARD_POST',
    entity_type: 'JOB_BOARD_POST',
    entity_id: id,
    new_value: { ...req.body, created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_board_post_created', { id });
  return success(res, 201, { id }, 'Job posted to platform');
});

export const getJobBoardPost = asyncHandler(async (req, res) => {
  const post = await JobBoardPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Job board post not found');
  return success(res, 200, post, 'Job board post retrieved');
});

export const updateJobBoardPost = asyncHandler(async (req, res) => {
  const post = await JobBoardPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Job board post not found');
  await JobBoardPost.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_JOB_BOARD_POST',
    entity_type: 'JOB_BOARD_POST',
    entity_id: req.params.id,
    old_value: post,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_board_post_updated', { id: req.params.id });
  return success(res, 200, null, 'Job board post updated');
});

export const deleteJobBoardPost = asyncHandler(async (req, res) => {
  const post = await JobBoardPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Job board post not found');
  await JobBoardPost.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_JOB_BOARD_POST',
    entity_type: 'JOB_BOARD_POST',
    entity_id: req.params.id,
    old_value: post,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_board_post_deleted', { id: req.params.id });
  return success(res, 200, null, 'Job board post deleted');
});

/**
 * Public endpoint delivering Indeed XML Job Feed
 */
export const getIndeedJobFeed = asyncHandler(async (req, res) => {
  const xml = await generateIndeedJobFeedXml();
  res.header('Content-Type', 'application/xml');
  return res.status(200).send(xml);
});

/**
 * Endpoint for testing / simulating Indeed candidate application ingestion
 */
export const simulateIndeedApplication = asyncHandler(async (req, res) => {
  const payload = req.body.applicant ? req.body : {
    applicant: {
      fullName: req.body.name || req.body.fullName || 'Test Indeed Candidate',
      email: req.body.email || `candidate_${Date.now()}@example.com`,
      phoneNumber: req.body.phone || '+91 98765 43210',
      resumeUrl: req.body.resumeUrl || 'https://example.com/resumes/sample.pdf',
      applicantId: `ind_sim_${Date.now()}`
    },
    jobId: req.body.jobId || null
  };

  const result = await processIndeedApplication(payload, req.headers);
  return success(res, 201, result, 'Indeed application successfully ingested');
});
