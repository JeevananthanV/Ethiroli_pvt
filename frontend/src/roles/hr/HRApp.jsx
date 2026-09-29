import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy-loaded HR Pages
const HRDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const HREmployees = lazy(() => import('./pages/Employees.jsx'));
const HRInterns = lazy(() => import('./pages/Interns.jsx'));
const HRAttendance = lazy(() => import('./pages/Attendance.jsx'));
const HRLeaves = lazy(() => import('./pages/Leaves.jsx'));
const HRInterviews = lazy(() => import('./pages/Interviews.jsx'));
const HRCommunications = lazy(() => import('./pages/Communications.jsx'));
const HRPayroll = lazy(() => import('./pages/Payroll.jsx'));
const HRPerformance = lazy(() => import('./pages/Performance.jsx'));
const HRJobsBoard = lazy(() => import('./pages/JobsBoard.jsx'));
const HROnboarding = lazy(() => import('./pages/Onboarding.jsx'));
const HRTraining = lazy(() => import('./pages/Training.jsx'));
const HRDocuments = lazy(() => import('./pages/Documents.jsx'));
const HRReports = lazy(() => import('./pages/Reports.jsx'));
const HROffboarding = lazy(() => import('./pages/Offboarding.jsx'));
const HRCalendar = lazy(() => import('./pages/Calendar.jsx'));
const HRCareerApplications = lazy(() => import('./pages/CareerApplications.jsx'));
const HRInquiries = lazy(() => import('./pages/Inquiries.jsx'));

function HRLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '350px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading People Operations...</span>
      </div>
    </div>
  );
}

/**
 * HRApp - Dynamic Modular Router for the HR / People Operations Portal
 */
export default function HRApp() {
  return (
    <Suspense fallback={<HRLoader />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="employees" element={<HREmployees />} />
        <Route path="interns" element={<HRInterns />} />
        <Route path="attendance" element={<HRAttendance />} />
        <Route path="leaves" element={<HRLeaves />} />
        <Route path="interviews" element={<HRInterviews />} />
        <Route path="communications" element={<HRCommunications />} />
        <Route path="announcements" element={<HRCommunications />} />
        <Route path="payroll" element={<HRPayroll />} />
        <Route path="performance" element={<HRPerformance />} />
        <Route path="jobs-board" element={<HRJobsBoard />} />
        <Route path="jobs" element={<HRJobsBoard />} />
        <Route path="onboarding" element={<HROnboarding />} />
        <Route path="training" element={<HRTraining />} />
        <Route path="documents" element={<HRDocuments />} />
        <Route path="reports" element={<HRReports />} />
        <Route path="calendar" element={<HRCalendar />} />
        <Route path="offboarding" element={<HROffboarding />} />
        <Route path="exit-offboarding" element={<HROffboarding />} />
        <Route path="applications" element={<HRCareerApplications />} />
        <Route path="career-applications" element={<HRCareerApplications />} />
        <Route path="inquiries" element={<HRInquiries />} />
        <Route path="website-inquiries" element={<HRInquiries />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
