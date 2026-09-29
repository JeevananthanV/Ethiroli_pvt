import Lesson from '../models/Lesson.js';
import LessonBlock from '../models/LessonBlock.js';
import LessonProgress from '../models/LessonProgress.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToRoom } from '../services/socketService.js';
import { awardBadge, issueCourseCompletionCertificate, BADGES } from '../services/certificateService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const listLessons = asyncHandler(async (req, res) => {
  const moduleId = req.params.moduleId || req.query.module_id;
  const isLearner = ['STUDENT', 'INTERN', 'EMPLOYEE'].includes(req.user.role);
  const viewerId = isLearner ? req.user.id : null;

  if (!moduleId) {
    const list = await Lesson.list({ limit: 100 });
    return success(res, 200, list, 'Lessons retrieved');
  }

  const list = await Lesson.listByModuleId(moduleId, viewerId);
  return success(res, 200, list, 'Lessons retrieved');
});

export const createLesson = asyncHandler(async (req, res) => {
  const moduleId = req.params.moduleId || req.body.module_id;
  if (!moduleId) {
    throw new BadRequestError('module_id is required');
  }

  let lessonOrder = req.body.lesson_order || req.body.order;
  if (!lessonOrder) {
    const total = await Lesson.count({ module_id: moduleId });
    lessonOrder = (total + 1) * 10;
  }

  const id = await Lesson.create({
    module_id: moduleId,
    title: req.body.title,
    content: req.body.content || '',
    video_url: req.body.video_url || null,
    lesson_order: lessonOrder
  });

  // If initial content or blocks were provided, create default block
  if (req.body.blocks && Array.isArray(req.body.blocks)) {
    for (let i = 0; i < req.body.blocks.length; i++) {
      const b = req.body.blocks[i];
      await LessonBlock.create({
        lesson_id: id,
        block_type: b.block_type || 'MARKDOWN',
        block_order: i + 1,
        content_payload: b.content_payload || { body: b.content || '' },
        is_interactive: Boolean(b.is_interactive)
      });
    }
  } else if (req.body.video_url) {
    await LessonBlock.create({
      lesson_id: id,
      block_type: 'VIDEO',
      block_order: 1,
      content_payload: { url: req.body.video_url, title: req.body.title },
      is_interactive: false
    });
  }

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_LESSON',
    entity_type: 'LESSON',
    entity_id: id,
    new_value: { ...req.body, module_id: moduleId, lesson_order: lessonOrder },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('STUDENT', 'course_curriculum_updated', { moduleId, lessonId: id });
  return success(res, 201, { id, title: req.body.title, lesson_order: lessonOrder }, 'Lesson created successfully');
});

export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new NotFoundError('Lesson not found');

  const blocks = await LessonBlock.listByLessonId(req.params.id);

  const isLearner = ['STUDENT', 'INTERN', 'EMPLOYEE'].includes(req.user.role);
  const progress = isLearner
    ? await LessonProgress.findByStudentAndLesson(req.user.id, req.params.id)
    : null;

  return success(
    res,
    200,
    {
      ...lesson,
      blocks,
      is_completed: Boolean(progress?.is_completed),
      completed_at: progress?.completed_at || null,
      seconds_watched: progress?.seconds_watched || 0
    },
    'Lesson retrieved'
  );
});

export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new NotFoundError('Lesson not found');

  const updates = {
    title: req.body.title !== undefined ? req.body.title : lesson.title,
    content: req.body.content !== undefined ? req.body.content : lesson.content,
    video_url: req.body.video_url !== undefined ? req.body.video_url : lesson.video_url,
    lesson_order: req.body.lesson_order !== undefined ? req.body.lesson_order : lesson.lesson_order
  };

  await Lesson.update(req.params.id, updates);

  broadcastToRole('STUDENT', 'course_curriculum_updated', { lessonId: req.params.id });
  return success(res, 200, null, 'Lesson updated successfully');
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) throw new NotFoundError('Lesson not found');

  await Lesson.delete(req.params.id);
  return success(res, 200, null, 'Lesson deleted successfully');
});

export const reorderLessons = asyncHandler(async (req, res) => {
  const moduleId = req.params.moduleId || req.body.module_id;
  const lessonIds = req.body.lessonIds || req.body.order;

  if (!moduleId || !Array.isArray(lessonIds)) {
    throw new BadRequestError('moduleId and lessonIds array are required');
  }

  await Lesson.reorder(moduleId, lessonIds);
  return success(res, 200, null, 'Lessons reordered successfully');
});

export const completeLesson = asyncHandler(async (req, res) => {
  const lessonId = req.params.id;
  const studentId = req.user.id;

  const result = await LessonProgress.markComplete(studentId, lessonId);
  if (!result) throw new NotFoundError('Lesson not found');

  // --- Gamification + completion pipeline -------------------------------
  let certificate = null;
  let badgesAwarded = [];

  if (result.completedLessons === 1) {
    const badgeId = await awardBadge(studentId, BADGES.FIRST_LESSON);
    if (badgeId) badgesAwarded.push(BADGES.FIRST_LESSON.name);
  }

  if (Number(result.percentage) === 100) {
    const issued = await issueCourseCompletionCertificate({ studentId, courseId: result.course_id });
    if (issued.certificate) {
      certificate = issued.certificate;
      if (issued.badgeId) badgesAwarded.push(BADGES.COURSE_COMPLETED.name);
    }
  }
  // ----------------------------------------------------------------------

  broadcastToRole('TUTOR', 'student_progress_updated', {
    studentId,
    lessonId,
    courseId: result.course_id,
    percentage: result.percentage
  });
  broadcastToRoom(`course:${result.course_id}`, 'lesson_progress_updated', {
    studentId,
    lessonId,
    courseId: result.course_id,
    percentage: result.percentage
  });

  return success(
    res,
    200,
    { ...result, certificate, badges_awarded: badgesAwarded },
    'Lesson marked as completed'
  );
});

export const getLessonBlocks = asyncHandler(async (req, res) => {
  const blocks = await LessonBlock.listByLessonId(req.params.id);
  return success(res, 200, blocks, 'Lesson blocks retrieved');
});

export const createLessonBlock = asyncHandler(async (req, res) => {
  const lessonId = req.params.id;
  const blockId = await LessonBlock.create({
    lesson_id: lessonId,
    block_type: req.body.block_type || 'MARKDOWN',
    block_order: req.body.block_order || 1,
    content_payload: req.body.content_payload || {},
    is_interactive: Boolean(req.body.is_interactive)
  });

  return success(res, 201, { id: blockId }, 'Lesson block created');
});

export const deleteLessonBlock = asyncHandler(async (req, res) => {
  await LessonBlock.delete(req.params.blockId);
  return success(res, 200, null, 'Lesson block deleted');
});
