import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import '../styles/premiumCalendar.css';

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
  const activeRole = defaultRole || authUser?.role || 'EMPLOYEE';

  // Date and Time normalization helpers
  const formatDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatTimeOnly = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const timePart = dateTimeStr.includes('T') ? dateTimeStr.split('T')[1] : dateTimeStr.split(' ')[1];
    return timePart ? timePart.slice(0, 5) : '';
  };

  const getEventDateKey = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    return dateTimeStr.split('T')[0].split(' ')[0];
  };

  const formatDateTimeRange = (start, end) => {
    if (!start) return 'Schedule unset';
    try {
      const s = new Date(start.replace(' ', 'T'));
      const dateFormatted = s.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const sTime = formatTimeOnly(start);
      const eTime = formatTimeOnly(end);
      return `${dateFormatted} • ${sTime}${eTime ? ` – ${eTime}` : ''}`;
    } catch {
      return `${start} to ${end || ''}`;
    }
  };

  // State
  const [activeDate, setActiveDate] = useState(new Date(currentDate || Date.now()));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllTypesDropdown, setShowAllTypesDropdown] = useState(false);

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
    dispatch(fetchRoleConfig(activeRole));
    dispatch(fetchAllowedTypes(activeRole));
  }, [dispatch, activeRole]);

  // Set initial view mode based on roleConfig default_view
  const hasInitializedView = React.useRef(false);
  useEffect(() => {
    if (roleConfig?.default_view && !hasInitializedView.current) {
      dispatch(setViewMode(roleConfig.default_view));
      hasInitializedView.current = true;
    }
  }, [dispatch, roleConfig?.default_view]);

  // Set default event type once types are loaded
  useEffect(() => {
    if (allowedTypes && allowedTypes.length > 0 && !formData.event_type_id) {
      setFormData((prev) => ({
        ...prev,
        event_type_id: allowedTypes[0].id
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
        event_type_id: selectedEventType === 'ALL' ? null : selectedEventType,
        role: activeRole
      })
    );
  }, [dispatch, rangeBounds, selectedEventType, activeRole]);

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

  // Auto-select first event in Agenda/Day view if none selected
  useEffect(() => {
    if (!selectedEvent && filteredEvents.length > 0) {
      setSelectedEvent(filteredEvents[0]);
    }
  }, [filteredEvents, selectedEvent]);

  // Smart Filter Types: only types with events > 0, plus current selected if active
  const smartFilterTypes = useMemo(() => {
    if (!allowedTypes) return [];
    return allowedTypes.filter((t) => {
      const count = expandedEvents.filter((e) => e.event_type_id === t.id).length;
      return count > 0 || selectedEventType === t.id;
    });
  }, [allowedTypes, expandedEvents, selectedEventType]);

  // Navigation handlers
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

    const typeId = prefilledTypeId || (creatableTypes[0]?.id || allowedTypes[0]?.id || '');
    setFormData({
      title: '',
      description: '',
      event_type_id: typeId,
      role: ['SUPER_ADMIN', 'ADMIN', 'HR'].includes(activeRole) ? 'ALL' : activeRole,
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
      role: formData.role || activeRole,
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
      setShowDetailModal(false);
    }
  };

  const handleSkipInstance = async (parentEventId, dateIso) => {
    if (window.confirm('Skip this recurrence instance for this specific date?')) {
      await dispatch(skipInstanceThunk({ parentEventId, date: getEventDateKey(dateIso) }));
      setSelectedEvent(null);
      setShowDetailModal(false);
    }
  };

  const handleCancelInstance = async (instanceId) => {
    if (window.confirm('Cancel this specific occurrence?')) {
      await dispatch(cancelInstanceThunk(instanceId));
      setSelectedEvent(null);
      setShowDetailModal(false);
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
      const dateStr = formatDateKey(new Date(year, month - 1, d));
      cells.push({ dayNumber: d, isCurrentMonth: false, dateStr });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateKey(new Date(year, month, d));
      cells.push({ dayNumber: d, isCurrentMonth: true, dateStr });
    }
    // Next month padding
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = formatDateKey(new Date(year, month + 1, d));
      cells.push({ dayNumber: d, isCurrentMonth: false, dateStr });
    }

    return cells;
  }, [activeDate]);

  // Map events to date strings for quick grid lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of filteredEvents) {
      if (!ev.start_time) continue;
      const dateStr = getEventDateKey(ev.start_time);
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
    const todayStr = formatDateKey(new Date());
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.getFullYear(), curr.getMonth(), first + i);
      const dateStr = formatDateKey(next);
      days.push({
        date: next,
        dateStr,
        dayName: next.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: next.getDate(),
        isToday: todayStr === dateStr
      });
    }
    return days;
  }, [activeDate]);

  // Event types current role is permitted to create
  const creatableTypes = useMemo(() => {
    if (!allowedTypes) return [];
    if (['SUPER_ADMIN', 'ADMIN'].includes(activeRole)) return allowedTypes;
    return allowedTypes.filter((t) => {
      const roles = t.allowed_create_roles || [];
      return roles.includes('ALL') || roles.includes(activeRole);
    });
  }, [allowedTypes, activeRole]);

  const canCreateEvents = creatableTypes.length > 0;

  // Role-configured quick add types
  const quickAddTypes = useMemo(() => {
    const configuredIds = roleConfig?.quick_create_types || [];
    if (configuredIds.length > 0) {
      const mapped = configuredIds
        .map((id) => creatableTypes.find((t) => t.id === id))
        .filter(Boolean);
      if (mapped.length > 0) return mapped;
    }
    return creatableTypes.slice(0, 3);
  }, [roleConfig, creatableTypes]);

  // Ownership & role-based event permissions
  const canUserDelete = (event) => {
    if (!event) return false;
    if (['SUPER_ADMIN', 'ADMIN'].includes(activeRole)) return true;
    return Boolean(authUser?.id && event.created_by === authUser.id);
  };

  const canUserEdit = (event) => {
    if (!event) return false;
    if (['SUPER_ADMIN', 'ADMIN'].includes(activeRole)) return true;
    if (authUser?.id && event.created_by === authUser.id) return true;
    const typeObj = allowedTypes?.find(
      (t) => t.id === event.event_type_id || t.label?.toUpperCase() === (event.type_label || event.event_type)?.toUpperCase()
    );
    const writeRoles = typeObj?.allowed_write_roles || [];
    return writeRoles.includes('ALL') || writeRoles.includes(activeRole);
  };

  const pageTitle = roleConfig?.calendar_title || `${activeRole.replace('_', ' ')} Calendar`;
  const monthName = activeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Handle clicking an event to view details
  const handleEventClick = (ev) => {
    setSelectedEvent(ev);
    if (viewMode === 'month' || viewMode === 'week') {
      setShowDetailModal(true);
    }
  };

  return (
    <AdminPage
      title={pageTitle}
      subtitle={`Operational workspace & scheduling center for ${activeRole.replace('_', ' ')} • Working Hours: ${roleConfig?.work_start_time || '09:00'} – ${roleConfig?.work_end_time || '18:00'}`}
    >
      <div className="premium-calendar-wrapper">
        {/* ===================== COMMAND DECK (MAIN TOOLBAR) ===================== */}
        <div className="calendar-command-deck">
          {/* Tier 1: Left = Nav & Month, Right = View Switcher & + New Event */}
          <div className="deck-main-tier">
            {/* Left: Nav & Month/Year */}
            <div className="deck-nav-section">
              <div className="calendar-nav-group">
                <button
                  type="button"
                  className="nav-btn"
                  onClick={handlePrev}
                  title="Previous Period"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="nav-today"
                  onClick={handleToday}
                  title="Go to Today"
                >
                  Today
                </button>
                <button
                  type="button"
                  className="nav-btn"
                  onClick={handleNext}
                  title="Next Period"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>

              <div className="calendar-date-display">
                <h3 className="month-heading-text">{monthName}</h3>
                <span className="events-counter-badge">
                  {filteredEvents.length} Active
                </span>
              </div>
            </div>

            {/* Right: View Switcher & Action Button */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="deck-view-switcher">
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                  onClick={() => dispatch(setViewMode('month'))}
                >
                  <i className="bi bi-grid-3x3"></i>
                  <span>Month</span>
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                  onClick={() => dispatch(setViewMode('week'))}
                >
                  <i className="bi bi-calendar-week"></i>
                  <span>Week</span>
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
                  onClick={() => dispatch(setViewMode('day'))}
                >
                  <i className="bi bi-calendar-day"></i>
                  <span>Day</span>
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'agenda' ? 'active' : ''}`}
                  onClick={() => dispatch(setViewMode('agenda'))}
                >
                  <i className="bi bi-list-check"></i>
                  <span>Agenda</span>
                </button>
              </div>

              {canCreateEvents && (
                <button
                  type="button"
                  className="btn-primary-schedule"
                  onClick={() => handleOpenCreateModal()}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>New Event</span>
                </button>
              )}
            </div>
          </div>

          {/* Tier 2: Smart Filters (Left) & Search + Quick Add (Right) */}
          <div className="deck-sub-tier">
            {/* Smart Filters (Active categories only) */}
            <div className="smart-filters-cluster">
              <span className="small text-muted fw-bold me-1">Filter:</span>
              <button
                type="button"
                className={`filter-badge-pill ${selectedEventType === 'ALL' ? 'active' : ''}`}
                onClick={() => dispatch(setSelectedEventType('ALL'))}
              >
                <span>All Events</span>
                <span className="pill-count">{expandedEvents.length}</span>
              </button>

              {smartFilterTypes.map((t) => {
                const count = expandedEvents.filter((e) => e.event_type_id === t.id).length;
                const isSelected = selectedEventType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`filter-badge-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => dispatch(setSelectedEventType(isSelected ? 'ALL' : t.id))}
                  >
                    <span
                      className="pill-dot"
                      style={{ backgroundColor: t.color || '#819E35' }}
                    ></span>
                    <span>{t.label}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}

              {/* More Types Dropdown Toggle */}
              {allowedTypes.length > smartFilterTypes.length && (
                <div className="position-relative d-inline-block">
                  <button
                    type="button"
                    className="filter-badge-pill text-secondary"
                    onClick={() => setShowAllTypesDropdown(!showAllTypesDropdown)}
                  >
                    <span>More Types ({allowedTypes.length - smartFilterTypes.length})</span>
                    <i className="bi bi-chevron-down ms-1" style={{ fontSize: '0.65rem' }}></i>
                  </button>

                  {showAllTypesDropdown && (
                    <div
                      className="dropdown-menu show shadow-lg border p-2 position-absolute"
                      style={{ zIndex: 100, minWidth: '180px', top: '100%', left: 0 }}
                    >
                      {allowedTypes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className="dropdown-item d-flex align-items-center justify-content-between small py-1 px-2 rounded"
                          onClick={() => {
                            dispatch(setSelectedEventType(t.id));
                            setShowAllTypesDropdown(false);
                          }}
                        >
                          <span className="d-flex align-items-center gap-2">
                            <span
                              className="pill-dot"
                              style={{ backgroundColor: t.color || '#819E35' }}
                            ></span>
                            <span>{t.label}</span>
                          </span>
                          <span className="text-muted small">
                            {expandedEvents.filter((e) => e.event_type_id === t.id).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Search Box & Quick Add */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="deck-search-box">
                <i className="bi bi-search deck-search-icon"></i>
                <input
                  type="text"
                  className="deck-search-input"
                  placeholder="Search events, clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="deck-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>

              {/* Quick-Add Shortcuts dynamically configured per role */}
              {quickAddTypes.length > 0 && canCreateEvents && (
                <div className="quick-add-cluster">
                  {quickAddTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="quick-add-btn"
                      onClick={() => handleOpenCreateModal(null, t.id)}
                      title={`Quick add ${t.label}`}
                    >
                      <i className={`bi ${t.icon || 'bi-plus'}`}></i>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================== 1. MONTH VIEW ===================== */}
        {viewMode === 'month' && (
          <div className="calendar-month-container">
            <div className="calendar-weekday-bar">
              <div className="weekday-col-title">Sun</div>
              <div className="weekday-col-title">Mon</div>
              <div className="weekday-col-title">Tue</div>
              <div className="weekday-col-title">Wed</div>
              <div className="weekday-col-title">Thu</div>
              <div className="weekday-col-title">Fri</div>
              <div className="weekday-col-title">Sat</div>
            </div>

            <div className="calendar-grid-cells">
              {monthData.map((cell, idx) => {
                const dayEvents = eventsByDate[cell.dateStr] || [];
                const isToday = formatDateKey(new Date()) === cell.dateStr;

                return (
                  <div
                    key={idx}
                    className={`grid-cell ${!cell.isCurrentMonth ? 'out-of-month' : ''}`}
                  >
                    <div className="cell-top-bar">
                      <span className={`cell-day-num ${isToday ? 'is-today' : ''}`}>
                        {cell.dayNumber}
                      </span>
                      {cell.isCurrentMonth && canCreateEvents && (
                        <button
                          type="button"
                          className="cell-add-btn"
                          title="Schedule event on this day"
                          onClick={() => handleOpenCreateModal(cell.dateStr)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      )}
                    </div>

                    {/* Day Events Stack */}
                    <div className="cell-events-list">
                      {dayEvents.slice(0, 3).map((ev) => {
                        const eventColor = ev.type_color || '#819E35';
                        const timeStr = formatTimeOnly(ev.start_time);
                        return (
                          <div
                            key={ev.id}
                            className="event-micro-card"
                            style={{
                              '--card-accent': eventColor,
                              '--card-border': eventColor + '40'
                            }}
                            onClick={() => handleEventClick(ev)}
                            title={`${ev.title}${timeStr ? ` (${timeStr})` : ''}`}
                          >
                            {timeStr && <span className="micro-time">{timeStr}</span>}
                            <span className="micro-title">{ev.title}</span>
                            {ev.meeting_link && <i className="bi bi-camera-video-fill micro-icon text-primary"></i>}
                            {ev.parent_event_id && <i className="bi bi-arrow-repeat micro-icon text-muted"></i>}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div
                          className="more-chip"
                          onClick={() => {
                            setActiveDate(new Date(cell.dateStr));
                            dispatch(setViewMode('agenda'));
                          }}
                        >
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== 2. WEEK VIEW ===================== */}
        {viewMode === 'week' && (
          <div className="calendar-week-container">
            <div className="week-top-bar">
              <div className="week-corner-gutter">Hour</div>
              {weekDays.map((w, idx) => (
                <div key={idx} className="week-header-day">
                  <span className="week-day-title">{w.dayName}</span>
                  <span className={`week-day-badge ${w.isToday ? 'is-today' : ''}`}>
                    {w.dayNumber}
                  </span>
                </div>
              ))}
            </div>

            <div className="week-grid-body">
              <div className="week-hour-column">
                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => (
                  <div key={hour} className="week-time-tick">
                    {hour < 10 ? `0${hour}` : hour}:00
                  </div>
                ))}
              </div>

              {weekDays.map((w, idx) => {
                const dayEvents = eventsByDate[w.dateStr] || [];
                return (
                  <div key={idx} className="week-day-events-column">
                    {dayEvents.map((ev) => {
                      const color = ev.type_color || '#819E35';
                      return (
                        <div
                          key={ev.id}
                          className="week-event-block"
                          style={{
                            '--card-accent': color,
                            '--card-border': color + '35'
                          }}
                          onClick={() => handleEventClick(ev)}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span
                              className="badge"
                              style={{ backgroundColor: color, color: '#fff', fontSize: '0.68rem' }}
                            >
                              {ev.type_label || ev.event_type}
                            </span>
                            <small className="fw-bold text-muted" style={{ fontSize: '0.72rem' }}>
                              {formatTimeOnly(ev.start_time)}
                            </small>
                          </div>
                          <div className="fw-bold text-truncate text-dark small mb-1">{ev.title}</div>
                          {ev.meeting_link && (
                            <span className="badge bg-success-subtle text-success small py-1 px-2">
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

        {/* ===================== 3. AGENDA & DAY VIEW ===================== */}
        {(viewMode === 'agenda' || viewMode === 'day') && (
          <div className="row g-4 mb-4">
            {/* Events Feed Column */}
            <div className="col-lg-7">
              <div className="agenda-feed-column">
                {filteredEvents.length === 0 ? (
                  <div className="calendar-month-container p-5 text-center text-muted">
                    <i className="bi bi-calendar-x fs-1 text-secondary mb-3 d-block"></i>
                    <h5 className="fw-bold text-dark mb-2">No Scheduled Events Found</h5>
                    <p className="small mb-4 text-muted">
                      There are no commitments matching your current filters or date range.
                    </p>
                    {canCreateEvents && (
                      <button
                        type="button"
                        className="btn-primary-schedule mx-auto"
                        onClick={() => handleOpenCreateModal()}
                      >
                        <i className="bi bi-plus-lg"></i>
                        <span>Create First Event</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredEvents.map((ev) => {
                    const isSelected = selectedEvent?.id === ev.id;
                    const eventColor = ev.type_color || '#819E35';
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
                        className={`agenda-card ${isSelected ? 'is-active' : ''}`}
                        style={{ '--card-accent': eventColor }}
                        onClick={() => setSelectedEvent(ev)}
                      >
                        <div className="agenda-card-top">
                          <span
                            className="agenda-category-badge"
                            style={{
                              backgroundColor: `${eventColor}18`,
                              color: eventColor,
                              border: `1px solid ${eventColor}35`
                            }}
                          >
                            <i className={`bi ${ev.type_icon || 'bi-calendar-event'}`}></i>
                            <span>{ev.type_label || ev.event_type}</span>
                          </span>

                          <span className="agenda-time-text">
                            <i className="bi bi-clock"></i>
                            <span>
                              {formatTimeOnly(ev.start_time)}
                              {ev.end_time ? ` – ${formatTimeOnly(ev.end_time)}` : ''}
                            </span>
                          </span>
                        </div>

                        <div className="agenda-card-title">
                          <span>{ev.title}</span>
                          {ev.parent_event_id && (
                            <span className="badge bg-light text-secondary border small fw-normal">
                              <i className="bi bi-arrow-repeat me-1"></i>Recurring
                            </span>
                          )}
                          {ev.priority && (
                            <span className={`priority-tag ${ev.priority.toLowerCase()}`}>
                              {ev.priority}
                            </span>
                          )}
                        </div>

                        {ev.description && <p className="agenda-card-desc">{ev.description}</p>}

                        <div className="agenda-card-footer">
                          <span className="small fw-semibold text-secondary d-flex align-items-center gap-1">
                            <i className="bi bi-calendar3"></i>
                            <span>{dateFormatted}</span>
                          </span>

                          <div className="d-flex align-items-center gap-2">
                            {ev.meeting_link && (
                              <a
                                href={ev.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-meet-join"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="bi bi-camera-video-fill"></i>
                                <span>Join Meet</span>
                              </a>
                            )}
                            {ev.location && (
                              <span className="small text-muted d-flex align-items-center gap-1">
                                <i className="bi bi-geo-alt-fill text-danger"></i>
                                <span>{ev.location}</span>
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

            {/* Sticky Inspection Side Panel */}
            <div className="col-lg-5">
              <div className="calendar-side-panel">
                <div className="side-panel-header">
                  <div className="side-panel-title">
                    <i className="bi bi-card-checklist text-success"></i>
                    <span>Event Details & Actions</span>
                  </div>
                  {selectedEvent && (
                    <span className="badge bg-white text-secondary border px-2 py-1 text-uppercase fw-bold">
                      {selectedEvent.status || 'Scheduled'}
                    </span>
                  )}
                </div>

                <div className="side-panel-body">
                  {selectedEvent ? (
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span
                          className="agenda-category-badge"
                          style={{
                            backgroundColor: `${selectedEvent.type_color || '#819E35'}18`,
                            color: selectedEvent.type_color || '#819E35',
                            border: `1px solid ${selectedEvent.type_color || '#819E35'}35`
                          }}
                        >
                          <i className={`bi ${selectedEvent.type_icon || 'bi-calendar-event'}`}></i>
                          <span>{selectedEvent.type_label || selectedEvent.event_type}</span>
                        </span>

                        {selectedEvent.priority && (
                          <span className={`priority-tag ${selectedEvent.priority.toLowerCase()}`}>
                            {selectedEvent.priority}
                          </span>
                        )}
                      </div>

                      <h4 className="fw-bold text-dark mb-3">{selectedEvent.title}</h4>

                      <div className="side-prop-box">
                        <span className="side-prop-label">Schedule & Duration</span>
                        <div className="fw-bold text-dark d-flex align-items-center gap-2 small">
                          <i className="bi bi-calendar-check text-primary"></i>
                          <span>
                            {formatDateTimeRange(selectedEvent.start_time, selectedEvent.end_time)}
                          </span>
                        </div>
                      </div>

                      {selectedEvent.description && (
                        <div className="side-prop-box">
                          <span className="side-prop-label">Description / Notes</span>
                          <p className="text-secondary small mb-0">{selectedEvent.description}</p>
                        </div>
                      )}

                      {selectedEvent.location && (
                        <div className="side-prop-box">
                          <span className="side-prop-label">Location / Room</span>
                          <div className="d-flex align-items-center gap-2 text-dark small">
                            <i className="bi bi-geo-alt-fill text-danger"></i>
                            <span className="fw-semibold">{selectedEvent.location}</span>
                          </div>
                        </div>
                      )}

                      {selectedEvent.meeting_link && (
                        <div className="mb-4">
                          <a
                            href={selectedEvent.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary-schedule w-100 justify-content-center py-2"
                          >
                            <i className="bi bi-camera-video-fill"></i>
                            <span>Launch Video Meeting</span>
                          </a>
                        </div>
                      )}

                      {/* Recurrence Actions */}
                      {selectedEvent.parent_event_id && canUserEdit(selectedEvent) && (
                        <div className="side-prop-box">
                          <span className="side-prop-label">
                            <i className="bi bi-arrow-repeat me-1 text-primary"></i>
                            Recurring Occurrence Controls
                          </span>
                          <div className="d-flex gap-2 mt-2">
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm w-50 fw-semibold"
                              onClick={() => handleSkipInstance(selectedEvent.parent_event_id, selectedEvent.start_time)}
                            >
                              <i className="bi bi-skip-forward me-1"></i>Skip Date
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm w-50 fw-semibold"
                              onClick={() => handleCancelInstance(selectedEvent.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>Cancel Occurrence
                            </button>
                          </div>
                        </div>
                      )}

                      {/* General Delete / Read Only */}
                      <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                        {canUserDelete(selectedEvent) ? (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill px-3 ms-auto"
                            onClick={() => handleDeleteEvent(selectedEvent.id)}
                          >
                            <i className="bi bi-trash"></i>
                            <span>Delete Event</span>
                          </button>
                        ) : (
                          <span className="badge bg-light text-secondary border px-3 py-2 ms-auto">
                            <i className="bi bi-shield-lock me-1"></i> Read-Only Event
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-calendar2-range fs-1 d-block mb-3 text-secondary"></i>
                      <h6 className="fw-bold text-dark">No Event Selected</h6>
                      <p className="small mb-3 text-muted">
                        Select any appointment or event from the schedule to inspect links, materials, and recurrence controls.
                      </p>
                      {canCreateEvents && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          onClick={() => handleOpenCreateModal()}
                        >
                          + New Event
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== EVENT DETAIL MODAL (FOR MONTH & WEEK VIEWS) ===================== */}
      {showDetailModal && selectedEvent && (
        <div className="cal-backdrop" onClick={() => setShowDetailModal(false)}>
          <div className="cal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cal-dialog-header">
              <div className="cal-dialog-title">
                <span
                  className="agenda-category-badge"
                  style={{
                    backgroundColor: `${selectedEvent.type_color || '#819E35'}20`,
                    color: selectedEvent.type_color || '#819E35',
                    border: `1px solid ${selectedEvent.type_color || '#819E35'}40`
                  }}
                >
                  <i className={`bi ${selectedEvent.type_icon || 'bi-calendar-event'}`}></i>
                  <span>{selectedEvent.type_label || selectedEvent.event_type}</span>
                </span>
                <span>Event Details</span>
              </div>
              <button
                type="button"
                className="cal-dialog-close"
                onClick={() => setShowDetailModal(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            <div className="cal-dialog-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4 className="fw-bold text-dark mb-0">{selectedEvent.title}</h4>
                {selectedEvent.priority && (
                  <span className={`priority-tag ${selectedEvent.priority.toLowerCase()}`}>
                    {selectedEvent.priority}
                  </span>
                )}
              </div>

              <div className="side-prop-box">
                <span className="side-prop-label">Schedule & Duration</span>
                <div className="fw-bold text-dark d-flex align-items-center gap-2 small">
                  <i className="bi bi-calendar-check text-primary"></i>
                  <span>
                    {formatDateTimeRange(selectedEvent.start_time, selectedEvent.end_time)}
                  </span>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="side-prop-box">
                  <span className="side-prop-label">Agenda / Description</span>
                  <p className="text-secondary small mb-0">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.location && (
                <div className="side-prop-box">
                  <span className="side-prop-label">Location / Room</span>
                  <div className="d-flex align-items-center gap-2 text-dark small">
                    <i className="bi bi-geo-alt-fill text-danger"></i>
                    <span className="fw-semibold">{selectedEvent.location}</span>
                  </div>
                </div>
              )}

              {selectedEvent.meeting_link && (
                <div className="mb-4">
                  <a
                    href={selectedEvent.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary-schedule w-100 justify-content-center py-2"
                  >
                    <i className="bi bi-camera-video-fill"></i>
                    <span>Launch Video Meeting</span>
                  </a>
                </div>
              )}

              {/* Recurrence Actions */}
              {selectedEvent.parent_event_id && canUserEdit(selectedEvent) && (
                <div className="side-prop-box">
                  <span className="side-prop-label">
                    <i className="bi bi-arrow-repeat me-1 text-primary"></i>
                    Recurring Occurrence Controls
                  </span>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-warning btn-sm w-50 fw-semibold"
                      onClick={() => handleSkipInstance(selectedEvent.parent_event_id, selectedEvent.start_time)}
                    >
                      <i className="bi bi-skip-forward me-1"></i>Skip Date
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm w-50 fw-semibold"
                      onClick={() => handleCancelInstance(selectedEvent.id)}
                    >
                      <i className="bi bi-x-circle me-1"></i>Cancel Occurrence
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="cal-dialog-footer">
              {canUserDelete(selectedEvent) ? (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <i className="bi bi-trash me-1"></i>Delete Event
                </button>
              ) : (
                <span className="badge bg-light text-secondary border px-3 py-2">
                  <i className="bi bi-shield-lock me-1"></i> Read-Only Event
                </span>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm rounded-pill px-4"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CREATE EVENT MODAL ===================== */}
      {showCreateModal && (
        <div className="cal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="cal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cal-dialog-header">
              <div className="cal-dialog-title">
                <i className="bi bi-calendar-plus-fill text-success"></i>
                <span>Schedule New Event</span>
              </div>
              <button
                type="button"
                className="cal-dialog-close"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="cal-dialog-body">
                <div className="row g-3">
                  {/* Event Type - restricted to creatable types for activeRole */}
                  <div className="col-md-6">
                    <label className="cal-input-label">Event Category *</label>
                    <select
                      className="cal-modal-select"
                      value={formData.event_type_id}
                      onChange={(e) => handleEventTypeChange(e.target.value)}
                      required
                    >
                      {creatableTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label} ({t.default_duration_minutes}m)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Selector Grid */}
                  <div className="col-md-6">
                    <label className="cal-input-label">Priority Level</label>
                    <div className="modal-priority-selector">
                      {['low', 'medium', 'high', 'urgent'].map((p) => {
                        const isSelected = formData.priority === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            className={`priority-btn ${isSelected ? `is-${p}` : ''}`}
                            onClick={() => setFormData({ ...formData, priority: p })}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Audience / Role Scope (Admin, Super Admin, HR) */}
                  {['SUPER_ADMIN', 'ADMIN', 'HR'].includes(activeRole) && (
                    <div className="col-12">
                      <label className="cal-input-label">Target Audience / Role Scope</label>
                      <select
                        className="cal-modal-select"
                        value={formData.role || 'ALL'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="ALL">🌐 All Roles (Organization-Wide)</option>
                        <option value="EMPLOYEE">👥 Employees Only</option>
                        <option value="INTERN">🎓 Interns Only</option>
                        <option value="TUTOR">📚 Tutors / Instructors Only</option>
                        <option value="STUDENT">🎒 Students Only</option>
                        <option value="PROJECT_MANAGER">🚀 Project Managers Only</option>
                        <option value="HR">💼 HR Department Only</option>
                        <option value="SALES">📈 Sales Team Only</option>
                        <option value="FINANCE">💳 Finance Department Only</option>
                        <option value="RECEPTION">🏢 Reception / Front Desk Only</option>
                      </select>
                    </div>
                  )}

                  {/* Title */}
                  <div className="col-12">
                    <label className="cal-input-label">Event Title *</label>
                    <input
                      type="text"
                      className="cal-modal-input"
                      placeholder="e.g. Design System Review, Sprint Demo, Client Presentation"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="cal-input-label">Agenda & Reference Notes</label>
                    <textarea
                      className="cal-modal-textarea"
                      rows="2"
                      placeholder="Key objectives, prerequisites, materials..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  {/* Start Time */}
                  <div className="col-md-6">
                    <label className="cal-input-label">Start Time *</label>
                    <input
                      type="datetime-local"
                      className="cal-modal-input"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>

                  {/* End Time */}
                  <div className="col-md-6">
                    <label className="cal-input-label">End Time *</label>
                    <input
                      type="datetime-local"
                      className="cal-modal-input"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      required
                    />
                  </div>

                  {/* Meeting Link */}
                  <div className="col-md-6">
                    <label className="cal-input-label">Meeting URL (Google Meet / Zoom)</label>
                    <input
                      type="url"
                      className="cal-modal-input"
                      placeholder="https://meet.google.com/..."
                      value={formData.meeting_link}
                      onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    />
                  </div>

                  {/* Location */}
                  <div className="col-md-6">
                    <label className="cal-input-label">Location / Conference Room</label>
                    <input
                      type="text"
                      className="cal-modal-input"
                      placeholder="Online, HQ Room 201, Studio..."
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  {/* Recurrence Section */}
                  <div className="col-12 pt-2">
                    <div className="modal-recurrence-card">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="recurrenceSwitch"
                          checked={formData.is_recurring}
                          onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold text-dark small" htmlFor="recurrenceSwitch">
                          Repeat this Event (Recurring Schedule)
                        </label>
                      </div>

                      {formData.is_recurring && (
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="cal-input-label small">Frequency</label>
                            <select
                              className="cal-modal-select form-select-sm"
                              value={formData.frequency}
                              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            >
                              <option value="DAILY">Daily</option>
                              <option value="WEEKLY">Weekly</option>
                              <option value="MONTHLY">Monthly</option>
                            </select>
                          </div>

                          <div className="col-md-4">
                            <label className="cal-input-label small">Interval</label>
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
                            <label className="cal-input-label small">Max Occurrences</label>
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

              <div className="cal-dialog-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-schedule px-4"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Scheduling...' : 'Save & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
