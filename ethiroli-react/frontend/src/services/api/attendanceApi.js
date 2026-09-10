import axiosInstance from './axiosInstance.js';

export const getAttendance = async () => {
  const response = await axiosInstance.get('/v1/attendance');
  return response.data;
};

export const checkIn = async (data) => {
  const response = await axiosInstance.post('/v1/attendance/check-in', data);
  return response.data;
};

export const checkOut = async (id) => {
  const response = await axiosInstance.post(`/v1/attendance/${id}/check-out`);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axiosInstance.put(`/v1/attendance/${id}`, data);
  return response.data;
};

export const listAttendance = getAttendance;

export const attendanceApi = {
  getAll: getAttendance,
  getAttendance,
  checkIn,
  checkOut,
  update: updateAttendance,
};
