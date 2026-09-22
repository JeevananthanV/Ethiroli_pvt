import axiosInstance from './axiosInstance.js';

export const listInterns = async () => {
  const response = await axiosInstance.get('/v1/interns');
  return response.data;
};

export const createIntern = async (data) => {
  const response = await axiosInstance.post('/v1/interns', data);
  return response.data;
};

export const getInternDashboard = async () => {
  const response = await axiosInstance.get('/v1/interns/dashboard');
  return response.data;
};

export const getInternPortalConfig = async () => {
  const response = await axiosInstance.get('/v1/interns/portal-config');
  return response.data;
};

