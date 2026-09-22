import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const listAssignments = asyncHandler(async (req, res) => {
  const { course_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Assignment.list({ course_id, limit: parseInt(limit), offset }),
    Assignment.count({ course_id })
  ]);

  return success(res, 200, items, 'Assignments retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createAssignment = asyncHandler(async (req, res) => {
  const id = await Assignment.create(req.body);
  return success(res, 201, { id }, 'Assignment created successfully');
});

export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new NotFoundError('Assignment not found');
  return success(res, 200, assignment, 'Assignment retrieved');
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new NotFoundError('Assignment not found');
  await Assignment.update(req.params.id, req.body);
  return success(res, 200, null, 'Assignment updated successfully');
});

export const listSubmissions = asyncHandler(async (req, res) => {
  const { assignment_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    AssignmentSubmission.list({ assignment_id, limit: parseInt(limit), offset }),
    AssignmentSubmission.count({ assignment_id })
  ]);

  return success(res, 200, items, 'Submissions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const gradeSubmission = asyncHandler(async (req, res) => {
  const submission = await AssignmentSubmission.findById(req.params.submissionId);
  if (!submission) throw new NotFoundError('Submission not found');
  await AssignmentSubmission.update(req.params.submissionId, {
    grade: req.body.grade,
    feedback: req.body.feedback,
    graded_by: req.user.id
  });
  return success(res, 200, null, 'Submission graded');
});
