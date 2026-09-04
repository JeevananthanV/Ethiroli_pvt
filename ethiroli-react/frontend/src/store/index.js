import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import leadsReducer from './slices/leadsSlice.js';
import usersReducer from './slices/usersSlice.js';
import feedReducer from './slices/feedSlice.js';
import auditReducer from './slices/auditSlice.js';
import uiReducer from './slices/uiSlice.js';

// Phase 2 Reducers
import employeesReducer from './slices/employeesSlice.js';
import attendanceReducer from './slices/attendanceSlice.js';
import leavesReducer from './slices/leavesSlice.js';
import coursesReducer from './slices/coursesSlice.js';
import enrollmentsReducer from './slices/enrollmentsSlice.js';
import clientsReducer from './slices/clientsSlice.js';
import tasksReducer from './slices/tasksSlice.js';

// Phase 3 Reducers
import invoicesReducer from './slices/invoicesSlice.js';
import paymentsReducer from './slices/paymentsSlice.js';
import transactionsReducer from './slices/transactionsSlice.js';
import forumReducer from './slices/forumSlice.js';
import badgesReducer from './slices/badgesSlice.js';
import liveQuizReducer from './slices/liveQuizSlice.js';

// Phase 4 Reducers
import communicationsReducer from './slices/communicationsSlice.js';
import templatesReducer from './slices/templatesSlice.js';
import jobsReducer from './slices/jobsSlice.js';
import candidatesReducer from './slices/candidatesSlice.js';
import interviewsReducer from './slices/interviewsSlice.js';
import integrationsReducer from './slices/integrationsSlice.js';

// Phase 5 Reducers
import payrollReducer from './slices/payrollSlice.js';
import performanceReducer from './slices/performanceSlice.js';
import calendarReducer from './slices/calendarSlice.js';
import holidayReducer from './slices/holidaySlice.js';
import approvalsReducer from './slices/approvalsSlice.js';
import companySettingsReducer from './slices/companySettingsSlice.js';

// Phase 6 Reducers
import projectsReducer from './slices/projectsSlice.js';
import mindmapReducer from './slices/mindmapSlice.js';
import certificatesReducer from './slices/certificatesSlice.js';
import jobsBoardReducer from './slices/jobsBoardSlice.js';
import monitoringReducer from './slices/monitoringSlice.js';

// Phase 7 Reducers
import tenantsReducer from './slices/tenantsSlice.js';
import productsReducer from './slices/productsSlice.js';
import cartReducer from './slices/cartSlice.js';
import ordersReducer from './slices/ordersSlice.js';
import couponsReducer from './slices/couponsSlice.js';
import reportsReducer from './slices/reportsSlice.js';
import apiKeysReducer from './slices/apiKeysSlice.js';
import webhooksReducer from './slices/webhooksSlice.js';

// Phase 8 Reducers
import predictiveReducer from './slices/predictiveSlice.js';
import automationReducer from './slices/automationSlice.js';
import pushNotificationsReducer from './slices/pushNotificationsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    users: usersReducer,
    feed: feedReducer,
    audit: auditReducer,
    ui: uiReducer,
    employees: employeesReducer,
    attendance: attendanceReducer,
    leaves: leavesReducer,
    courses: coursesReducer,
    enrollments: enrollmentsReducer,
    clients: clientsReducer,
    tasks: tasksReducer,
    invoices: invoicesReducer,
    payments: paymentsReducer,
    transactions: transactionsReducer,
    forum: forumReducer,
    badges: badgesReducer,
    liveQuiz: liveQuizReducer,
    communications: communicationsReducer,
    templates: templatesReducer,
    jobs: jobsReducer,
    candidates: candidatesReducer,
    interviews: interviewsReducer,
    integrations: integrationsReducer,
    payroll: payrollReducer,
    performance: performanceReducer,
    calendar: calendarReducer,
    holiday: holidayReducer,
    approvals: approvalsReducer,
    companySettings: companySettingsReducer,
    projects: projectsReducer,
    mindmap: mindmapReducer,
    certificates: certificatesReducer,
    jobsBoard: jobsBoardReducer,
    monitoring: monitoringReducer,
    tenants: tenantsReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    coupons: couponsReducer,
    reports: reportsReducer,
    apiKeys: apiKeysReducer,
    webhooks: webhooksReducer,
    predictive: predictiveReducer,
    automation: automationReducer,
    pushNotifications: pushNotificationsReducer
  }
});
