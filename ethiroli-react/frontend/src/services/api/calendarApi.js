import axiosInstance from './axiosInstance.js';

export const listEvents = async (params) => {
  const response = await axiosInstance.get('/v1/calendar/events', { params });
  return response.data;
};
export const getEvents = listEvents;

export const createEvent = async (data) => {
  const response = await axiosInstance.post('/v1/calendar/events', data);
  return response.data;
};

export const listHolidays = async () => {
  const response = await axiosInstance.get('/v1/calendar/holidays');
  return response.data;
};

export const createHoliday = async (data) => {
  const response = await axiosInstance.post('/v1/calendar/holidays', data);
  return response.data;
};
