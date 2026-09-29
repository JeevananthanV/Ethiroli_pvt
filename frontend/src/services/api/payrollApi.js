import axiosInstance from './axiosInstance.js';

export const getSalaryStructures = async (params = {}) => {
  const response = await axiosInstance.get('/v1/payroll/salary-structures', { params });
  return response.data;
};

export const getSalaryStructure = async (id) => {
  const response = await axiosInstance.get(`/v1/payroll/salary-structures/${id}`);
  return response.data;
};

export const createSalaryStructure = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/salary-structures', data);
  return response.data;
};

export const updateSalaryStructure = async (id, data) => {
  const response = await axiosInstance.put(`/v1/payroll/salary-structures/${id}`, data);
  return response.data;
};

export const deleteSalaryStructure = async (id) => {
  const response = await axiosInstance.delete(`/v1/payroll/salary-structures/${id}`);
  return response.data;
};

export const processPayroll = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/process', data);
  return response.data;
};

export const runPayrollForAll = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/run-all', data);
  return response.data;
};

export const getPayrollHistory = async (params) => {
  const response = await axiosInstance.get('/v1/payroll/history', { params });
  return response.data;
};

export const listPayrollHistory = getPayrollHistory;

export const getPayslip = async (id) => {
  const response = await axiosInstance.get(`/v1/payroll/${id}/payslip`);
  return response.data;
};

export const payrollApi = {
  getAll: getSalaryStructures,
  getSalaryStructures,
  getSalaryStructure,
  createSalaryStructure,
  updateSalaryStructure,
  deleteSalaryStructure,
  processPayroll,
  runPayrollForAll,
  getPayrollHistory,
  listPayrollHistory: getPayrollHistory,
  getPayslip
};

export default payrollApi;

