import axiosInstance from './axiosInstance.js';

export const listInterns = async (params) => {
  const response = await axiosInstance.get('/v1/interns', { params });
  return response.data;
};

export const createIntern = async (data) => {
  const response = await axiosInstance.post('/v1/interns', data);
  return response.data;
};
