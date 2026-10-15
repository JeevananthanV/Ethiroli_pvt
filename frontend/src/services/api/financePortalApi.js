import axiosInstance from './axiosInstance.js';

// ---------------------------------------------------------------------------
// Finance‑portal attendance API (mirrors the employee/intern shims)
// All endpoints are scoped under /v1/finance/attendance so the back‑end can
// enforce finance‑role isolation while re‑using the same table‑structure.
// ---------------------------------------------------------------------------

// Helper: local YYYY‑MM‑DD key for the finance portal’s timezone (IST).
export const localDateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const financePortalApi = {
  // Monthly attendance snapshot for the calendar chip / summary.
  getMonthlyAttendance: (month) =>
    axiosInstance.get('/v1/finance/attendance/monthly', { params: { month } }),

  // Today's punch state (is_punched_in, sessions, etc.) – drives the live
  // clock card on the finance attendance page.
  getTodayAttendance: () => axiosInstance.get('/v1/finance/attendance/today'),

  // Summary stats (present/absent counts, rate, etc.).
  getSummary: () => axiosInstance.get('/v1/finance/attendance/summary'),

  // Single punch action – CHECK_IN / CHECK_OUT.
  punchAttendance: (action) =>
    axiosInstance.post('/v1/finance/attendance/punch', { action }),
};
export default financePortalApi;