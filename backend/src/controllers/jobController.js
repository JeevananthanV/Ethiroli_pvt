import Job from '../models/Job.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listJobs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Job.list({ status, limit: parseInt(limit), offset }),
    Job.count({ status })
  ]);

  return success(res, 200, items, 'Jobs retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createJob = asyncHandler(async (req, res) => {
  const id = await Job.create({ ...req.body, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_JOB',
    entity_type: 'JOB',
    entity_id: id,
    new_value: { ...req.body, created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_created', { id });
  return success(res, 201, { id }, 'Job posting created');
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new NotFoundError('Job not found');
  return success(res, 200, job, 'Job retrieved');
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new NotFoundError('Job not found');
  await Job.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_JOB',
    entity_type: 'JOB',
    entity_id: req.params.id,
    old_value: job,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_updated', { id: req.params.id });
  return success(res, 200, null, 'Job updated');
});

export const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new NotFoundError('Job not found');
  await Job.update(req.params.id, { status: 'CLOSED' });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CLOSE_JOB',
    entity_type: 'JOB',
    entity_id: req.params.id,
    old_value: job,
    new_value: { status: 'CLOSED' },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_closed', { id: req.params.id });
  return success(res, 200, null, 'Job closed');
});

export const publishJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new NotFoundError('Job not found');
  await Job.update(req.params.id, { status: 'OPEN' });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'PUBLISH_JOB',
    entity_type: 'JOB',
    entity_id: req.params.id,
    old_value: job,
    new_value: { status: 'OPEN' },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_published', { id: req.params.id });
  return success(res, 200, null, 'Job published');
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new NotFoundError('Job not found');
  await Job.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_JOB',
    entity_type: 'JOB',
    entity_id: req.params.id,
    old_value: job,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'job_deleted', { id: req.params.id });
  return success(res, 200, null, 'Job deleted successfully');
});
