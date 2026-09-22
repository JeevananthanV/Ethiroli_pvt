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
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
