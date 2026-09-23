import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events, eventTypes, eventFilters, onEventClick, onCreateEvent, onUpdateEvent, onDeleteEvent }) => {
  const [view, setView] = React.useState('month');
  const [date, setDate] = React.useState(new Date());

  const getEventTypeColor = (eventType) => {
    const et = eventTypes?.find(e => e.label === eventType);
    return et?.color || '#6366f1';
  };

  const filteredEvents = React.useMemo(() => {
    if (!events?.length) return [];
    if (!eventFilters || eventFilters.length === 0) return events;

    return events.filter(event => {
      const eventType = eventTypes?.find(e => e.label === event.event_type);
      return eventFilters.includes(eventType?.label);
    });
  }, [events, eventFilters, eventTypes]);

  const calendarEvents = React.useMemo(() => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      event_type: event.event_type,
      event: event,
    }));
  }, [filteredEvents]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: getEventTypeColor(event.event_type),
        borderRadius: '4px',
        border: 'none',
        color: '#fff',
        padding: '2px 4px',
      },
    };
  };

  const handleSelectSlot = ({ start, end }) => {
    const newEvent = {
      title: '',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      event_type: eventTypes?.[0]?.label || 'general',
    };
    onCreateEvent?.(newEvent);
  };

  const selectable = true;

  return (
    <div className="calendar-component">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={date}
        onChange={setDate}
        onNavigate={setDate}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onEventClick}
        onSelectSlot={handleSelectSlot}
        selectable={selectable}
        style={{ height: 600, marginTop: 30 }}
        views={['day', 'week', 'month', 'agenda']}
      />
    </div>
  );
};

export default CalendarComponent;