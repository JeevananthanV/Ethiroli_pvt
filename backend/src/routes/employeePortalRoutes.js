import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import * as controller from '../controllers/employeePortalController.js';
import * as passwordChangeController from '../controllers/passwordChangeController.js';

const router = express.Router();

// NOTE: there are deliberately NO public routes in this file.
//
// The employee password-recovery endpoints live in authRoutes.js
// (`POST /v1/auth/password-recovery/*`) instead. They cannot be declared here
// even with `router.use(authenticate)` moved below them, because
// routes/index.js mounts `employeeRoutes` at `/v1` (line 127) and that router
// calls a path-less `router.use(authenticate)`. Every /v1/* request therefore
// hits an authentication check before it can ever reach this router, so any
// route added here would be unreachable without a session - which defeats the
// entire purpose of a forgot-password flow. authRoutes is mounted earlier
// (line 104), ahead of that catch-all.
//
// See passwordRecoveryController.js for how the flow is kept safe without a
// session: it can only create and inspect a reviewable request, and setting a
// password still needs an ADMIN / SUPER_ADMIN / HR approval that is short-lived
// and single-use.

router.use(authenticate);

// Role gate. This router previously had authentication only, so any
// authenticated principal (STUDENT, INTERN, CLIENT, VENDOR, RECEPTION) could
// read the whole employee surface - payslips, profile, documents, attendance,
// messages. EMPLOYEE is the intended role; ADMIN / SUPER_ADMIN are kept so an
// administrator can still open /app/employee/* from the shared console.
// No other portal calls /v1/employee/* - hrApi and receptionApi use
// /v1/employees, which is a separate router - so this is employee-scoped.
router.use(requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'));

// 1. Dashboard
router.get('/dashboard', controller.getDashboardOverview);

// 2. Attendance & Punch
// Punch supports multiple work sessions per day; punches are server-timestamped.
router.post('/attendance/punch', controller.punchAttendance);
router.get('/attendance/today', controller.getTodayAttendance);
// Registered before /attendance so the month query is matched as its own path.
// Scoped to the authenticated employee server-side (no user id parameter).
router.get('/attendance/monthly', controller.getMonthlyAttendance);
router.get('/attendance', controller.getAttendanceHistory);

// 3. Leaves
router.get('/leaves', controller.getLeavesAndBalances);
router.post('/leaves', controller.applyLeave);

// 4. Tasks & Projects
router.get('/tasks', controller.getAssignedTasks);
router.patch('/tasks/:id/status', controller.updateTaskStatus);
router.get('/projects', controller.getMyProjects);

// 5. Training & Development
router.get('/courses', controller.getEnrolledCourses);
router.get('/assignments', controller.getAssignments);

// 6. Documents, Payslips, and Profile
router.get('/documents', controller.getPersonalDocuments);
router.post('/documents', controller.uploadPersonalDocument);
router.get('/payslips', controller.getMyPayslips);
router.get('/profile', controller.getMyProfile);
router.patch('/profile', controller.updateMyProfile);

// 7. Support & Tickets
router.get('/support', controller.getSupportTickets);
router.post('/support', controller.createSupportTicket);

// 8. Communication & Governance
router.get('/announcements', controller.getAnnouncements);
router.get('/approvals', controller.getMyApprovals);
router.get('/achievements', controller.getAchievements);

// 10. Password change (approval workflow)
// Not self-service by clicking a link: the employee raises a request, an
// ADMIN / SUPER_ADMIN / HR reviews it, and only an approved, unexpired, unused
// grant lets that employee set a new password.
router.post('/password-change-request', passwordChangeController.requestPasswordChange);
router.get('/password-change-request', passwordChangeController.getMyPasswordChangeRequest);
router.post('/password-change', passwordChangeController.changePasswordWithApproval);
router.get('/messages', controller.getMessages);
router.get('/messages/contacts', controller.getMessageContacts);
router.post('/messages', controller.sendMessage);

export default router;
