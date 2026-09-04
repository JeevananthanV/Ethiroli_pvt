import { broadcastToRoom } from '../services/socketService.js';

export const startLiveQuizSession = async (req, res) => {
  try {
    const sessionId = 'mock-session-123';
    res.status(201).json({ message: 'Live quiz session started.', id: sessionId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinLiveQuizSession = async (req, res) => {
  res.status(200).json({ message: 'Joined live quiz session.' });
};

export const submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    broadcastToRoom(`session:${sessionId}`, 'live_quiz_answer', { userId: req.user.id, answer: req.body.answer });
    res.status(200).json({ message: 'Answer submitted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  res.status(200).json([
    { name: 'Student A', score: 100 },
    { name: 'Student B', score: 80 }
  ]);
};
