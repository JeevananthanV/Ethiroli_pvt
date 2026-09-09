/**
 * Ethiroli SaaS Platform — Role-Based Navigation Configuration
 * Defines sidebar menu items for each of the 11 roles based on PROJECT_DOCUMENTATION.md Section 5.2.
 */

import { ROLES } from '../utils/roleRouting.js';

export const ROLE_NAVIGATION = Object.freeze({
  [ROLES.SUPER_ADMIN]: [
    { label: 'Dashboard', path: '/app/super-admin/dashboard', icon: 'dashboard' },
    { label: 'Users', path: '/app/super-admin/users', icon: 'group' },
    { label: 'Leads (CRM)', path: '/app/super-admin/leads', icon: 'contact_mail' },
    { label: 'Tenants', path: '/app/super-admin/tenants', icon: 'domain' },
    { label: 'System Monitoring', path: '/app/super-admin/monitoring', icon: 'monitor_heart' },
    { label: 'System Search', path: '/app/super-admin/system-search', icon: 'search' },
    { label: 'Audit Logs', path: '/app/super-admin/audit-logs', icon: 'history' },
    { label: 'Settings', path: '/app/super-admin/settings', icon: 'settings' },
    { label: 'Approvals', path: '/app/super-admin/super-approvals', icon: 'verified' },
    { label: 'Calendar', path: '/app/super-admin/super-calendar', icon: 'calendar_month' },
    { label: 'Jobs Board', path: '/app/super-admin/super-jobs-board', icon: 'work' },
    { label: 'Gamification', path: '/app/super-admin/super-gamification', icon: 'emoji_events' },
    { label: 'Integrations', path: '/app/super-admin/super-integrations', icon: 'hub' },
  ],

  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/app/admin/dashboard', icon: 'dashboard' },
    { label: 'Users', path: '/app/admin/users', icon: 'group' },
    { label: 'Leads (CRM)', path: '/app/admin/leads', icon: 'contact_mail' },
    { label: 'Approvals', path: '/app/admin/approvals', icon: 'verified' },
    { label: 'Calendar', path: '/app/admin/calendar', icon: 'calendar_month' },
    { label: 'Monitoring', path: '/app/admin/monitoring', icon: 'monitor_heart' },
    { label: 'Jobs Board', path: '/app/admin/jobs-board', icon: 'work' },
    { label: 'Marketplace', path: '/app/admin/marketplace', icon: 'storefront' },
    { label: 'Reports', path: '/app/admin/reports', icon: 'bar_chart' },
    { label: 'Automation Studio', path: '/app/admin/automation', icon: 'smart_toy' },
    { label: 'AI Analytics', path: '/app/admin/analytics', icon: 'analytics' },
    { label: 'Developer Portal', path: '/app/admin/developer', icon: 'code' },
    { label: 'Gamification', path: '/app/admin/gamification', icon: 'emoji_events' },
    { label: 'Integrations', path: '/app/admin/integrations', icon: 'hub' },
    { label: 'Audit Logs', path: '/app/admin/audit-logs', icon: 'history' },
  ],

  [ROLES.HR]: [
    { label: 'Dashboard', path: '/app/hr/dashboard', icon: 'dashboard' },
    { label: 'Employees', path: '/app/hr/employees', icon: 'badge' },
    { label: 'Interns', path: '/app/hr/interns', icon: 'school' },
    { label: 'Attendance', path: '/app/hr/attendance', icon: 'schedule' },
    { label: 'Leaves', path: '/app/hr/leaves', icon: 'event_busy' },
    { label: 'Interviews', path: '/app/hr/interviews', icon: 'record_voice_over' },
    { label: 'Communications', path: '/app/hr/communications', icon: 'forum' },
    { label: 'Payroll', path: '/app/hr/payroll', icon: 'payments' },
    { label: 'Performance', path: '/app/hr/performance', icon: 'trending_up' },
    { label: 'Jobs Board', path: '/app/hr/jobs-board', icon: 'work' },
  ],

  [ROLES.TUTOR]: [
    { label: 'Dashboard', path: '/app/tutor/dashboard', icon: 'dashboard' },
    { label: 'Courses', path: '/app/tutor/courses', icon: 'menu_book' },
    { label: 'Curriculum', path: '/app/tutor/curriculum', icon: 'library_books' },
    { label: 'Students', path: '/app/tutor/students', icon: 'groups' },
  ],

  [ROLES.PROJECT_MANAGER]: [
    { label: 'Dashboard', path: '/app/pm/dashboard', icon: 'dashboard' },
    { label: 'Clients', path: '/app/pm/clients', icon: 'handshake' },
    { label: 'Subscriptions', path: '/app/pm/subscriptions', icon: 'subscriptions' },
    { label: 'Tasks', path: '/app/pm/tasks', icon: 'checklist' },
    { label: 'Company Settings', path: '/app/pm/settings', icon: 'business' },
  ],

  [ROLES.FINANCE]: [
    { label: 'Dashboard', path: '/app/finance/dashboard', icon: 'dashboard' },
    { label: 'Income', path: '/app/finance/income', icon: 'trending_up' },
    { label: 'Expenses', path: '/app/finance/expenses', icon: 'trending_down' },
    { label: 'Invoices', path: '/app/finance/invoices', icon: 'receipt_long' },
    { label: 'Payments', path: '/app/finance/payments', icon: 'paid' },
    { label: 'Schedules', path: '/app/finance/schedules', icon: 'update' },
    { label: 'Payroll Runs', path: '/app/finance/payroll', icon: 'payments' },
  ],

  [ROLES.SALES]: [
    { label: 'Dashboard', path: '/app/sales/dashboard', icon: 'dashboard' },
    { label: 'Leads (CRM)', path: '/app/sales/leads', icon: 'contact_mail' },
    { label: 'Follow-Ups', path: '/app/sales/follow-ups', icon: 'notification_important' },
  ],

  [ROLES.RECEPTION]: [
    { label: 'Dashboard', path: '/app/reception/dashboard', icon: 'dashboard' },
    { label: 'Attendance', path: '/app/reception/attendance', icon: 'schedule' },
    { label: 'Calendar', path: '/app/reception/calendar', icon: 'calendar_month' },
    { label: 'Communications', path: '/app/reception/communications', icon: 'forum' },
  ],

  [ROLES.EMPLOYEE]: [
    { label: 'Dashboard', path: '/app/employee/dashboard', icon: 'dashboard' },
    { label: 'Leaves', path: '/app/employee/leaves', icon: 'event_busy' },
    { label: 'Payslips', path: '/app/employee/payslips', icon: 'receipt' },
    { label: 'Performance', path: '/app/employee/performance', icon: 'trending_up' },
  ],

  [ROLES.STUDENT]: [
    { label: 'Dashboard', path: '/app/student/dashboard', icon: 'dashboard' },
    { label: 'My Courses', path: '/app/student/courses', icon: 'menu_book' },
    { label: 'Live Quiz', path: '/app/student/live-quiz', icon: 'quiz' },
    { label: 'Forum', path: '/app/student/forum', icon: 'forum' },
    { label: 'Profile', path: '/app/student/profile', icon: 'person' },
    { label: 'Projects', path: '/app/student/projects', icon: 'code' },
    { label: 'Mind Map', path: '/app/student/mindmap', icon: 'account_tree' },
    { label: 'Certificates', path: '/app/student/certificates', icon: 'workspace_premium' },
  ],

  [ROLES.INTERN]: [
    { label: 'Dashboard', path: '/app/intern/dashboard', icon: 'dashboard' },
  ],
});

/**
 * Returns navigation links for a given user role
 * @param {string} role - The user's role
 * @returns {Array<{label: string, path: string, icon?: string}>}
 */
export const getNavigationForRole = (role) => {
  if (!role) return [];
  const normalized = String(role).trim().toUpperCase();
  return ROLE_NAVIGATION[normalized] || [];
};
