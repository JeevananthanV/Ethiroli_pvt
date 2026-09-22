import axiosInstance from './axiosInstance.js';

export const getAttendance = async (params = {}) => {
  const response = await axiosInstance.get('/v1/attendance', { params });
  return response.data;
};

export const checkIn = async (data = {}) => {
  const response = await axiosInstance.post('/v1/attendance/check-in', data);
  return response.data;
};

export const checkOut = async (data = {}) => {
  const response = await axiosInstance.post('/v1/attendance/check-out', typeof data === 'object' ? data : { id: data });
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/attendance/${id}`, data);
  return response.data;
};

export const getAttendanceSummary = async (params = {}) => {
  const response = await axiosInstance.get('/v1/attendance/summary', { params });
  return response.data;
};

export const listAttendance = getAttendance;

export const attendanceApi = {
  getAll: getAttendance,
  getAttendance,
  checkIn,
  checkOut,
  update: updateAttendance,
  getSummary: getAttendanceSummary,
};

export default attendanceApi;
