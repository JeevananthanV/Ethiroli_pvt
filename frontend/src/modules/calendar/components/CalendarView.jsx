import React, { useState } from 'react';

const CalendarView = ({ events, eventTypes, selectedEvent, eventTypeFilters, onEventClick, onCreateEvent, onUpdateEvent, onDeleteEvent }) => {
  const [viewMode, setViewMode] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getEventTypeColor = (eventType) => {
    const et = eventTypes.find(e => e.label === eventType);
    return et ? et.color : '#6366f1';
  };

  const filteredEvents = events.filter(event => {
    if (eventTypeFilters.length === 0) return true;
    const eventType = eventTypes.find(e => e.label === event.event_type);
    return eventTypeFilters.includes(eventType?.label);
  });

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = event.start_time.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h3>Calendar</h3>
        <div className="view-controls">
          <button onClick={() => setViewMode('day')} className={viewMode === 'day' ? 'active' : ''}>Day</button>
          <button onClick={() => setViewMode('week')} className={viewMode === 'week' ? 'active' : ''}>Week</button>
          <button onClick={() => setViewMode('month')} className={viewMode === 'month' ? 'active' : ''}>Month</button>
        </div>
      </div>
      <div className="events-container">
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date} className="day-events">
            <div className="date-header">{date}</div>
            <div className="event-list">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className={`event-item ${event.event_type}`}
                  onClick={() => onEventClick(event)}
                >
                  <div className="event-time">{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="event-title" style={{ borderColor: getEventTypeColor(event.event_type) }}>
                    <span className="event-dot" style={{ backgroundColor: getEventTypeColor(event.event_type) }}></span>
                    {event.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;