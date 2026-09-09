import { validateUUID, sanitizeInput } from '../utils/validators.js';
import LiveQuizSession from '../models/LiveQuizSession.js';
import Quiz from '../models/Quiz.js';
import AuditLog from '../models/AuditLog.js';
import { getIO } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const startLiveQuizSession = asyncHandler(async (req, res) => {
  const { quiz_id } = req.body;
  if (!validateUUID(quiz_id)) {
    throw new ValidationError('Invalid quiz ID format');
  }

  const quiz = await Quiz.findById(quiz_id);
  if (!quiz) {
    throw new NotFoundError('Quiz not found');
  }

  const id = await LiveQuizSession.create({
    quiz_id,
    tutor_id: req.user.id
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'START_LIVE_QUIZ_SESSION',
    entity_type: 'LIVE_QUIZ_SESSION',
    entity_id: id,
    new_value: { quiz_id, tutor_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const io = getIO();
  if (io) {
    io.to(`session:${id}`).emit('live_quiz_started', { sessionId: id, quizId: quiz_id });
  }

  return success(res, 201, { id }, 'Live quiz session started');
});

export const joinLiveQuizSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!validateUUID(sessionId)) {
    throw new ValidationError('Invalid session ID format');
  }

  const session = await LiveQuizSession.findById(sessionId);
  if (!session || !session.is_active) {
    throw new NotFoundError('Live quiz session not found or inactive');
  }

  await LiveQuizSession.incrementParticipants(sessionId);

  const io = getIO();
  if (io) {
    io.to(`session:${sessionId}`).emit('live_quiz_participant_joined', {
      sessionId,
      userId: req.user.id,
      totalParticipants: session.total_participants + 1
    });
  }

  return success(res, 200, { sessionId }, 'Joined live quiz session');
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { question_id, answer } = req.body;
  if (!validateUUID(sessionId)) {
    throw new ValidationError('Invalid session ID format');
  }

  const session = await LiveQuizSession.findById(sessionId);
  if (!session || !session.is_active) {
    throw new NotFoundError('Live quiz session not found or inactive');
  }

  const io = getIO();
  if (io) {
    io.to(`session:${sessionId}`).emit('live_quiz_answer', {
      userId: req.user.id,
      answer: sanitizeInput(answer)
    });
  }

  return success(res, 200, null, 'Answer submitted');
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!validateUUID(sessionId)) {
    throw new ValidationError('Invalid session ID format');
  }

  const session = await LiveQuizSession.findById(sessionId);
  if (!session) {
    throw new NotFoundError('Live quiz session not found');
  }

  return success(res, 200, [], 'Leaderboard retrieved');
});

export const endSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!validateUUID(sessionId)) {
    throw new ValidationError('Invalid session ID format');
  }

  const session = await LiveQuizSession.findById(sessionId);
  if (!session || !session.is_active) {
    throw new NotFoundError('Live quiz session not found or already ended');
  }

  await LiveQuizSession.update(sessionId, {
    ended_at: new Date(),
    is_active: false
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'END_LIVE_QUIZ_SESSION',
    entity_type: 'LIVE_QUIZ_SESSION',
    entity_id: sessionId,
    old_value: { is_active: true },
    new_value: { is_active: false },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const io = getIO();
  if (io) {
    io.to(`session:${sessionId}`).emit('live_quiz_ended', { sessionId });
  }

  return success(res, 200, null, 'Live quiz session ended');
});
