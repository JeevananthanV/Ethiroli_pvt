import axiosInstance from './axiosInstance.js';

// 1. Dashboard & Analytics
export const getReceptionSummary = async () => {
  const response = await axiosInstance.get('/v1/reception/dashboard/summary');
  return response.data?.data || response.data;
};

export const getReceptionAnalytics = async () => {
  const response = await axiosInstance.get('/v1/reception/analytics');
  return response.data?.data || response.data;
};

// 2. Visitor Management
export const getVisitors = async (params) => {
  const response = await axiosInstance.get('/v1/operations/visitors', { params });
  return response.data?.data || response.data;
};

export const createVisitor = async (data) => {
  const response = await axiosInstance.post('/v1/operations/visitors', data);
  return response.data?.data || response.data;
};

export const checkoutVisitor = async (id) => {
  const response = await axiosInstance.put(`/v1/operations/visitors/${id}/checkout`);
  return response.data?.data || response.data;
};

export const deleteVisitor = async (id) => {
  const response = await axiosInstance.delete(`/v1/operations/visitors/${id}`);
  return response.data?.data || response.data;
};

// 3. Appointments & Pre-Registrations
export const getAppointments = async (params) => {
  const response = await axiosInstance.get('/v1/reception/appointments', { params });
  return response.data?.data || response.data;
};

export const getAppointment = async (id) => {
  const response = await axiosInstance.get(`/v1/reception/appointments/${id}`);
  return response.data?.data || response.data;
};

export const createAppointment = async (data) => {
  const response = await axiosInstance.post('/v1/reception/appointments', data);
  return response.data?.data || response.data;
};

export const updateAppointmentStatus = async (id, status, badge_number) => {
  const response = await axiosInstance.patch(`/v1/reception/appointments/${id}/status`, { status, badge_number });
  return response.data?.data || response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(`/v1/reception/appointments/${id}`);
  return response.data?.data || response.data;
};

// 4. Receipts & Fee Counter
export const getReceipts = async (params) => {
  const response = await axiosInstance.get('/v1/reception/receipts', { params });
  return response.data?.data || response.data;
};

export const getReceipt = async (id) => {
  const response = await axiosInstance.get(`/v1/reception/receipts/${id}`);
  return response.data?.data || response.data;
};

export const createReceipt = async (data) => {
  const response = await axiosInstance.post('/v1/reception/receipts', data);
  return response.data?.data || response.data;
};

export const getReceiptStats = async () => {
  const response = await axiosInstance.get('/v1/reception/receipts/stats');
  return response.data?.data || response.data;
};

// 5. Fast Directory Search
export const searchDirectory = async (q) => {
  const response = await axiosInstance.get('/v1/reception/directory/search', { params: { q } });
  return response.data?.data || response.data;
};

// 6. Cross-Module Entity Integrations
export const getEnquiries = async (params) => {
  const response = await axiosInstance.get('/v1/leads', { params: { ...params, source: 'WALK_IN' } });
  return response.data?.data || response.data;
};

export const getLeads = async (params) => {
  const response = await axiosInstance.get('/v1/leads', { params });
  return response.data?.data || response.data;
};

export const createLead = async (data) => {
  const response = await axiosInstance.post('/v1/leads', data);
  return response.data?.data || response.data;
};

export const getStudents = async (params) => {
  const response = await axiosInstance.get('/v1/users', { params: { ...params, role: 'STUDENT' } });
  return response.data?.data || response.data;
};

export const getInterns = async (params) => {
  const response = await axiosInstance.get('/v1/interns', { params });
  return response.data?.data || response.data;
};

export const getEmployees = async (params) => {
  const response = await axiosInstance.get('/v1/employees', { params });
  return response.data?.data || response.data;
};

export const getAdmissions = async (params) => {
  const response = await axiosInstance.get('/v1/operations/reception/overview');
  return response.data?.data?.admissions || response.data?.admissions || [];
};

export const getPayments = async (params) => {
  const response = await axiosInstance.get('/v1/finance/transactions', { params });
  return response.data?.data || response.data;
};

export const getCommunications = async (params) => {
  const response = await axiosInstance.get('/v1/communications', { params });
  return response.data?.data || response.data;
};

export const getAnnouncements = async (params) => {
  const response = await axiosInstance.get('/v1/feed', { params });
  return response.data?.data || response.data;
};

export const getNotifications = async (params) => {
  const response = await axiosInstance.get('/v1/notifications', { params });
  return response.data?.data || response.data;
};
