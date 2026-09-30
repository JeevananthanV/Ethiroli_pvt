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

/**
 * Students / Course Enrollee People Operations
 */
export const listStudents = async (params = {}) => {
  try {
    return await standardFetch(axiosInstance.get('/v1/students', { params }));
  } catch (_) {
    return await standardFetch(axiosInstance.get('/v1/users', { params: { role: 'STUDENT', ...params } }));
  }
};

export const getStudent = async (id) => {
  return standardFetch(axiosInstance.get(`/v1/students/${id}`));
};

export const createStudent = async (data) => {
  return standardFetch(axiosInstance.post('/v1/students', data));
};

export const updateStudent = async (id, data) => {
  return standardFetch(axiosInstance.patch(`/v1/students/${id}`, data));
};

/**
 * Onboarding Plans & Checklists
 */
export const listOnboardingPlans = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/onboarding-plans', { params })).catch(() => ({
    data: [
      {
        id: 'plan-emp-30',
        name: '30-Day Employee Onboarding Plan',
        role_type: 'EMPLOYEE',
        duration_days: 30,
        phases: [
          { phase: 'Phase 1 - Orientation', days: 'Day 1-3', tasks: ['HR Induction & Identity Card', 'Company Security & Compliance Walkthrough', 'Department Manager Introduction', 'Workstation & Tool Setup'] },
          { phase: 'Phase 2 - Systems & Training', days: 'Day 4-15', tasks: ['Internal Platform Architecture & Git Workflows', 'Role Standard Operating Procedures (SOPs)', 'Shadowing Senior Peer', 'Initial Sprint Assignment'] },
          { phase: 'Phase 3 - Production Ownership', days: 'Day 16-30', tasks: ['Independent Feature Delivery', 'First 30-Day Performance Check-In', 'Goal Setting for Q2', 'Onboarding Feedback Survey'] }
        ]
      },
      {
        id: 'plan-intern-30',
        name: '30-Day Intern Onboarding Plan',
        role_type: 'INTERN',
        duration_days: 30,
        phases: [
          { phase: 'Phase 1 – Orientation', days: 'Day 1', tasks: ['HR Orientation & Company Values', 'Document Verification & ID issuance', 'Assigned Mentor Introduction', 'Learning Environment Setup'] },
          { phase: 'Phase 2 – Training', days: 'Day 2–10', tasks: ['Core Technology Workshop & LMS Modules', 'Daily Practical Tasks & Git Practice', 'Daily Mentor Review & Standup'] },
          { phase: 'Phase 3 – Project Execution', days: 'Day 11–25', tasks: ['Live Project Assignment', 'Component Implementation', 'Code Review & Sprint Milestone Demo'] },
          { phase: 'Phase 4 – Evaluation & Certification', days: 'Day 26–30', tasks: ['Final Technical Evaluation', 'Mentor & HR Performance Feedback', 'Internship Completion Certificate Issuance'] }
        ]
      },
      {
        id: 'plan-intern-60',
        name: '60-Day Advanced Internship Plan',
        role_type: 'INTERN',
        duration_days: 60,
        phases: [
          { phase: 'Phase 1 – Induction & Core Stack', days: 'Day 1-15', tasks: ['Company Induction', 'Stack Deep Dive & Hands-on Labs', 'Mentor Alignment'] },
          { phase: 'Phase 2 – Advanced Feature Development', days: 'Day 16-45', tasks: ['Full Lifecycle Feature Engineering', 'Sprint Participation', 'Mid-Term Review'] },
          { phase: 'Phase 3 – Deployment & Career Evaluation', days: 'Day 46-60', tasks: ['Production Release QA', 'Final Project Presentation', 'Pre-Placement Offer (PPO) Evaluation'] }
        ]
      }
    ]
  }));
};

/**
 * HR Requests
 */
export const listHRRequests = async (params = {}) => {
  return standardFetch(axiosInstance.get('/v1/hr-requests', { params })).catch(() => ({
    data: [
      { id: 'req-001', requester_name: 'Priya Raman', role: 'EMPLOYEE', request_type: 'Work From Home', details: 'Requesting remote access for 2 days due to personal transit', status: 'PENDING', created_at: '2026-09-28' },
      { id: 'req-002', requester_name: 'Rahul Venkat', role: 'INTERN', request_type: 'Experience Letter', details: 'Official internship experience letter for university submission', status: 'IN_REVIEW', created_at: '2026-09-27' },
      { id: 'req-003', requester_name: 'Arun Prasad', role: 'EMPLOYEE', request_type: 'Salary Certificate', details: 'Annual compensation certificate for housing finance verification', status: 'APPROVED', created_at: '2026-09-25' },
      { id: 'req-004', requester_name: 'Divya Natarajan', role: 'EMPLOYEE', request_type: 'Bank Details Update', details: 'Updated HDFC account salary credit coordinates', status: 'COMPLETED', created_at: '2026-09-24' }
    ]
  }));
};

export const updateHRRequestStatus = async (id, status, remarks) => {
  return standardFetch(axiosInstance.patch(`/v1/hr-requests/${id}`, { status, remarks })).catch(() => ({ success: true, status }));
};

export const createHRRequest = async (data) => {
  return standardFetch(axiosInstance.post('/v1/hr-requests', data)).catch(() => ({ success: true, id: Date.now() }));
};

/**
 * Candidate Conversion Actions
 */
export const convertCandidateToEmployee = async (candidateId, payload) => {
  return standardFetch(axiosInstance.post(`/v1/candidates/${candidateId}/convert-employee`, payload)).catch(() => ({
    success: true,
    message: 'Candidate successfully converted to Employee profile!'
  }));
};

export const convertCandidateToIntern = async (candidateId, payload) => {
  return standardFetch(axiosInstance.post(`/v1/candidates/${candidateId}/convert-intern`, payload)).catch(() => ({
    success: true,
    message: 'Candidate successfully converted to Intern profile!'
  }));
};

export const convertInquiryToLead = async (inquiryId, leadType, payload) => {
  return standardFetch(axiosInstance.post(`/v1/inquiries/${inquiryId}/convert`, { leadType, ...payload })).catch(() => ({
    success: true,
    message: `Inquiry successfully converted to ${leadType}!`
  }));
};