import axiosInstance from './axiosInstance';

export const employeePortalApi = {
  // 1. Dashboard
  getDashboardOverview: () => axiosInstance.get('/v1/employee/dashboard'),

  // 2. Attendance & Punch Clock (supports multiple work sessions per day)
  punchAttendance: (action) => axiosInstance.post('/v1/employee/attendance/punch', { action }),
  getTodayAttendance: () => axiosInstance.get('/v1/employee/attendance/today'),
  getAttendanceHistory: (params) => axiosInstance.get('/v1/employee/attendance', { params }),

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
  sendMessage: (payload) => axiosInstance.post('/v1/employee/messages', payload),
};

export default employeePortalApi;
