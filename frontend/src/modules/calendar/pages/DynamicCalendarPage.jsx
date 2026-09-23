import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import {
  fetchRoleConfig,
  fetchAllowedTypes,
  fetchExpandedEvents,
  createEventThunk,
  deleteEventThunk,
  skipInstanceThunk,
  cancelInstanceThunk,
  setViewMode,
  setCurrentDate,
  setSelectedEventType
} from '../../../store/slices/calendarSlice.js';

export default function DynamicCalendarPage({ defaultRole = null }) {
  const dispatch = useDispatch();
  const {
    expandedEvents,
    allowedTypes,
    roleConfig,
    viewMode,
    currentDate,
    selectedEventType,
    loading,
    actionLoading
  } = useSelector((state) => state.calendar);

  const authUser = useSelector((state) => state.auth?.user || state.auth?.currentUser);
  const activeRole = authUser?.role || defaultRole || 'EMPLOYEE';

  // Navigation state
  const [activeDate, setActiveDate] = useState(new Date(currentDate || Date.now()));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type_id: '',
    start_time: '',
    end_time: '',
    location: '',
    meeting_link: '',
    priority: 'medium',
    is_recurring: false,
    frequency: 'WEEKLY',
    interval: 1,
    days_of_week: [],
    max_occurrences: 4,
    end_date: ''
  });

  // Load configs on mount or role change
  useEffect(() => {
    dispatch(fetchRoleConfig());
    dispatch(fetchAllowedTypes());
  }, [dispatch, activeRole]);

  // Set default event type once types are loaded
  useEffect(() => {
    if (allowedTypes && allowedTypes.length > 0 && !formData.event_type_id) {
      const firstType = allowedTypes[0];
      setFormData((prev) => ({
        ...prev,
        event_type_id: firstType.id
      }));
    }
  }, [allowedTypes]);

  // Calculate range bounds based on active view and date
  const rangeBounds = useMemo(() => {
    const d = new Date(activeDate);
    const year = d.getFullYear();
    const month = d.getMonth();

    if (viewMode === 'month') {
      const start = new Date(year, month - 1, 20);
      const end = new Date(year, month + 2, 10);
      return {
        start: start.toISOString().slice(0, 19).replace('T', ' '),
        end: end.toISOString().slice(0, 19).replace('T', ' ')
      };
    } else if (viewMode === 'week') {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(d.setDate(diff - 7));
      const end = new Date(d.setDate(diff + 14));
      return {
        start: start.toISOString().slice(0, 19).replace('T', ' '),
        end: end.toISOString().slice(0, 19).replace('T', ' ')
      };
    } else {
      // Day or Agenda
      const start = new Date(year, month, d.getDate() - 15);
      const end = new Date(year, month, d.getDate() + 45);
      return {
        start: start.toISOString().slice(0, 19).replace('T', ' '),
        end: end.toISOString().slice(0, 19).replace('T', ' ')
      };
    }
  }, [activeDate, viewMode]);

  // Fetch events when range or type changes
  useEffect(() => {
    dispatch(
      fetchExpandedEvents({
        start: rangeBounds.start,
        end: rangeBounds.end,
        event_type_id: selectedEventType === 'ALL' ? null : selectedEventType
      })
    );
  }, [dispatch, rangeBounds, selectedEventType]);

  // Filter events by search query
  const filteredEvents = useMemo(() => {
    return expandedEvents.filter((ev) => {
      if (selectedEventType !== 'ALL' && ev.event_type_id !== selectedEventType) {
        return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        ev.title?.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q) ||
        ev.type_label?.toLowerCase().includes(q)
      );
    });
  }, [expandedEvents, selectedEventType, searchQuery]);

  // Handlers for month/week navigation
  const handlePrev = () => {
    const next = new Date(activeDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setActiveDate(next);
  };

  const handleNext = () => {
    const next = new Date(activeDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setActiveDate(next);
  };

  const handleToday = () => {
    setActiveDate(new Date());
  };

  // Open creation modal with prefilled date
  const handleOpenCreateModal = (targetDate = null, prefilledTypeId = null) => {
    const base = targetDate ? new Date(targetDate) : new Date();
    base.setMinutes(0, 0, 0);
    const startStr = new Date(base.getTime() + 3600000).toISOString().slice(0, 16);
    const endStr = new Date(base.getTime() + 7200000).toISOString().slice(0, 16);

    const typeId = prefilledTypeId || (allowedTypes[0]?.id || '');
    setFormData({
      title: '',
      description: '',
      event_type_id: typeId,
      start_time: startStr,
      end_time: endStr,
      location: '',
      meeting_link: '',
      priority: 'medium',
      is_recurring: false,
      frequency: 'WEEKLY',
      interval: 1,
      days_of_week: [new Date().getDay()],
      max_occurrences: 4,
      end_date: ''
    });
    setShowCreateModal(true);
  };

  // Handle Event Type selection & auto-adjust duration
  const handleEventTypeChange = (typeId) => {
    const selected = allowedTypes.find((t) => t.id === typeId);
    const durationMin = selected?.default_duration_minutes || 60;

    let updatedEnd = formData.end_time;
    if (formData.start_time) {
      const s = new Date(formData.start_time);
      const e = new Date(s.getTime() + durationMin * 60000);
      updatedEnd = e.toISOString().slice(0, 16);
    }

    setFormData((prev) => ({
      ...prev,
      event_type_id: typeId,
      end_time: updatedEnd
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.event_type_id || !formData.start_time || !formData.end_time) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      event_type_id: formData.event_type_id,
      start_time: formData.start_time.replace('T', ' ') + ':00',
      end_time: formData.end_time.replace('T', ' ') + ':00',
      location: formData.location || null,
      meeting_link: formData.meeting_link || null,
      priority: formData.priority
    };

    if (formData.is_recurring) {
      payload.recurrence_rule = {
        frequency: formData.frequency,
        interval: parseInt(formData.interval, 10) || 1,
        days_of_week: formData.days_of_week,
        max_occurrences: formData.max_occurrences ? parseInt(formData.max_occurrences, 10) : null,
        end_date: formData.end_date || null
      };
    }

    const result = await dispatch(createEventThunk(payload));
    if (!result.error) {
      setShowCreateModal(false);
      // Refresh range
      dispatch(
        fetchExpandedEvents({
          start: rangeBounds.start,
          end: rangeBounds.end,
          event_type_id: selectedEventType === 'ALL' ? null : selectedEventType
        })
      );
    } else {
      alert(result.payload || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteEventThunk(id));
      setSelectedEvent(null);
    }
  };

  const handleSkipInstance = async (parentEventId, dateIso) => {
    if (window.confirm('Skip this recurrence instance for this specific date?')) {
      await dispatch(skipInstanceThunk({ parentEventId, date: dateIso.split(' ')[0] }));
      setSelectedEvent(null);
    }
  };

  const handleCancelInstance = async (instanceId) => {
    if (window.confirm('Cancel this specific occurrence?')) {
      await dispatch(cancelInstanceThunk(instanceId));
      setSelectedEvent(null);
    }
  };

  // Month grid calculations
  const monthData = useMemo(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dayNumber: d, isCurrentMonth: false, dateStr });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dayNumber: d, isCurrentMonth: true, dateStr });
    }
    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dayNumber: d, isCurrentMonth: false, dateStr });
    }

    return cells;
  }, [activeDate]);

  // Map events to date strings for quick grid lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of filteredEvents) {
      if (!ev.start_time) continue;
      const dateStr = ev.start_time.split(' ')[0] || ev.start_time.split('T')[0];
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(ev);
    }
    return map;
  }, [filteredEvents]);

  // Week days calculation
  const weekDays = useMemo(() => {
    const curr = new Date(activeDate);
    const first = curr.getDate() - curr.getDay();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.getFullYear(), curr.getMonth(), first + i);
      const dateStr = next.toISOString().split('T')[0];
      days.push({
        date: next,
        dateStr,
        dayName: next.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: next.getDate(),
        isToday: new Date().toISOString().split('T')[0] === dateStr
      });
    }
    return days;
  }, [activeDate]);

  const canCreateEvents = allowedTypes && allowedTypes.length > 0;
  const pageTitle = roleConfig?.calendar_title || 'Dynamic Operations Calendar';
  const monthName = activeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <AdminPage
      title={pageTitle}
      subtitle={`Role: ${activeRole} • Working Hours: ${roleConfig?.work_start_time || '09:00'} – ${roleConfig?.work_end_time || '18:00'}`}
      actions={
        <div className="d-flex align-items-center gap-2">
          {canCreateEvents && (
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
              onClick={() => handleOpenCreateModal()}
            >
              <i className="bi bi-plus-circle"></i>
              <span>New Event</span>
            </button>
          )}
        </div>
      }
    >
      <div className="container-fluid px-0 py-2">
        {/* Top Control Bar: Month Navigation, Search, View Switcher */}
        <div className="card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            {/* Date Navigator */}
            <div className="d-flex align-items-center gap-2">
              <div className="btn-group shadow-sm">
                <button type="button" className="btn btn-outline-secondary" onClick={handlePrev}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary px-3" onClick={handleToday}>
                  Today
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleNext}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
              <h4 className="fw-bold mb-0 text-dark ms-2">{monthName}</h4>
            </div>

            {/* Search Input */}
            <div className="input-group input-group-sm" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search events, topics, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn btn-light border" onClick={() => setSearchQuery('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="btn-group btn-group-sm shadow-sm">
              <button
                type="button"
                className={`btn ${viewMode === 'month' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => dispatch(setViewMode('month'))}
              >
                <i className="bi bi-calendar3 me-1"></i> Month
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'week' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => dispatch(setViewMode('week'))}
              >
                <i className="bi bi-calendar-week me-1"></i> Week
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'day' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => dispatch(setViewMode('day'))}
              >
                <i className="bi bi-calendar-day me-1"></i> Day
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'agenda' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => dispatch(setViewMode('agenda'))}
              >
                <i className="bi bi-view-list me-1"></i> Agenda
              </button>
            </div>
          </div>

          {/* Quick-Create Types Shortcuts */}
          {roleConfig?.quick_create_types && roleConfig.quick_create_types.length > 0 && canCreateEvents && (
            <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top flex-wrap">
              <span className="small text-muted fw-semibold">Quick Create:</span>
              {roleConfig.quick_create_types.map((typeId) => {
                const t = allowedTypes.find((item) => item.id === typeId);
                if (!t) return null;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2 rounded-pill"
                    onClick={() => handleOpenCreateModal(null, t.id)}
                  >
                    <i className={`bi ${t.icon || 'bi-plus'}`}></i>
                    <span>+ {t.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Dynamic Event Type Filters */}
          <div className="d-flex align-items-center gap-2 mt-3 pt-2 border-top flex-wrap">
            <span className="small text-muted fw-semibold">Filter:</span>
            <button
              type="button"
              className={`btn btn-sm rounded-pill ${
                selectedEventType === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => dispatch(setSelectedEventType('ALL'))}
            >
              All Types ({expandedEvents.length})
            </button>
            {allowedTypes.map((t) => {
              const count = expandedEvents.filter((e) => e.event_type_id === t.id).length;
              const isSelected = selectedEventType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-1 ${
                    isSelected ? 'btn-dark' : 'btn-light border text-secondary'
                  }`}
                  onClick={() => dispatch(setSelectedEventType(isSelected ? 'ALL' : t.id))}
                >
                  <span
                    className="rounded-circle d-inline-block"
                    style={{ width: '8px', height: '8px', backgroundColor: t.color || '#6366f1' }}
                  ></span>
                  <span>{t.label}</span>
                  <span className="badge bg-secondary-subtle text-dark ms-1">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================== VIEW MODES ===================== */}

        {/* 1. MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden bg-white mb-4">
            <div className="row g-0 text-center fw-semibold text-muted bg-light border-bottom py-2">
              <div className="col">Sun</div>
              <div className="col">Mon</div>
              <div className="col">Tue</div>
              <div className="col">Wed</div>
              <div className="col">Thu</div>
              <div className="col">Fri</div>
              <div className="col">Sat</div>
            </div>

            <div className="row g-0" style={{ minHeight: '620px' }}>
              {monthData.map((cell, idx) => {
                const dayEvents = eventsByDate[cell.dateStr] || [];
                const isToday = new Date().toISOString().split('T')[0] === cell.dateStr;

                return (
                  <div
                    key={idx}
                    className={`col border-bottom border-end p-2 d-flex flex-column ${
                      !cell.isCurrentMonth ? 'bg-light text-muted' : 'bg-white'
                    }`}
                    style={{ width: '14.285%', minHeight: '120px', transition: 'background-color 0.15s ease' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span
                        className={`badge ${
                          isToday ? 'bg-primary text-white rounded-circle p-2' : 'text-secondary fw-bold'
                        }`}
                        style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {cell.dayNumber}
                      </span>
                      {cell.isCurrentMonth && canCreateEvents && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-muted p-0 text-decoration-none opacity-50 hover-opacity-100"
                          title="Create event on this day"
                          onClick={() => handleOpenCreateModal(cell.dateStr)}
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      )}
                    </div>

                    {/* Day Events Stack */}
                    <div className="d-flex flex-column gap-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-truncate px-2 py-1 rounded small fw-semibold cursor-pointer shadow-xs"
                          style={{
                            backgroundColor: (ev.type_color || '#6366f1') + '22',
                            color: ev.type_color || '#4f46e5',
                            borderLeft: `3px solid ${ev.type_color || '#4f46e5'}`,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedEvent(ev)}
                          title={`${ev.title} (${ev.start_time?.split(' ')[1]?.slice(0, 5) || ''})`}
                        >
                          <span className="me-1">
                            {ev.start_time ? ev.start_time.split(' ')[1]?.slice(0, 5) : ''}
                          </span>
                          <span>{ev.title}</span>
                          {ev.parent_event_id && <i className="bi bi-arrow-repeat ms-1 text-muted"></i>}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span
                          className="badge bg-light text-primary border cursor-pointer mt-1"
                          onClick={() => {
                            setActiveDate(new Date(cell.dateStr));
                            dispatch(setViewMode('agenda'));
                          }}
                        >
                          +{dayEvents.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. WEEK VIEW */}
        {viewMode === 'week' && (
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden bg-white mb-4">
            <div className="row g-0 text-center bg-light border-bottom py-2">
              <div className="col-1 fw-bold text-muted small">Time</div>
              {weekDays.map((w, idx) => (
                <div key={idx} className="col fw-bold">
                  <span className="text-muted small d-block">{w.dayName}</span>
                  <span className={`badge ${w.isToday ? 'bg-primary text-white' : 'text-dark'} fs-6`}>
                    {w.dayNumber}
                  </span>
                </div>
              ))}
            </div>

            <div className="row g-0" style={{ maxHeight: '650px', overflowY: 'auto' }}>
              <div className="col-1 border-end bg-light text-center py-2">
                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => (
                  <div key={hour} className="small text-muted" style={{ height: '60px' }}>
                    {hour}:00
                  </div>
                ))}
              </div>

              {weekDays.map((w, idx) => {
                const dayEvents = eventsByDate[w.dateStr] || [];
                return (
                  <div key={idx} className="col border-end p-1 position-relative" style={{ minHeight: '780px' }}>
                    {dayEvents.map((ev) => {
                      const startTime = ev.start_time ? ev.start_time.split(' ')[1] : '09:00';
                      const startHour = parseInt(startTime.split(':')[0], 10);
                      const startMin = parseInt(startTime.split(':')[1], 10);
                      const topOffset = Math.max(0, (startHour - 8) * 60 + startMin);

                      return (
                        <div
                          key={ev.id}
                          className="p-2 rounded mb-1 shadow-sm cursor-pointer border"
                          style={{
                            backgroundColor: (ev.type_color || '#6366f1') + '18',
                            borderColor: ev.type_color || '#6366f1',
                            color: '#1f2937',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedEvent(ev)}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span
                              className="badge"
                              style={{ backgroundColor: ev.type_color || '#6366f1', color: '#fff', fontSize: '0.7rem' }}
                            >
                              {ev.type_label || ev.event_type}
                            </span>
                            <small className="text-muted fw-bold">
                              {ev.start_time ? ev.start_time.split(' ')[1]?.slice(0, 5) : ''}
                            </small>
                          </div>
                          <strong className="d-block small text-truncate">{ev.title}</strong>
                          {ev.meeting_link && (
                            <span className="badge bg-primary text-white small mt-1">
                              <i className="bi bi-camera-video me-1"></i>Meet
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. AGENDA & DAY VIEW */}
        {(viewMode === 'agenda' || viewMode === 'day') && (
          <div className="row g-4">
            {/* Events List */}
            <div className="col-lg-7">
              <div className="d-flex flex-column gap-3">
                {filteredEvents.length === 0 ? (
                  <div className="card border-0 shadow-sm p-5 text-center text-muted bg-white rounded-3">
                    <i className="bi bi-calendar-x fs-1 text-secondary mb-2"></i>
                    <h5 className="fw-bold text-dark">No Scheduled Events Found</h5>
                    <p className="small mb-3">There are no commitments matching your current filters or date range.</p>
                    {canCreateEvents && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mx-auto"
                        onClick={() => handleOpenCreateModal()}
                      >
                        + Create First Event
                      </button>
                    )}
                  </div>
                ) : (
                  filteredEvents.map((ev) => {
                    const isSelected = selectedEvent?.id === ev.id;
                    const dateFormatted = ev.start_time
                      ? new Date(ev.start_time.replace(' ', 'T')).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Date unset';

                    return (
                      <div
                        key={ev.id}
                        className={`card border shadow-sm p-3 rounded-3 cursor-pointer ${
                          isSelected ? 'border-primary border-2 bg-light' : 'bg-white'
                        }`}
                        onClick={() => setSelectedEvent(ev)}
                        style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span
                            className="badge d-inline-flex align-items-center gap-1"
                            style={{
                              backgroundColor: (ev.type_color || '#6366f1') + '22',
                              color: ev.type_color || '#6366f1',
                              border: `1px solid ${ev.type_color || '#6366f1'}`
                            }}
                          >
                            <i className={`bi ${ev.type_icon || 'bi-calendar-event'}`}></i>
                            <span>{ev.type_label || ev.event_type}</span>
                          </span>

                          <span className="small text-muted fw-semibold">
                            <i className="bi bi-clock me-1"></i>
                            {ev.start_time ? ev.start_time.split(' ')[1]?.slice(0, 5) : ''}
                            {ev.end_time ? ` – ${ev.end_time.split(' ')[1]?.slice(0, 5)}` : ''}
                          </span>
                        </div>

                        <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                          <span>{ev.title}</span>
                          {ev.parent_event_id && (
                            <span className="badge bg-secondary-subtle text-secondary small fw-normal">
                              <i className="bi bi-arrow-repeat me-1"></i>Recurring
                            </span>
                          )}
                        </h6>
                        {ev.description && <p className="text-muted small mb-2">{ev.description}</p>}

                        <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                          <span className="small fw-semibold text-primary">
                            <i className="bi bi-calendar-event me-1"></i>
                            {dateFormatted}
                          </span>
                          <div className="d-flex align-items-center gap-2">
                            {ev.meeting_link && (
                              <a
                                href={ev.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="badge bg-primary text-white text-decoration-none py-1 px-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="bi bi-camera-video me-1"></i>Meet
                              </a>
                            )}
                            {ev.location && (
                              <span className="small text-muted">
                                <i className="bi bi-geo-alt me-1"></i>
                                {ev.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Event Inspection Panel */}
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 sticky-top rounded-3 bg-white" style={{ top: '1rem' }}>
                <div className="card-header bg-white py-3 border-0">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-info-circle me-1 text-primary"></i>Event Details & Actions
                  </h6>
                </div>
                <div className="card-body p-4 pt-0">
                  {selectedEvent ? (
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span
                          className="badge d-inline-flex align-items-center gap-1"
                          style={{
                            backgroundColor: (selectedEvent.type_color || '#6366f1') + '22',
                            color: selectedEvent.type_color || '#6366f1',
                            border: `1px solid ${selectedEvent.type_color || '#6366f1'}`
                          }}
                        >
                          <i className={`bi ${selectedEvent.type_icon || 'bi-calendar-event'}`}></i>
                          <span>{selectedEvent.type_label || selectedEvent.event_type}</span>
                        </span>

                        <span className="badge bg-light text-secondary border text-uppercase">
                          {selectedEvent.status || 'scheduled'}
                        </span>
                      </div>

                      <h5 className="fw-bold text-dark mb-2">{selectedEvent.title}</h5>

                      <p className="text-primary fw-semibold small mb-3">
                        <i className="bi bi-calendar-check me-1"></i>
                        {selectedEvent.start_time}
                        {selectedEvent.end_time ? ` – ${selectedEvent.end_time}` : ''}
                      </p>

                      {selectedEvent.description && (
                        <div className="mb-3">
                          <strong className="text-dark small d-block mb-1">Description:</strong>
                          <p className="text-muted small">{selectedEvent.description}</p>
                        </div>
                      )}

                      {selectedEvent.location && (
                        <div className="mb-3 p-2 bg-light rounded border small">
                          <strong className="text-dark d-block">Location / Venue:</strong>
                          <span className="text-muted">{selectedEvent.location}</span>
                        </div>
                      )}

                      {selectedEvent.meeting_link && (
                        <div className="mb-3">
                          <a
                            href={selectedEvent.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                          >
                            <i className="bi bi-camera-video"></i>
                            <span>Join Meeting</span>
                          </a>
                        </div>
                      )}

                      {/* Recurrence Actions */}
                      {selectedEvent.parent_event_id && (
                        <div className="mb-3 p-3 bg-light rounded-3 border">
                          <strong className="text-dark small d-block mb-2">
                            <i className="bi bi-arrow-repeat me-1 text-primary"></i>Recurring Occurrence Controls:
                          </strong>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm w-50"
                              onClick={() => handleSkipInstance(selectedEvent.parent_event_id, selectedEvent.start_time)}
                            >
                              <i className="bi bi-skip-forward me-1"></i>Skip Date
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm w-50"
                              onClick={() => handleCancelInstance(selectedEvent.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>Cancel Occurrence
                            </button>
                          </div>
                        </div>
                      )}

                      {/* General Delete */}
                      <div className="border-top pt-3 mt-3 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => handleDeleteEvent(selectedEvent.id)}
                        >
                          <i className="bi bi-trash"></i>
                          <span>Delete Event</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-calendar2-week fs-1 d-block mb-2 text-secondary"></i>
                      <p className="small mb-0">Select any event from the schedule to inspect links, materials, and recurrence controls.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== CREATE EVENT MODAL ===================== */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-3">
              <div className="modal-header bg-light border-0 py-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-plus text-primary"></i>
                  <span>Schedule Role Event</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Event Type */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Event Type *</label>
                      <select
                        className="form-select"
                        value={formData.event_type_id}
                        onChange={(e) => handleEventTypeChange(e.target.value)}
                        required
                      >
                        {allowedTypes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label} (Default: {t.default_duration_minutes}m)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Priority</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Title */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Event Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Architectural Design Review, Sprint Planning, Candidate Interview"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Description / Agenda</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Key agenda topics, prerequisites, reference links..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    {/* Start Time */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Start Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        required
                      />
                    </div>

                    {/* End Time */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">End Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        required
                      />
                    </div>

                    {/* Meeting Link */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Meeting URL (Google Meet / Zoom)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://meet.google.com/..."
                        value={formData.meeting_link}
                        onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                      />
                    </div>

                    {/* Location */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Location / Room</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Online, Conference Room A, HQ Floor 3"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    {/* Recurrence Section */}
                    <div className="col-12 pt-2">
                      <div className="p-3 bg-light rounded-3 border">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="recurrenceSwitch"
                            checked={formData.is_recurring}
                            onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                          />
                          <label className="form-check-label fw-bold text-dark small" htmlFor="recurrenceSwitch">
                            Repeat this Event (Recurring Commitment)
                          </label>
                        </div>

                        {formData.is_recurring && (
                          <div className="row g-3">
                            <div className="col-md-4">
                              <label className="form-label small text-muted">Frequency</label>
                              <select
                                className="form-select form-select-sm"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                              >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                              </select>
                            </div>

                            <div className="col-md-4">
                              <label className="form-label small text-muted">Repeat Every</label>
                              <div className="input-group input-group-sm">
                                <input
                                  type="number"
                                  min="1"
                                  max="12"
                                  className="form-control"
                                  value={formData.interval}
                                  onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                                />
                                <span className="input-group-text small">
                                  {formData.frequency === 'DAILY' ? 'days' : formData.frequency === 'WEEKLY' ? 'weeks' : 'months'}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <label className="form-label small text-muted">Occurrences Limit</label>
                              <input
                                type="number"
                                min="1"
                                max="52"
                                className="form-control form-control-sm"
                                placeholder="e.g. 4 instances"
                                value={formData.max_occurrences}
                                onChange={(e) => setFormData({ ...formData, max_occurrences: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light border-0 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 shadow-sm"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Scheduling...' : 'Save & Broadcast'}
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
