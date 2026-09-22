import pool from '../config/database.js';
import Batch from '../models/Batch.js';
import Doubt from '../models/Doubt.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Attendance from '../models/Attendance.js';
import UserBadge from '../models/UserBadge.js';
import Certificate from '../models/Certificate.js';
import { broadcastToRoom, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { ROLES } from '../config/constants.js';

// 1. Unified LMS Overview
export const getLMSOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role === ROLES.STUDENT || role === ROLES.INTERN) {
    // Student Perspective
    const [
      [enrolledCourses],
      studentBatches,
      [upcomingQuizzes],
      [upcomingAssignments],
      [attendanceStats],
      unresolvedDoubts,
      badges,
      certificates
    ] = await Promise.all([
      pool.execute(
        `SELECT e.*, c.name, c.code, c.description, c.duration_days, c.fee
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         WHERE e.student_id = ? AND e.status = 'ACTIVE'`,
        [userId]
      ),
      Batch.listStudentBatches(userId),
      pool.execute(
        `SELECT q.id, q.title, q.time_limit_minutes, q.passing_score, c.name as course_name
         FROM quizzes q
         JOIN courses c ON q.course_id = c.id
         JOIN enrollments e ON c.id = e.course_id
         WHERE e.student_id = ? AND q.is_published = TRUE
         LIMIT 5`,
        [userId]
      ),
      pool.execute(
        `SELECT a.id, a.title, a.due_date, a.max_score, c.name as course_name,
                s.status as submission_status, s.grade
         FROM assignments a
         JOIN courses c ON a.course_id = c.id
         JOIN enrollments e ON c.id = e.course_id
         LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
         WHERE e.student_id = ? AND (a.due_date >= CURDATE() OR s.id IS NULL)
         ORDER BY a.due_date ASC
         LIMIT 5`,
        [userId, userId]
      ),
      pool.execute(
        `SELECT 
           COUNT(*) as total_days,
           SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present_days
         FROM attendance 
         WHERE user_id = ?`,
        [userId]
      ),
      Doubt.list({ student_id: userId, status: 'OPEN', limit: 5 }),
      UserBadge.findByUserId(userId),
      Certificate.list({ student_id: userId, limit: 10 })
    ]);

    const totalDays = attendanceStats[0]?.total_days || 0;
    const presentDays = attendanceStats[0]?.present_days || 0;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    return success(res, 200, {
      role: 'STUDENT',
      courses: enrolledCourses,
      batches: studentBatches,
      upcomingQuizzes,
      upcomingAssignments,
      attendance: {
        totalDays,
        presentDays,
        percentage: attendancePercentage
      },
      unresolvedDoubts,
      badgesCount: badges.length,
      certificatesCount: certificates.length
    }, 'Student LMS overview retrieved');
  } else {
    // Tutor / Admin Perspective
    const [
      batches,
      [pendingGrading],
      openDoubts,
      [activeStudentsCount]
    ] = await Promise.all([
      role === ROLES.TUTOR ? Batch.list({ tutor_id: userId }) : Batch.list(),
      pool.execute(
        `SELECT COUNT(*) as count 
         FROM assignment_submissions s 
         WHERE s.grade IS NULL`
      ),
      role === ROLES.TUTOR ? Doubt.list({ assigned_tutor_id: userId, status: 'OPEN' }) : Doubt.list({ status: 'OPEN' }),
      pool.execute(
        `SELECT COUNT(DISTINCT student_id) as count FROM enrollments WHERE status = 'ACTIVE'`
      )
    ]);

    return success(res, 200, {
      role,
      batches,
      pendingGradingCount: pendingGrading[0]?.count || 0,
      openDoubtsCount: openDoubts.length,
      activeStudentsCount: activeStudentsCount[0]?.count || 0,
      recentDoubts: openDoubts.slice(0, 5)
    }, 'Tutor/Admin LMS overview retrieved');
  }
});

// 2. Academic Batches Management
export const getBatches = asyncHandler(async (req, res) => {
  const { course_id, is_active } = req.query;
  const tutorId = req.user.role === ROLES.TUTOR ? req.user.id : req.query.tutor_id;

  const batches = await Batch.list({
    course_id,
    tutor_id: tutorId,
    is_active: is_active !== undefined ? is_active === 'true' : undefined
  });

  return success(res, 200, batches, 'Batches retrieved');
});

export const createBatch = asyncHandler(async (req, res) => {
  const { course_id, tutor_id, batch_code, name, start_date, end_date, max_capacity } = req.body;

  if (!course_id || !batch_code || !name || !start_date || !end_date) {
    throw new BadRequestError('course_id, batch_code, name, start_date, and end_date are required');
  }

  const assignedTutor = tutor_id || req.user.id;
  const id = await Batch.create({
    course_id,
    tutor_id: assignedTutor,
    batch_code,
    name,
    start_date,
    end_date,
    max_capacity
  });

  return success(res, 201, { id, batch_code }, 'Batch created successfully');
});

