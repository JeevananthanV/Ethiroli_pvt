import axiosInstance from './axiosInstance';

export const operationsApi = {
  // Visitor Logs
  getVisitors: (params) => axiosInstance.get('/v1/operations/visitors', { params }),
  createVisitor: (data) => axiosInstance.post('/v1/operations/visitors', data),
  checkoutVisitor: (id) => axiosInstance.put(`/v1/operations/visitors/${id}/checkout`),
  deleteVisitor: (id) => axiosInstance.delete(`/v1/operations/visitors/${id}`),

  // Timesheets
  getTimesheets: (params) => axiosInstance.get('/v1/operations/timesheets', { params }),
  createTimesheet: (data) => axiosInstance.post('/v1/operations/timesheets', data),
  approveTimesheet: (id) => axiosInstance.put(`/v1/operations/timesheets/${id}/approve`),
  rejectTimesheet: (id, data) => axiosInstance.put(`/v1/operations/timesheets/${id}/reject`, data),

  // Role Overview aggregates
  getSalesOverview: () => axiosInstance.get('/v1/operations/sales/overview'),
  getFinanceOverview: () => axiosInstance.get('/v1/operations/finance/overview'),
  getReceptionOverview: () => axiosInstance.get('/v1/operations/reception/overview'),
};

export default operationsApi;
