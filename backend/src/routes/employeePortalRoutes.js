import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/employeePortalController.js';

const router = express.Router();

// Enforce authentication across all employee portal routes
router.use(authenticate);

// 1. Dashboard
router.get('/dashboard', controller.getDashboardOverview);

// 2. Attendance & Punch
// Punch supports multiple work sessions per day; punches are server-timestamped.
router.post('/attendance/punch', controller.punchAttendance);
router.get('/attendance/today', controller.getTodayAttendance);
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
router.get('/messages', controller.getMessages);
router.get('/messages/contacts', controller.getMessageContacts);
router.post('/messages', controller.sendMessage);

export default router;
