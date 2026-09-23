import React from 'react';

const CalendarEventForm = ({ event, eventTypes, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(event || {
    title: '',
    description: '',
    event_type: 'general',
    start_time: '',
    end_time: '',
    location: '',
    is_all_day: false,
    recurrence_rule: null,
    assigned_users: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h3>{event ? 'Edit Event' : 'Create Event'}</h3>
      <div className="form-group">
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Event Type</label>
        <select name="event_type" value={formData.event_type} onChange={handleChange}>
          {eventTypes.map(et => (
            <option key={et.id || et.label} value={et.label}>{et.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Start Time</label>
        <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>End Time</label>
        <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>All Day</label>
        <input type="checkbox" name="is_all_day" checked={formData.is_all_day} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Assigned Users</label>
        <input type="text" name="assigned_users" value={(formData.assigned_users || []).join(', ')} onChange={handleChange} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">{event ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default CalendarEventForm;