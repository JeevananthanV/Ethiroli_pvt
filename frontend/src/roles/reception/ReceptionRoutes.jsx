import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';

// Lazy-loaded Reception Pages
const ReceptionDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const ReceptionEnquiries = lazy(() => import('./pages/Enquiries.jsx'));
const ReceptionLeads = lazy(() => import('./pages/Leads.jsx'));
const ReceptionVisitors = lazy(() => import('./pages/Visitors.jsx'));
const ReceptionFollowUps = lazy(() => import('./pages/FollowUps.jsx'));
const ReceptionStudents = lazy(() => import('./pages/Students.jsx'));
const ReceptionInterns = lazy(() => import('./pages/Interns.jsx'));
const ReceptionEmployees = lazy(() => import('./pages/Employees.jsx'));
const ReceptionAdmissions = lazy(() => import('./pages/Admissions.jsx'));
const ReceptionAttendance = lazy(() => import('./pages/Attendance.jsx'));
const ReceptionRegistration = lazy(() => import('./pages/Registration.jsx'));
const ReceptionAppointments = lazy(() => import('./pages/Appointments.jsx'));
const ReceptionCalendar = lazy(() => import('./pages/Calendar.jsx'));
const ReceptionDocuments = lazy(() => import('./pages/Documents.jsx'));
const ReceptionPayments = lazy(() => import('./pages/Payments.jsx'));
const ReceptionReceipts = lazy(() => import('./pages/Receipts.jsx'));
const ReceptionCommunications = lazy(() => import('./pages/Communications.jsx'));
const ReceptionAnnouncements = lazy(() => import('./pages/Announcements.jsx'));
const ReceptionNotifications = lazy(() => import('./pages/Notifications.jsx'));
const ReceptionReports = lazy(() => import('./pages/Reports.jsx'));
const ReceptionProfile = lazy(() => import('./pages/Profile.jsx'));

/**
 * ReceptionRoutes - route tree for the Reception portal.
 * Mounted at `/app/reception/*` by AdminApp (shared console) and by ReceptionApp (reception.html).
 */
export default function ReceptionRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading reception portal..." />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ReceptionDashboard />} />
        <Route path="enquiries" element={<ReceptionEnquiries />} />
        <Route path="leads" element={<ReceptionLeads />} />
        <Route path="visitors" element={<ReceptionVisitors />} />
        <Route path="follow-ups" element={<ReceptionFollowUps />} />
        <Route path="students" element={<ReceptionStudents />} />
        <Route path="interns" element={<ReceptionInterns />} />
        <Route path="employees" element={<ReceptionEmployees />} />
        <Route path="admissions" element={<ReceptionAdmissions />} />
        <Route path="attendance" element={<ReceptionAttendance />} />
        <Route path="registration" element={<ReceptionRegistration />} />
        <Route path="appointments" element={<ReceptionAppointments />} />
        <Route path="calendar" element={<ReceptionCalendar />} />
        <Route path="documents" element={<ReceptionDocuments />} />
        <Route path="payments" element={<ReceptionPayments />} />
        <Route path="receipts" element={<ReceptionReceipts />} />
        <Route path="communications" element={<ReceptionCommunications />} />
        <Route path="announcements" element={<ReceptionAnnouncements />} />
        <Route path="notifications" element={<ReceptionNotifications />} />
        <Route path="reports" element={<ReceptionReports />} />
        <Route path="profile" element={<ReceptionProfile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
