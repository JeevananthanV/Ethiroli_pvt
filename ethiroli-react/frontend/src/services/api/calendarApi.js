import axiosInstance from './axiosInstance.js';

export const getEvents = async () => {
  const response = await axiosInstance.get('/v1/events');
  return response.data;
};

export const listEvents = getEvents;

export const createEvent = async (data) => {
  const response = await axiosInstance.post('/v1/events', data);
  return response.data;
};

export const calendarApi = {
  getEvents,
  listEvents,
  createEvent,
};
