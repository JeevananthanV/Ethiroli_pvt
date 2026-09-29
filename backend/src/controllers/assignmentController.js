import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToRoom } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError, ValidationError } from '../utils/errors.js';

/** Roles that consume assignments rather than author them. */
const LEARNER_ROLES = new Set(['STUDENT', 'INTERN', 'EMPLOYEE']);

const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: limit > 0 ? Math.ceil(total / limit) : 1
});

/**
 * Learners only ever see assignments belonging to courses they are enrolled
 * in, each annotated with their own submission. Staff see the raw list and
 * can filter by course.
 */
export const listAssignments = asyncHandler(async (req, res) => {
  const { course_id, page = 1, limit = 50 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const offset = (pageNum - 1) * limitNum;

  if (LEARNER_ROLES.has(req.user.role)) {
    const items = await Assignment.listByStudentId(req.user.id);
    res.locals.meta = buildMeta(1, items.length, items.length);
    return success(res, 200, items, 'Assignments retrieved');
  }

  const [items, countRow] = await Promise.all([
    Assignment.list({ course_id, limit: limitNum, offset }),
    Assignment.count({ course_id })
  ]);

  res.locals.meta = buildMeta(pageNum, limitNum, countRow);
  return success(res, 200, items, 'Assignments retrieved');
});

/** GET /v1/assignments/me - the signed-in learner's assignment workspace. */
export const listMyAssignments = asyncHandler(async (req, res) => {
  const items = await Assignment.listByStudentId(req.user.id);
  res.locals.meta = buildMeta(1, items.length, items.length);
  return success(res, 200, items, 'Assignments retrieved');
});

export const createAssignment = asyncHandler(async (req, res) => {
  const id = await Assignment.create(req.body);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_ASSIGNMENT',
    entity_type: 'ASSIGNMENT',
    entity_id: id,
    new_value: { ...req.body },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  if (req.body.course_id) {
    broadcastToRoom(`course:${req.body.course_id}`, 'assignment_created', { id, course_id: req.body.course_id });
  }
  broadcastToRole('STUDENT', 'assignment_created', { id, course_id: req.body.course_id });

  return success(res, 201, { id }, 'Assignment created successfully');
});

export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new NotFoundError('Assignment not found');

  const isLearner = LEARNER_ROLES.has(req.user.role);
  const submission = isLearner
    ? await AssignmentSubmission.findByAssignmentAndStudent(assignment.id, req.user.id)
    : null;
  const submittedCount = isLearner ? undefined : await AssignmentSubmission.countWithStudents(assignment.id);

  return success(res, 200, { ...assignment, submission, submitted_count: submittedCount }, 'Assignment retrieved');
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new NotFoundError('Assignment not found');
  await Assignment.update(req.params.id, req.body);
  return success(res, 200, null, 'Assignment updated successfully');
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new NotFoundError('Assignment not found');

  await Assignment.delete(req.params.id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_ASSIGNMENT',
    entity_type: 'ASSIGNMENT',
    entity_id: assignment.id,
    old_value: assignment,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Assignment deleted successfully');
});

/** GET /v1/assignments/:id/submissions - roster of who submitted, with grades. */
export const listSubmissions = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id || req.query.assignment_id;
  if (!assignmentId) throw new BadRequestError('assignment id is required');

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new NotFoundError('Assignment not found');

  const items = await AssignmentSubmission.listWithStudents(assignmentId);
  res.locals.meta = buildMeta(1, items.length, items.length);

  return success(
    res,
    200,
    items.map((item) => ({
      ...item,
      max_score: assignment.max_score,
      assignment_title: assignment.title
    })),
    'Submissions retrieved'
  );
});

/**
 * POST /v1/assignments/:id/submissions
 * A learner submits (or re-submits) their work for an assignment.
 */
export const submitAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new NotFoundError('Assignment not found');

  const fileUrl = req.body.file_url || req.body.fileUrl || null;
  const textContent = req.body.text_content || req.body.textContent || null;

  if (!fileUrl && !textContent) {
    throw new ValidationError('Provide either a text response or a file link before submitting.');
  }

  if (assignment.due_date) {
    const due = new Date(`${assignment.due_date}T23:59:59`);
    if (Number.isNaN(due.getTime()) === false && new Date() > due) {
      // Late submissions are allowed but flagged back to the learner.
      res.locals.meta = { late: true };
    }
  }

  const submissionId = await AssignmentSubmission.create({
    assignment_id: assignmentId,
    student_id: req.user.id,
    file_url: fileUrl,
    text_content: textContent
  });

  const submission = await AssignmentSubmission.findById(submissionId);

  broadcastToRole('TUTOR', 'assignment_submitted', {
    assignment_id: assignmentId,
    course_id: assignment.course_id,
    student_id: req.user.id,
    student_name: req.user.full_name
  });
  if (assignment.course_id) {
    broadcastToRoom(`course:${assignment.course_id}`, 'assignment_submitted', {
      assignment_id: assignmentId,
      student_id: req.user.id
    });
  }

  return success(res, 201, submission, 'Assignment submitted successfully');
});

/** GET /v1/assignments/:id/mine - the caller's own submission for an assignment. */
export const getMySubmission = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new NotFoundError('Assignment not found');

  const submission = await AssignmentSubmission.findByAssignmentAndStudent(assignment.id, req.user.id);
  return success(res, 200, submission, 'Submission retrieved');
});

/** PATCH /v1/submissions/:submissionId/grade - score and feedback. */
export const gradeSubmission = asyncHandler(async (req, res) => {
  const submission = await AssignmentSubmission.findById(req.params.submissionId);
  if (!submission) throw new NotFoundError('Submission not found');

  const assignment = await Assignment.findById(submission.assignment_id);
  const maxScore = assignment?.max_score ?? 100;
  const grade = Number(req.body.grade);

  if (!Number.isFinite(grade) || grade < 0 || grade > maxScore) {
    throw new ValidationError(`Grade must be between 0 and ${maxScore}.`);
  }

  await AssignmentSubmission.grade(submission.id, grade, req.body.feedback ?? null);
  await AssignmentSubmission.update(submission.id, { graded_by: req.user.id });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'GRADE_SUBMISSION',
    entity_type: 'ASSIGNMENT_SUBMISSION',
    entity_id: submission.id,
    new_value: { grade, feedback: req.body.feedback ?? null, max_score: maxScore },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('STUDENT', 'assignment_graded', {
    submission_id: submission.id,
    assignment_id: submission.assignment_id,
    student_id: submission.student_id,
    grade,
    max_score: maxScore,
    feedback: req.body.feedback ?? null
  });

  const updated = await AssignmentSubmission.findById(submission.id);
  return success(res, 200, updated, 'Submission graded');
});
