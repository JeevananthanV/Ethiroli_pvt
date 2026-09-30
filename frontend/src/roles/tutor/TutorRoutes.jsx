import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';

// Lazy-loaded Tutor Pages
const TutorDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const TutorCourses = lazy(() => import('./pages/Courses.jsx'));
const TutorBatches = lazy(() => import('./pages/Batches.jsx'));
const TutorCurriculum = lazy(() => import('./pages/CourseCurriculum.jsx'));
const TutorAssignments = lazy(() => import('./pages/Assignments.jsx'));
const TutorQuestionBank = lazy(() => import('./pages/QuestionBank.jsx'));
const TutorStudents = lazy(() => import('./pages/Students.jsx'));
const TutorForum = lazy(() => import('./pages/Forum.jsx'));
const TutorCommunications = lazy(() => import('./pages/Communications.jsx'));
const TutorCalendar = lazy(() => import('./pages/Calendar.jsx'));
const TutorProfile = lazy(() => import('../../common/components/RoleProfile/RoleProfile.jsx'));

/**
 * TutorRoutes - route tree for the Tutor / Teaching portal.
 * Mounted at `/app/tutor/*` by AdminApp (shared console) and by TutorApp (tutor.html).
 */
export default function TutorRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading tutor portal..." />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="courses" element={<TutorCourses />} />
        <Route path="batches" element={<TutorBatches />} />
        <Route path="curriculum" element={<TutorCurriculum />} />
        <Route path="assignments" element={<TutorAssignments />} />
        <Route path="question-bank" element={<TutorQuestionBank />} />
        <Route path="students" element={<TutorStudents />} />
        <Route path="forum" element={<TutorForum />} />
        <Route path="communications" element={<TutorCommunications />} />
        <Route path="calendar" element={<TutorCalendar />} />
        <Route path="profile" element={<TutorProfile title="Tutor Faculty Profile" subtitle="Manage your academic credentials, profile photo, and teaching security access" />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
