import QuestionBank from '../models/QuestionBank.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const listQuestions = asyncHandler(async (req, res) => {
  const { course_id, module_id, topic, difficulty, question_type, search, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, total] = await Promise.all([
    QuestionBank.list({ course_id, module_id, topic, difficulty, question_type, search, limit: parseInt(limit), offset }),
    QuestionBank.count({ course_id, module_id, topic, difficulty, question_type, search })
  ]);

  return success(res, 200, items, 'Questions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
  });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { topic, question_text, options } = req.body;
  if (!topic || !question_text) {
    throw new BadRequestError('topic and question_text are required');
  }

  if (!Array.isArray(options) || options.length < 2) {
    throw new BadRequestError('At least 2 options are required');
  }

  const hasCorrect = options.some(o => o.is_correct);
  if (!hasCorrect) {
    throw new BadRequestError('At least one option must be marked as correct (is_correct: true)');
  }

  const id = await QuestionBank.create({
    ...req.body,
    created_by: req.user.id
  });

  return success(res, 201, { id }, 'Question created successfully in Question Bank');
});

export const getQuestion = asyncHandler(async (req, res) => {
  const q = await QuestionBank.findById(req.params.id, true);
  if (!q) throw new NotFoundError('Question not found');
  return success(res, 200, q, 'Question retrieved');
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const q = await QuestionBank.findById(req.params.id);
  if (!q) throw new NotFoundError('Question not found');

  await QuestionBank.delete(req.params.id);
  return success(res, 200, null, 'Question deleted successfully');
});

export const bulkImportQuestions = asyncHandler(async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new BadRequestError('questions array is required');
  }

  // Validate each question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.topic || !q.question_text) {
      throw new BadRequestError(`Question at index ${i} is missing topic or question_text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new BadRequestError(`Question at index ${i} requires at least 2 options`);
    }
  }

  const createdIds = await QuestionBank.bulkCreate(questions, req.user.id);
  return success(res, 201, { count: createdIds.length, ids: createdIds }, 'Questions bulk imported successfully');
});
