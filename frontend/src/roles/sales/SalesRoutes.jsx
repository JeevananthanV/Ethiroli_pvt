import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';

// Lazy-loaded Sales Pages
const SalesDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const SalesLeads = lazy(() => import('./pages/Leads.jsx'));
const SalesContacts = lazy(() => import('./pages/Contacts.jsx'));
const SalesCompanies = lazy(() => import('./pages/Companies.jsx'));
const SalesOpportunities = lazy(() => import('./pages/Opportunities.jsx'));
const SalesDeals = lazy(() => import('./pages/Deals.jsx'));
const SalesPipeline = lazy(() => import('./pages/SalesPipeline.jsx'));
const SalesProposals = lazy(() => import('./pages/Proposals.jsx'));
const SalesFollowUps = lazy(() => import('./pages/FollowUps.jsx'));
const SalesTasks = lazy(() => import('./pages/Tasks.jsx'));
const SalesActivities = lazy(() => import('./pages/Activities.jsx'));
const SalesCalls = lazy(() => import('./pages/Calls.jsx'));
const SalesMeetings = lazy(() => import('./pages/Meetings.jsx'));
const SalesCalendar = lazy(() => import('./pages/Calendar.jsx'));
const SalesSubscriptions = lazy(() => import('./pages/Subscriptions.jsx'));
const SalesCampaigns = lazy(() => import('./pages/Campaigns.jsx'));
const SalesHandover = lazy(() => import('./pages/Handover.jsx'));
const SalesReports = lazy(() => import('./pages/Reports.jsx'));
const SalesTargets = lazy(() => import('./pages/Targets.jsx'));
const SalesDocuments = lazy(() => import('./pages/Documents.jsx'));
const SalesCommunications = lazy(() => import('./pages/Communications.jsx'));
const SalesNotifications = lazy(() => import('./pages/Notifications.jsx'));
const SalesProfile = lazy(() => import('./pages/Profile.jsx'));

/**
 * SalesRoutes - route tree for the Sales portal.
 * Mounted at `/app/sales/*` by AdminApp (shared console) and by SalesApp (sales.html).
 */
export default function SalesRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading sales portal..." />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SalesDashboard />} />
        <Route path="leads" element={<SalesLeads />} />
        <Route path="contacts" element={<SalesContacts />} />
        <Route path="companies" element={<SalesCompanies />} />
        <Route path="opportunities" element={<SalesOpportunities />} />
        <Route path="deals" element={<SalesDeals />} />
        <Route path="pipeline" element={<SalesPipeline />} />
        <Route path="proposals" element={<SalesProposals />} />
        <Route path="follow-ups" element={<SalesFollowUps />} />
        <Route path="tasks" element={<SalesTasks />} />
        <Route path="activities" element={<SalesActivities />} />
        <Route path="calls" element={<SalesCalls />} />
        <Route path="meetings" element={<SalesMeetings />} />
        <Route path="calendar" element={<SalesCalendar />} />
        <Route path="subscriptions" element={<SalesSubscriptions />} />
        <Route path="campaigns" element={<SalesCampaigns />} />
        <Route path="handover" element={<SalesHandover />} />
        <Route path="reports" element={<SalesReports />} />
        <Route path="targets" element={<SalesTargets />} />
        <Route path="documents" element={<SalesDocuments />} />
        <Route path="communications" element={<SalesCommunications />} />
        <Route path="notifications" element={<SalesNotifications />} />
        <Route path="profile" element={<SalesProfile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
