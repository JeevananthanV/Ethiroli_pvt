/**
 * Standardized API Response Shape
 * @typedef {Object} HrApiResponse
 * @property {any} data
 * @property {number} status
 * @property {string} statusText
 * @property {string} error
 */

/**
 * Standardized fetch with consistent error handling
 */
import axiosInstance from './axiosInstance.js';

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

/**
 * Employee CRUD
 */
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

/**
 * Intern CRUD
 */
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
 * HR Routes - Standardized
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
 * Interviews
 */
export const listInterviews = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/interviews', { params }));
};

/**
 * Communications/Announcements
 */
export const listCommunications = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/communications', { params }));
};

/**
 * Role Routes
 */
export const listRoles = async () => {
  return standardFetch(axiosInstance.get('/v1/roles'));
};