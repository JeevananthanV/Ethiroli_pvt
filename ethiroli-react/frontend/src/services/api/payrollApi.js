import axiosInstance from './axiosInstance.js';

export const listSalaryStructures = async (params) => {
  const response = await axiosInstance.get('/v1/payroll/salary-structures', { params });
  return response.data;
};

export const createSalaryStructure = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/salary-structures', data);
  return response.data;
};

export const processPayroll = async (data) => {
  const response = await axiosInstance.post('/v1/payroll/process', data);
  return response.data;
};

export const listPayrollHistory = async (params) => {
  const response = await axiosInstance.get('/v1/payroll/history', { params });
  return response.data;
};
