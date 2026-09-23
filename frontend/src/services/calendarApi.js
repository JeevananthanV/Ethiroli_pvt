import api from './axios.js';

export const listEvents = async (params = {}) => {
  const { start_date, end_date, event_type, event_type_id, status, role, page = 1, limit = 50 } = params;
  const query = {};
  if (start_date) query.start_date = start_date;
  if (end_date) query.end_date = end_date;
  if (event_type) query.event_type = event_type;
  if (event_type_id) query.event_type_id = event_type_id;
  if (status) query.status = status;
  if (role) query.role = role;
  query.page = page;
  query.limit = limit;

  const response = await api.get('/calendar/events', { params: query });
  return response.data?.data || response.data;
};

export const listExpanded = async ({ start, end, event_type_id = null }) => {
  const params = { start, end };
  if (event_type_id) params.event_type_id = event_type_id;
  const response = await api.get('/calendar/expand', { params });
  return response.data?.data || response.data || [];
};

export const getEvent = async (id) => {
  const response = await api.get(`/calendar/events/${id}`);
  return response.data?.data || response.data;
};

export const createEvent = async (data) => {
  const response = await api.post('/calendar/events', data);
  return response.data?.data || response.data;
};

export const updateEvent = async (id, data) => {
  const response = await api.patch(`/calendar/events/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/calendar/events/${id}`);
  return response.data?.data || response.data;
};

export const getRoleConfig = async () => {
  const response = await api.get('/calendar/config');
  return response.data?.data || response.data;
};

export const listAllowedTypes = async () => {
  const response = await api.get('/calendar/types');
  return response.data?.data || response.data || [];
};

export const listEventTypes = async (params = {}) => {
  const response = await api.get('/calendar/event-types', { params });
  return response.data?.data || response.data || [];
};

export const createEventType = async (data) => {
  const response = await api.post('/calendar/event-types', data);
  return response.data?.data || response.data;
};

export const updateEventType = async (id, data) => {
  const response = await api.patch(`/calendar/event-types/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteEventType = async (id) => {
  const response = await api.delete(`/calendar/event-types/${id}`);
  return response.data?.data || response.data;
};

export const createRecurrence = async (id, ruleData) => {
  const response = await api.post(`/calendar/events/${id}/recurrence`, ruleData);
  return response.data?.data || response.data;
};

export const getInstances = async (id, params = {}) => {
  const response = await api.get(`/calendar/events/${id}/instances`, { params });
  return response.data?.data || response.data || [];
};

export const skipInstance = async (parentEventId, date) => {
  const response = await api.post(`/calendar/instances/${parentEventId}/skip`, { date });
  return response.data?.data || response.data;
};

export const cancelInstance = async (instanceId) => {
  const response = await api.post(`/calendar/instances/${instanceId}/cancel`);
  return response.data?.data || response.data;
};

const calendarApi = {
  listEvents,
  getEvents: listEvents,
  listExpanded,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getRoleConfig,
  listAllowedTypes,
  listEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
  createRecurrence,
  getInstances,
  skipInstance,
  cancelInstance
};

export default calendarApi;
