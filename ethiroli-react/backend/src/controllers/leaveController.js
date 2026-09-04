import Leave from '../models/Leave.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';

export const listLeaves = async (req, res) => {
  try {
    const user_id = ['EMPLOYEE', 'INTERN'].includes(req.user.role) ? req.user.id : req.query.user_id;
    const list = await Leave.list({ status: req.query.status, user_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    await Leave.create({ ...req.body, user_id: req.user.id });
    broadcastToRole('HR', 'leave_applied', { user_id: req.user.id, name: req.user.full_name });
    res.status(201).json({ message: 'Leave request submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Leave.updateStatus(req.params.id, status, req.user.id);
    const leave = await Leave.findById(req.params.id);
    if (leave) {
      broadcastToUser(leave.user_id, 'leave_approved', { id: req.params.id, status });
    }
    res.status(200).json({ message: 'Leave status updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
