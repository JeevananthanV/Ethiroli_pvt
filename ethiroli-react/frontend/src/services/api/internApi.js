import axiosInstance from './axiosInstance.js';

export const listInterns = async () => {
  const response = await axiosInstance.get('/v1/interns');
  return response.data;
};

export const createIntern = async (data) => {
  const response = await axiosInstance.post('/v1/interns', data);
  return response.data;
};
