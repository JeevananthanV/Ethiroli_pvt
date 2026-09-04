import Task from '../models/Task.js';
import { broadcastToUser } from '../services/socketService.js';

export const listTasks = async (req, res) => {
  try {
    const assigned_to = req.user.role === 'EMPLOYEE' || req.user.role === 'INTERN' ? req.user.id : req.query.assigned_to;
    const list = await Task.list({ assigned_to, subscription_id: req.query.subscription_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const id = await Task.create(req.body);
    if (req.body.assigned_to) {
      broadcastToUser(req.body.assigned_to, 'task_assigned', { id, description: req.body.description });
    }
    res.status(201).json({ message: 'Task created successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    await Task.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Task status updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
