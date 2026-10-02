import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';
import './styles/employee-portal.css';

// Lazy-loaded Employee Pages
const EmployeeDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const EmployeeTasks = lazy(() => import('./pages/Tasks.jsx'));
const EmployeeProjects = lazy(() => import('./pages/Projects.jsx'));
const EmployeeAttendance = lazy(() => import('./pages/Attendance.jsx'));
const EmployeeLeaves = lazy(() => import('./pages/Leaves.jsx'));
const EmployeeCalendar = lazy(() => import('./pages/Calendar.jsx'));
const EmployeeTraining = lazy(() => import('./pages/Training.jsx'));
const EmployeeAssignments = lazy(() => import('./pages/Assignments.jsx'));
const EmployeePerformance = lazy(() => import('./pages/Performance.jsx'));
const EmployeeDocuments = lazy(() => import('./pages/Documents.jsx'));
const EmployeePayslips = lazy(() => import('./pages/Payslips.jsx'));
const EmployeeProfile = lazy(() => import('./pages/Profile.jsx'));
const EmployeeApprovals = lazy(() => import('./pages/Approvals.jsx'));
const EmployeeAnnouncements = lazy(() => import('./pages/Announcements.jsx'));
const EmployeeMessages = lazy(() => import('./pages/Messages.jsx'));
const EmployeeNotifications = lazy(() => import('./pages/Notifications.jsx'));
const EmployeeAchievements = lazy(() => import('./pages/Achievements.jsx'));
const EmployeeSupport = lazy(() => import('./pages/Support.jsx'));

/**
 * EmployeeRoutes - route tree for the Employee portal.
 * Mounted at `/app/employee/*` by AdminApp (shared console) and by EmployeeApp (employee.html).
 *
 * The whole tree is wrapped in `.emp-portal`, which scopes the Employee design
 * system (employee-portal.css) to this portal only. The inner `key` forces a
 * remount on navigation so each page replays its entrance animation.
 */
export default function EmployeeRoutes() {
  const location = useLocation();

  return (
    <div className="emp-portal">
      <Suspense fallback={<RouteLoader label="Loading employee portal..." />}>
        <div key={location.pathname}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="projects" element={<EmployeeProjects />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="leaves" element={<EmployeeLeaves />} />
            <Route path="calendar" element={<EmployeeCalendar />} />
            <Route path="training" element={<EmployeeTraining />} />
            <Route path="assignments" element={<EmployeeAssignments />} />
            <Route path="performance" element={<EmployeePerformance />} />
            <Route path="documents" element={<EmployeeDocuments />} />
            <Route path="payslips" element={<EmployeePayslips />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="approvals" element={<EmployeeApprovals />} />
            <Route path="announcements" element={<EmployeeAnnouncements />} />
            <Route path="messages" element={<EmployeeMessages />} />
            <Route path="notifications" element={<EmployeeNotifications />} />
            <Route path="achievements" element={<EmployeeAchievements />} />
            <Route path="support" element={<EmployeeSupport />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </Suspense>
    </div>
  );
}