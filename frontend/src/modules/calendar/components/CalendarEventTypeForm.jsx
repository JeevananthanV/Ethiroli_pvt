import React, { useState } from 'react';

const CalendarEventTypeForm = ({ eventType, eventTypes, onCreate, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(eventType || {
    label: '',
    description: '',
    icon: 'event',
    defaultDuration: 30,
    color: '#6366f1',
    allowedCreateRoles: [],
    allowedWriteRoles: [],
    notificationTargets: [],
    isActive: true,
    sortOrder: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (role, field) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(role)
        ? current.filter(r => r !== role)
        : [...current, role];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventType) {
      onUpdate(formData);
    } else {
      onCreate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-type-form">
      <h3>{eventType ? 'Edit Event Type' : 'Create Event Type'}</h3>
      <div className="form-group">
        <label>Label</label>
        <input type="text" name="label" value={formData.label} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Icon</label>
        <input type="text" name="icon" value={formData.icon} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Default Duration (min)</label>
        <input type="number" name="defaultDuration" value={formData.defaultDuration} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Color</label>
        <input type="color" name="color" value={formData.color} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Allowed Create Roles</label>
        <div className="checkbox-group">
          {['SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'RECEPTION', 'VENDOR', 'CLIENT'].map(role => (
            <label key={role}>
              <input type="checkbox" checked={(formData.allowedCreateRoles || []).includes(role)} onChange={() => handleRoleChange(role, 'allowedCreateRoles')} />
              {role}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Allowed Write Roles</label>
        <div className="checkbox-group">
          {['SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'RECEPTION'].map(role => (
            <label key={role}>
              <input type="checkbox" checked={(formData.allowedWriteRoles || []).includes(role)} onChange={() => handleRoleChange(role, 'allowedWriteRoles')} />
              {role}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Notification Targets</label>
        <div className="checkbox-group">
          {['SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'RECEPTION'].map(role => (
            <label key={role}>
              <input type="checkbox" checked={(formData.notificationTargets || []).includes(role)} onChange={() => handleRoleChange(role, 'notificationTargets')} />
              {role}
            </label>
          ))}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">{eventType ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default CalendarEventTypeForm;