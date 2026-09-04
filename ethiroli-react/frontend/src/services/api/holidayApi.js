import axiosInstance from './axiosInstance.js';

export const getHolidays = async (params) => {
  const response = await axiosInstance.get('/v1/calendar/holidays', { params });
  return response.data;
};

export const createHoliday = async (holidayData) => {
  const response = await axiosInstance.post('/v1/calendar/holidays', holidayData);
  return response.data;
};
