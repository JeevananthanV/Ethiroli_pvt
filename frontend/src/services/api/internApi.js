import axiosInstance from './axiosInstance.js';

export const listInterns = async (params = {}) => {
  const response = await axiosInstance.get('/v1/interns', { params });
  return response.data;
};

export const createIntern = async (data) => {
  const response = await axiosInstance.post('/v1/interns', data);
  return response.data;
};

export const getIntern = async (id) => {
  const response = await axiosInstance.get(`/v1/interns/${id}`);
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

export const updateIntern = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/interns/${id}`, data);
  return response.data;
};

export const deleteIntern = async (id) => {
  const response = await axiosInstance.delete(`/v1/interns/${id}`);
  return response.data;
};

export const getAvailableMentors = async () => {
  const response = await axiosInstance.get('/v1/users/mentors');
  return response.data;
};

export const bulkUpdateInterns = async (ids, data) => {
  const response = await axiosInstance.patch('/v1/interns/bulk', { ids, data });
  return response.data;
};

export const exportInterns = async (params = {}) => {
  const response = await axiosInstance.get('/v1/interns/export', { 
    params, 
    responseType: 'blob' 
  });
  return response.data;
};
