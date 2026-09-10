import axiosInstance from './axiosInstance.js';

export const getSalaryStructures = async () => {
  const response = await axiosInstance.get('/v1/payroll/structures');
  return response.data;
};

export const createSalaryStructure = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/structures', data);
  return response.data;
};

export const processPayroll = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/process', data);
  return response.data;
};

export const getPayrollHistory = async () => {
  const response = await axiosInstance.get('/v1/payroll/history');
  return response.data;
};

export const listPayrollHistory = getPayrollHistory;

export const payrollApi = {
  getSalaryStructures,
  createSalaryStructure,
  processPayroll,
  getPayrollHistory,
  listPayrollHistory,
};
