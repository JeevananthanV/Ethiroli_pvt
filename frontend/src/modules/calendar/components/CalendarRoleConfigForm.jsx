import React, { useState, useEffect } from 'react';

const CalendarRoleConfigForm = ({ role, config, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    enabledEventTypes: config?.enabledEventTypes || [],
    notificationChannels: config?.notificationChannels || ['email'],
    isEnabled: config?.isEnabled ?? true,
  });

  const eventTypes = [
    'INTERVIEW', 'INTERNSHIP', 'TRAINING', 'MEETING', 'DEADLINE',
    'REMINDER', 'NOTIFICATION', 'MILESTONE', 'REVIEW', 'HOLIDAY'
  ];

  useEffect(() => {
    if (config) {
      setFormData({
        enabledEventTypes: config.enabledEventTypes || [],
        notificationChannels: config.notificationChannels || ['email'],
        isEnabled: config.isEnabled ?? true,
      });
    }
  }, [config]);

  const toggleEventType = (type) => {
    setFormData(prev => ({
      ...prev,
      enabledEventTypes: prev.enabledEventTypes.includes(type)
        ? prev.enabledEventTypes.filter(t => t !== type)
        : [...prev.enabledEventTypes, type],
    }));
  };

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      notificationChannels: prev.notificationChannels.includes(channel)
        ? prev.notificationChannels.filter(c => c !== channel)
        : [...prev.notificationChannels, channel],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="role-config-form">
      <h3>Configure {role} Role</h3>
      <div className="form-group">
        <label>
          <input type="checkbox" checked={formData.isEnabled} onChange={e => setFormData({...formData, isEnabled: e.target.checked})} />
          Enable Calendar
        </label>
      </div>
      <div className="form-group">
        <h4>Enabled Event Types</h4>
        <div className="checkbox-group">
          {eventTypes.map(type => (
            <label key={type}>
              <input type="checkbox" checked={formData.enabledEventTypes.includes(type)} onChange={() => toggleEventType(type)} />
              {type}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <h4>Notification Channels</h4>
        <div className="checkbox-group">
          {['email', 'sms', 'push', 'in_app'].map(channel => (
            <label key={channel}>
              <input type="checkbox" checked={formData.notificationChannels.includes(channel)} onChange={() => toggleChannel(channel)} />
              {channel.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default CalendarRoleConfigForm;