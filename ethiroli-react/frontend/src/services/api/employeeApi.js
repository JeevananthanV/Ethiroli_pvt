import axiosInstance from './axiosInstance.js';

export const getEmployees = async () => {
  const response = await axiosInstance.get('/v1/employees');
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await axiosInstance.post('/v1/employees', data);
  return response.data;
};

export const getEmployee = async (id) => {
  const response = await axiosInstance.get(`/v1/employees/${id}`);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await axiosInstance.put(`/v1/employees/${id}`, data);
  return response.data;
};

export const listEmployees = getEmployees;

export const employeeApi = {
  getAll: getEmployees,
  getById: getEmployee,
  create: createEmployee,
  update: updateEmployee,
};
