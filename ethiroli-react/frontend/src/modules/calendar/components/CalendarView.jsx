import React, { useEffect, useState } from 'react';
import { getEvents, createEvent } from '../../../services/api/calendarApi.js';
import { getHolidays, createHoliday } from '../../../services/api/holidayApi.js';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'event' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [evRes, holRes] = await Promise.all([
        getEvents().catch(() => []),
        getHolidays().catch(() => []),
      ]);
      setEvents(Array.isArray(evRes) ? evRes : []);
      setHolidays(Array.isArray(holRes) ? holRes : []);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent({ title: newEvent.title, date: newEvent.date, type: newEvent.type });
      setShowEventForm(false);
      setNewEvent({ title: '', date: '', type: 'event' });
      loadData();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  if (loading) return <div className="loading">Loading calendar...</div>;

  const allItems = [...events.map((e) => ({ ...e, category: 'Event' })), ...holidays.map((h) => ({ ...h, category: 'Holiday' }))];

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Calendar</h2>
          <p className="pageSubtitle">Events and holidays overview</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowEventForm(true)} className="btn btnPrimary">+ Add Event</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardHeader"><h3 className="cardTitle">Upcoming Events & Holidays</h3></div>
        <div className="cardBody">
          {allItems.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)' }}>No events or holidays found.</p>
          ) : (
            <table className="table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th></tr></thead>
              <tbody>
                {allItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td><span className="statusTag active">{item.category}</span></td>
                    <td>{item.date || item.start_date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showEventForm && (
        <div className="modalOverlay" onClick={() => setShowEventForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Add Event</h3>
            <form onSubmit={handleCreateEvent}>
              <div className="formGroup">
                <label className="label">Title</label>
                <input className="input" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Date</label>
                <input className="input" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowEventForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
