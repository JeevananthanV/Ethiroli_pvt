/**
 * Ethiroli SaaS Platform — Role-Based Navigation Configuration
 * Defines sidebar menu items for each of the 11 roles based on PROJECT_DOCUMENTATION.md Section 5.2.
 */

import { ROLES } from '../utils/roleRouting.js';

export const ROLE_NAVIGATION = Object.freeze({
  [ROLES.SUPER_ADMIN]: [
    { label: 'Dashboard', path: '/app/super-admin/dashboard', icon: 'dashboard' },
    {
      label: 'Platform',
      icon: 'domain',
      children: [
        { label: 'Tenants / Organizations', path: '/app/super-admin/tenants', icon: 'domain' },
        { label: 'Users', path: '/app/super-admin/users', icon: 'group' },
        { label: 'Roles & Permissions', path: '/app/super-admin/roles-permissions', icon: 'admin_panel_settings' },
        { label: 'Subscriptions & Plans', path: '/app/super-admin/plans', icon: 'subscriptions' },
        { label: 'Platform Billing', path: '/app/super-admin/billing', icon: 'payments' },
      ],
    },
    {
      label: 'CRM',
      icon: 'contact_mail',
      children: [
        { label: 'Leads (CRM)', path: '/app/super-admin/leads', icon: 'contact_mail' },
      ],
    },
    {
      label: 'Operations',
      icon: 'calendar_month',
      children: [
        { label: 'Global Calendar', path: '/app/super-admin/calendar', icon: 'calendar_month' },
        { label: 'Approvals', path: '/app/super-admin/approvals', icon: 'verified' },
        { label: 'Notifications', path: '/app/super-admin/notifications', icon: 'notifications' },
        { label: 'Communications', path: '/app/super-admin/communications', icon: 'forum' },
      ],
    },
    {
      label: 'Platform Services',
      icon: 'smart_toy',
      children: [
        { label: 'Automation Studio', path: '/app/super-admin/automation', icon: 'smart_toy' },
        { label: 'Integrations', path: '/app/super-admin/integrations', icon: 'hub' },
        { label: 'Email / SMS / WhatsApp', path: '/app/super-admin/messaging', icon: 'sms' },
        { label: 'Developer Portal', path: '/app/super-admin/developer', icon: 'code' },
        { label: 'Marketplace', path: '/app/super-admin/marketplace', icon: 'storefront' },
      ],
    },
    {
      label: 'Analytics',
      icon: 'bar_chart',
      children: [
        { label: 'Reports', path: '/app/super-admin/reports', icon: 'bar_chart' },
        { label: 'AI Analytics', path: '/app/super-admin/analytics', icon: 'analytics' },
        { label: 'Gamification', path: '/app/super-admin/gamification', icon: 'emoji_events' },
      ],
    },
    {
      label: 'System',
      icon: 'monitor_heart',
      children: [
        { label: 'System Monitoring', path: '/app/super-admin/monitoring', icon: 'monitor_heart' },
        { label: 'System Search', path: '/app/super-admin/system-search', icon: 'search' },
        { label: 'Feature Flags', path: '/app/super-admin/feature-flags', icon: 'toggle_on' },
        { label: 'System Configuration', path: '/app/super-admin/configuration', icon: 'tune' },
        { label: 'Database / Storage', path: '/app/super-admin/storage', icon: 'storage' },
        { label: 'Backup & Recovery', path: '/app/super-admin/backups', icon: 'backup' },
      ],
    },
    {
      label: 'Security',
      icon: 'security',
      children: [
        { label: 'Security Center', path: '/app/super-admin/security', icon: 'security' },
        { label: 'Audit Logs', path: '/app/super-admin/audit-logs', icon: 'history' },
      ],
    },
    {
      label: 'Administration',
      icon: 'settings',
      children: [
        { label: 'Settings', path: '/app/super-admin/settings', icon: 'settings' },
        { label: 'Admin Profile', path: '/app/super-admin/profile', icon: 'person' },
      ],
    },
  ],

  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/app/admin/dashboard', icon: 'bi-speedometer2' },
    {
      label: 'People',
      icon: 'bi-people',
      children: [
        { label: 'Users', path: '/app/admin/users', icon: 'bi-person-badge' },
        { label: 'Employees', path: '/app/admin/employees', icon: 'bi-person-workspace' },
        { label: 'Interns', path: '/app/admin/interns', icon: 'bi-briefcase' },
        { label: 'Students', path: '/app/admin/students', icon: 'bi-mortarboard' },
        { label: 'Tutors', path: '/app/admin/tutors', icon: 'bi-person-video3' },
      ],
    },
    {
      label: 'Learning',
      icon: 'bi-book',
      children: [
        { label: 'Courses', path: '/app/admin/courses', icon: 'bi-journal-bookmark' },
        { label: 'Curriculum', path: '/app/admin/curriculum', icon: 'bi-journal-text' },
        { label: 'Assignments', path: '/app/admin/assignments', icon: 'bi-pencil-square' },
        { label: 'Batches', path: '/app/admin/batches', icon: 'bi-collection' },
      ],
    },
    {
      label: 'Projects',
      icon: 'bi-kanban',
      children: [
        { label: 'Projects', path: '/app/admin/projects', icon: 'bi-folder2' },
        { label: 'Teams', path: '/app/admin/teams', icon: 'bi-microsoft-teams' },
        { label: 'Tasks', path: '/app/admin/tasks', icon: 'bi-check2-square' },
      ],
    },
    {
      label: 'HR Management',
      icon: 'bi-person-lines-fill',
      children: [
        { label: 'Attendance', path: '/app/admin/attendance', icon: 'bi-calendar-check' },
        { label: 'Leaves', path: '/app/admin/leaves', icon: 'bi-calendar-x' },
        { label: 'Performance', path: '/app/admin/performance', icon: 'bi-graph-up' },
        { label: 'Approvals', path: '/app/admin/approvals', icon: 'bi-patch-check' },
      ],
    },
    {
      label: 'CRM & Sales',
      icon: 'bi-funnel',
      children: [
        { label: 'Leads (CRM)', path: '/app/admin/leads', icon: 'bi-funnel-fill' },
        { label: 'Contacts', path: '/app/admin/contacts', icon: 'bi-person-lines-fill' },
        { label: 'Opportunities', path: '/app/admin/opportunities', icon: 'bi-lightbulb' },
        { label: 'Deals', path: '/app/admin/deals', icon: 'bi-handbag' },
      ],
    },
    {
      label: 'Finance',
      icon: 'bi-cash-coin',
      children: [
        { label: 'Income', path: '/app/admin/income', icon: 'bi-arrow-up-circle' },
        { label: 'Expenses', path: '/app/admin/expenses', icon: 'bi-arrow-down-circle' },
        { label: 'Invoices', path: '/app/admin/invoices', icon: 'bi-receipt-cutoff' },
        { label: 'Payments', path: '/app/admin/payments', icon: 'bi-credit-card' },
      ],
    },
    {
      label: 'Operations',
      icon: 'bi-gear-wide-connected',
      children: [
        { label: 'Calendar', path: '/app/admin/calendar', icon: 'bi-calendar3' },
        { label: 'Communications', path: '/app/admin/communications', icon: 'bi-chat-left-text' },
        { label: 'Documents', path: '/app/admin/documents', icon: 'bi-folder2-open' },
        { label: 'Notifications', path: '/app/admin/notifications', icon: 'bi-bell' },
      ],
    },
    {
      label: 'Recruitment',
      icon: 'bi-briefcase-fill',
      children: [
        { label: 'Jobs Board', path: '/app/admin/jobs-board', icon: 'bi-card-list' },
      ],
    },
    {
      label: 'Reporting',
      icon: 'bi-bar-chart-line',
      children: [
        { label: 'Reports', path: '/app/admin/reports', icon: 'bi-bar-chart-fill' },
        { label: 'AI Analytics', path: '/app/admin/analytics', icon: 'bi-cpu' },
      ],
    },
    {
      label: 'Automation',
      icon: 'bi-robot',
      children: [
        { label: 'Automation Studio', path: '/app/admin/automation', icon: 'bi-lightning-charge' },
        { label: 'Integrations', path: '/app/admin/integrations', icon: 'bi-plug' },
        { label: 'Developer Portal', path: '/app/admin/developer', icon: 'bi-code-slash' },
      ],
    },
    {
      label: 'Engagement',
      icon: 'bi-trophy',
      children: [
        { label: 'Marketplace', path: '/app/admin/marketplace', icon: 'bi-shop' },
        { label: 'Gamification', path: '/app/admin/gamification', icon: 'bi-award' },
      ],
    },
    {
      label: 'Security',
      icon: 'bi-shield-check',
      children: [
        { label: 'Audit Logs', path: '/app/admin/audit-logs', icon: 'bi-clock-history' },
        { label: 'Settings', path: '/app/admin/settings', icon: 'bi-sliders' },
      ],
    },
  ],

  [ROLES.HR]: [
    { label: 'Dashboard', path: '/app/hr/dashboard', icon: 'dashboard' },
    {
      label: 'Recruitment',
      icon: 'work',
      children: [
        { label: 'Job Applications', path: '/app/hr/applications', icon: 'bi-person-lines-fill' },
        { label: 'Website Inquiries', path: '/app/hr/inquiries', icon: 'bi-envelope-paper' },
        { label: 'Jobs Board', path: '/app/hr/jobs-board', icon: 'work' },
        { label: 'Interviews', path: '/app/hr/interviews', icon: 'record_voice_over' },
        { label: 'Candidate Pipeline', path: '/app/hr/applications', icon: 'route' },
      ],
    },
    {
      label: 'Students',
      icon: 'school',
      children: [
        { label: 'Student Admissions', path: '/app/hr/students', icon: 'menu_book' },
        { label: 'Payment Verification', path: '/app/hr/students', icon: 'paid' },
        { label: 'Tutor Assignment', path: '/app/hr/students', icon: 'person' },
        { label: 'LMS Progress', path: '/app/hr/students', icon: 'trending_up' },
        { label: 'Certificate Clearance', path: '/app/hr/students', icon: 'workspace_premium' },
      ],
    },
    {
      label: 'Employees',
      icon: 'badge',
      children: [
        { label: 'Employee Directory', path: '/app/hr/employees', icon: 'badge' },
        { label: 'Payroll & CTC', path: '/app/hr/payroll', icon: 'payments' },
      ],
    },
    {
      label: 'Interns',
      icon: 'bi-mortarboard',
      children: [
        { label: 'Intern Directory', path: '/app/hr/interns', icon: 'school' },
      ],
    },
    {
      label: 'Onboarding',
      icon: 'checklist',
      children: [
        { label: 'New Joiners & Overview', path: '/app/hr/onboarding', icon: 'person_add' },
        { label: 'Onboarding Plans (30/60/90D)', path: '/app/hr/onboarding-plans', icon: 'route' },
        { label: 'Checklists & Verification', path: '/app/hr/checklists', icon: 'checklist' },
      ],
    },
    {
      label: 'Attendance & Leaves',
      icon: 'schedule',
      children: [
        { label: 'Workforce Attendance', path: '/app/hr/attendance', icon: 'schedule' },
        { label: 'Leave Management', path: '/app/hr/leaves', icon: 'event_busy' },
      ],
    },
    {
      label: 'Training & LMS',
      icon: 'menu_book',
      children: [
        { label: 'Training Pathways', path: '/app/hr/training', icon: 'school' },
      ],
    },
    {
      label: 'Performance',
      icon: 'trending_up',
      children: [
        { label: 'Reviews & Goals / KPIs', path: '/app/hr/performance', icon: 'trending_up' },
      ],
    },
    {
      label: 'HR Documents & Vault',
      icon: 'folder',
      children: [
        { label: 'Documents Repository', path: '/app/hr/documents', icon: 'folder' },
        { label: 'HR Letters & Offers', path: '/app/hr/letters', icon: 'description' },
        { label: 'HR Requests', path: '/app/hr/requests', icon: 'bi-inbox' },
      ],
    },
    { label: 'Announcements', path: '/app/hr/announcements', icon: 'campaign' },
    { label: 'Offboarding & Exit', path: '/app/hr/offboarding', icon: 'exit_to_app' },
    { label: 'Reports & Analytics', path: '/app/hr/reports', icon: 'bar_chart' },
  ],

  [ROLES.TUTOR]: [
    { label: 'Dashboard', path: '/app/tutor/dashboard', icon: 'bi-speedometer2' },
    {
      label: 'Learning & Courses',
      icon: 'bi-journal-bookmark-fill',
      children: [
        { label: 'All Courses', path: '/app/tutor/courses', icon: 'bi-journals' },
        { label: 'Curriculum Studio', path: '/app/tutor/curriculum', icon: 'bi-diagram-3-fill' },
        { label: 'Batches & Cohorts', path: '/app/tutor/batches', icon: 'bi-grid-3x3-gap-fill' },
      ],
    },
    {
      label: 'Assessments',
      icon: 'bi-patch-question-fill',
      children: [
        { label: 'Question Bank', path: '/app/tutor/question-bank', icon: 'bi-collection' },
        { label: 'Quiz Management', path: '/app/tutor/quizzes', icon: 'bi-ui-checks' },
        { label: 'Assignment Studio', path: '/app/tutor/assignments', icon: 'bi-code-square' },
      ],
    },
    {
      label: 'Learners & Tracking',
      icon: 'bi-people-fill',
      children: [
        { label: 'Student 360° Roster', path: '/app/tutor/students', icon: 'bi-person-lines-fill' },
        { label: 'Academic Reports', path: '/app/tutor/reports', icon: 'bi-bar-chart-line-fill' },
      ],
    },
    {
      label: 'Engagement',
      icon: 'bi-chat-dots-fill',
      children: [
        { label: 'Live Schedule / Calendar', path: '/app/tutor/calendar', icon: 'bi-calendar3' },
        { label: 'Discussion Forum', path: '/app/tutor/forum', icon: 'bi-chat-left-quote-fill' },
        { label: 'Communications', path: '/app/tutor/communications', icon: 'bi-broadcast' },
      ],
    },
    { label: 'Faculty Profile', path: '/app/tutor/profile', icon: 'bi-person-circle' },
  ],

  [ROLES.PROJECT_MANAGER]: [
    { label: 'Dashboard', path: '/app/pm/dashboard', icon: 'dashboard' },
    { label: 'Projects', path: '/app/pm/projects', icon: 'code' },
    { label: 'Milestones', path: '/app/pm/milestones', icon: 'flag' },
    { label: 'Sprints', path: '/app/pm/sprints', icon: 'speedometer' },
    { label: 'Tasks', path: '/app/pm/tasks', icon: 'checklist' },
    { label: 'Teams', path: '/app/pm/team', icon: 'groups' },
    { label: 'Timesheets', path: '/app/pm/timesheets', icon: 'schedule' },
    { label: 'Project Files', path: '/app/pm/files', icon: 'folder' },
    { label: 'Clients', path: '/app/pm/clients', icon: 'domain' },
    { label: 'Client Communication', path: '/app/pm/client-comms', icon: 'chat' },
    { label: 'Approvals', path: '/app/pm/approvals', icon: 'verified' },
    { label: 'Subscriptions', path: '/app/pm/subscriptions', icon: 'subscriptions' },
    { label: 'Invoices', path: '/app/pm/invoices', icon: 'receipt_long' },
    { label: 'Project Expenses', path: '/app/pm/expenses', icon: 'payments' },
    { label: 'Project Reports', path: '/app/pm/reports', icon: 'bar_chart' },
    { label: 'Performance', path: '/app/pm/performance', icon: 'trending_up' },
    { label: 'Calendar', path: '/app/pm/calendar', icon: 'calendar_month' },
    { label: 'Notifications', path: '/app/pm/notifications', icon: 'notifications' },
    { label: 'My Profile', path: '/app/pm/profile', icon: 'person' },
    { label: 'Company Settings', path: '/app/pm/settings', icon: 'settings' },
  ],

  [ROLES.FINANCE]: [
    { label: 'Dashboard', path: '/app/finance/dashboard', icon: 'dashboard' },
    { label: 'General Ledger', path: '/app/finance/transactions', icon: 'receipt' },
    { label: 'Cash Flow Forecast', path: '/app/finance/cashflow', icon: 'timeline' },
    { label: 'Income', path: '/app/finance/income', icon: 'trending_up' },
    { label: 'Expenses', path: '/app/finance/expenses', icon: 'trending_down' },
    { label: 'Invoices', path: '/app/finance/invoices', icon: 'receipt_long' },
    { label: 'Payments', path: '/app/finance/payments', icon: 'paid' },
    { label: 'Receivables (AR)', path: '/app/finance/receivables', icon: 'monetization_on' },
    { label: 'Payables (AP)', path: '/app/finance/payables', icon: 'account_balance_wallet' },
    { label: 'Refunds & UTR', path: '/app/finance/refunds', icon: 'undo' },
    { label: 'Clients & Accounts', path: '/app/finance/clients', icon: 'groups' },
    { label: 'Retainer Subscriptions', path: '/app/finance/subscriptions', icon: 'subscriptions' },
    { label: 'Payroll Runs', path: '/app/finance/payroll', icon: 'payments' },
    { label: 'Salary Structures', path: '/app/finance/salary', icon: 'badge' },
    { label: 'Payment Schedules', path: '/app/finance/schedules', icon: 'update' },
    { label: 'Departmental Budgets', path: '/app/finance/budgets', icon: 'pie_chart' },
    { label: 'Tax & GST Compliance', path: '/app/finance/tax', icon: 'gavel' },
    { label: 'Financial Reports (P&L)', path: '/app/finance/reports', icon: 'bar_chart' },
    { label: 'Document Vault', path: '/app/finance/documents', icon: 'folder' },
    { label: 'Finance Approvals', path: '/app/finance/approvals', icon: 'verified' },
    { label: 'Tax Calendar', path: '/app/finance/calendar', icon: 'calendar_month' },
    { label: 'Notifications', path: '/app/finance/notifications', icon: 'notifications' },
    { label: 'Finance Settings', path: '/app/finance/settings', icon: 'settings' },
  ],

  [ROLES.SALES]: [
    { label: 'Dashboard', path: '/app/sales/dashboard', icon: 'dashboard' },
    { label: 'CRM Contacts', path: '/app/sales/contacts', icon: 'contact_mail' },
    { label: 'Opportunities', path: '/app/sales/opportunities', icon: 'trending_up' },
    { label: 'Deals', path: '/app/sales/deals', icon: 'deal' },
    { label: 'Proposals / Quotes', path: '/app/sales/proposals', icon: 'description' },
    { label: 'Campaigns', path: '/app/sales/campaigns', icon: 'campaign' },
    { label: 'Reports', path: '/app/sales/reports', icon: 'bar_chart' },
    { label: 'Follow-Ups', path: '/app/sales/follow-ups', icon: 'notification_important' },
  ],

  [ROLES.RECEPTION]: [
    { label: 'Dashboard', path: '/app/reception/dashboard', icon: 'bi-speedometer2' },
    {
      label: 'Sales & CRM',
      icon: 'bi-people',
      children: [
        { label: 'Enquiries', path: '/app/reception/enquiries', icon: 'bi-chat-dots' },
        { label: 'Leads', path: '/app/reception/leads', icon: 'bi-funnel' },
        { label: 'Visitors', path: '/app/reception/visitors', icon: 'bi-person-badge' },
        { label: 'Follow-Ups', path: '/app/reception/follow-ups', icon: 'bi-clock-history' },
      ],
    },
    {
      label: 'Academic & Talent',
      icon: 'bi-mortarboard',
      children: [
        { label: 'Students', path: '/app/reception/students', icon: 'bi-mortarboard-fill' },
        { label: 'Interns', path: '/app/reception/interns', icon: 'bi-briefcase' },
        { label: 'Employees', path: '/app/reception/employees', icon: 'bi-person-workspace' },
        { label: 'Admissions', path: '/app/reception/admissions', icon: 'bi-journal-check' },
        { label: 'Attendance', path: '/app/reception/attendance', icon: 'bi-calendar-check' },
        { label: 'Registrations', path: '/app/reception/registration', icon: 'bi-person-plus' },
      ],
    },
    {
      label: 'Operations & Scheduling',
      icon: 'bi-calendar-week',
      children: [
        { label: 'Appointments', path: '/app/reception/appointments', icon: 'bi-calendar2-check' },
        { label: 'Calendar', path: '/app/reception/calendar', icon: 'bi-calendar3' },
        { label: 'Documents', path: '/app/reception/documents', icon: 'bi-folder2-open' },
      ],
    },
    {
      label: 'Financial Management',
      icon: 'bi-cash-coin',
      children: [
        { label: 'Payments', path: '/app/reception/payments', icon: 'bi-credit-card' },
        { label: 'Receipts', path: '/app/reception/receipts', icon: 'bi-receipt' },
      ],
    },
    {
      label: 'Communication & Engagement',
      icon: 'bi-chat-square-quote',
      children: [
        { label: 'Communications', path: '/app/reception/communications', icon: 'bi-envelope' },
        { label: 'Announcements', path: '/app/reception/announcements', icon: 'bi-megaphone' },
        { label: 'Notifications', path: '/app/reception/notifications', icon: 'bi-bell' },
      ],
    },
    {
      label: 'Analytics & Profile',
      icon: 'bi-graph-up-arrow',
      children: [
        { label: 'Reports', path: '/app/reception/reports', icon: 'bi-bar-chart-line' },
        { label: 'My Profile', path: '/app/reception/profile', icon: 'bi-person-circle' },
      ],
    },
  ],

  [ROLES.EMPLOYEE]: [
    { label: 'Dashboard', path: '/app/employee/dashboard', icon: 'speedometer2' },
    {
      label: 'Employee Management',
      icon: 'briefcase',
      children: [
        { label: 'My Tasks', path: '/app/employee/tasks', icon: 'check2-square' },
        { label: 'My Projects', path: '/app/employee/projects', icon: 'kanban' },
        { label: 'Attendance', path: '/app/employee/attendance', icon: 'clock' },
        { label: 'Leave Management', path: '/app/employee/leaves', icon: 'calendar-x' },
        { label: 'Calendar', path: '/app/employee/calendar', icon: 'calendar3' },
      ],
    },
    {
      label: 'Learning & Development',
      icon: 'mortarboard',
      children: [
        { label: 'My Training', path: '/app/employee/training', icon: 'book' },
        { label: 'Assignments', path: '/app/employee/assignments', icon: 'journal-check' },
        { label: 'Performance', path: '/app/employee/performance', icon: 'graph-up-arrow' },
      ],
    },
    {
      label: 'Personal Records',
      icon: 'person-badge',
      children: [
        { label: 'My Documents', path: '/app/employee/documents', icon: 'folder2' },
        { label: 'Payslips', path: '/app/employee/payslips', icon: 'receipt' },
        { label: 'My Profile', path: '/app/employee/profile', icon: 'person-circle' },
      ],
    },
    {
      label: 'Communication & Governance',
      icon: 'chat-square-dots',
      children: [
        { label: 'Approvals', path: '/app/employee/approvals', icon: 'patch-check' },
        { label: 'Announcements', path: '/app/employee/announcements', icon: 'megaphone' },
        { label: 'Messages', path: '/app/employee/messages', icon: 'chat-left-text' },
        { label: 'Notifications', path: '/app/employee/notifications', icon: 'bell' },
        { label: 'Achievements', path: '/app/employee/achievements', icon: 'trophy' },
        { label: 'Help & Support', path: '/app/employee/support', icon: 'life-preserver' },
      ],
    },
  ],

  [ROLES.STUDENT]: [
    { label: 'Dashboard', path: '/app/student/dashboard', icon: 'dashboard' },
    {
      label: 'Learning',
      icon: 'menu_book',
      children: [
        { label: 'My Courses', path: '/app/student/courses', icon: 'menu_book' },
        { label: 'Learning Path', path: '/app/student/learning-path', icon: 'route' },
        { label: 'Course Modules', path: '/app/student/modules', icon: 'library_books' },
        { label: 'Course Player', path: '/app/student/course-player', icon: 'play_circle' },
      ],
    },
    {
      label: 'Practice & Labs',
      icon: 'code',
      children: [
        { label: 'Live Classes', path: '/app/student/live-classes', icon: 'bi-camera-video' },
        { label: 'Live Quiz', path: '/app/student/live-quiz', icon: 'quiz' },
        { label: 'Assessments', path: '/app/student/quiz', icon: 'assignment' },
        { label: 'Assignments', path: '/app/student/assignments', icon: 'checklist' },
        { label: 'Projects', path: '/app/student/projects', icon: 'code' },
      ],
    },
    {
      label: 'Schedule & Attendance',
      icon: 'schedule',
      children: [
        { label: 'Attendance', path: '/app/student/attendance', icon: 'schedule' },
        { label: 'Calendar', path: '/app/student/calendar', icon: 'calendar_month' },
      ],
    },
    {
      label: 'Support & Community',
      icon: 'forum',
      children: [
        { label: 'Doubts & Mentorship', path: '/app/student/doubts', icon: 'help' },
        { label: 'Discussion Forum', path: '/app/student/forum', icon: 'forum' },
        { label: 'Curriculum Mind Map', path: '/app/student/mindmap', icon: 'account_tree' },
        { label: 'Resources Library', path: '/app/student/resources', icon: 'folder' },
      ],
    },
    {
      label: 'Growth & Career',
      icon: 'workspace_premium',
      children: [
        { label: 'Notifications', path: '/app/student/notifications', icon: 'notifications' },
        { label: 'Academic Feedback', path: '/app/student/feedback', icon: 'rate_review' },
        { label: 'Certificates', path: '/app/student/certificates', icon: 'workspace_premium' },
        { label: 'Achievements & XP', path: '/app/student/achievements', icon: 'emoji_events' },
        { label: 'Career & Placement', path: '/app/student/career', icon: 'work' },
      ],
    },
    { label: 'Student Profile', path: '/app/student/profile', icon: 'person' },
  ],

  [ROLES.INTERN]: [
    { label: 'Dashboard', path: '/app/intern/dashboard', icon: 'dashboard' },
    { label: 'My Training Plan', path: '/app/intern/training-plan', icon: 'route' },
    { label: 'Daily Tasks', path: '/app/intern/tasks', icon: 'checklist' },
    { label: 'Attendance', path: '/app/intern/attendance', icon: 'schedule' },
    { label: 'Projects', path: '/app/intern/projects', icon: 'code' },
    { label: 'Assignments', path: '/app/intern/assignments', icon: 'assignment' },
    { label: 'Daily Work Log', path: '/app/intern/work-log', icon: 'edit_note' },
    { label: 'Mentor', path: '/app/intern/mentor', icon: 'person' },
    { label: 'Feedback', path: '/app/intern/feedback', icon: 'rate_review' },
    { label: 'Calendar', path: '/app/intern/calendar', icon: 'calendar_month' },
    { label: 'Documents', path: '/app/intern/documents', icon: 'folder' },
    { label: 'Certificate', path: '/app/intern/certificate', icon: 'workspace_premium' },
  ],

  [ROLES.SALES]: [
    { label: 'Dashboard', path: '/app/sales/dashboard', icon: 'speedometer2' },
    {
      label: 'CRM & Leads',
      icon: 'people',
      children: [
        { label: 'Leads', path: '/app/sales/leads', icon: 'person-plus' },
        { label: 'Contacts', path: '/app/sales/contacts', icon: 'person-lines-fill' },
        { label: 'Companies / Clients', path: '/app/sales/companies', icon: 'building' },
        { label: 'Opportunities', path: '/app/sales/opportunities', icon: 'lightning-charge' },
      ],
    },
    {
      label: 'Pipeline & Deals',
      icon: 'kanban',
      children: [
        { label: 'Deals Board', path: '/app/sales/deals', icon: 'grid-3x3-gap' },
        { label: 'Sales Pipeline', path: '/app/sales/pipeline', icon: 'funnel' },
        { label: 'Proposals & Quotes', path: '/app/sales/proposals', icon: 'file-earmark-text' },
      ],
    },
    {
      label: 'Activities & Tasks',
      icon: 'calendar-check',
      children: [
        { label: 'Follow-Ups', path: '/app/sales/follow-ups', icon: 'clock-history' },
        { label: 'Tasks', path: '/app/sales/tasks', icon: 'check2-square' },
        { label: 'Activities', path: '/app/sales/activities', icon: 'activity' },
        { label: 'Calls', path: '/app/sales/calls', icon: 'telephone' },
        { label: 'Meetings', path: '/app/sales/meetings', icon: 'camera-video' },
        { label: 'Calendar', path: '/app/sales/calendar', icon: 'calendar3' },
      ],
    },
    {
      label: 'Revenue & Growth',
      icon: 'graph-up-arrow',
      children: [
        { label: 'Subscriptions', path: '/app/sales/subscriptions', icon: 'arrow-repeat' },
        { label: 'Campaigns', path: '/app/sales/campaigns', icon: 'megaphone' },
        { label: 'Customer Handover', path: '/app/sales/handover', icon: 'box-arrow-right' },
      ],
    },
    {
      label: 'Analytics & Targets',
      icon: 'bar-chart-line',
      children: [
        { label: 'Sales Reports', path: '/app/sales/reports', icon: 'pie-chart' },
        { label: 'Targets & Quotas', path: '/app/sales/targets', icon: 'award' },
      ],
    },
    {
      label: 'Operations & Comms',
      icon: 'folder2-open',
      children: [
        { label: 'Documents', path: '/app/sales/documents', icon: 'file-earmark-pdf' },
        { label: 'Communications', path: '/app/sales/communications', icon: 'chat-dots' },
        { label: 'Notifications', path: '/app/sales/notifications', icon: 'bell' },
      ],
    },
    { label: 'My Profile', path: '/app/sales/profile', icon: 'person-circle' },
  ],

  [ROLES.INTERN]: [
    { label: 'Dashboard', path: '/app/intern/dashboard', icon: 'bi-speedometer2' },
    {
      label: 'Learning',
      icon: 'bi-mortarboard',
      children: [
        { label: 'My Training Plan', path: '/app/intern/training-plan', icon: 'bi-journal-code' },
        { label: 'LMS Courses', path: '/app/intern/courses', icon: 'bi-collection-play' },
        { label: 'Assignments', path: '/app/intern/assignments', icon: 'bi-file-earmark-code' },
        { label: 'Achievements', path: '/app/intern/achievements', icon: 'bi-trophy' },
      ],
    },
    {
      label: 'Daily Execution',
      icon: 'bi-lightning-charge',
      children: [
        { label: 'Daily Tasks', path: '/app/intern/tasks', icon: 'bi-list-task' },
        { label: 'Attendance', path: '/app/intern/attendance', icon: 'bi-calendar-check' },
        { label: 'Daily Work Log', path: '/app/intern/work-log', icon: 'bi-pencil-square' },
        { label: 'Projects', path: '/app/intern/projects', icon: 'bi-kanban' },
      ],
    },
    {
      label: 'Mentorship',
      icon: 'bi-person-badge',
      children: [
        { label: 'Mentor', path: '/app/intern/mentor', icon: 'bi-person-video3' },
        { label: 'Doubts / Discussions', path: '/app/intern/doubts', icon: 'bi-chat-left-dots' },
        { label: 'Feedback', path: '/app/intern/feedback', icon: 'bi-star-half' },
      ],
    },
    {
      label: 'Schedule',
      icon: 'bi-calendar3',
      children: [
        { label: 'Calendar', path: '/app/intern/calendar', icon: 'bi-calendar3' },
      ],
    },
    {
      label: 'Records',
      icon: 'bi-folder2-open',
      children: [
        { label: 'Documents', path: '/app/intern/documents', icon: 'bi-file-earmark-text' },
        { label: 'Certificates', path: '/app/intern/certificates', icon: 'bi-award' },
      ],
    },
    { label: 'My Profile', path: '/app/intern/profile', icon: 'bi-person-circle' },
  ],
});

/**
 * Returns navigation links for a given user role
 * @param {string} role - The user's role
 * @returns {Array<{label: string, path: string, icon?: string, children?: Array}>}
 */
export const getNavigationForRole = (role) => {
  if (!role) return [];
  const normalized = String(role).trim().toUpperCase();
  return ROLE_NAVIGATION[normalized] || [];
};
