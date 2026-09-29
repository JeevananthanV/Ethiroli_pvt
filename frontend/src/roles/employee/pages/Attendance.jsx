import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Attendance() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [punching, setPunching] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [durationSeconds, setDurationSeconds] = useState(0);

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAttendanceHistory({ limit: 60 });
      const records = res?.data || (Array.isArray(res) ? res : []);
      setHistory(records);

      const todayStr = new Date().toISOString().slice(0, 10);
      const foundToday = records.find(r => r.date && r.date.startsWith(todayStr));
      setTodayRecord(foundToday || null);

      if (foundToday && foundToday.check_in_time && !foundToday.check_out_time) {
        const inDate = new Date(foundToday.check_in_time);
        const diffSecs = Math.max(0, Math.floor((Date.now() - inDate.getTime()) / 1000));
        setDurationSeconds(diffSecs);
      } else if (foundToday && foundToday.check_out_time && foundToday.check_in_time) {
        const inDate = new Date(foundToday.check_in_time);
        const outDate = new Date(foundToday.check_out_time);
        setDurationSeconds(Math.max(0, Math.floor((outDate.getTime() - inDate.getTime()) / 1000)));
      } else {
        setDurationSeconds(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const isCheckedIn = Boolean(todayRecord && todayRecord.check_in_time);
  const isCheckedOut = Boolean(todayRecord && todayRecord.check_out_time);

  // Live Clock & Ticking Duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      if (isCheckedIn && !isCheckedOut) {
        setDurationSeconds(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn, isCheckedOut]);

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  const handlePunch = async (action) => {
    setPunching(true);
    setSuccessMsg('');
    setError(null);
    try {
      await employeePortalApi.punchAttendance(action);
      setSuccessMsg(`Successfully ${action === 'CHECK_IN' ? 'punched in' : 'punched out'}!`);
      await loadAttendance();
    } catch (err) {
      setError(err.message || `Failed to ${action.toLowerCase()}`);
    } finally {
      setPunching(false);
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = history.length;
    const present = history.filter(r => r.status === 'PRESENT').length;
    const late = history.filter(r => r.is_late).length;
    const halfDay = history.filter(r => r.status === 'HALF_DAY').length;
    const absent = history.filter(r => r.status === 'ABSENT').length;
    const rate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 100;
    const totalHours = history.reduce((sum, r) => sum + (Number(r.hours || r.total_hours) || 0), 0);

    return { total, present, late, halfDay, absent, rate, totalHours: totalHours.toFixed(1) };
  }, [history]);

  return (
    <AdminPage
      title="Attendance & Time Clock"
      subtitle="Track your daily work hours, punches, and monthly presence"
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
              <h3 className="fw-bold text-success mb-0">{stats.rate}%</h3>
              <small className="text-muted">Target: 95% minimum</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Present Days</span>
              <h3 className="fw-bold text-primary mb-0">{stats.present}</h3>
              <small className="text-success">{stats.total} Logged Periods</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Total Hours Worked</span>
              <h3 className="fw-bold text-dark mb-0">{stats.totalHours}h</h3>
              <small className="text-muted">Verified billable hours</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Punctuality</span>
              <h3 className={`fw-bold mb-0 ${stats.late > 2 ? 'text-warning' : 'text-success'}`}>{stats.late} Late</h3>
              <small className="text-muted">{stats.late === 0 ? 'Perfect timing' : 'Arrivals after 09:00 AM'}</small>
            </div>
          </div>
        </div>

        {/* Quick Punch Clock Card */}
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
                    <span className="text-muted small d-block">Today's Check-in</span>
                    <span className="fw-semibold fs-6 text-dark">
                      {todayRecord?.check_in_time ? new Date(todayRecord.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Today's Check-out</span>
                    <span className="fw-semibold fs-6 text-dark">
                      {todayRecord?.check_out_time ? new Date(todayRecord.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Working Duration</span>
                    <span className="fw-bold fs-6 font-monospace text-success">
                      {isCheckedIn ? formatDuration(durationSeconds) : '--:--:--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Status</span>
                    <span className={`badge ${todayRecord?.status === 'PRESENT' ? 'bg-success' : 'bg-secondary'}`}>
                      {todayRecord?.status || 'NOT PUNCHED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-5 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end">
                  <button
                    className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
                    disabled={punching || isCheckedIn}
                    onClick={() => handlePunch('CHECK_IN')}
                  >
                    <i className="bi bi-box-arrow-in-right"></i>
                    {isCheckedIn ? 'Checked In' : 'Punch In'}
                  </button>

                  <button
                    className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2"
                    disabled={punching || !isCheckedIn || isCheckedOut}
                    onClick={() => handlePunch('CHECK_OUT')}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    {isCheckedOut ? 'Checked Out' : 'Punch Out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Attendance Logs */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Recent Attendance Records</h6>
            <span className="badge bg-light text-dark border">{history.length} Logged Days</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Duration</th>
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
                    <tr key={record.id || record.date}>
                      <td className="fw-semibold text-dark">
                        {record.date ? new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td>
                        {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td>
                        {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td>
                        {record.hours ? `${record.hours} hrs` : record.total_hours ? `${record.total_hours} hrs` : '—'}
                      </td>
                      <td>
                        <span className={`badge ${record.status === 'PRESENT' ? 'bg-success' : record.status === 'LEAVE' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {record.status || 'ABSENT'}
                        </span>
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
    </AdminPage>
  );
}
