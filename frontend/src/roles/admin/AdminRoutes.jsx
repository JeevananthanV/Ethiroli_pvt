import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';

// Admin console pages (owned by roles/admin)
const AdminDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AdminUsers = lazy(() => import('./pages/Users.jsx'));
const AdminTutors = lazy(() => import('./pages/Tutors.jsx'));
const AdminApprovals = lazy(() => import('./pages/Approvals.jsx'));
const AdminLeads = lazy(() => import('./pages/Leads.jsx'));
const AdminCalendar = lazy(() => import('./pages/Calendar.jsx'));
const EventTypeAdmin = lazy(() => import('./pages/EventTypeAdmin.jsx'));
const AdminCommunications = lazy(() => import('./pages/Communications.jsx'));
const AdminJobsBoard = lazy(() => import('./pages/JobsBoard.jsx'));
const AdminReports = lazy(() => import('./pages/Reports.jsx'));
const AdminAIAnalytics = lazy(() => import('./pages/AIAnalytics.jsx'));
const AdminAutomationStudio = lazy(() => import('./pages/AutomationStudio.jsx'));
const AdminIntegrations = lazy(() => import('./pages/Integrations.jsx'));
const AdminDeveloperPortal = lazy(() => import('./pages/DeveloperPortal.jsx'));
const AdminMarketplace = lazy(() => import('./pages/Marketplace.jsx'));
const AdminGamification = lazy(() => import('./pages/Gamification.jsx'));
const AdminAuditLogs = lazy(() => import('./pages/AuditLogs.jsx'));
const AdminSettings = lazy(() => import('./pages/Settings.jsx'));
const AdminMonitoring = lazy(() => import('./pages/Monitoring.jsx'));
const AdminProfile = lazy(() => import('../../common/components/RoleProfile/RoleProfile.jsx'));

// The admin console deliberately reuses the best screen from each specialised role.
const HREmployees = lazy(() => import('../hr/pages/Employees.jsx'));
const HRInterns = lazy(() => import('../hr/pages/Interns.jsx'));
const HRAttendance = lazy(() => import('../hr/pages/Attendance.jsx'));
const HRLeaves = lazy(() => import('../hr/pages/Leaves.jsx'));
const HRPerformance = lazy(() => import('../hr/pages/Performance.jsx'));
const HRDocuments = lazy(() => import('../hr/pages/Documents.jsx'));
const TutorStudents = lazy(() => import('../tutor/pages/Students.jsx'));
const TutorCourses = lazy(() => import('../tutor/pages/Courses.jsx'));
const TutorCurriculum = lazy(() => import('../tutor/pages/CourseCurriculum.jsx'));
const TutorAssignments = lazy(() => import('../tutor/pages/Assignments.jsx'));
const TutorBatches = lazy(() => import('../tutor/pages/Batches.jsx'));
const PMProjects = lazy(() => import('../project-manager/pages/Projects.jsx'));
const PMTeam = lazy(() => import('../project-manager/pages/Team.jsx'));
const PMTasks = lazy(() => import('../project-manager/pages/Tasks.jsx'));
const SalesContacts = lazy(() => import('../sales/pages/Contacts.jsx'));
const SalesOpportunities = lazy(() => import('../sales/pages/Opportunities.jsx'));
const SalesDeals = lazy(() => import('../sales/pages/Deals.jsx'));
const SalesNotifications = lazy(() => import('../sales/pages/Notifications.jsx'));
const FinanceIncome = lazy(() => import('../finance/pages/Income.jsx'));
const FinanceExpenses = lazy(() => import('../finance/pages/Expenses.jsx'));
const FinanceInvoices = lazy(() => import('../finance/pages/Invoices.jsx'));
const FinancePayments = lazy(() => import('../finance/pages/Payments.jsx'));

/**
 * AdminRoutes - route tree for the Admin console (admin.html / AdminApp).
 * Mounted at `/app/admin/*`; keeps the historic 13-domain URL layout.
 */
export default function AdminRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading admin console..." />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Domain 1: Executive Dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Domain 2: PEOPLE */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="employees" element={<HREmployees />} />
        <Route path="interns" element={<HRInterns />} />
        <Route path="students" element={<TutorStudents />} />
        <Route path="tutors" element={<AdminTutors />} />

        {/* Domain 3: LEARNING */}
        <Route path="courses" element={<TutorCourses />} />
        <Route path="curriculum" element={<TutorCurriculum />} />
        <Route path="assignments" element={<TutorAssignments />} />
        <Route path="batches" element={<TutorBatches />} />

        {/* Domain 4: PROJECTS */}
        <Route path="projects" element={<PMProjects />} />
        <Route path="teams" element={<PMTeam />} />
        <Route path="tasks" element={<PMTasks />} />

        {/* Domain 5: HR MANAGEMENT */}
        <Route path="attendance" element={<HRAttendance />} />
        <Route path="leaves" element={<HRLeaves />} />
        <Route path="performance" element={<HRPerformance />} />
        <Route path="approvals" element={<AdminApprovals />} />

        {/* Domain 6: CRM & SALES */}
        <Route path="leads" element={<AdminLeads />} />
        <Route path="contacts" element={<SalesContacts />} />
        <Route path="opportunities" element={<SalesOpportunities />} />
        <Route path="deals" element={<SalesDeals />} />

        {/* Domain 7: FINANCE */}
        <Route path="income" element={<FinanceIncome />} />
        <Route path="expenses" element={<FinanceExpenses />} />
        <Route path="invoices" element={<FinanceInvoices />} />
        <Route path="payments" element={<FinancePayments />} />

        {/* Domain 8: OPERATIONS */}
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="calendar/types" element={<EventTypeAdmin />} />
        <Route path="communications" element={<AdminCommunications />} />
        <Route path="documents" element={<HRDocuments />} />
        <Route path="notifications" element={<SalesNotifications />} />

        {/* Domain 9: RECRUITMENT */}
        <Route path="jobs-board" element={<AdminJobsBoard />} />

        {/* Domain 10: REPORTING */}
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAIAnalytics />} />

        {/* Domain 11: AUTOMATION */}
        <Route path="automation" element={<AdminAutomationStudio />} />
        <Route path="integrations" element={<AdminIntegrations />} />
        <Route path="developer" element={<AdminDeveloperPortal />} />

        {/* Domain 12: ENGAGEMENT */}
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="gamification" element={<AdminGamification />} />

        {/* Domain 13: SECURITY & CONFIG */}
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="monitoring" element={<AdminMonitoring />} />
        <Route path="profile" element={<AdminProfile title="Admin Executive Profile" subtitle="Manage your administrative credentials, avatar image, and security access" />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
