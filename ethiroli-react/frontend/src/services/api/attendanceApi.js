import axiosInstance from './axiosInstance.js';

export const listAttendance = async (params) => {
  const response = await axiosInstance.get('/v1/attendance', { params });
  return response.data;
};

export const checkIn = async () => {
  const response = await axiosInstance.post('/v1/attendance/check-in');
  return response.data;
};

export const checkOut = async () => {
  const response = await axiosInstance.post('/v1/attendance/check-out');
  return response.data;
};

export const manualCorrect = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/attendance/${id}`, data);
  return response.data;
};
