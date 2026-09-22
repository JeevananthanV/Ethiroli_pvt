import axiosInstance from './axiosInstance.js';

// 1. Dashboard & Pipeline
export const getDashboardSummary = async () => {
  const response = await axiosInstance.get('/v1/sales/dashboard/summary');
  return response.data?.data || response.data;
};

export const getPipelineSummary = async () => {
  const response = await axiosInstance.get('/v1/sales/pipeline/summary');
  return response.data?.data || response.data;
};

// 2. Deals Management
export const getDeals = async (params) => {
  const response = await axiosInstance.get('/v1/sales/deals', { params });
  return response.data?.data || response.data;
};

export const getDeal = async (id) => {
  const response = await axiosInstance.get(`/v1/sales/deals/${id}`);
  return response.data?.data || response.data;
};

export const createDeal = async (data) => {
  const response = await axiosInstance.post('/v1/sales/deals', data);
  return response.data?.data || response.data;
};

export const updateDeal = async (id, data) => {
  const response = await axiosInstance.put(`/v1/sales/deals/${id}`, data);
  return response.data?.data || response.data;
};

export const updateDealStage = async (id, stage, loss_reason = null) => {
  const response = await axiosInstance.patch(`/v1/sales/deals/${id}/stage`, { stage, loss_reason });
  return response.data?.data || response.data;
};

export const deleteDeal = async (id) => {
  const response = await axiosInstance.delete(`/v1/sales/deals/${id}`);
  return response.data?.data || response.data;
};

// 3. Proposals & Quotations
export const getProposals = async (params) => {
  const response = await axiosInstance.get('/v1/sales/proposals', { params });
  return response.data?.data || response.data;
};

export const getProposal = async (id) => {
  const response = await axiosInstance.get(`/v1/sales/proposals/${id}`);
  return response.data?.data || response.data;
};

export const createProposal = async (data) => {
  const response = await axiosInstance.post('/v1/sales/proposals', data);
  return response.data?.data || response.data;
};

export const updateProposal = async (id, data) => {
  const response = await axiosInstance.put(`/v1/sales/proposals/${id}`, data);
  return response.data?.data || response.data;
};

export const updateProposalStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/sales/proposals/${id}/status`, { status });
  return response.data?.data || response.data;
};

export const deleteProposal = async (id) => {
  const response = await axiosInstance.delete(`/v1/sales/proposals/${id}`);
  return response.data?.data || response.data;
};

// 4. Activities, Calls, Meetings & Calendar
export const getActivities = async (params) => {
  const response = await axiosInstance.get('/v1/sales/activities', { params });
  return response.data?.data || response.data;
};

export const getUpcomingActivities = async (params) => {
  const response = await axiosInstance.get('/v1/sales/activities/upcoming', { params });
  return response.data?.data || response.data;
};

export const createActivity = async (data) => {
  const response = await axiosInstance.post('/v1/sales/activities', data);
  return response.data?.data || response.data;
};

export const updateActivity = async (id, data) => {
  const response = await axiosInstance.put(`/v1/sales/activities/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteActivity = async (id) => {
  const response = await axiosInstance.delete(`/v1/sales/activities/${id}`);
  return response.data?.data || response.data;
};

// 5. Targets & Quotas
export const getTargets = async (params) => {
  const response = await axiosInstance.get('/v1/sales/targets', { params });
  return response.data?.data || response.data;
};

export const createOrUpdateTarget = async (data) => {
  const response = await axiosInstance.post('/v1/sales/targets', data);
  return response.data?.data || response.data;
};

export const deleteTarget = async (id) => {
  const response = await axiosInstance.delete(`/v1/sales/targets/${id}`);
  return response.data?.data || response.data;
};

// 6. Customer Handovers
export const getHandovers = async (params) => {
  const response = await axiosInstance.get('/v1/sales/handovers', { params });
  return response.data?.data || response.data;
};

export const createHandover = async (data) => {
  const response = await axiosInstance.post('/v1/sales/handovers', data);
  return response.data?.data || response.data;
};

export const updateHandoverStatus = async (id, status, assigned_person_id) => {
  const response = await axiosInstance.patch(`/v1/sales/handovers/${id}/status`, { status, assigned_person_id });
  return response.data?.data || response.data;
};

export const deleteHandover = async (id) => {
  const response = await axiosInstance.delete(`/v1/sales/handovers/${id}`);
  return response.data?.data || response.data;
};

// 7. Analytics & Reports
export const getSalesReports = async () => {
  const response = await axiosInstance.get('/v1/sales/reports');
  return response.data?.data || response.data;
};

// 8. CRM Leads & Clients (Interoperability)
export const getLeads = async (params) => {
  const response = await axiosInstance.get('/v1/leads', { params });
  return response.data?.data || response.data;
};

export const createLead = async (data) => {
  const response = await axiosInstance.post('/v1/leads', data);
  return response.data?.data || response.data;
};

export const updateLead = async (id, data) => {
  const response = await axiosInstance.put(`/v1/leads/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteLead = async (id) => {
  const response = await axiosInstance.delete(`/v1/leads/${id}`);
  return response.data?.data || response.data;
};

export const getClients = async (params) => {
  const response = await axiosInstance.get('/v1/clients', { params });
  return response.data?.data || response.data;
};

export const getSubscriptions = async (params) => {
  const response = await axiosInstance.get('/v1/subscriptions', { params });
  return response.data?.data || response.data;
};

export const getCommunications = async (params) => {
  const response = await axiosInstance.get('/v1/communications', { params });
  return response.data?.data || response.data;
};

export const getNotifications = async (params) => {
  const response = await axiosInstance.get('/v1/notifications', { params });
  return response.data?.data || response.data;
};
