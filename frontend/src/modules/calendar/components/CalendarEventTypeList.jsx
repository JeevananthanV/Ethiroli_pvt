import React, { useState } from 'react';

const CalendarEventTypeList = ({ eventTypes, loading, onEventTypeFilterChange }) => {
  const [filters, setFilters] = React.useState([]);

  const toggleFilter = (label) => {
    const newFilters = filters.includes(label)
      ? filters.filter(f => f !== label)
      : [...filters, label];
    setFilters(newFilters);
    onEventTypeFilterChange(newFilters);
  };

  if (loading) return <div className="loading">Loading event types...</div>;

  return (
    <div className="event-type-list">
      <h3>Event Types</h3>
      {eventTypes.map(et => (
        <div key={et.id || et.label} className="event-type-item">
          <label>
            <input
              type="checkbox"
              checked={filters.includes(et.label)}
              onChange={() => toggleFilter(et.label)}
            />
            <span className="event-type-dot" style={{ backgroundColor: et.color || '#6366f1' }}></span>
            {et.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CalendarEventTypeList;