export const getBatchStudents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const students = await Batch.listStudents(id);
  return success(res, 200, students, 'Batch students retrieved');
});

export const addStudentToBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { student_id } = req.body;

  if (!student_id) throw new BadRequestError('student_id is required');

  const result = await Batch.addStudent(id, student_id);
  return success(res, 201, result, 'Student enrolled in batch');
});

// 3. Batch Attendance Roll-Call
export const getBatchAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date = new Date().toISOString().slice(0, 10) } = req.query;

  const [rows] = await pool.execute(
    `SELECT bs.student_id, u.full_name as student_name, u.email as student_email,
            a.id as attendance_id, a.status, a.check_in_time, a.check_out_time, a.is_late
     FROM batch_students bs
     JOIN users u ON bs.student_id = u.id
     LEFT JOIN attendance a ON bs.student_id = a.user_id AND a.date = ?
     WHERE bs.batch_id = ?
     ORDER BY u.full_name ASC`,
    [date, id]
  );

  return success(res, 200, rows, 'Batch attendance log retrieved');
});

export const markBatchAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date = new Date().toISOString().slice(0, 10), records } = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    throw new BadRequestError('records must be an array of { student_id, status }');
  }

  for (const item of records) {
    await pool.execute(
      `INSERT INTO attendance (user_id, date, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [item.student_id, date, item.status || 'PRESENT']
    );
  }

  broadcastToRoom(`batch:${id}`, 'attendance_updated', { batchId: id, date });
  return success(res, 200, null, 'Batch attendance recorded successfully');
});

// 4. Doubt Management Engine
export const getDoubts = asyncHandler(async (req, res) => {
  const { course_id, status } = req.query;
  const studentId = req.user.role === ROLES.STUDENT ? req.user.id : undefined;

  const doubts = await Doubt.list({
    student_id: studentId,
    course_id,
    status
  });

  return success(res, 200, doubts, 'Doubts retrieved');
});

export const submitDoubt = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { course_id, lesson_id, title, description, code_snippet, screenshot_url } = req.body;

  if (!course_id || !title || !description) {
    throw new BadRequestError('course_id, title, and description are required');
  }

  const id = await Doubt.create({
    student_id: studentId,
    course_id,
    lesson_id,
    title,
    description,
    code_snippet,
    screenshot_url
  });

  // Broadcast real-time alert to course tutors and peers
  broadcastToRoom(`course:${course_id}`, 'doubt_created', {
    doubtId: id,
    studentId,
    title,
    courseId: course_id
  });

  return success(res, 201, { id }, 'Doubt submitted successfully');
});

export const resolveDoubt = asyncHandler(async (req, res) => {
  const tutorId = req.user.id;
  const { id } = req.params;
  const { resolution_notes } = req.body;

  if (!resolution_notes) {
    throw new BadRequestError('resolution_notes is required');
  }

  const doubt = await Doubt.findById(id);
  if (!doubt) throw new NotFoundError('Doubt not found');

  await Doubt.resolve(id, {
    assigned_tutor_id: tutorId,
    resolution_notes
  });

  // Notify the student directly
  broadcastToUser(doubt.student_id, 'doubt_resolved', {
    doubtId: id,
    resolution_notes,
    resolvedBy: req.user.full_name || 'Instructor'
  });

  return success(res, 200, { id, status: 'RESOLVED' }, 'Doubt resolved');
});

// 5. Student Performance & Analytics
export const getStudentAnalytics = asyncHandler(async (req, res) => {
  const studentId = req.user.role === ROLES.STUDENT ? req.user.id : (req.query.student_id || req.user.id);

  const [
    [quizScores],
    [assignmentGrades],
    [courseProgress]
  ] = await Promise.all([
    pool.execute(
      `SELECT AVG(score) as average_score, COUNT(*) as attempts_count
       FROM quiz_attempts 
       WHERE student_id = ?`,
      [studentId]
    ),
    pool.execute(
      `SELECT AVG(grade) as average_grade, COUNT(*) as submitted_count
       FROM assignment_submissions 
       WHERE student_id = ? AND grade IS NOT NULL`,
      [studentId]
    ),
    pool.execute(
      `SELECT e.progress_percentage, c.name as course_name 
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id 
       WHERE e.student_id = ?`,
      [studentId]
    )
  ]);

  return success(res, 200, {
    studentId,
    quizzes: {
      averageScore: Math.round(quizScores[0]?.average_score || 0),
      attemptsCount: quizScores[0]?.attempts_count || 0
    },
    assignments: {
      averageGrade: Math.round(assignmentGrades[0]?.average_grade || 0),
      submittedCount: assignmentGrades[0]?.submitted_count || 0
    },
    courseProgress
  }, 'Student analytics retrieved');
});
