import Lesson from '../models/Lesson.js';
import { broadcastToRole } from '../services/socketService.js';

export const listLessons = async (req, res) => {
  try {
    const list = await Lesson.listByModuleId(req.params.moduleId);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createLesson = async (req, res) => {
  try {
    await Lesson.create({ ...req.body, module_id: req.params.moduleId });
    broadcastToRole('STUDENT', 'course_content_updated', { moduleId: req.params.moduleId });
    res.status(201).json({ message: 'Lesson created successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    await Lesson.update(req.params.id, req.body);
    broadcastToRole('STUDENT', 'course_content_updated', { lessonId: req.params.id });
    res.status(200).json({ message: 'Lesson updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    await Lesson.delete(req.params.id);
    res.status(200).json({ message: 'Lesson deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
