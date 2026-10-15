import axiosInstance from './axiosInstance.js';

// Helper: local YYYY‑MM‑DD key for the intern’s timezone (IST).
export const localDateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const internPortalApi = {
  // Monthly attendance snapshot for the calendar chip / summary.
  getMonthlyAttendance: (month) =>
    axiosInstance.get('/v1/intern/attendance/monthly', { params: { month } }),

  // Today's punch state (is_punched_in, sessions, etc.) – drives the live
  // clock card on the attendance page.
  getTodayAttendance: () => axiosInstance.get('/v1/intern/attendance/today'),

  // Full attendance history for the grid / KPI tiles.
  getAttendanceHistory: (params = {}) =>
    axiosInstance.get('/v1/intern/attendance', { params }),

  // Single punch action – CHECK_IN / CHECK_OUT.
  punchAttendance: (action) => axiosInstance.post('/v1/intern/attendance/punch', { action }),

  // Summary stats (present/absent counts, rate, etc.).
  getSummary: () => axiosInstance.get('/v1/intern/attendance/summary'),
};
export default internPortalApi;