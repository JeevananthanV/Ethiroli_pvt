import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import {
  formatClock,
  formatSessionRange,
  formatDuration,
  formatLiveDuration,
  formatDateLabel,
  openSessionElapsedSeconds,
  punchStatusLabel,
  punchStatusClass,
} from '../utils/attendanceFormat.js';

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [punching, setPunching] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // Punch Out is only sent after the employee confirms in the modal.
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayRes, historyRes] = await Promise.all([
        employeePortalApi.getTodayAttendance(),
        employeePortalApi.getAttendanceHistory({ limit: 60 }),
      ]);
      // `axiosInstance` unwraps to response.data, so these are the envelopes.
      setToday(todayRes?.data || null);
      const list = historyRes?.data || [];
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // Live clock + ticking duration for the open session.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setElapsedSeconds(openSessionElapsedSeconds(today));
    }, 1000);
    return () => clearInterval(timer);
  }, [today]);

  const isPunchedIn = Boolean(today?.is_punched_in);

  // ---- Punch In: no confirmation required, sent immediately. ----
  const handlePunchIn = async () => {
    setPunching(true);
    setSuccessMsg('');
    setError(null);
    setConfirmError('');
    try {
      await employeePortalApi.punchAttendance('CHECK_IN');
      setSuccessMsg('Punched in successfully. Have a productive day!');
      await loadAttendance();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to punch in');
    } finally {
      setPunching(false);
    }
  };

  // ---- Punch Out: step 1, open the confirmation modal (no API call). ----
  const handlePunchOutClick = () => {
    setConfirmError('');
    setShowConfirm(true);
  };

  // ---- Punch Out: step 2, only called after Confirm. ----
  const handleConfirmPunchOut = async () => {
    if (punching) return; // guard against duplicate submissions
    setPunching(true);
    setConfirmError('');
    try {
      await employeePortalApi.punchAttendance('CHECK_OUT');
      setShowConfirm(false);
      setSuccessMsg('Punched out successfully. See you tomorrow!');
      await loadAttendance();
    } catch (err) {
      // Keep the modal open so the session state is never lost and the user
      // can retry; do not show a false success.
      setConfirmError(err.response?.data?.message || err.message || 'Punch out failed. Please try again.');
    } finally {
      setPunching(false);
    }
  };

  const cancelPunchOut = () => {
    if (punching) return;
    setShowConfirm(false);
    setConfirmError('');
  };

  const sessions = today?.sessions || [];
  const currentSession = today?.current_session || null;
  const totalWorked = today?.worked_minutes ?? 0;
  // While clocked in, show the live elapsed time for the current session.
  const currentSessionMinutes = Math.floor(elapsedSeconds / 60);

  const stats = {
    total: history.length,
    present: history.filter(r => r.status === 'PRESENT').length,
    late: history.filter(r => r.is_late).length,
    halfDay: history.filter(r => r.status === 'HALF_DAY').length,
    absent: history.filter(r => r.status === 'ABSENT').length,
  };
  const rate = stats.total > 0
    ? Math.round(((stats.present + stats.halfDay * 0.5) / stats.total) * 100)
    : 100;
  const totalHours = (history.reduce((s, r) => s + (Number(r.worked_hours) || 0), 0)).toFixed(1);

  return (
    <AdminPage
      title="Attendance & Time Clock"
      subtitle="Track your work sessions, punches, and daily working hours"
      loading={loading}
      error={error}
      onRetry={loadAttendance}
    >
      <div className="container-fluid px-0">
        {successMsg && (
          <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-2" role="alert">
            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
            <div className="flex-grow-1">{successMsg}</div>
            <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
          </div>
        )}

        {/* Top 4 KPI Metrics */}
        <div className="row g-3 mb-2">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Attendance Rate</span>
              <h3 className="fw-bold text-success mb-0">{rate}%</h3>
              <small className="text-muted">Target: 95% minimum</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Present Days</span>
              <h3 className="fw-bold text-primary mb-0">{stats.present}</h3>
              <small className="text-success">{stats.total} Logged Days</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Total Hours Worked</span>
              <h3 className="fw-bold text-dark mb-0">{totalHours}h</h3>
              <small className="text-muted">Excludes breaks</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Punctuality</span>
              <h3 className={`fw-bold mb-0 ${stats.late > 2 ? 'text-warning' : 'text-success'}`}>{stats.late} Late</h3>
              <small className="text-muted">{stats.late === 0 ? 'Perfect timing' : 'Arrivals after 09:00'}</small>
            </div>
          </div>
        </div>

        {/* Punch Clock Card */}
        <div className="card shadow-sm border-0 mb-2 bg-light">
          <div className="card-body p-3">
            <div className="row align-items-center g-4">
              <div className="col-md-7 mb-3 mb-md-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-clock-history fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">Live Work Clock</h5>
                    <p className="text-muted mb-0 small">
                      {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} • <strong className="text-dark">{currentTime}</strong>
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-3 pt-2 border-top flex-wrap">
                  <div>
                    <span className="text-muted small d-block">Status</span>
                    <span className={`badge ${punchStatusClass(today)}`}>
                      {punchStatusLabel(today)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Sessions Today</span>
                    <span className="fw-semibold fs-6 text-dark">{today?.session_count ?? 0}</span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Total Working Hours</span>
                    <span className="fw-bold fs-6 font-monospace text-success">
                      {formatDuration(totalWorked)}
                    </span>
                  </div>
                  {isPunchedIn && (
                    <div>
                      <span className="text-muted small d-block">Current Session</span>
                      <span className="fw-bold fs-6 font-monospace text-primary">
                        {formatLiveDuration(currentSessionMinutes, elapsedSeconds % 60)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-5 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end">
                  {!isPunchedIn ? (
                    <button
                      className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
                      disabled={punching}
                      onClick={handlePunchIn}
                    >
                      <i className="bi bi-box-arrow-in-right"></i>
                      {punching ? 'Punching In...' : 'Punch In'}
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2"
                      disabled={punching}
                      onClick={handlePunchOutClick}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      {punching ? 'Punching Out...' : 'Punch Out'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Today's session list */}
            {sessions.length > 0 && (
              <div className="mt-3 pt-3 border-top">
                <h6 className="mb-2 fw-bold text-dark small text-uppercase text-muted">Today's Sessions</h6>
                <div className="list-group list-group-flush">
                  {sessions.map((s, idx) => (
                    <div key={s.id} className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="badge bg-light text-dark border">Session {idx + 1}</span>
                        <span className="font-monospace text-dark">{formatSessionRange(s)}</span>
                      </div>
                      <span className="d-flex align-items-center gap-2">
                        {s.is_active ? (
                          <span className="badge bg-success">
                            Running {formatDuration(currentSessionMinutes)}
                          </span>
                        ) : (
                          <span className="badge bg-light text-dark border">
                            {formatDuration(s.duration_minutes ?? s.worked_minutes)}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {sessions.length > 1 && (
                  <small className="text-muted">
                    Breaks between sessions are excluded from your total working hours.
                  </small>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Attendance History</h6>
            <span className="badge bg-light text-dark border">{history.length} Days</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Date</th>
                  <th>Sessions</th>
                  <th>Details</th>
                  <th>Total Worked</th>
                  <th>Status</th>
                  <th>Punctuality</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No attendance records found for this period.
                    </td>
                  </tr>
                ) : (
                  history.map((record) => (
                    <tr key={record.id || record.work_date}>
                      <td className="fw-semibold text-dark">
                        {formatDateLabel(record.work_date || record.date)}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {record.session_count ?? 0}
                        </span>
                      </td>
                      <td>
                        {record.sessions && record.sessions.length > 0 ? (
                          <div className="d-flex flex-column gap-1">
                            {record.sessions.map((s, i) => (
                              <span key={s.id} className="font-monospace small text-muted">
                                {i + 1}. {formatSessionRange(s)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-monospace small text-muted">
                            {formatClock(record.check_in_time)} – {formatClock(record.check_out_time)}
                          </span>
                        )}
                      </td>
                      <td className="fw-semibold text-success">
                        {formatDuration(record.worked_minutes ?? Math.round((record.worked_hours || 0) * 60))}
                      </td>
                      <td>
                        <span className={`badge ${record.status === 'PRESENT' ? 'bg-success' : record.status === 'LEAVE' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {record.status || 'ABSENT'}
                        </span>
                        {record.is_open && (
                          <span className="badge bg-info text-dark ms-1">In progress</span>
                        )}
                      </td>
                      <td>
                        {record.is_late ? (
                          <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                            <i className="bi bi-exclamation-triangle-fill"></i> Late
                          </span>
                        ) : (
                          <span className="text-success small d-inline-flex align-items-center gap-1">
                            <i className="bi bi-check-circle"></i> On Time
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Punch Out Confirmation Modal */}
      {showConfirm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmPunchOutTitle"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 id="confirmPunchOutTitle" className="modal-title fw-bold">Confirm Punch Out</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelPunchOut}
                  disabled={punching}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Are you sure you want to punch out?</p>

                <div className="bg-light rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Current session punch in:</span>
                    <span className="fw-semibold font-monospace text-dark">
                      {formatClock(currentSession?.check_in_time)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Current working time:</span>
                    <span className="fw-bold font-monospace text-success">
                      {formatDuration(currentSessionMinutes)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Sessions completed today:</span>
                    <span className="fw-semibold text-dark">{sessions.length}</span>
                  </div>
                </div>

                <p className="text-muted small mb-0">
                  If you punch out now, your current work session will end. You can punch in
                  again later to start a new session, and breaks are not counted as working time.
                </p>

                {confirmError && (
                  <div className="alert alert-danger mt-3 mb-0 d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{confirmError}</div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={cancelPunchOut}
                  disabled={punching}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={handleConfirmPunchOut}
                  disabled={punching}
                >
                  {punching ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Punching Out...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      <span>Confirm Punch Out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
