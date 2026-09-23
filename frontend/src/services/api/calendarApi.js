import calendarApi, {
  listEvents,
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
} from '../calendarApi.js';

export const getEvents = listEvents;

export {
  listEvents,
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
  cancelInstance,
  calendarApi
};

export default calendarApi;
