import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';

// Lazy-loaded Student / LMS Pages
const StudentDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const StudentCourses = lazy(() => import('./pages/Courses.jsx'));
const StudentModules = lazy(() => import('./pages/Modules.jsx'));
const StudentCoursePlayer = lazy(() => import('./pages/CoursePlayer.jsx'));
const StudentAssignments = lazy(() => import('./pages/Assignments.jsx'));
const StudentLiveQuiz = lazy(() => import('./pages/LiveQuiz.jsx'));
const StudentQuiz = lazy(() => import('./pages/Quiz.jsx'));
const StudentDoubts = lazy(() => import('./pages/Doubts.jsx'));
const StudentForum = lazy(() => import('./pages/Forum.jsx'));
const StudentProfile = lazy(() => import('./pages/Profile.jsx'));
const StudentProjects = lazy(() => import('./pages/Projects.jsx'));
const StudentMindMap = lazy(() => import('./pages/MindMap.jsx'));
const StudentCertificates = lazy(() => import('./pages/Certificates.jsx'));
const StudentCalendar = lazy(() => import('./pages/Calendar.jsx'));
const StudentAttendance = lazy(() => import('./pages/Attendance.jsx'));

/**
 * StudentRoutes - route tree for the Student LMS portal.
 * Mounted at `/app/student/*` by AdminApp (shared console) and by StudentApp
 * (student.html), so the route list lives in exactly one place.
 */
export default function StudentRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading student portal..." />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="modules" element={<StudentModules />} />
        <Route path="course-player" element={<StudentCoursePlayer />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="live-quiz" element={<StudentLiveQuiz />} />
        <Route path="quiz" element={<StudentQuiz />} />
        <Route path="doubts" element={<StudentDoubts />} />
        <Route path="forum" element={<StudentForum />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="projects" element={<StudentProjects />} />
        <Route path="mindmap" element={<StudentMindMap />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
