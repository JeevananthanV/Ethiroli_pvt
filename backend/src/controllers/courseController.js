import Course from '../models/Course.js';
import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const listCourses = asyncHandler(async (req, res) => {
  const { role } = req.user;

  // Scope the catalogue by caller:
  //   TUTOR   -> only courses assigned to them (their "My Courses")
  //   STUDENT -> only published courses (drafts are not enrol-able)
  //   ADMIN+  -> everything, optionally filtered by ?tutor_id / ?is_active
  const tutor_id = role === 'TUTOR' ? req.user.id : req.query.tutor_id;
  const is_active = role === 'STUDENT' ? true : req.query.is_active;

  const list = await Course.list({ tutor_id, is_active });
  return success(res, 200, list);
});

export const createCourse = asyncHandler(async (req, res) => {
  const id = await Course.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_COURSE',
    entity_type: 'COURSE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'course_created', { id });
  return success(res, 201, { id }, 'Course created successfully');
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  return success(res, 200, course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  await Course.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_COURSE',
    entity_type: 'COURSE',
    entity_id: req.params.id,
    old_value: course,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'course_updated', { id: req.params.id });
  return success(res, 200, null, 'Course updated successfully');
});

export const publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  await Course.update(req.params.id, { is_active: true });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'PUBLISH_COURSE',
    entity_type: 'COURSE',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'course_published', { id: req.params.id });
  return success(res, 200, null, 'Course published');
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  await Course.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_COURSE',
    entity_type: 'COURSE',
    entity_id: req.params.id,
    old_value: course,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'course_deleted', { id: req.params.id });
  return success(res, 200, null, 'Course deleted successfully');
});

export const exportCourseCurriculum = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');

  const [modules, quizzes] = await Promise.all([
    pool.execute('SELECT * FROM modules WHERE course_id = ? ORDER BY module_order ASC', [courseId]).then(([r]) => r),
    pool.execute('SELECT * FROM quizzes WHERE course_id = ?', [courseId]).then(([r]) => r)
  ]);

  const curriculum = await Promise.all(
    modules.map(async (m) => {
      const [lessons] = await pool.execute(
        'SELECT * FROM lessons WHERE module_id = ? ORDER BY lesson_order ASC',
        [m.id]
      );
      const lessonsWithBlocks = await Promise.all(
        lessons.map(async (l) => {
          const [blocks] = await pool.execute(
            'SELECT * FROM lesson_blocks WHERE lesson_id = ? ORDER BY block_order ASC',
            [l.id]
          );
          return {
            ...l,
            blocks: blocks.map(b => ({
              ...b,
              content_payload: typeof b.content_payload === 'string' ? JSON.parse(b.content_payload) : b.content_payload
            }))
          };
        })
      );
      return {
        ...m,
        lessons: lessonsWithBlocks
      };
    })
  );

  return success(res, 200, {
    course,
    modules: curriculum,
    quizzes
  }, 'Course curriculum exported successfully');
});

export const importCourseCurriculum = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const { modules } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new NotFoundError('Course not found');

  if (!Array.isArray(modules) || modules.length === 0) {
    throw new BadRequestError('modules array is required');
  }

  const Module = (await import('../models/Module.js')).default;
  const Lesson = (await import('../models/Lesson.js')).default;
  const LessonBlock = (await import('../models/LessonBlock.js')).default;

  let totalModules = 0;
  let totalLessons = 0;

  for (let mIdx = 0; mIdx < modules.length; mIdx++) {
    const mData = modules[mIdx];
    const moduleId = await Module.create({
      course_id: courseId,
      title: mData.title,
      module_order: mData.module_order || (mIdx + 1) * 10
    });
    totalModules++;

    if (Array.isArray(mData.lessons)) {
      for (let lIdx = 0; lIdx < mData.lessons.length; lIdx++) {
        const lData = mData.lessons[lIdx];
        const lessonId = await Lesson.create({
          module_id: moduleId,
          title: lData.title,
          content: lData.content || '',
          video_url: lData.video_url || null,
          lesson_order: lData.lesson_order || (lIdx + 1) * 10
        });
        totalLessons++;

        if (Array.isArray(lData.blocks)) {
          for (let bIdx = 0; bIdx < lData.blocks.length; bIdx++) {
            const bData = lData.blocks[bIdx];
            await LessonBlock.create({
              lesson_id: lessonId,
              block_type: bData.block_type || 'MARKDOWN',
              block_order: bIdx + 1,
              content_payload: bData.content_payload || { body: bData.content || '' },
              is_interactive: Boolean(bData.is_interactive)
            });
          }
        }
      }
    }
  }

  broadcastToRole('TUTOR', 'course_curriculum_updated', { courseId });
  return success(res, 201, { totalModules, totalLessons }, 'Course curriculum imported successfully');
});
