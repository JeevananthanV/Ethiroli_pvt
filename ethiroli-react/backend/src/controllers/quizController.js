import Quiz from '../models/Quiz.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listQuizzes = asyncHandler(async (req, res) => {
  const { course_id, is_published, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Quiz.list({ course_id, is_published, limit: parseInt(limit), offset }),
    Quiz.count({ course_id, is_published })
  ]);

  return success(res, 200, items, 'Quizzes retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const id = await Quiz.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_QUIZ',
    entity_type: 'QUIZ',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'quiz_created', { id });
  return success(res, 201, { id }, 'Quiz created successfully');
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');
  return success(res, 200, quiz, 'Quiz retrieved');
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');
  await Quiz.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_QUIZ',
    entity_type: 'QUIZ',
    entity_id: req.params.id,
    old_value: quiz,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'quiz_updated', { id: req.params.id });
  return success(res, 200, null, 'Quiz updated successfully');
});

export const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');
  await Quiz.update(req.params.id, { is_published: true });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'PUBLISH_QUIZ',
    entity_type: 'QUIZ',
    entity_id: req.params.id,
    old_value: quiz,
    new_value: { is_published: true },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'quiz_published', { id: req.params.id });
  return success(res, 200, null, 'Quiz published');
});

export const unpublishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');
  await Quiz.update(req.params.id, { is_published: false });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UNPUBLISH_QUIZ',
    entity_type: 'QUIZ',
    entity_id: req.params.id,
    old_value: quiz,
    new_value: { is_published: false },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'quiz_unpublished', { id: req.params.id });
  return success(res, 200, null, 'Quiz unpublished');
});
