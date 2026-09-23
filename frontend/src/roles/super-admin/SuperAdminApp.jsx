import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy-loaded Super Admin Pages
const SuperAdminDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const SuperAdminTenants = lazy(() => import('./pages/Tenants.jsx'));
const SuperAdminUsers = lazy(() => import('./pages/Users.jsx'));
const SuperAdminRolesPermissions = lazy(() => import('./pages/RolesPermissions.jsx'));
const SuperAdminPlans = lazy(() => import('./pages/Plans.jsx'));
const SuperAdminBilling = lazy(() => import('./pages/Billing.jsx'));
const SuperAdminLeads = lazy(() => import('./pages/Leads.jsx'));
const SuperAdminCalendar = lazy(() => import('./pages/Calendar.jsx'));
const SuperAdminApprovals = lazy(() => import('./pages/Approvals.jsx'));
const SuperAdminNotifications = lazy(() => import('./pages/Notifications.jsx'));
const SuperAdminCommunications = lazy(() => import('./pages/Communications.jsx'));
const SuperAdminAutomationStudio = lazy(() => import('./pages/AutomationStudio.jsx'));
const SuperAdminIntegrations = lazy(() => import('./pages/Integrations.jsx'));
const SuperAdminMessaging = lazy(() => import('./pages/Messaging.jsx'));
const SuperAdminDeveloperPortal = lazy(() => import('./pages/DeveloperPortal.jsx'));
const SuperAdminMarketplace = lazy(() => import('./pages/Marketplace.jsx'));
const SuperAdminReports = lazy(() => import('./pages/Reports.jsx'));
const SuperAdminAIAnalytics = lazy(() => import('./pages/AIAnalytics.jsx'));
const SuperAdminGamification = lazy(() => import('./pages/Gamification.jsx'));
const SuperAdminMonitoring = lazy(() => import('./pages/Monitoring.jsx'));
const SuperAdminSystemSearch = lazy(() => import('./pages/SystemSearch.jsx'));
const SuperAdminFeatureFlags = lazy(() => import('./pages/FeatureFlags.jsx'));
const SuperAdminConfiguration = lazy(() => import('./pages/Configuration.jsx'));
const SuperAdminStorage = lazy(() => import('./pages/Storage.jsx'));
const SuperAdminBackups = lazy(() => import('./pages/Backups.jsx'));
const SuperAdminSecurityCenter = lazy(() => import('./pages/SecurityCenter.jsx'));
const SuperAdminAuditLogs = lazy(() => import('./pages/AuditLogs.jsx'));
const SuperAdminSettings = lazy(() => import('./pages/Settings.jsx'));
const SuperAdminProfile = lazy(() => import('./pages/Profile.jsx'));

function SuperAdminLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '350px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading Multi-Tenant Platform Engine...</span>
      </div>
    </div>
  );
}

/**
 * SuperAdminApp - Dynamic Modular Router for the Super Admin Multi-Tenant Portal
 */
export default function SuperAdminApp() {
  return (
    <Suspense fallback={<SuperAdminLoader />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />

        {/* Platform & Multi-Tenancy */}
        <Route path="tenants" element={<SuperAdminTenants />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="roles-permissions" element={<SuperAdminRolesPermissions />} />
        <Route path="plans" element={<SuperAdminPlans />} />
        <Route path="billing" element={<SuperAdminBilling />} />

        {/* CRM */}
        <Route path="leads" element={<SuperAdminLeads />} />

        {/* Operations */}
        <Route path="calendar" element={<SuperAdminCalendar />} />
        <Route path="approvals" element={<SuperAdminApprovals />} />
        <Route path="notifications" element={<SuperAdminNotifications />} />
        <Route path="communications" element={<SuperAdminCommunications />} />

        {/* Platform Services & Automation */}
        <Route path="automation" element={<SuperAdminAutomationStudio />} />
        <Route path="integrations" element={<SuperAdminIntegrations />} />
        <Route path="messaging" element={<SuperAdminMessaging />} />
        <Route path="developer" element={<SuperAdminDeveloperPortal />} />
        <Route path="marketplace" element={<SuperAdminMarketplace />} />

        {/* Analytics & AI */}
        <Route path="reports" element={<SuperAdminReports />} />
        <Route path="analytics" element={<SuperAdminAIAnalytics />} />
        <Route path="gamification" element={<SuperAdminGamification />} />

        {/* System & Telemetry */}
        <Route path="monitoring" element={<SuperAdminMonitoring />} />
        <Route path="system-search" element={<SuperAdminSystemSearch />} />
        <Route path="feature-flags" element={<SuperAdminFeatureFlags />} />
        <Route path="configuration" element={<SuperAdminConfiguration />} />
        <Route path="storage" element={<SuperAdminStorage />} />
        <Route path="backups" element={<SuperAdminBackups />} />

        {/* Security & Audit */}
        <Route path="security" element={<SuperAdminSecurityCenter />} />
        <Route path="audit-logs" element={<SuperAdminAuditLogs />} />

        {/* Administration */}
        <Route path="settings" element={<SuperAdminSettings />} />
        <Route path="profile" element={<SuperAdminProfile />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
