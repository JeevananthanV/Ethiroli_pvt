import express from 'express';
import crypto from 'crypto';
import pool from '../config/database.js';
import VideoTask from '../models/VideoTask.js';
import VideoWorkLog from '../models/VideoWorkLog.js';
import VideoReview from '../models/VideoReview.js';
import VideoRevision from '../models/VideoRevision.js';
import VideoDelivery from '../models/VideoDelivery.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const router = express.Router();

router.use(authenticate);

// ==========================================
// 1. VIDEO PROJECTS
// ==========================================

router.get('/projects', authenticate, requireRole('VIDEO_EDITOR', 'MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT vp.*, u.full_name as editor_name 
     FROM video_projects vp
     LEFT JOIN users u ON vp.assigned_editor = u.id`
  );
  return success(res, 200, rows, 'Video projects retrieved');
}));

router.post('/projects', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { title, client_name, project_type, description, assigned_editor } = req.body;
  if (!title) throw new ValidationError('Title is required');

  const id = crypto.randomUUID();
  await pool.execute(
    `INSERT INTO video_projects 
      (id, title, client_name, project_type, description, assigned_editor, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, title, client_name, project_type || 'Marketing', description, assigned_editor, req.user?.id]
  );

  return success(res, 201, { id, title, project_type }, 'Video project created');
}));

// ==========================================
// 2. VIDEO TASKS
// ==========================================

router.get('/tasks', authenticate, requireRole('VIDEO_EDITOR', 'MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const result = await VideoTask.getTasks({
    status: req.query.status,
    priority: req.query.priority,
    assigned_editor: req.query.bda_id,
    page: req.query.page || 1,
    limit: req.query.limit || 20,
  });
  return success(res, 200, result, 'Video tasks retrieved');
}));

router.post('/tasks', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const result = await VideoTask.createTask(req.body);
  return success(res, 201, result, 'Video task created');
}));

router.get('/tasks/:id', authenticate, requireRole('*'), asyncHandler(async (req, res) => {
  const task = await VideoTask.getTaskById(req.params.id);
  if (!task) throw new NotFoundError('Video task not found');
  return success(res, 200, task, 'Video task retrieved');
}));

router.patch('/tasks/:id/status', authenticate, requireRole('VIDEO_EDITOR', 'MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const updated = await VideoTask.updateTaskStatus(req.params.id, req.body.status, req.user?.id);
  if (updated) return success(res, 200, { updated }, 'Task status updated');
  return success(res, 200, { updated: 0 }, 'No update made');
}));

router.delete('/tasks/:id', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const deleted = await VideoTask.deleteTask(req.params.id);
  return success(res, 200, { deleted }, 'Task deleted');
}));

// ==========================================
// 3. VIDEO WORK LOGS
// ==========================================

router.post('/tasks/:id/log', authenticate, requireRole('VIDEO_EDITOR'), asyncHandler(async (req, res) => {
  const logId = await VideoWorkLog.createLog({
    task_id: req.params.id,
    editor: req.user?.id,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    blockers: req.body.blockers,
    notes: req.body.notes,
  });
  return success(res, 201, { logId }, 'Work log created');
}));

router.get('/tasks/:id/logs', authenticate, requireRole('VIDEO_EDITOR', 'MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const result = await VideoWorkLog.getLogs({ task_id: req.params.id });
  return success(res, 200, result, 'Work logs retrieved');
}));

router.get('/editor/stats/:editorId', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const result = await VideoWorkLog.getEditorStats(req.params.editorId);
  return success(res, 200, result, 'Editor stats retrieved');
}));

// ==========================================
// 4. VIDEO REVIEWS
// ==========================================

router.post('/tasks/:id/review', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const reviewId = await VideoReview.createReview({
    task_id: req.params.id,
    reviewer: req.user?.id,
    comments: req.body.comments,
    overall_rating: req.body.overall_rating,
    approve: req.body.approve || 0,
    reject: req.body.reject || 0,
    required_revisions: req.body.required_revisions || 0,
  });
  return success(res, 201, { reviewId }, 'Review created');
}));

