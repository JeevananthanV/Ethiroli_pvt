import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';

// Lazy-loaded Finance Pages
const FinanceDashboard = lazy(() => import('./pages/Dashboard.jsx'));
const FinanceTransactions = lazy(() => import('./pages/Transactions.jsx'));
const FinanceCashFlow = lazy(() => import('./pages/CashFlow.jsx'));
const FinanceIncome = lazy(() => import('./pages/Income.jsx'));
const FinanceExpenses = lazy(() => import('./pages/Expenses.jsx'));
const FinanceInvoices = lazy(() => import('./pages/Invoices.jsx'));
const FinancePayments = lazy(() => import('./pages/Payments.jsx'));
const FinanceReceivables = lazy(() => import('./pages/Receivables.jsx'));
const FinancePayables = lazy(() => import('./pages/Payables.jsx'));
const FinanceRefunds = lazy(() => import('./pages/Refunds.jsx'));
const FinanceClients = lazy(() => import('./pages/Clients.jsx'));
const FinanceSubscriptions = lazy(() => import('./pages/Subscriptions.jsx'));
const FinancePayroll = lazy(() => import('./pages/Payroll.jsx'));
const FinanceSalary = lazy(() => import('./pages/Salary.jsx'));
const FinanceSchedules = lazy(() => import('./pages/Schedules.jsx'));
const FinanceBudgets = lazy(() => import('./pages/Budgets.jsx'));
const FinanceTax = lazy(() => import('./pages/Tax.jsx'));
const FinanceReports = lazy(() => import('./pages/Reports.jsx'));
const FinanceDocuments = lazy(() => import('./pages/Documents.jsx'));
const FinanceApprovals = lazy(() => import('./pages/Approvals.jsx'));
const FinanceCalendar = lazy(() => import('./pages/Calendar.jsx'));
const FinanceNotifications = lazy(() => import('./pages/Notifications.jsx'));
const FinanceSettings = lazy(() => import('./pages/Settings.jsx'));

/**
 * FinanceRoutes - route tree for the Finance portal.
 * Mounted at `/app/finance/*` by AdminApp (shared console) and by FinanceApp (finance.html).
 */
export default function FinanceRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading finance portal..." />}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FinanceDashboard />} />
        <Route path="transactions" element={<FinanceTransactions />} />
        <Route path="cashflow" element={<FinanceCashFlow />} />
        <Route path="income" element={<FinanceIncome />} />
        <Route path="expenses" element={<FinanceExpenses />} />
        <Route path="invoices" element={<FinanceInvoices />} />
        <Route path="payments" element={<FinancePayments />} />
        <Route path="receivables" element={<FinanceReceivables />} />
        <Route path="payables" element={<FinancePayables />} />
        <Route path="refunds" element={<FinanceRefunds />} />
        <Route path="clients" element={<FinanceClients />} />
        <Route path="subscriptions" element={<FinanceSubscriptions />} />
        <Route path="payroll" element={<FinancePayroll />} />
        <Route path="salary" element={<FinanceSalary />} />
        <Route path="schedules" element={<FinanceSchedules />} />
        <Route path="budgets" element={<FinanceBudgets />} />
        <Route path="tax" element={<FinanceTax />} />
        <Route path="reports" element={<FinanceReports />} />
        <Route path="documents" element={<FinanceDocuments />} />
        <Route path="approvals" element={<FinanceApprovals />} />
        <Route path="calendar" element={<FinanceCalendar />} />
        <Route path="notifications" element={<FinanceNotifications />} />
        <Route path="settings" element={<FinanceSettings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
