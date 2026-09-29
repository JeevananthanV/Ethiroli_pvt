import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import QuestionBank from '../models/QuestionBank.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToRoom } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import pool from '../config/database.js';

const STAFF_ROLES = ['TUTOR', 'ADMIN', 'SUPER_ADMIN'];
/** Staff may see answer keys and unpublished quizzes; everyone else gets the student view. */
const isStaff = (user) => STAFF_ROLES.includes(user?.role);

export const listQuizzes = asyncHandler(async (req, res) => {
  const { course_id, is_published, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Learners only ever see published quizzes, no matter what they pass in.
  const publishedFilter =
    is_published !== undefined ? is_published === 'true' : isStaff(req.user) ? undefined : true;

  const [items, countRow] = await Promise.all([
    Quiz.list({ course_id, is_published: publishedFilter, limit: parseInt(limit), offset }),
    Quiz.count({ course_id, is_published: publishedFilter })
  ]);

  // Attach questions count for each quiz
  const enriched = await Promise.all(
    items.map(async (q) => {
      const [resCount] = await pool.execute(
        'SELECT COUNT(*) as q_count FROM quiz_questions WHERE quiz_id = ?',
        [q.id]
      );
      return {
        ...q,
        questions_count: resCount[0]?.q_count || 0
      };
    })
  );

  return success(res, 200, enriched, 'Quizzes retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const id = await Quiz.create(req.body);

  if (Array.isArray(req.body.question_ids) && req.body.question_ids.length > 0) {
    await Quiz.attachQuestions(id, req.body.question_ids);
  }

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

  // Answer keys are staff-only: learners receive the same stripped payload /take returns.
  const questions = isStaff(req.user)
    ? await Quiz.getQuestionsWithAnswers(req.params.id)
    : await Quiz.getQuestionsForStudent(req.params.id);

  return success(res, 200, { ...quiz, questions }, 'Quiz retrieved');
});

export const getQuizForTake = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');

  // Strip answer keys: student receives questions with option choices only
  const questions = await Quiz.getQuestionsForStudent(req.params.id);
  return success(res, 200, { ...quiz, questions }, 'Quiz prepared for student attempt');
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const quizId = req.params.id;
  const studentId = req.user.id;
  const { answers = {}, time_taken_seconds = 0 } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new NotFoundError('Quiz not found');

  // Fetch verified questions with correct options
  const questions = await Quiz.getQuestionsWithAnswers(quizId);
  if (questions.length === 0) {
    throw new BadRequestError('This quiz does not contain any questions yet.');
  }

  let earnedPoints = 0;
  let totalPoints = 0;
  const itemizedResults = [];

  for (const q of questions) {
    const qPoints = q.points || 1;
    totalPoints += qPoints;

    const studentAnswer = answers[q.id];
    let isCorrect = false;

    if (q.question_type === 'MULTI_SELECT') {
      const correctOptionIds = q.options.filter(o => o.is_correct).map(o => o.id);
      const studentSelected = Array.isArray(studentAnswer) ? studentAnswer : [];
      const matchAll = correctOptionIds.length === studentSelected.length &&
        correctOptionIds.every(id => studentSelected.includes(id));
      if (matchAll) {
        isCorrect = true;
      }
    } else {
      // Single select / MCQ / True-False
      const correctOption = q.options.find(o => o.is_correct);
      if (correctOption && studentAnswer === correctOption.id) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      earnedPoints += qPoints;
    }

    itemizedResults.push({
      question_id: q.id,
      question_text: q.question_text,
      is_correct: isCorrect,
      points_earned: isCorrect ? qPoints : 0,
      points_max: qPoints,
      explanation: q.explanation
    });
  }

  const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const isPassed = scorePercentage >= (quiz.passing_score || 70);

  const attemptId = await QuizAttempt.create({
    quiz_id: quizId,
    student_id: studentId,
    score: scorePercentage,
    total_questions: questions.length,
    time_taken_seconds,
    answers: { answers, itemizedResults }
  });

  return success(res, 200, {
    attempt_id: attemptId,
    quiz_id: quizId,
    score: scorePercentage,
    earned_points: earnedPoints,
    total_points: totalPoints,
    passing_score: quiz.passing_score || 70,
    is_passed: isPassed,
    total_questions: questions.length,
    time_taken_seconds,
    itemized_results: itemizedResults
  }, 'Quiz submitted and evaluated successfully');
});

export const getQuizResults = asyncHandler(async (req, res) => {
  const quizId = req.params.id;
  const studentId = req.user.role === 'STUDENT' ? req.user.id : req.query.student_id;

  const attempts = await QuizAttempt.list({ quiz_id: quizId, student_id: studentId, limit: 10 });
  return success(res, 200, attempts, 'Quiz attempts retrieved');
});

export const attachQuestions = asyncHandler(async (req, res) => {
  const quizId = req.params.id;
  const { question_ids } = req.body;

  if (!Array.isArray(question_ids) || question_ids.length === 0) {
    throw new BadRequestError('question_ids must be a non-empty array');
  }

  await Quiz.attachQuestions(quizId, question_ids);
  return success(res, 200, null, 'Questions attached to quiz');
});

export const detachQuestion = asyncHandler(async (req, res) => {
  const { id, questionId } = req.params;
  await Quiz.detachQuestion(id, questionId);
  return success(res, 200, null, 'Question detached from quiz');
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');

  await Quiz.update(req.params.id, req.body);
  broadcastToRole('TUTOR', 'quiz_updated', { id: req.params.id });
  return success(res, 200, null, 'Quiz updated successfully');
});

export const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');

  await Quiz.update(req.params.id, { is_published: true });
  broadcastToRole('TUTOR', 'quiz_published', { id: req.params.id });
  broadcastToRoom(`course:${quiz.course_id}`, 'quiz_published', { quizId: req.params.id, courseId: quiz.course_id });
  return success(res, 200, null, 'Quiz published');
});

export const unpublishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');

  await Quiz.update(req.params.id, { is_published: false });
  broadcastToRole('TUTOR', 'quiz_unpublished', { id: req.params.id });
  return success(res, 200, null, 'Quiz unpublished');
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new NotFoundError('Quiz not found');

  await Quiz.delete(req.params.id);
  broadcastToRole('TUTOR', 'quiz_deleted', { id: req.params.id });
  return success(res, 200, null, 'Quiz deleted successfully');
});
