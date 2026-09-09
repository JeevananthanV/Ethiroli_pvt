import Lesson from '../models/Lesson.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listLessons = asyncHandler(async (req, res) => {
  const list = await Lesson.listByModuleId(req.params.moduleId);
  return success(res, 200, list, 'Lessons retrieved');
});

export const createLesson = asyncHandler(async (req, res) => {
  const id = await Lesson.create({ ...req.body, module_id: req.params.moduleId });
  broadcastToRole('STUDENT', 'course_content_updated', { moduleId: req.params.moduleId });
  return success(res, 201, { id }, 'Lesson created successfully');
});

export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new NotFoundError('Lesson not found');
  return success(res, 200, lesson, 'Lesson retrieved');
});

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new NotFoundError('Lesson not found');
  await Lesson.update(req.params.id, req.body);
  broadcastToRole('STUDENT', 'course_content_updated', { lessonId: req.params.id });
  return success(res, 200, null, 'Lesson updated successfully');
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new NotFoundError('Lesson not found');
  await Lesson.delete(req.params.id);
  return success(res, 200, null, 'Lesson deleted successfully');
});
