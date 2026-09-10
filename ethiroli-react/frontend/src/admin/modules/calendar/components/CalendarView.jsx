import React, { useEffect, useState } from 'react';
import { getEvents, createEvent } from '../../../../services/api/calendarApi.js';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'event' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getEvents().catch(() => []);
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEvent(newEvent);
      setShowEventForm(false);
      setNewEvent({ title: '', date: '', type: 'event' });
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  if (loading) return <div className="loading">Loading calendar...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Calendar</h2>
          <p className="pageSubtitle">Events and schedule</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowEventForm(true)} className="btn btnPrimary">+ Add Event</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {events.length === 0 ? (
            <div className="emptyState"><h3>No Events</h3><p>No events scheduled.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Title</th><th>Date</th><th>Type</th></tr></thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.title}</td>
                    <td>{ev.date ? new Date(ev.date).toLocaleDateString() : '—'}</td>
                    <td><span className="statusTag active">{ev.type || 'Event'}</span></td>
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
            <form onSubmit={handleCreate}>
              <div className="formGroup">
                <label className="label">Event Title</label>
                <input className="input" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Date</label>
                <input className="input" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <select className="select" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                </select>
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
