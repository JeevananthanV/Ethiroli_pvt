import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';
import { Link } from 'react-router-dom';

export default function Attendance() {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('09:15 AM');
  const [workMode, setWorkMode] = useState('REMOTE');
  const [durationSeconds, setDurationSeconds] = useState(5520); // ~1h 32m
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [leaveForm, setLeaveForm] = useState({ date: '', reason: '', type: 'SICK' });
  const [alert, setAlert] = useState({ type: '', text: '' });

  // Ticking current time & working duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      if (clockedIn) {
        setDurationSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [clockedIn]);

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  // September 2026 Calendar Days (30 days)
  const calendarDays = [
    { day: 1, status: 'PRESENT', in: '09:20 AM', out: '05:40 PM', hours: '8.3', log: 'Setup React monorepo architecture.' },
    { day: 2, status: 'PRESENT', in: '09:15 AM', out: '05:30 PM', hours: '8.2', log: 'Built responsive Navbar and Drawer.' },
    { day: 3, status: 'PRESENT', in: '09:25 AM', out: '05:45 PM', hours: '8.3', log: 'Configured Redux Toolkit slices.' },
    { day: 4, status: 'PRESENT', in: '09:30 AM', out: '05:30 PM', hours: '8.0', log: 'Completed Module 1 assignments.' },
    { day: 5, status: 'HOLIDAY', in: '—', out: '—', hours: '—', log: 'Weekend' },
    { day: 6, status: 'HOLIDAY', in: '—', out: '—', hours: '—', log: 'Weekend' },
    { day: 7, status: 'PRESENT', in: '09:10 AM', out: '05:40 PM', hours: '8.5', log: 'Refactored CSS modules to Bootstrap.' },
    { day: 8, status: 'LATE', in: '10:15 AM', out: '06:15 PM', hours: '8.0', log: 'Fixed ESLint errors.' },
    { day: 9, status: 'PRESENT', in: '09:15 AM', out: '05:30 PM', hours: '8.2', log: 'Implemented JWT token refresh.' },
    { day: 10, status: 'PRESENT', in: '09:20 AM', out: '05:35 PM', hours: '8.2', log: 'Configured Redis token cache.' },
    { day: 11, status: 'PRESENT', in: '09:15 AM', out: '05:30 PM', hours: '8.2', log: 'Sprint Review demonstration.' },
    { day: 12, status: 'HOLIDAY', in: '—', out: '—', hours: '—', log: 'Weekend' },
    { day: 13, status: 'HOLIDAY', in: '—', out: '—', hours: '—', log: 'Weekend' },
    { day: 14, status: 'LEAVE', in: '—', out: '—', hours: '—', log: 'Approved Sick Leave' },
    { day: 15, status: 'PRESENT', in: '09:15 AM', out: '05:30 PM', hours: '8.2', log: 'PostgreSQL database modeling.' },
    { day: 16, status: 'PRESENT', in: '09:30 AM', out: '05:30 PM', hours: '8.0', log: 'Built API endpoints for courses.' },
    { day: 17, status: 'ABSENT', in: '—', out: '—', hours: '—', log: 'Unplanned absence (Medical emergency)' },
    { day: 18, status: 'PRESENT', in: '09:15 AM', out: 'In Progress', hours: 'Live', log: 'Working on Intern Portal UI.' },
    { day: 19, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 20, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 21, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 22, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 23, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 24, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 25, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 26, status: 'HOLIDAY', in: '—', out: '—', hours: '—', log: 'Weekend' },
    { day: 27, status: 'HOLIDAY', in: '—', out: '—', hours: '—', log: 'Weekend' },
    { day: 28, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 29, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' },
    { day: 30, status: 'UPCOMING', in: '—', out: '—', hours: '—', log: 'Scheduled' }
  ];

  const handleConfirmCheckout = () => {
    setClockedIn(false);
    setShowCheckoutModal(false);
    setAlert({ type: 'success', text: 'Checked out successfully! Remember to verify your Daily Work Log submission.' });
  };

  const handleClockIn = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setClockInTime(timeStr);
    setClockedIn(true);
    setDurationSeconds(0);
    setAlert({ type: 'success', text: `Clocked in successfully at ${timeStr} (${workMode} mode)` });
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    setShowLeaveModal(false);
    setAlert({ type: 'success', text: `Leave request for ${leaveForm.date} submitted for mentor approval!` });
    setLeaveForm({ date: '', reason: '', type: 'SICK' });
  };

  const getDayDotClass = (status) => {
    switch (status) {
      case 'PRESENT': return 'bg-success';
      case 'ABSENT': return 'bg-danger';
      case 'LATE': return 'bg-warning';
      case 'LEAVE': return 'bg-primary';
      case 'HOLIDAY': return 'bg-secondary';
      default: return 'bg-light border';
    }
  };

  return (
    <AdminPage
      title="Attendance & Time Tracker"
      subtitle="Punch in/out, monitor live working duration, view visual monthly calendar, and apply for leaves"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Top 4 KPI Metrics */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center">
              <span className="text-muted small fw-semibold">Overall Attendance</span>
              <h3 className="fw-bold text-success mb-0">94%</h3>
              <small className="text-muted">Req: 85% for certificate</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center">
              <span className="text-muted small fw-semibold">Total Working Days</span>
              <h3 className="fw-bold text-primary mb-0">42</h3>
              <small className="text-muted">Full cohort duration</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center">
              <span className="text-muted small fw-semibold">Present Days</span>
              <h3 className="fw-bold text-dark mb-0">38</h3>
              <small className="text-success">2 Late • 1 Leave</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 p-3 text-center">
              <span className="text-muted small fw-semibold">Leave Balance</span>
              <h3 className="fw-bold text-info mb-0">2 Days</h3>
              <small className="text-muted">Remaining this month</small>
            </div>
          </div>
        </div>

        {/* Today's Attendance Punch Card */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center g-4">
              <div className="col-md-4 text-center text-md-start border-md-end">
                <span className="text-muted small text-uppercase fw-bold">Live Clock</span>
                <h2 className="display-6 fw-bold text-primary mb-1">{currentTime}</h2>
                <span className="badge bg-light text-dark border">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="col-md-4 text-center border-md-end">
                <span className="text-muted small text-uppercase fw-bold d-block mb-1">Working Duration Counter</span>
                <h2 className="fw-bold text-success font-monospace mb-2">
                  {clockedIn ? formatDuration(durationSeconds) : '00h 00m 00s'}
                </h2>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <span className={`badge px-3 py-1 ${clockedIn ? 'bg-success' : 'bg-secondary'}`}>
                    <i className={`bi bi-${clockedIn ? 'broadcast' : 'power'} me-1`}></i>
                    {clockedIn ? `Checked In at ${clockInTime}` : 'Checked Out'}
                  </span>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className={`btn ${workMode === 'REMOTE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setWorkMode('REMOTE')}
                    >
                      Remote
                    </button>
                    <button
                      type="button"
                      className={`btn ${workMode === 'OFFICE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setWorkMode('OFFICE')}
                    >
                      Office
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-4 text-center text-md-end">
                <div className="d-flex flex-column gap-2">
                  {clockedIn ? (
                    <button
                      className="btn btn-danger btn-lg shadow-sm"
                      onClick={() => setShowCheckoutModal(true)}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i> Check Out
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-lg shadow-sm"
                      onClick={handleClockIn}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i> Clock In Now
                    </button>
                  )}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowLeaveModal(true)}
                  >
                    <i className="bi bi-calendar2-plus me-1"></i> Apply for Leave (2 Days Left)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Monthly Calendar Grid (September 2026) */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold text-dark">September 2026 Attendance Grid</h5>
              <small className="text-muted">Click on any calendar day to inspect check-in/out timestamps and work log</small>
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
                <span className="rounded-circle bg-primary d-inline-block" style={{ width: '10px', height: '10px' }}></span> Leave
              </span>
              <span className="d-flex align-items-center gap-1">
                <span className="rounded-circle bg-secondary d-inline-block" style={{ width: '10px', height: '10px' }}></span> Holiday
              </span>
            </div>
          </div>

          <div className="card-body p-4 pt-0">
            <div className="row row-cols-2 row-cols-sm-4 row-cols-md-7 g-2">
              {calendarDays.map((d) => (
                <div key={d.day} className="col">
                  <div
                    className={`p-2 border rounded-3 text-center cursor-pointer ${
                      selectedDayDetail?.day === d.day ? 'border-primary border-2 bg-light' : 'bg-white'
                    }`}
                    onClick={() => setSelectedDayDetail(d)}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold text-dark">{d.day}</span>
                      <span
                        className={`rounded-circle d-inline-block ${getDayDotClass(d.status)}`}
                        style={{ width: '8px', height: '8px' }}
                      ></span>
                    </div>
                    <span className="d-block small text-muted" style={{ fontSize: '0.7rem' }}>
                      {d.status === 'HOLIDAY' ? 'Off' : d.hours === 'Live' ? '🟢 Live' : `${d.hours}h`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Day Inspection Drawer */}
            {selectedDayDetail && (
              <div className="mt-4 p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 text-dark">
                    September {selectedDayDetail.day}, 2026 — Details
                  </h6>
                  <button
                    type="button"
                    className="btn-close btn-sm"
                    onClick={() => setSelectedDayDetail(null)}
                  ></button>
                </div>
                <div className="row g-2 small">
                  <div className="col-sm-3">
                    <span className="text-muted d-block">Status:</span>
                    <strong className="text-dark">{selectedDayDetail.status}</strong>
                  </div>
                  <div className="col-sm-3">
                    <span className="text-muted d-block">Check In:</span>
                    <strong className="text-dark">{selectedDayDetail.in}</strong>
                  </div>
                  <div className="col-sm-3">
                    <span className="text-muted d-block">Check Out:</span>
                    <strong className="text-dark">{selectedDayDetail.out}</strong>
                  </div>
                  <div className="col-sm-3">
                    <span className="text-muted d-block">Total Hours:</span>
                    <strong className="text-dark">{selectedDayDetail.hours}</strong>
                  </div>
                  <div className="col-12 mt-2">
                    <span className="text-muted d-block">Work Log Summary:</span>
                    <span className="text-dark">{selectedDayDetail.log}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Check-out Confirmation Modal */}
        {showCheckoutModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Confirm Check Out</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-3 text-dark">
                    You have logged <strong className="text-success">{formatDuration(durationSeconds)}</strong> today.
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
                  <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirmCheckout}>
                    Confirm & Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Request Modal */}
        {showLeaveModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Apply for Leave</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLeaveModal(false)}></button>
                </div>
                <form onSubmit={handleApplyLeave}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Leave Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={leaveForm.date}
                        onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Leave Category</label>
                      <select
                        className="form-select"
                        value={leaveForm.type}
                        onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                      >
                        <option value="SICK">Sick Leave (Medical)</option>
                        <option value="COLLEGE">College Exam / Academic Duty</option>
                        <option value="PERSONAL">Personal Emergency</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Reason for Absence</label>
                      <textarea
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
                    <button type="submit" className="btn btn-primary btn-sm">
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
