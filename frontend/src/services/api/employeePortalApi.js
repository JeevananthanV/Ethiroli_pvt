import axiosInstance, { publicApi } from './axiosInstance';

export const employeePortalApi = {
  // 1. Dashboard
  getDashboardOverview: () => axiosInstance.get('/v1/employee/dashboard'),

  // 2. Attendance & Punch Clock (supports multiple work sessions per day)
  punchAttendance: (action) => axiosInstance.post('/v1/employee/attendance/punch', { action }),
  getTodayAttendance: () => axiosInstance.get('/v1/employee/attendance/today'),
  getAttendanceHistory: (params) => axiosInstance.get('/v1/employee/attendance', { params }),
  // Per-day PRESENT/ABSENT/LEAVE state + monthly summary for the calendar.
  // Server-side scoped to the signed-in employee; takes no user id parameter.
  getMonthlyAttendance: (month) => axiosInstance.get('/v1/employee/attendance/monthly', { params: { month } }),

  // 3. Leaves & Balances
  getLeavesAndBalances: () => axiosInstance.get('/v1/employee/leaves'),
  applyLeave: (payload) => axiosInstance.post('/v1/employee/leaves', payload),

  // 4. Tasks & Projects
  getAssignedTasks: (params) => axiosInstance.get('/v1/employee/tasks', { params }),
  updateTaskStatus: (id, status) => axiosInstance.patch(`/v1/employee/tasks/${id}/status`, { status }),
  getMyProjects: () => axiosInstance.get('/v1/employee/projects'),

  // 5. Training & Development
  getEnrolledCourses: () => axiosInstance.get('/v1/employee/courses'),
  getAssignments: () => axiosInstance.get('/v1/employee/assignments'),

  // 6. Documents, Payslips, Profile
  getPersonalDocuments: () => axiosInstance.get('/v1/employee/documents'),
  uploadPersonalDocument: (payload) => axiosInstance.post('/v1/employee/documents', payload),
  getMyPayslips: () => axiosInstance.get('/v1/employee/payslips'),
  getMyProfile: () => axiosInstance.get('/v1/employee/profile'),
  updateMyProfile: (payload) => axiosInstance.patch('/v1/employee/profile', payload),

  // 7. Support & Help Desk
  getSupportTickets: () => axiosInstance.get('/v1/employee/support'),
  createSupportTicket: (payload) => axiosInstance.post('/v1/employee/support', payload),

  // 8. Communication & Governance
  getAnnouncements: () => axiosInstance.get('/v1/employee/announcements'),
  getMyApprovals: () => axiosInstance.get('/v1/employee/approvals'),
  getAchievements: () => axiosInstance.get('/v1/employee/achievements'),
  getMessages: (params) => axiosInstance.get('/v1/employee/messages', { params }),
  getMessageContacts: (params) => axiosInstance.get('/v1/employee/messages/contacts', { params }),

  // 8b. Password change (approval workflow)
  // Raising a request grants nothing on its own; an administrator must approve it
  // before the new password can be set.
  getMyPasswordChangeRequest: () => axiosInstance.get('/v1/employee/password-change-request'),
  requestPasswordChange: (payload) => axiosInstance.post('/v1/employee/password-change-request', payload),
  changePasswordWithApproval: (payload) => axiosInstance.post('/v1/employee/password-change', payload),
  // Self-service change while the current password is known. The backend
  // verifies the current password, then hashes via the shared credential service.
  changePassword: (payload) => axiosInstance.post('/v1/auth/change-password', payload),

  // 8c. Password recovery — used from the SIGN-IN screen, so these are the only
  // endpoints in this file that are called while unauthenticated. They go to
  // axios directly (not through the instance's 401 interceptor) and are
  // intentionally public: a locked-out employee has no session to send.
  requestPasswordRecovery: (payload) => publicApi.post('/v1/auth/password-recovery/request', payload),
  getPasswordRecoveryStatus: (payload) => publicApi.post('/v1/auth/password-recovery/status', payload),
  setPasswordWithRecovery: (payload) => publicApi.post('/v1/auth/password-recovery/set-password', payload),

  // 9. Notifications — backed by the shared activity feed, scoped to the
  // signed-in employee on the server (no employee-specific table needed).
  getNotifications: (params) => axiosInstance.get('/v1/activity-feed', { params }),
  markNotificationRead: (id) => axiosInstance.patch(`/v1/activity-feed/${id}/read`),
  markAllNotificationsRead: () => axiosInstance.post('/v1/activity-feed/read-all'),
  sendMessage: (payload) => axiosInstance.post('/v1/employee/messages', payload),
};

export default employeePortalApi;
