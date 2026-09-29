import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import attendanceApi from '../../../services/api/attendanceApi.js';
import lmsApi from '../../../services/api/lmsApi.js';

export default function StudentAttendance() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [punching, setPunching] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [attRes, sumRes, batchRes] = await Promise.all([
        attendanceApi.getAttendance({ limit: 60 }).catch(() => ({ data: [] })),
        attendanceApi.getSummary().catch(() => ({ data: null })),
        lmsApi.getBatches().catch(() => ({ data: [] }))
      ]);

      const records = attRes?.data || (Array.isArray(attRes) ? attRes : []);
      setHistory(records);

      const sumData = sumRes?.data || sumRes || null;
      setSummary(sumData);

      const batchList = batchRes?.data || (Array.isArray(batchRes) ? batchRes : []);
      setBatches(batchList);

      const todayStr = new Date().toISOString().slice(0, 10);
      const foundToday = records.find(r => r.date && r.date.startsWith(todayStr));
      setTodayRecord(foundToday || null);
    } catch (err) {
      setError(err.message || 'Failed to load attendance information');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Session Self Punch-in
  const handleSessionPunch = async (action) => {
    setPunching(true);
    setAlert({ type: '', text: '' });
    try {
      if (action === 'CHECK_IN') {
        const todayStr = new Date().toISOString().slice(0, 10);
        await attendanceApi.checkIn({ date: todayStr, status: 'PRESENT' });
        setAlert({ type: 'success', text: 'Checked into today’s academic session successfully!' });
      } else {
        await attendanceApi.checkOut({});
        setAlert({ type: 'success', text: 'Session checkout logged successfully!' });
      }
      await loadData();
    } catch (err) {
      setAlert({ type: 'danger', text: err.response?.data?.message || err.message || 'Failed to record session punch' });
    } finally {
      setPunching(false);
    }
  };

  // Metrics calculations
  const totalDays = summary?.totalDays || history.length || 0;
  const presentDays = summary?.presentDays || history.filter(r => r.status === 'PRESENT').length || 0;
  const absentDays = summary?.absentDays || history.filter(r => r.status === 'ABSENT').length || 0;
  const halfDays = summary?.halfDays || history.filter(r => r.status === 'HALF_DAY').length || 0;
  const lateCount = summary?.lateCount || history.filter(r => r.is_late).length || 0;

  // Weighted attendance % (half days count as 0.5)
  const attendancePercentage = totalDays > 0 
    ? Math.round(((presentDays + halfDays * 0.5) / totalDays) * 100) 
    : 100;

  const isEligible = attendancePercentage >= 75;
  const isWarning = attendancePercentage >= 65 && attendancePercentage < 75;

  // Filter records
  const filteredHistory = history.filter(r => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'LATE') return r.is_late;
    return r.status === filterStatus;
  });

  const isCheckedIn = Boolean(todayRecord && todayRecord.check_in_time);
  const isCheckedOut = Boolean(todayRecord && todayRecord.check_out_time);

  return (
    <AdminPage
      title="Student Attendance & Academic Eligibility"
      subtitle="Track your lecture presence, batch roll-call history, and exam eligibility standing"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center mb-2`} role="alert">
            <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2 fs-5`}></i>
            <div className="flex-grow-1">{alert.text}</div>
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* 75% Academic Requirement Alert Banner */}
        <div className={`card border-0 mb-2 shadow-sm ${isEligible ? 'bg-success-subtle border-start border-success border-4' : isWarning ? 'bg-warning-subtle border-start border-warning border-4' : 'bg-danger-subtle border-start border-danger border-4'}`}>
          <div className="card-body p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center text-white ${isEligible ? 'bg-success' : isWarning ? 'bg-warning' : 'bg-danger'}`} style={{ width: '48px', height: '48px' }}>
                  <i className={`bi ${isEligible ? 'bi-mortarboard-fill' : 'bi-exclamation-triangle-fill'} fs-4`}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">
                    {isEligible ? 'Academic Standing: Exam Eligible (≥ 75%)' : isWarning ? 'Academic Warning: Near Minimum Threshold' : 'Critical Warning: Below 75% Threshold'}
                  </h6>
                  <p className="mb-0 text-muted small">
                    Institutional policy mandates a minimum of <strong>75% verified attendance</strong> for semester exam hall tickets and course completion certification.
                  </p>
                </div>
              </div>

              <div className="text-md-end">
                <span className={`badge fs-6 px-3 py-2 ${isEligible ? 'bg-success' : isWarning ? 'bg-warning text-dark' : 'bg-danger'}`}>
                  {attendancePercentage}% Current Standing
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className={`progress-bar progress-bar-striped progress-bar-animated ${isEligible ? 'bg-success' : isWarning ? 'bg-warning' : 'bg-danger'}`}
                  role="progressbar"
                  style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                  aria-valuenow={attendancePercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between text-muted small mt-1">
                <span>0%</span>
                <span className="fw-bold text-danger">75% (Min. Criteria)</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="row g-3 mb-2">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Overall Attendance</span>
              <h3 className={`fw-bold mb-0 ${isEligible ? 'text-success' : 'text-danger'}`}>{attendancePercentage}%</h3>
              <small className="text-muted">{presentDays} / {totalDays} Classes</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Classes Attended</span>
              <h3 className="fw-bold text-primary mb-0">{presentDays}</h3>
              <small className="text-success">{halfDays > 0 ? `${halfDays} Half Days` : 'Full Sessions'}</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Classes Absent</span>
              <h3 className="fw-bold text-danger mb-0">{absentDays}</h3>
              <small className="text-muted">Unattended Sessions</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center h-100">
              <span className="text-muted small fw-semibold">Late Arrivals</span>
              <h3 className="fw-bold text-warning mb-0">{lateCount}</h3>
              <small className="text-muted">Logged after 09:00 AM</small>
            </div>
          </div>
        </div>

        {/* Today's Class Session Live Card */}
        <div className="card shadow-sm border-0 mb-2 bg-light">
          <div className="card-body p-3">
            <div className="row align-items-center g-3">
              <div className="col-md-7">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-person-check fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">Today's Class Session Check-In</h5>
                    <p className="text-muted mb-0 small">
                      {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} • {currentTime}
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-3 pt-2 border-top">
                  <div>
                    <span className="text-muted small d-block">Today's Entry</span>
                    <span className="fw-semibold fs-6 text-dark">
                      {todayRecord?.check_in_time ? new Date(todayRecord.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Today's Exit</span>
                    <span className="fw-semibold fs-6 text-dark">
                      {todayRecord?.check_out_time ? new Date(todayRecord.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">Daily Status</span>
                    <span className={`badge ${todayRecord?.status === 'PRESENT' ? 'bg-success' : todayRecord?.status === 'HALF_DAY' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {todayRecord?.status || 'NOT RECORDED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-5 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                  <button
                    className="btn btn-primary px-3 py-2 d-flex align-items-center gap-2"
                    disabled={punching || isCheckedIn}
                    onClick={() => handleSessionPunch('CHECK_IN')}
                  >
                    <i className="bi bi-box-arrow-in-right"></i>
                    {isCheckedIn ? 'Checked In' : 'Self Check-In'}
                  </button>

                  <button
                    className="btn btn-outline-secondary px-3 py-2 d-flex align-items-center gap-2"
                    disabled={punching || !isCheckedIn || isCheckedOut}
                    onClick={() => handleSessionPunch('CHECK_OUT')}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    {isCheckedOut ? 'Checked Out' : 'Check Out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Academic Batches */}
        {batches.length > 0 && (
          <div className="card shadow-sm border-0 mb-2">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">My Enrolled Cohorts & Batches</h6>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Batch Code</th>
                    <th>Cohort Name</th>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(b => (
                    <tr key={b.id}>
                      <td><code className="text-primary fw-bold">{b.batch_code}</code></td>
                      <td className="fw-semibold text-dark">{b.name}</td>
                      <td>{b.course_name || 'Academic Course'}</td>
                      <td className="text-muted">{b.tutor_name || 'Assigned Instructor'}</td>
                      <td className="text-muted small">
                        {b.start_date ? new Date(b.start_date).toLocaleDateString() : 'N/A'} - {b.end_date ? new Date(b.end_date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Attendance Records Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h6 className="mb-0 fw-bold">Session Attendance History</h6>
              <small className="text-muted">Verified daily records from instructor roll-calls and classroom attendance</small>
            </div>

            {/* Filter buttons */}
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('ALL')}
              >
                All ({history.length})
              </button>
              <button
                type="button"
                className={`btn ${filterStatus === 'PRESENT' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('PRESENT')}
              >
                Present ({presentDays})
              </button>
              <button
                type="button"
                className={`btn ${filterStatus === 'ABSENT' ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('ABSENT')}
              >
                Absent ({absentDays})
              </button>
              <button
                type="button"
                className={`btn ${filterStatus === 'LATE' ? 'btn-warning' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('LATE')}
              >
                Late ({lateCount})
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Session Date</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Punctuality</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-calendar-x fs-2 d-block mb-2"></i>
                      No attendance records found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((record) => (
                    <tr key={record.id || record.date}>
                      <td className="fw-semibold text-dark">
                        {record.date ? new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td>
                        {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : record.clock_in || '—'}
                      </td>
                      <td>
                        {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : record.clock_out || '—'}
                      </td>
                      <td>
                        {record.hours ? `${record.hours} hrs` : record.total_hours ? `${record.total_hours} hrs` : '—'}
                      </td>
                      <td>
                        <span className={`badge ${record.status === 'PRESENT' ? 'bg-success' : record.status === 'HALF_DAY' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {record.status || 'ABSENT'}
                        </span>
                      </td>
                      <td>
                        {record.is_late ? (
                          <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                            <i className="bi bi-exclamation-circle-fill"></i> Late
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
