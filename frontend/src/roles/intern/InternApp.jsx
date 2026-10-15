import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager or Lazy Page Components for Intern Portal
const InternDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const InternProfile = lazy(() => import('./pages/Profile.jsx'));
const InternAttendance = lazy(() => import('./pages/Attendance.jsx'));
const InternTasks = lazy(() => import('./pages/Tasks.jsx'));
const InternProjects = lazy(() => import('./pages/Projects.jsx'));
const InternAssignments = lazy(() => import('./pages/Assignments.jsx'));
const InternWorkLog = lazy(() => import('./pages/WorkLog.jsx'));
const InternTrainingPlan = lazy(() => import('./pages/TrainingPlan.jsx'));
const InternCourses = lazy(() => import('./pages/Courses.jsx'));
const InternDocuments = lazy(() => import('./pages/Documents.jsx'));
const InternAchievements = lazy(() => import('./pages/Achievements.jsx'));
const InternCertificates = lazy(() => import('./pages/Certificates.jsx'));
const InternMentor = lazy(() => import('./pages/Mentor.jsx'));
const InternFeedback = lazy(() => import('./pages/Feedback.jsx'));
const InternCalendar = lazy(() => import('./pages/Calendar.jsx'));
const InternNotifications = lazy(() => import('./pages/Notifications.jsx'));
const InternMessages = lazy(() => import('./pages/Messages.jsx'));
const InternHelp = lazy(() => import('./pages/Help.jsx'));
// Head of Interns cohort view. Separate from the individual dashboard and
// only rendered for an account flagged is_intern_head (the backend enforces
// the same rule on the route).
const InternHead = lazy(() => import('./pages/InternHead.jsx'));

function InternLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '350px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading module...</span>
      </div>
    </div>
  );
}

/**
 * InternApp - Dedicated modular router and application controller
 * for the Intern Management System (IMS).
 */
export default function InternApp() {
  return (
    <Suspense fallback={<InternLoader />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InternDashboard />} />
        <Route path="profile" element={<InternProfile />} />
        <Route path="attendance" element={<InternAttendance />} />
        <Route path="tasks" element={<InternTasks />} />
        <Route path="projects" element={<InternProjects />} />
        <Route path="assignments" element={<InternAssignments />} />
        <Route path="training-plan" element={<InternTrainingPlan />} />
        <Route path="training" element={<InternTrainingPlan />} />
        <Route path="courses" element={<InternCourses />} />
        <Route path="documents" element={<InternDocuments />} />
        <Route path="achievements" element={<InternAchievements />} />
        <Route path="certificates" element={<InternCertificates />} />
        <Route path="certificate" element={<InternCertificates />} />
        <Route path="cert" element={<InternCertificates />} />
        <Route path="work-log" element={<InternWorkLog />} />
        <Route path="worklog" element={<InternWorkLog />} />
        <Route path="mentor" element={<InternMentor />} />
        <Route path="doubts" element={<InternMentor />} />
        <Route path="feedback" element={<InternFeedback />} />
        <Route path="calendar" element={<InternCalendar />} />
        <Route path="notifications" element={<InternNotifications />} />
        <Route path="messages" element={<InternMessages />} />
        <Route path="help" element={<InternHelp />} />
        <Route path="head" element={<InternHead />} />
        <Route path="interns" element={<InternHead />} />
        {/* Absolute on purpose. A relative to="dashboard" inside the splat
            route resolves against the matched path, so an unknown URL such as
            /app/intern/typo became /app/intern/typo/dashboard, matched "*"
            again and looped forever, growing the URL without bound. */}
        <Route path="*" element={<Navigate to="/app/intern/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
