/**
 * Standardized API Response Shape
 * @typedef {Object} HrApiResponse
 * @property {any} data
 * @property {number} status
 * @property {string} statusText
 * @property {string} error
 */

import axiosInstance from './axiosInstance.js';

/**
 * Standardized fetch with consistent error handling
 */
const standardFetch = async (promise, onError) => {
  try {
    const result = await promise;
    return result;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
    if (onError) onError(message);
    throw new Error(message);
  }
};

/**
 * Dashboard Metrics
 */
export const getDashboardMetrics = async () => {
  return standardFetch(axiosInstance.get('/v1/hr/dashboard/metrics'));
};

/**
 * Employees
 */
export const listEmployees = async () => {
  return standardFetch(axiosInstance.get('/v1/employees'));
};

export const createEmployee = async (data) => {
  return standardFetch(axiosInstance.post('/v1/employees', data));
};

export const updateEmployee = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/employees/${id}`, data));
};

export const deleteEmployee = async (id) => {
  return standardFetch(axiosInstance.delete(`/v1/employees/${id}`));
};

/**
 * Jobs
 */
export const listJobs = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/jobs', { params }));
};

/**
 * Attendance
 */
export const listAttendance = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/attendance', { params }));
};

export const checkIn = async (data) => {
  return standardFetch(axiosInstance.post('/v1/attendance/checkin', data));
};

export const updateAttendance = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/attendance/${id}`, data));
};

export const getAttendanceSummary = async () => {
  return standardFetch(axiosInstance.get('/v1/attendance/summary'));
};

/**
 * Leaves
 */
export const listLeaves = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/leaves', { params }));
};

export const createLeave = async (data) => {
  return standardFetch(axiosInstance.post('/v1/leaves', data));
};

export const approveLeave = async (id) => {
  return standardFetch(axiosInstance.patch(`/v1/leaves/${id}/approve`));
};

export const rejectLeave = async (id) => {
  return standardFetch(axiosInstance.patch(`/v1/leaves/${id}/reject`));
};

/**
 * Payroll
 */
export const listPayrollHistory = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/payroll/history', { params }));
};

export const runPayrollForAll = async (data) => {
  return standardFetch(axiosInstance.post('/v1/payroll/run', data));
};

/**
 * Documents
 */
export const listDocuments = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/documents', { params }));
};

export const uploadDocument = async (data) => {
  return standardFetch(axiosInstance.post('/v1/documents', data));
};

export const deleteDocument = async (id) => {
  return standardFetch(axiosInstance.delete(`/v1/documents/${id}`));
};

/**
 * Performance
 */
export const listPerformance = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/performance', { params }));
};

export const updatePerformance = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/performance/${id}`, data));
};

/**
 * Interns
 */
export const listInterns = async () => {
  return standardFetch(axiosInstance.get('/v1/interns'));
};

export const createIntern = async (data) => {
  return standardFetch(axiosInstance.post('/v1/interns', data));
};

export const updateIntern = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/interns/${id}`, data));
};

export const deleteIntern = async (id) => {
  return standardFetch(axiosInstance.delete(`/v1/interns/${id}`));
};

/**
 * Interviews
 */
export const listInterviews = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/interviews', { params }));
};

export const createInterview = async (data) => {
  return standardFetch(axiosInstance.post('/v1/interviews', data));
};

export const updateInterview = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/interviews/${id}`, data));
};

/**
 * HR Routes
 */
export const listHrRoutes = async () => {
  return standardFetch(axiosInstance.get('/v1/hr/routes'));
};

/**
 * Career Applications
 */
export const listCareerApplications = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/career-applications', { params }));
};

/**
 * Inquiries
 */
export const listInquiries = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/inquiries', { params }));
};

/**
 * Communications / Announcements
 */
export const listCommunications = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/communications', { params }));
};

/**
 * Calendar Events
 */
export const listCalendarEvents = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/calendar/events', { params }));
};

/**
 * Offboarding / Exit Requests
 */
export const listExitRequests = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/exit-requests', { params }));
};

export const createExitRequest = async (data) => {
  return standardFetch(axiosInstance.post('/v1/exit-requests', data));
};

export const updateExitRequest = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/exit-requests/${id}`, data));
};

/**
 * Onboarding
 */
export const listOnboardings = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/onboardings', { params }));
};

export const createOnboarding = async (data) => {
  return standardFetch(axiosInstance.post('/v1/onboardings', data));
};

export const updateOnboarding = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/onboardings/${id}`, data));
};

export const deleteOnboarding = async (id) => {
  return standardFetch(axiosInstance.delete(`/v1/onboardings/${id}`));
};

/**
 * Training
 */
export const listTrainings = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/trainings', { params }));
};

export const createTraining = async (data) => {
  return standardFetch(axiosInstance.post('/v1/trainings', data));
};

export const updateTraining = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/trainings/${id}`, data));
};

/**
 * Reports
 */
export const listReports = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/reports', { params }));
};

/**
 * Role Routes
 */
export const listRoles = async () => {
  return standardFetch(axiosInstance.get('/v1/roles'));
};