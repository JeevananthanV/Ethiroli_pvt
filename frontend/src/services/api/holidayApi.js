import axiosInstance from './axiosInstance.js';

export const getHolidays = async () => {
  const response = await axiosInstance.get('/v1/holidays');
  return response.data;
};

export const getHoliday = async (id) => {
  const response = await axiosInstance.get(`/v1/holidays/${id}`);
  return response.data;
};

export const createHoliday = async (data) => {
  const response = await axiosInstance.post('/v1/holidays', data);
  return response.data;
};

export const updateHoliday = async (id, data) => {
  const response = await axiosInstance.put(`/v1/holidays/${id}`, data);
  return response.data;
};

export const deleteHoliday = async (id) => {
  const response = await axiosInstance.delete(`/v1/holidays/${id}`);
  return response.data;
};

export const holidayApi = {
  getAll: getHolidays,
  getHolidays,
  getHoliday,
  createHoliday,
  updateHoliday,
  deleteHoliday
};

export default holidayApi;

