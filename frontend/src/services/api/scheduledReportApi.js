import axiosInstance from './axiosInstance.js';

export const listSchedules = async () => {
  const response = await axiosInstance.get('/v1/reports/schedules');
  return response.data;
};

export const createSchedule = async (data) => {
  const response = await axiosInstance.post('/v1/reports/schedules', data);
  return response.data;
};
