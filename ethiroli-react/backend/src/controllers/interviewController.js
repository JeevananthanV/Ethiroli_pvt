import Interview from '../models/Interview.js';
import { broadcastToRole } from '../services/socketService.js';

export const listInterviews = async (req, res) => {
  try {
    const list = await Interview.list({ interviewer_id: req.query.interviewer_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const id = await Interview.create(req.body);
    res.status(201).json({ message: 'Interview scheduled.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
