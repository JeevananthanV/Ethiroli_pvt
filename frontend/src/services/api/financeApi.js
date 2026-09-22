import axiosInstance from './axiosInstance.js';

export const getDashboardSummary = async () => {
  const response = await axiosInstance.get('/v1/finance/dashboard/summary');
  return response.data?.data || response.data;
};

export const getDashboardTrends = async () => {
  const response = await axiosInstance.get('/v1/finance/dashboard/trends');
  return response.data?.data || response.data;
};

export const getTransactions = async (params) => {
  const response = await axiosInstance.get('/v1/finance/transactions', { params });
  return response.data?.data || response.data;
};

export const createTransaction = async (data) => {
  const response = await axiosInstance.post('/v1/finance/transactions', data);
  return response.data?.data || response.data;
};

export const getCashFlowForecast = async () => {
  const response = await axiosInstance.get('/v1/finance/cash-flow/forecast');
  return response.data?.data || response.data;
};

export const getReceivablesAging = async () => {
  const response = await axiosInstance.get('/v1/finance/receivables/aging');
  return response.data?.data || response.data;
};

export const getPayables = async () => {
  const response = await axiosInstance.get('/v1/finance/payables');
  return response.data?.data || response.data;
};

export const getRefunds = async (params) => {
  const response = await axiosInstance.get('/v1/finance/refunds', { params });
  return response.data?.data || response.data;
};

export const createRefund = async (data) => {
  const response = await axiosInstance.post('/v1/finance/refunds', data);
  return response.data?.data || response.data;
};

export const processRefund = async (id, data) => {
  const response = await axiosInstance.post(`/v1/finance/refunds/${id}/process`, data);
  return response.data?.data || response.data;
};

export const getClientLedger = async (clientId) => {
  const response = await axiosInstance.get(`/v1/finance/clients/${clientId}/ledger`);
  return response.data?.data || response.data;
};

export const getBudgets = async (params) => {
  const response = await axiosInstance.get('/v1/finance/budgets', { params });
  return response.data?.data || response.data;
};

export const createBudget = async (data) => {
  const response = await axiosInstance.post('/v1/finance/budgets', data);
  return response.data?.data || response.data;
};

export const getTaxSummary = async () => {
  const response = await axiosInstance.get('/v1/finance/tax/summary');
  return response.data?.data || response.data;
};

export const recordTaxFiling = async (data) => {
  const response = await axiosInstance.post('/v1/finance/tax/filings', data);
  return response.data?.data || response.data;
};

export const getFinancialReports = async (params) => {
  const response = await axiosInstance.get('/v1/finance/reports', { params });
  return response.data?.data || response.data;
};

export const financeApi = {
  getDashboardSummary,
  getDashboardTrends,
  getTransactions,
  createTransaction,
  getCashFlowForecast,
  getReceivablesAging,
  getPayables,
  getRefunds,
  createRefund,
  processRefund,
  getClientLedger,
  getBudgets,
  createBudget,
  getTaxSummary,
  recordTaxFiling,
  getFinancialReports
};

export default financeApi;
