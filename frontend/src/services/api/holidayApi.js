import axiosInstance from './axiosInstance.js';

export const getHolidays = async () => {
  const response = await axiosInstance.get('/v1/holidays');
  return response.data;
};

export const createHoliday = async (data) => {
  const response = await axiosInstance.post('/v1/holidays', data);
  return response.data;
};
