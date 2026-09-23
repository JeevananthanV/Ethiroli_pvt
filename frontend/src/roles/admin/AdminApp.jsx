import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const AdminUsers = lazy(() => import('./pages/Users.jsx'));
const AdminTutors = lazy(() => import('./pages/Tutors.jsx'));
const AdminSettings = lazy(() => import('./pages/Settings.jsx'));
const AdminLeads = lazy(() => import('./pages/Leads.jsx'));
const AdminHR = lazy(() => import('./pages/HR.jsx'));
const AdminLMS = lazy(() => import('./pages/LMS.jsx'));
const AdminPMS = lazy(() => import('./pages/PMS.jsx'));
const AdminFinance = lazy(() => import('./pages/Finance.jsx'));
const AdminAuditLogs = lazy(() => import('./pages/AuditLogs.jsx'));
const AdminApprovals = lazy(() => import('./pages/Approvals.jsx'));
const AdminCalendar = lazy(() => import('./pages/Calendar.jsx'));
const EventTypeAdmin = lazy(() => import('./pages/EventTypeAdmin.jsx'));
const AdminCommunications = lazy(() => import('./pages/Communications.jsx'));
const AdminReports = lazy(() => import('./pages/Reports.jsx'));
const AdminAutomationStudio = lazy(() => import('./pages/AutomationStudio.jsx'));
const AdminAIAnalytics = lazy(() => import('./pages/AIAnalytics.jsx'));
const AdminMarketplace = lazy(() => import('./pages/Marketplace.jsx'));
const AdminIntegrations = lazy(() => import('./pages/Integrations.jsx'));
const AdminDeveloperPortal = lazy(() => import('./pages/DeveloperPortal.jsx'));
const AdminGamification = lazy(() => import('./pages/Gamification.jsx'));
const AdminJobsBoard = lazy(() => import('./pages/JobsBoard.jsx'));
const AdminInterviews = lazy(() => import('./pages/Interviews.jsx'));
const AdminMonitoring = lazy(() => import('./pages/Monitoring.jsx'));

function AdminLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '350px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading Admin Command Center...</span>
      </div>
    </div>
  );
}

/**
 * AdminApp - Dynamic Modular Router for the Admin Portal
 */
export default function AdminApp() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* People Management */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="employees" element={<AdminUsers />} />
        <Route path="interns" element={<AdminUsers />} />
        <Route path="students" element={<AdminUsers />} />
        <Route path="tutors" element={<AdminTutors />} />

        {/* Learning & LMS */}
        <Route path="courses" element={<AdminLMS />} />
        <Route path="curriculum" element={<AdminLMS />} />
        <Route path="batches" element={<AdminLMS />} />
        <Route path="training" element={<AdminLMS />} />
        <Route path="learning" element={<AdminLMS />} />

        {/* Projects & PMS */}
        <Route path="projects" element={<AdminPMS />} />
        <Route path="teams" element={<AdminPMS />} />
        <Route path="tasks" element={<AdminPMS />} />

        {/* HR Operations */}
        <Route path="hr" element={<AdminHR />} />
        <Route path="attendance" element={<AdminHR />} />
        <Route path="leaves" element={<AdminHR />} />
        <Route path="performance" element={<AdminHR />} />
        <Route path="payroll" element={<AdminHR />} />
        <Route path="approvals" element={<AdminApprovals />} />

        {/* CRM & Sales */}
        <Route path="leads" element={<AdminLeads />} />
        <Route path="contacts" element={<AdminLeads />} />
        <Route path="opportunities" element={<AdminLeads />} />
        <Route path="deals" element={<AdminLeads />} />

        {/* Finance & Accounts */}
        <Route path="finance" element={<AdminFinance />} />
        <Route path="income" element={<AdminFinance />} />
        <Route path="expenses" element={<AdminFinance />} />
        <Route path="invoices" element={<AdminFinance />} />
        <Route path="payments" element={<AdminFinance />} />

        {/* Campus Operations & Comms */}
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="calendar/types" element={<EventTypeAdmin />} />
        <Route path="communications" element={<AdminCommunications />} />
        <Route path="documents" element={<AdminCommunications />} />
        <Route path="notifications" element={<AdminCommunications />} />

        {/* Recruitment */}
        <Route path="jobs-board" element={<AdminJobsBoard />} />
        <Route path="interviews" element={<AdminInterviews />} />

        {/* Reporting & Analytics */}
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAIAnalytics />} />

        {/* Platform Services & Automation */}
        <Route path="automation" element={<AdminAutomationStudio />} />
        <Route path="integrations" element={<AdminIntegrations />} />
        <Route path="developer" element={<AdminDeveloperPortal />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="gamification" element={<AdminGamification />} />
        <Route path="monitoring" element={<AdminMonitoring />} />

        {/* Governance & Settings */}
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
