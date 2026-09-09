import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listEvents, createEvent } from '../../services/api/calendarApi.js';
import { getHolidays, createHoliday } from '../../services/api/holidayApi.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'event' });
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [evRes, holRes] = await Promise.all([
        listEvents().catch(() => []),
        getHolidays().catch(() => []),
      ]);
      setEvents(Array.isArray(evRes) ? evRes : []);
      setHolidays(Array.isArray(holRes) ? holRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createEvent({ title: newEvent.title, date: newEvent.date, type: newEvent.type });
      setShowEventForm(false);
      setNewEvent({ title: '', date: '', type: 'event' });
      loadData();
    } catch (err) {
      alert(`Failed to create event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateHoliday = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createHoliday({ name: newEvent.title, date: newEvent.date });
      setShowEventForm(false);
      setNewEvent({ title: '', date: '', type: 'event' });
      loadData();
    } catch (err) {
      alert(`Failed to create holiday: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr });
    }
    return days;
  };

  const getItemsForDate = (dateStr) => {
    if (!dateStr) return [];
    const dayEvents = events.filter((e) => e.date === dateStr);
    const dayHolidays = holidays.filter((h) => h.date === dateStr);
    return [...dayEvents.map((e) => ({ ...e, category: 'Event' })), ...dayHolidays.map((h) => ({ ...h, category: 'Holiday' }))];
  };

  const calendarDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const monthStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthEvents = events.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const monthHolidays = holidays.filter((h) => {
      const d = new Date(h.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    return {
      total: monthEvents.length + monthHolidays.length,
      events: monthEvents.length,
      holidays: monthHolidays.length,
    };
  }, [currentDate, events, holidays]);

  const goToPrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <AdminPage
      title="Calendar"
      subtitle="Events and holidays overview"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={goToToday}>Today</button>
          <button className="btn primary" onClick={() => { setNewEvent({ title: '', date: selectedDate || new Date().toISOString().split('T')[0], type: 'event' }); setShowEventForm(true); }}>
            + Add Event
          </button>
        </div>
      }
    >
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">This Month</p>
          <p className="statValue">{monthStats.total}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Events</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text' }}>
            {monthStats.events}
          </p>
        </div>
        <div className="statCard">
          <p className="statLabel">Holidays</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text' }}>
            {monthStats.holidays}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn secondary" onClick={goToPrevMonth}>&lt;</button>
            <h3 className="cardTitle" style={{ margin: 0 }}>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button className="btn secondary" onClick={goToNextMonth}>&gt;</button>
          </div>
        </div>
        <div className="cardBody" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DAYS.map((day) => (
              <div key={day} style={{ padding: '10px', textAlign: 'center', fontWeight: 600, fontSize: 12, color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                {day}
              </div>
            ))}
            {calendarDays.map((item, idx) => {
              const items = getItemsForDate(item.date);
              const isToday = item.date === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.date) {
                      setSelectedDate(item.date);
                      setNewEvent((prev) => ({ ...prev, date: item.date }));
                    }
                  }}
                  style={{
                    minHeight: 100,
                    padding: '8px',
                    border: '1px solid var(--admin-border-subtle)',
                    borderTop: 'none',
                    borderLeft: 'none',
                    background: isToday ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                    cursor: item.date ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                  }}
                >
                  {item.day && (
                    <>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: isToday ? 700 : 400,
                        background: isToday ? 'var(--admin-primary)' : 'transparent',
                        color: isToday ? '#fff' : 'var(--admin-text-primary)',
                        marginBottom: 4,
                      }}>
                        {item.day}
                      </div>
                      {items.slice(0, 3).map((ev, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 4,
                            marginBottom: 2,
                            background: ev.category === 'Holiday' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: ev.category === 'Holiday' ? '#f59e0b' : '#3b82f6',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {items.length > 3 && (
                        <div style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>
                          +{items.length - 3} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="modalOverlay" onClick={() => setShowEventForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Add Event / Holiday</h3>
              <button className="closeBtn" onClick={() => setShowEventForm(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <form onSubmit={newEvent.type === 'holiday' ? handleCreateHoliday : handleCreateEvent}>
                <div className="formGroup">
                  <label className="label required">Title</label>
                  <input
                    className="inputField"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label className="label required">Date</label>
                  <input
                    className="inputField"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Type</label>
                  <select
                    className="select"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  >
                    <option value="event">Event</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button type="button" className="btn secondary" onClick={() => setShowEventForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
