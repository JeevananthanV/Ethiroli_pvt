import Attendance from '../models/Attendance.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';

export const listAttendance = async (req, res) => {
  try {
    const user_id = req.user.role === 'EMPLOYEE' || req.user.role === 'INTERN' ? req.user.id : req.query.user_id;
    const list = await Attendance.list({
      user_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    await Attendance.checkIn(userId);
    broadcastToRole('HR', 'attendance_check_in', { userId, time: new Date() });
    res.status(200).json({ message: 'Checked in successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    await Attendance.checkOut(userId);
    broadcastToRole('HR', 'attendance_check_out', { userId, time: new Date() });
    res.status(200).json({ message: 'Checked out successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const manualCorrect = async (req, res) => {
  try {
    await Attendance.manualCorrect(req.params.id, req.body);
    res.status(200).json({ message: 'Attendance correction saved.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
