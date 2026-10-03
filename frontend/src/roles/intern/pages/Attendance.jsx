import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useModalDismiss, backdropClick } from '../components/useModalDismiss.js';
import { Link } from 'react-router-dom';
import attendanceApi, { localDateKey } from '../../../services/api/attendanceApi.js';
import { formatTime12, formatTime12WithSeconds } from '../../../common/utils/timeFormat.js';

const LEAVE_TYPES = [
  { value: 'SICK', label: 'Sick Leave (Medical)' },
  { value: 'COLLEGE', label: 'College Exam / Academic Duty' },
  { value: 'PERSONAL', label: 'Personal Emergency' }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** 12-hour clock label used across the clock, calendar and day drawer. */
const formatClock = (value) => formatTime12(value);

const formatDuration = (totalSeconds) => {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

/** Inclusive day count between two `YYYY-MM-DD` keys. */
const countDaysInclusive = (fromKey, toKey) => {
  const from = new Date(`${fromKey}T00:00:00`);
  const to = new Date(`${toKey}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  return Math.floor((to - from) / 86400000) + 1;
};

export default function Attendance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Today's punch tracking state
  const [todayRecord, setTodayRecord] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [workMode, setWorkMode] = useState('REMOTE');
  // Which action the big button below the selector will perform.
  // IN is chosen on a fresh day; it flips to OUT automatically once clocked in.
  const [punchDirection, setPunchDirection] = useState('IN');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => formatTime12WithSeconds(new Date()));

  // Modals & drawers
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  // Escape + scroll-lock for all three dialogs. The previous onKeyDown handler
  // sat on the overlay div, which never takes focus, so it rarely fired.
  useModalDismiss(showCheckoutModal, () => setShowCheckoutModal(false));
  useModalDismiss(showLeaveModal, () => setShowLeaveModal(false));
  useModalDismiss(!!selectedDayDetail, () => setSelectedDayDetail(null));
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', reason: '', type: 'SICK' });
  const [alert, setAlert] = useState({ type: '', text: '' });

  // The current local day, held in state so the midnight effect below has a
  // dependency that actually changes when the day rolls over IST.
  const [todayKey, setTodayKey] = useState(() => localDateKey());
  const today = useMemo(() => new Date(`${todayKey}T00:00:00`), [todayKey]);

  // `loadAttendance` is memoised with [] so it can read the current day without
  // being re-created on every midnight tick.
  const todayKeyRef = useRef(todayKey);
  todayKeyRef.current = todayKey;

  // Visible calendar month. Defaults to the month the intern is actually in,
  // instead of the hard-coded September 2026 the grid used to be pinned to.
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const viewMonthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const shiftMonth = (delta) => {
    setViewMonth((prevMonth) => {
      const next = new Date(viewYear, prevMonth + delta, 1);
      setViewYear(next.getFullYear());
      return next.getMonth();
    });
  };

  const isViewingCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // Load live attendance records
  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pull a wide window so month navigation is not limited to 60 rows.
      const [listRes, sumRes] = await Promise.all([
        attendanceApi.getAttendance({ limit: 400 }).catch(() => ({ data: [] })),
        attendanceApi.getSummary().catch(() => ({ data: null }))
      ]);

      const attList = listRes?.data || (Array.isArray(listRes) ? listRes : []);
      setRecords(attList);

      const sumData = sumRes?.data || sumRes || null;
      setSummary(sumData);

      // Check today's punch state. `date` is normalised to YYYY-MM-DD by the
      // model, so an exact match is safe. Compared against the tracked day key
      // rather than a fresh Date, so a reload just after midnight IST and the
      // midnight rollover effect agree on which day is "today".
      const foundToday = attList.find((r) => (r.date || '').slice(0, 10) === todayKeyRef.current);
      setTodayRecord(foundToday || null);

      if (foundToday && foundToday.work_mode) {
        setWorkMode(foundToday.work_mode);
      }

      if (foundToday && foundToday.check_in_time && !foundToday.check_out_time) {
        setClockedIn(true);
        setIsCheckedOut(false);
        // Mid-shift on reload: offer OUT, since IN is already done.
        setPunchDirection('OUT');
        const inDate = new Date(foundToday.check_in_time);
        setClockInTime(formatClock(inDate));
        // Anchor on the punch timestamp so a tab that was closed and reopened
        // does not restart the counter from the wrong value.
        const diffSecs = Math.max(0, Math.floor((Date.now() - inDate.getTime()) / 1000));
        setDurationSeconds(diffSecs);
      } else if (foundToday && foundToday.check_out_time) {
        setClockedIn(false);
        setIsCheckedOut(true);
        setPunchDirection('IN');
        if (foundToday.check_in_time) {
          const inDate = new Date(foundToday.check_in_time);
          const outDate = new Date(foundToday.check_out_time);
          setClockInTime(formatClock(inDate));
          setDurationSeconds(Math.max(0, Math.floor((outDate.getTime() - inDate.getTime()) / 1000)));
        } else {
          setDurationSeconds(0);
        }
      } else {
        setClockedIn(false);
        setIsCheckedOut(false);
        setClockInTime('');
        setDurationSeconds(0);
        // Fresh day: back to IN so the pair is ready for the first punch.
        setPunchDirection('IN');
      }
    } catch (err) {
      setError(err.message || 'Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // Ticking current time & working duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime12WithSeconds(new Date()));
      if (clockedIn) {
        setDurationSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [clockedIn]);

  /**
   * Midnight rollover, Indian time.
   *
   * The punch pair is locked out for the rest of the day once OUT is done, so
   * it has to re-arm when the local day changes. `loadAttendance` re-reads the
   * server, which decides the new state from the fresh date.
   *
   * Scheduling is recomputed on every render off `todayKey` so a tab that was
   * open across midnight re-arms without needing a reload.
   */
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2, 0);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      // New IST day: re-arm the pair, follow the month if it changed, and
      // re-read the server for whatever the new day actually contains.
      const fresh = localDateKey();
      const next = new Date(`${fresh}T00:00:00`);
      setTodayKey(fresh);
      setPunchDirection('IN');
      setSelectedDayDetail(null);
      if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
        setViewMonth(next.getMonth());
        setViewYear(next.getFullYear());
      }
      loadAttendance();
    }, Math.max(1000, msUntilMidnight));

    return () => clearTimeout(timer);
  }, [todayKey, loadAttendance, viewMonth, viewYear]);

  // Live Check In — sends the selected Remote/Office mode with the punch.
  const handleClockIn = async () => {
    setActionLoading(true);
    setAlert({ type: '', text: '' });
    try {
      await attendanceApi.checkIn({
        date: localDateKey(),
        status: 'PRESENT',
        work_mode: workMode
      });
      const timeStr = formatClock(new Date());
      setClockInTime(timeStr);
      setClockedIn(true);
      setIsCheckedOut(false);
      setDurationSeconds(0);
      // Step through the flow: after a successful IN, the selector moves to OUT
      // so the next click on the big button punches out.
      setPunchDirection('OUT');
      setAlert({ type: 'success', text: `Clocked IN at ${timeStr} · ${workMode === 'OFFICE' ? 'Office' : 'Remote'}` });
      await loadAttendance();
    } catch (err) {
      setAlert({ type: 'danger', text: err.response?.data?.message || err.message || 'Failed to clock in' });
    } finally {
      setActionLoading(false);
    }
  };

  // Live Check Out
  const handleConfirmCheckout = async () => {
    setActionLoading(true);
    try {
      await attendanceApi.checkOut({});
      setClockedIn(false);
      setIsCheckedOut(true);
      setShowCheckoutModal(false);
      // Day is complete. The pair resets to IN and stays disabled until the
      // local calendar day rolls over past midnight.
      setPunchDirection('IN');
      setAlert({ type: 'success', text: 'Clocked OUT successfully! Remember to submit your Daily Work Log.' });
      await loadAttendance();
    } catch (err) {
      setAlert({ type: 'danger', text: err.response?.data?.message || err.message || 'Failed to check out' });
      setShowCheckoutModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  const leaveDayCount = useMemo(() => {
    if (!leaveForm.from || !leaveForm.to) return 0;
    if (leaveForm.to < leaveForm.from) return 0;
    return countDaysInclusive(leaveForm.from, leaveForm.to);
  }, [leaveForm.from, leaveForm.to]);

  const leaveRangeInvalid = Boolean(leaveForm.from && leaveForm.to && leaveForm.to < leaveForm.from);

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (leaveRangeInvalid || !leaveDayCount) return;
    setShowLeaveModal(false);
    setAlert({
      type: 'success',
      text: `Leave request for ${leaveDayCount} day${leaveDayCount > 1 ? 's' : ''} (${leaveForm.from} to ${leaveForm.to}) submitted for mentor approval!`
    });
    setLeaveForm({ from: '', to: '', reason: '', type: 'SICK' });
  };

  const openLeaveModal = () => {
    // Default the range to today; the intern can widen it inside the form.
    const start = localDateKey();
    setLeaveForm((prev) => ({ ...prev, from: start, to: start }));
    setShowLeaveModal(true);
  };

  /**
   * Build the visible month grid from real records only.
   *
   * The previous version was pinned to September 2026 and filled every empty
   * weekday with invented PRESENT/LATE/ABSENT/LEAVE data, so the grid never
   * reflected the intern's actual punches and "today" could never appear.
   * Now: real records, real month length, real weekdays, and the live punch
   * only highlighted on the actual current date.
   */
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = localDateKey(new Date(viewYear, viewMonth, day));
      const dayOfWeek = new Date(viewYear, viewMonth, day).getDay(); // 0 Sun .. 6 Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = dateStr === todayKey;
      const isFuture = dateStr > todayKey;

      const record = records.find((r) => (r.date || '').slice(0, 10) === dateStr);

      let status;
      let inTime = '—';
      let outTime = '—';
      // `null` means "nothing recorded" and renders as a blank cell, rather
      // than a dash placeholder.
      let hours = null;
      let log = '';
      let mode = null;

      if (record) {
        status = record.is_late ? 'LATE' : record.status || 'PRESENT';
        inTime = formatClock(record.check_in_time) || '—';
        outTime = record.check_out_time ? formatClock(record.check_out_time) : 'In Progress';
        hours = record.hours != null ? `${record.hours}` : 'Live';
        mode = record.work_mode || null;
        log = mode
          ? `${mode === 'OFFICE' ? 'Office' : 'Remote'} session`
          : 'Attendance recorded';
      } else if (isToday && clockedIn) {
        status = 'PRESENT';
        inTime = clockInTime || '—';
        outTime = 'In Progress';
        hours = 'Live';
        mode = workMode;
        log = 'Live in-progress work session';
      } else if (isWeekend) {
        status = 'HOLIDAY';
        log = 'Weekend / non-working day';
      } else if (isFuture) {
        status = 'UPCOMING';
        log = 'Upcoming working day';
      } else {
        status = 'ABSENT';
        log = 'No punch recorded';
      }

      days.push({ day, dateStr, status, in: inTime, out: outTime, hours, log, mode, isToday, isWeekend });
    }
    return days;
  }, [records, viewYear, viewMonth, todayKey, clockedIn, clockInTime, workMode]);

  // KPI values come from the real records for the visible month.
  const monthKpis = useMemo(() => {
    const working = calendarDays.filter((d) => !d.isWeekend && d.status !== 'UPCOMING');
    const present = working.filter((d) => d.status === 'PRESENT' || d.status === 'LATE');
    const late = working.filter((d) => d.status === 'LATE');
    const absent = working.filter((d) => d.status === 'ABSENT');
    const percentage = working.length ? Math.round((present.length / working.length) * 100) : 0;
    return {
      presentCount: present.length,
      totalWorkingDays: working.length,
      lateCount: late.length,
      absentCount: absent.length,
      attendancePercentage: percentage
    };
  }, [calendarDays]);

  // Prefer server-side totals when they cover the visible window; fall back to
  // the month-scoped numbers so the cards never show a hard-coded 94%.
  const summaryPresent = summary?.presentDays;
  const summaryTotal = summary?.totalDays;
  const useSummaryTotals = Number.isFinite(summaryTotal) && summaryTotal > calendarDays.length;

  const presentCount = useSummaryTotals ? summaryPresent : monthKpis.presentCount;
  const totalWorkingDays = useSummaryTotals ? summaryTotal : monthKpis.totalWorkingDays;
  const attendancePercentage = useSummaryTotals
    ? (Number(summaryTotal) ? Math.round(((summaryPresent || 0) / summaryTotal) * 100) : 0)
    : monthKpis.attendancePercentage;
  const lateCount = Number.isFinite(summary?.lateCount) ? summary.lateCount : monthKpis.lateCount;

  const getDayDotClass = (status) => {
    switch (status) {
      case 'PRESENT': return 'bg-success';
      case 'ABSENT': return 'bg-danger';
      case 'LATE': return 'bg-warning';
      case 'HALF_DAY': return 'bg-info';
      case 'HOLIDAY': return 'bg-secondary';
      default: return 'bg-light border';
    }
  };

  return (
    <AdminPage
      title="Attendance & Time Tracker"
      subtitle="Punch in/out, monitor live working duration, view visual monthly calendar, and apply for leaves"
      loading={loading}
      error={error}
      onRetry={loadAttendance}
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Top 4 KPI Metrics */}
        <div className="row g-3 mb-2">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Overall Attendance</span>
              <h3 className="fw-bold text-success mb-0">{attendancePercentage}%</h3>
              <small className="text-muted">Req: 85% for certificate</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Working Days Logged</span>
              <h3 className="fw-bold text-primary mb-0">{totalWorkingDays}</h3>
              <small className="text-muted">{viewMonthLabel}</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Present Days</span>
              <h3 className="fw-bold text-dark mb-0">{presentCount}</h3>
              <small className="text-success">{lateCount} Late</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Late / Absent</span>
              <h3 className="fw-bold text-warning mb-0">{lateCount} / {monthKpis.absentCount}</h3>
              <small className="text-muted">In {viewMonthLabel}</small>
            </div>
          </div>
        </div>

        {/* Today's Attendance Punch Card */}
        <div className="card shadow-sm border-0 mb-2 bg-light">
          <div className="card-body p-3">
            <div className="row align-items-center g-4">
              <div className="col-md-4 text-center text-md-start border-md-end">
                {/* Remote / Office selector sits directly above the live clock. */}
                <div className="btn-group btn-group-sm mb-2" role="group" aria-label="Work mode">
                  <button
                    type="button"
                    className={`btn ${workMode === 'REMOTE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setWorkMode('REMOTE')}
                    disabled={clockedIn || isCheckedOut}
                    title={clockedIn ? 'Work mode is locked once you have clocked in' : 'Work from home'}
                  >
                    <i className="bi bi-house me-1"></i> Remote
                  </button>
                  <button
                    type="button"
                    className={`btn ${workMode === 'OFFICE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setWorkMode('OFFICE')}
                    disabled={clockedIn || isCheckedOut}
                    title={clockedIn ? 'Work mode is locked once you have clocked in' : 'Work from the office'}
                  >
                    <i className="bi bi-building me-1"></i> Office
                  </button>
                </div>
                <span className="text-muted small text-uppercase fw-bold d-block">Live Clock</span>
                <h2 className="display-6 fw-bold text-primary mb-1">{currentTime}</h2>
                <span className="badge bg-light text-dark border">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="col-md-4 text-center border-md-end">
                <span className="text-muted small text-uppercase fw-bold d-block mb-1">Working Duration Counter</span>
                <h2 className="fw-bold text-success font-monospace mb-2">
                  {clockedIn || isCheckedOut ? formatDuration(durationSeconds) : '00h 00m 00s'}
                </h2>
                <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                  <span className={`badge px-3 py-1 ${clockedIn ? 'bg-success' : isCheckedOut ? 'bg-secondary' : 'bg-warning text-dark'}`}>
                    <i className={`bi bi-${clockedIn ? 'broadcast' : isCheckedOut ? 'check-circle' : 'power'} me-1`}></i>
                    {clockedIn
                      ? `Clocked IN at ${clockInTime}`
                      : isCheckedOut
                        ? `Clocked OUT${clockInTime ? ` at ${clockInTime}` : ''}`
                        : 'Not Punched Today'}
                  </span>
                  {todayRecord?.work_mode && (
                    <span className="badge px-3 py-1 bg-light text-dark border">
                      <i className="bi bi-building me-1"></i>
                      {todayRecord.work_mode === 'OFFICE' ? 'Office' : 'Remote'}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-md-4 text-center text-md-end">
                <div className="d-flex flex-column gap-2">
                  {/* Step 1: pick IN or OUT here. It only selects the action,
                      it never punches on its own. */}
                  <div className="btn-group btn-group-sm justify-content-center" role="group" aria-label="Punch direction">
                    <button
                      type="button"
                      className={`btn ${punchDirection === 'IN' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setPunchDirection('IN')}
                      disabled={clockedIn || isCheckedOut}
                      title={clockedIn ? 'Already clocked in for today' : isCheckedOut ? 'Today is already completed' : 'Select Clock In'}
                    >
                      <i className="bi bi-box-arrow-in-right me-1"></i> IN
                    </button>
                    <button
                      type="button"
                      className={`btn ${punchDirection === 'OUT' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setPunchDirection('OUT')}
                      disabled={!clockedIn}
                      title={!clockedIn ? 'Clock in first before selecting Clock Out' : 'Select Clock Out'}
                    >
                      <i className="bi bi-box-arrow-left me-1"></i> OUT
                    </button>
                  </div>

                  {/* Step 2: this button performs whatever is selected above. */}
                  <button
                    className={`btn btn-lg shadow-sm d-flex align-items-center justify-content-center ${
                      isCheckedOut ? 'btn-secondary' : punchDirection === 'OUT' ? 'btn-danger' : 'btn-success'
                    }`}
                    disabled={actionLoading || isCheckedOut || (punchDirection === 'OUT' && !clockedIn)}
                    onClick={() => (punchDirection === 'OUT' ? setShowCheckoutModal(true) : handleClockIn())}
                  >
                    <i className={`bi bi-${punchDirection === 'OUT' ? 'box-arrow-left' : 'box-arrow-in-right'} me-2`}></i>
                    {isCheckedOut ? 'Completed for Today' : punchDirection === 'OUT' ? 'Clock Out Now' : 'Clock In Now'}
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={openLeaveModal}
                  >
                    <i className="bi bi-calendar2-plus me-1"></i> Apply for Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Attendance Grid */}
        <div className="card shadow-sm border-0 mb-2">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <div>
                <h5 className="mb-0 fw-bold text-dark">{viewMonthLabel} Attendance</h5>
                <small className="text-muted">Click any day to inspect check-in/out times and work mode</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              {!isViewingCurrentMonth && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none px-1"
                  onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
                >
                  Today
                </button>
              )}
            </div>
            {/* Legend */}
            <div className="d-flex gap-3 flex-wrap small">
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle bg-success d-inline-block" style={{ width: '10px', height: '10px' }}></span> Present
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle bg-danger d-inline-block" style={{ width: '10px', height: '10px' }}></span> Absent
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle bg-warning d-inline-block" style={{ width: '10px', height: '10px' }}></span> Late
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle bg-secondary d-inline-block" style={{ width: '10px', height: '10px' }}></span> Holiday
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle bg-light border d-inline-block" style={{ width: '10px', height: '10px' }}></span> Upcoming
              </span>
            </div>
          </div>

          <div className="card-body p-3 pt-0">
            {/* The grid always renders. Dates without a punch are still
                clickable, so the day detail can be opened before clocking in
                and after clocking out. */}
            {records.length === 0 && (
              <div className="alert alert-light border d-flex align-items-center gap-2 py-2 px-3 small text-muted mb-3">
                <i className="bi bi-info-circle"></i>
                <span>
                  No punches recorded for {viewMonthLabel} yet. Use the IN button above to start
                  tracking, or click any date to view its details.
                </span>
              </div>
            )}
            <div className="row row-cols-2 row-cols-sm-4 row-cols-md-7 g-2">
              {calendarDays.map((d) => (
                <div key={d.dateStr} className="col">
                  <button
                    type="button"
                    className={`btn w-100 p-2 border rounded-3 text-center bg-white ${
                      d.isToday ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedDayDetail(d)}
                    style={{ transition: 'all 0.15s ease' }}
                  >
                    <span className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold text-dark">
                        {d.day}
                        {d.isToday && <span className="ms-1 badge bg-primary" style={{ fontSize: '0.55rem' }}>Today</span>}
                      </span>
                      <span
                        className={`rounded-circle d-inline-block ${getDayDotClass(d.status)}`}
                        style={{ width: '8px', height: '8px' }}
                      ></span>
                    </span>
                    {/* No dash placeholder anywhere. A day with no hours
                        recorded stays blank; "Off" is kept for holidays. */}
                    {(() => {
                      if (d.status === 'HOLIDAY') {
                        return <span className="d-block small text-muted" style={{ fontSize: '0.7rem' }}>Off</span>;
                      }
                      if (d.hours === 'Live') {
                        return <span className="d-block small text-success" style={{ fontSize: '0.7rem' }}>Live</span>;
                      }
                      // `d.hours` is null when nothing is recorded. Number(null)
                      // is 0, so the null check has to come before parsing.
                      if (d.hours === null || d.hours === undefined) return null;
                      const hrs = Number(d.hours);
                      if (!Number.isFinite(hrs)) return null;
                      return <span className="d-block small text-muted" style={{ fontSize: '0.7rem' }}>{hrs}h</span>;
                    })()}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day Detail — compact modal, opened by clicking a calendar day */}
        {selectedDayDetail && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dayDetailTitle"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedDayDetail(null); }}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content border-0 shadow">
                <div className="modal-header py-2">
                  <h6 className="modal-title fw-bold mb-0" id="dayDetailTitle">
                    {new Date(`${selectedDayDetail.dateStr}T00:00:00`).toLocaleDateString(undefined, {
                      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => setSelectedDayDetail(null)}
                  ></button>
                </div>
                <div className="modal-body py-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small">Status</span>
                    <span className={`badge ${
                      selectedDayDetail.status === 'PRESENT' ? 'bg-success'
                        : selectedDayDetail.status === 'LATE' ? 'bg-warning text-dark'
                        : selectedDayDetail.status === 'ABSENT' ? 'bg-danger'
                        : selectedDayDetail.status === 'HALF_DAY' ? 'bg-info'
                        : selectedDayDetail.status === 'HOLIDAY' ? 'bg-secondary'
                        : 'bg-light text-dark border'
                    }`}>
                      {selectedDayDetail.status}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-muted small">Check In</span>
                    <strong className="text-dark small font-monospace">{selectedDayDetail.in}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-muted small">Check Out</span>
                    <strong className="text-dark small font-monospace">{selectedDayDetail.out}</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-muted small">Total Hours</span>
                    <strong className="text-success small font-monospace">
                      {selectedDayDetail.hours === 'Live'
                        ? 'Live'
                        : selectedDayDetail.hours === null || selectedDayDetail.hours === undefined
                          ? '—'
                          : `${selectedDayDetail.hours}h`}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-muted small">Work Mode</span>
                    <strong className="text-dark small">
                      {selectedDayDetail.mode
                        ? (selectedDayDetail.mode === 'OFFICE' ? 'Office' : 'Remote')
                        : 'Not recorded'}
                    </strong>
                  </div>
                  {selectedDayDetail.log && selectedDayDetail.log !== '—' && (
                    <>
                      <hr className="my-2" />
                      <div className="text-muted small mb-1">Note</div>
                      <div className="text-dark small">{selectedDayDetail.log}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check-out Confirmation Modal */}
        {showCheckoutModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm Check Out"
            onClick={backdropClick(() => setShowCheckoutModal(false))}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Confirm Check Out</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-3 text-dark">
                    You clocked IN at <strong>{clockInTime || '—'}</strong> ({workMode === 'OFFICE' ? 'Office' : 'Remote'}) and have logged{' '}
                    <strong className="text-success">{formatDuration(durationSeconds)}</strong> today.
                  </p>
                  <div className="p-3 bg-warning-subtle border border-warning rounded-3 mb-3 small">
                    <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                    <strong>Did you submit your Daily Work Log?</strong>
                    <p className="mb-0 mt-1 text-dark">
                      Submitting your daily activity report is required before checking out to receive full attendance credit.
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="/app/intern/work-log" className="btn btn-outline-primary btn-sm">
                    Open Work Log First
                  </Link>
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm" 
                    disabled={actionLoading}
                    onClick={handleConfirmCheckout}
                  >
                    {actionLoading ? 'Clocking out...' : 'Confirm & Clock OUT'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Request Modal */}
        {showLeaveModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Apply for Leave"
            onClick={backdropClick(() => setShowLeaveModal(false))}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Apply for Leave</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLeaveModal(false)}></button>
                </div>
                <form onSubmit={handleApplyLeave}>
                  <div className="modal-body">
                    <div className="row g-2 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold" htmlFor="leaveFrom">Leave From</label>
                        <input
                          id="leaveFrom"
                          type="date"
                          className="form-control"
                          value={leaveForm.from}
                          onChange={(e) => setLeaveForm({
                            ...leaveForm,
                            from: e.target.value,
                            // Keep the range valid when the start moves past the end.
                            to: leaveForm.to && leaveForm.to < e.target.value ? e.target.value : leaveForm.to
                          })}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold" htmlFor="leaveTo">Leave To</label>
                        <input
                          id="leaveTo"
                          type="date"
                          className={`form-control ${leaveRangeInvalid ? 'is-invalid' : ''}`}
                          min={leaveForm.from || undefined}
                          value={leaveForm.to}
                          onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                          required
                        />
                        {leaveRangeInvalid && (
                          <div className="invalid-feedback">End date must be on or after the start date.</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold" htmlFor="leaveDays">
                        Number of Days
                      </label>
                      <input
                        id="leaveDays"
                        type="number"
                        className="form-control"
                        min="1"
                        max="30"
                        readOnly
                        value={leaveDayCount || ''}
                        placeholder="Select a date range"
                      />
                      <div className="form-text">
                        Counted automatically from the Leave From / Leave To range.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold" htmlFor="leaveType">Leave Category</label>
                      <select
                        id="leaveType"
                        className="form-select"
                        value={leaveForm.type}
                        onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                      >
                        {LEAVE_TYPES.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold" htmlFor="leaveReason">Reason for Absence</label>
                      <textarea
                        id="leaveReason"
                        className="form-control"
                        rows="3"
                        placeholder="State reason clearly for mentor and HR review..."
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light btn-sm" onClick={() => setShowLeaveModal(false)}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={leaveRangeInvalid || !leaveDayCount}
                    >
                      Submit Leave Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
