import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, fetchEventTypes, createEventThunk, updateEventThunk, deleteEventThunk, clearExpandedInstances } from '../store/slices/calendarSlice.js';
import CalendarEventTypeForm from '../modules/calendar/components/CalendarEventTypeForm.jsx';
import CalendarEventForm from '../modules/calendar/components/CalendarEventForm.jsx';
import CalendarBigView from '../modules/calendar/components/CalendarBigView.jsx';
import CalendarEventTypeList from '../modules/calendar/components/CalendarEventTypeList.jsx';
import CalendarRoleConfigForm from '../modules/calendar/components/CalendarRoleConfigForm.jsx';

const CalendarContainer = () => {
  const dispatch = useDispatch();
  const { events, eventTypes, eventTypesLoading, error } = useSelector(state => state.calendar);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTypeFilters, setEventTypeFilters] = useState([]);

  useEffect(() => {
    dispatch(fetchEvents({ page: 1, limit: 100 }));
    dispatch(fetchEventTypes());
    return () => {
      dispatch(clearExpandedInstances());
    };
  }, [dispatch]);

  const handleCreateEvent = async (eventData) => {
    try {
      const result = await dispatch(createEventThunk(eventData)).unwrap();
      setSelectedEvent(null);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const { id, ...data } = eventData;
      const result = await dispatch(updateEventThunk({ id, data })).unwrap();
      setSelectedEvent(null);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await dispatch(deleteEventThunk(eventId)).unwrap();
      setSelectedEvent(null);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleEventTypeFilterChange = (filters) => {
    setEventTypeFilters(filters);
  };

  return (
    <div className="calendar-container">
      <div className="sidebar">
        <CalendarEventTypeList
          eventTypes={eventTypes}
          loading={eventTypesLoading}
          onEventTypeFilterChange={handleEventTypeFilterChange}
        />
      </div>
      <div className="main-content">
        <div className="header">
          <h2>Calendar</h2>
          <button onClick={() => setSelectedEvent(null)} className="btn-primary">
            New Event
          </button>
        </div>
        <CalendarBigView
          events={events}
          eventTypes={eventTypes}
          eventFilters={eventTypeFilters}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
        {selectedEvent && (
          <div className="event-detail-panel">
            <CalendarEventForm
              event={selectedEvent}
              eventTypes={eventTypes}
              onSave={handleUpdateEvent}
              onCancel={() => setSelectedEvent(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarContainer;