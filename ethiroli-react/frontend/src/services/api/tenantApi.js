import axiosInstance from './axiosInstance.js';

export const listTenants = async () => {
  const response = await axiosInstance.get('/v1/tenants');
  return response.data;
};

export const getTenant = async (id) => {
  const response = await axiosInstance.get(`/v1/tenants/${id}`);
  return response.data;
};

export const createTenant = async (data) => {
  const response = await axiosInstance.post('/v1/tenants', data);
  return response.data;
};

export const updateTenant = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/tenants/${id}`, data);
  return response.data;
};

export const deleteTenant = async (id) => {
  const response = await axiosInstance.delete(`/v1/tenants/${id}`);
  return response.data;
};
