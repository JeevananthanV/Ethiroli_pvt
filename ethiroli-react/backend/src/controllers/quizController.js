import Quiz from '../models/Quiz.js';
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
  return success(res, 200, null, 'Quiz updated successfully');
});

export const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');
  await Quiz.update(req.params.id, { is_published: true });
  return success(res, 200, null, 'Quiz published');
});

export const unpublishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');
  await Quiz.update(req.params.id, { is_published: false });
  return success(res, 200, null, 'Quiz unpublished');
});
