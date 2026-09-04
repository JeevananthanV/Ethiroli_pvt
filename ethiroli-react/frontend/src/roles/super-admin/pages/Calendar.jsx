import React, { useEffect, useState } from 'react';
import { listEvents, createEvent } from '../../../services/api/calendarApi.js';
import { getHolidays, createHoliday } from '../../../services/api/holidayApi.js';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', date: '', description: '' });
  const [holidayForm, setHolidayForm] = useState({ name: '', date: '', type: 'public' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsRes, holidaysRes] = await Promise.all([listEvents(), getHolidays()]);
      setEvents(eventsRes?.data || eventsRes || []);
      setHolidays(holidaysRes?.data || holidaysRes || []);
    } catch (err) {
      console.error('Failed to load calendar data', err);
      setError('Failed to load calendar and holidays.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await createEvent(eventForm);
      setEvents(prev => [...prev, data?.data || data]);
      setShowEventModal(false);
      setEventForm({ title: '', date: '', description: '' });
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Failed to create event.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateHoliday = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await createHoliday(holidayForm);
      setHolidays(prev => [...prev, data?.data || data]);
      setShowHolidayModal(false);
      setHolidayForm({ name: '', date: '', type: 'public' });
    } catch (err) {
      console.error('Failed to create holiday', err);
      alert('Failed to create holiday.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading calendar...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  const sortedEvents = [...events].sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date));
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Organizational Operations Calendar</h1>
          <p className="pageSubtitle">Upcoming events and holidays across the platform.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnPrimary" onClick={() => setShowEventModal(true)}>New Event</button>
          <button className="btn btnSecondary" onClick={() => setShowHolidayModal(true)} style={{ marginLeft: '8px' }}>New Holiday</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Upcoming Events ({sortedEvents.length})</h3>
          </div>
          <div className="cardBody">
            {sortedEvents.length === 0 && <div className="emptyState">No upcoming events.</div>}
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Date</th><th>Description</th></tr>
              </thead>
              <tbody>
                {sortedEvents.map((ev, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600' }}>{ev.title || ev.name}</td>
                    <td>{ev.date || ev.start_date || '-'}</td>
                    <td>{ev.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Holidays ({sortedHolidays.length})</h3>
          </div>
          <div className="cardBody">
            {sortedHolidays.length === 0 && <div className="emptyState">No holidays found.</div>}
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Date</th><th>Type</th></tr>
              </thead>
              <tbody>
                {sortedHolidays.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '600' }}>{h.name}</td>
                    <td>{h.date}</td>
                    <td><span className="statusTag active">{h.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEventModal && (
        <div className="modalOverlay" onClick={() => setShowEventModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Create Event</h3>
            <form onSubmit={handleCreateEvent}>
              <div className="formGroup">
                <label className="label">Title</label>
                <input className="input" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Date</label>
                <input type="date" className="input" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <textarea className="textarea" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btnSecondary" onClick={() => setShowEventModal(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Creating...' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHolidayModal && (
        <div className="modalOverlay" onClick={() => setShowHolidayModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Create Holiday</h3>
            <form onSubmit={handleCreateHoliday}>
              <div className="formGroup">
                <label className="label">Holiday Name</label>
                <input className="input" required value={holidayForm.name} onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Date</label>
                <input type="date" className="input" required value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <select className="select" value={holidayForm.type} onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })}>
                  <option value="public">Public</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btnSecondary" onClick={() => setShowHolidayModal(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Creating...' : 'Create Holiday'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
