import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listEvents, createEvent } from '../../services/api/calendarApi.js';

export default function EventModal({ isOpen, onClose, eventId }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', type: 'event', description: '' });
  const [editingId, setEditingId] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listEvents();
      const list = Array.isArray(data) ? data : [];
      if (eventId) {
        const found = list.find((e) => e.id === eventId);
        if (found) {
          setFormData({
            title: found.title || '',
            date: found.date || '',
            type: found.type || 'event',
            description: found.description || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (isOpen) {
      loadEvents();
      if (eventId) {
        setEditingId(eventId);
      } else {
        setEditingId(null);
        setFormData({ title: '', date: '', type: 'event', description: '' });
      }
    }
  }, [isOpen, eventId, loadEvents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await createEvent({ id: editingId, ...formData });
      } else {
        await createEvent(formData);
      }
      onClose?.();
    } catch (err) {
      alert(`Failed to save event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setSaving(true);
    try {
      await createEvent({ id: editingId, _method: 'DELETE' });
      onClose?.();
    } catch (err) {
      alert(`Failed to delete event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3 className="modalTitle">{editingId ? 'Edit Event' : 'Create Event'}</h3>
          <button className="closeBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label className="label required">Title</label>
                <input
                  className="inputField"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label required">Date</label>
                <input
                  className="inputField"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <select
                  className="select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 20 }}>
                <div>
                  {editingId && (
                    <button type="button" className="btn danger" onClick={handleDelete} disabled={saving}>
                      Delete
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="btn secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