router.get('/tasks/:id/reviews', authenticate, requireRole('*'), asyncHandler(async (req, res) => {
  const result = await VideoReview.getReviews({ task_id: req.params.id });
  return success(res, 200, result, 'Reviews retrieved');
}));

router.get('/tasks/:id/reviews/count', authenticate, requireRole('*'), asyncHandler(async (req, res) => {
  const result = await VideoReview.getTaskReviewsCount(req.params.id);
  return success(res, 200, result, 'Review counts retrieved');
}));

// ==========================================
// 5. VIDEO REVISIONS
// ==========================================

router.post('/tasks/:id/revisions', authenticate, requireRole('VIDEO_EDITOR'), asyncHandler(async (req, res) => {
  const revisionId = await VideoRevision.createRevision({
    task_id: req.params.id,
    version_number: req.body.version_number,
    previous_version: req.body.previous_version,
    video_url: req.body.video_url,
    revision_notes: req.body.revision_notes,
    revised_by: req.user?.id,
  });
  return success(res, 201, { revisionId }, 'Revision created');
}));

router.get('/tasks/:id/revisions', authenticate, requireRole('*'), asyncHandler(async (req, res) => {
  const result = await VideoRevision.getRevisions({ task_id: req.params.id });
  return success(res, 200, result, 'Revisions retrieved');
}));

router.patch('/revisions/:id/approve', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const approved = await VideoRevision.approveRevision(req.params.id, req.user?.id);
  return success(res, 200, { approved }, 'Revision approved');
}));

router.patch('/revisions/:id/reject', authenticate, requireRole('MANAGER', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const rejected = await VideoRevision.rejectRevision(req.params.id, req.user?.id, req.body?.reason);
  return success(res, 200, { rejected }, 'Revision rejected');
}));

// ==========================================
// 6. VIDEO DELIVERIES
// ==========================================

router.post('/tasks/:id/delivery', authenticate, requireRole('VIDEO_EDITOR'), asyncHandler(async (req, res) => {
  const deliveryId = await VideoDelivery.createDelivery({
    task_id: req.params.id,
    delivered_by: req.user?.id,
    client_approved: req.body.client_approved,
    client_comments: req.body.client_comments,
    payment_amount: req.body.payment_amount,
    payment_status: req.body.payment_status || 'Unpaid',
  });
  await VideoTask.updateTaskStatus(req.params.id, 'Delivered', req.user?.id);
  return success(res, 201, { deliveryId }, 'Delivery created');
}));

router.get('/tasks/:id/deliveries', authenticate, requireRole('*'), asyncHandler(async (req, res) => {
  const result = await VideoDelivery.getDeliveries({ task_id: req.params.id });
  return success(res, 200, result, 'Deliveries retrieved');
}));

router.patch('/deliveries/:id/payment', authenticate, requireRole('FINANCE', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const updated = await VideoDelivery.updatePayment(req.params.id, req.body.paymentStatus, req.body.paymentRef);
  return success(res, 200, { updated }, 'Payment status updated');
}));

// ==========================================
// 7. TASK COMMISSION
// ==========================================

router.post(
  '/tasks/:id/commission',
  authenticate,
  requireRole('MANAGER', 'SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const task = await VideoTask.getTaskById(req.params.id);
    if (!task) throw new NotFoundError('Video task not found');
    if (task.status !== 'Delivered') throw new ValidationError('Task not delivered yet');

    const hourlyRate = 500;
    const commissionAmount = parseFloat((task.estimated_hours * hourlyRate * 0.15).toFixed(2));

    const [commission] = await pool.execute(
      `INSERT INTO sales_commissions 
        (deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, created_by)
       VALUES (?, ?, ?, ?, ?, 'Pending Approval', ?)`,
      [task.id, task.assigned_editor, commissionAmount, 15.00, commissionAmount, req.user?.id]
    );

    return success(res, 200, { 
      commissionId: commission.insertId, 
      commissionAmount, 
      eligibleAmount: commissionAmount,
      rate: 15.00 
    }, 'Video task commission calculated');
  })
);

export default router;