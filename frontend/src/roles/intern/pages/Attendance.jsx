import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';

export default function Attendance() {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [workMode, setWorkMode] = useState('REMOTE');
  const [todayHours, setTodayHours] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initial mock / state sync
  const [logs, setLogs] = useState([
    { id: '1', date: new Date().toISOString().slice(0, 10), clockIn: '09:30 AM', clockOut: '—', hours: 'In Progress', mode: 'REMOTE', status: 'PRESENT' },
    { id: '2', date: '2026-09-09', clockIn: '09:15 AM', clockOut: '05:45 PM', hours: '8.50', mode: 'REMOTE', status: 'PRESENT' },
    { id: '3', date: '2026-09-08', clockIn: '09:30 AM', clockOut: '05:30 PM', hours: '8.00', mode: 'OFFICE', status: 'PRESENT' },
    { id: '4', date: '2026-09-07', clockIn: '09:45 AM', clockOut: '05:45 PM', hours: '8.00', mode: 'REMOTE', status: 'PRESENT' },
    { id: '5', date: '2026-09-05', clockIn: '10:00 AM', clockOut: '02:00 PM', hours: '4.00', mode: 'REMOTE', status: 'HALF_DAY' },
  ]);

  useEffect(() => {
    // Check if clocked in today in session
    const savedClock = localStorage.getItem(`attendance_${user?.id || 'intern'}`);
    if (savedClock) {
      const data = JSON.parse(savedClock);
      if (data.date === new Date().toISOString().slice(0, 10) && !data.clockOut) {
        setClockedIn(true);
        setClockInTime(data.clockIn);
        setWorkMode(data.mode || 'REMOTE');
      }
    }
  }, [user]);

  const handleClockIn = () => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockedIn(true);
      setClockInTime(timeStr);
      setMessage({ type: 'success', text: `Clocked in successfully at ${timeStr} (${workMode} mode)` });
      
      const entry = { date: now.toISOString().slice(0, 10), clockIn: timeStr, mode: workMode };
      localStorage.setItem(`attendance_${user?.id || 'intern'}`, JSON.stringify(entry));
      
      setLogs((prev) => [
        { id: Date.now().toString(), date: entry.date, clockIn: timeStr, clockOut: '—', hours: 'In Progress', mode: workMode, status: 'PRESENT' },
        ...prev.filter((l) => l.date !== entry.date)
      ]);
      setLoading(false);
    }, 400);
  };

  const handleClockOut = () => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockedIn(false);
      setMessage({ type: 'info', text: `Clocked out at ${timeStr}. Great work today!` });
      localStorage.removeItem(`attendance_${user?.id || 'intern'}`);
      
      const todayDate = now.toISOString().slice(0, 10);
      setLogs((prev) =>
        prev.map((l) =>
          l.date === todayDate
            ? { ...l, clockOut: timeStr, hours: '8.25', status: 'PRESENT' }
            : l
        )
      );
      setTodayHours('8.25');
      setLoading(false);
    }, 400);
  };

  return (
    <AdminPage
      title="Attendance & Time Tracker"
      subtitle="Log your daily check-in, track hours, and monitor attendance history"
    >
      <div className="container-fluid px-0">
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'info'} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'info-circle'} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Punch In / Out Card & Summary Stats */}
        <div className="row g-3 mb-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                <p className="text-muted mb-1 text-uppercase fw-semibold small">Real-Time Clock In / Out</p>
                <h2 className="display-6 fw-bold mb-2 text-primary">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </h2>
                
                <div className="my-3">
                  <span className={`badge px-3 py-2 fs-6 ${clockedIn ? 'bg-success' : 'bg-secondary'}`}>
                    <i className={`bi bi-${clockedIn ? 'broadcast' : 'power'} me-1`}></i>
                    {clockedIn ? `Status: CLOCKED IN since ${clockInTime}` : 'Status: NOT CLOCKED IN'}
                  </span>
                </div>

                <div className="mb-3 w-75 mx-auto">
                  <label className="form-label small text-muted">Work Location Mode</label>
                  <select 
                    className="form-select text-center" 
                    value={workMode} 
                    onChange={(e) => setWorkMode(e.target.value)}
                    disabled={clockedIn}
                  >
                    <option value="REMOTE">Remote / Work from Home</option>
                    <option value="OFFICE">Office / In-Person</option>
                  </select>
                </div>

                <div className="d-grid gap-2 col-8 mx-auto mt-2">
                  {!clockedIn ? (
                    <button 
                      className="btn btn-success btn-lg py-2 fw-semibold shadow-sm"
                      onClick={handleClockIn}
                      disabled={loading}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      {loading ? 'Processing...' : 'Clock In Now'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-danger btn-lg py-2 fw-semibold shadow-sm"
                      onClick={handleClockOut}
                      disabled={loading}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i>
                      {loading ? 'Processing...' : 'Clock Out Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="row g-3 h-100">
              <div className="col-sm-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="bg-primary-subtle text-primary p-3 rounded-circle mb-3">
                      <i className="bi bi-calendar-check fs-3"></i>
                    </div>
                    <p className="text-muted mb-1 small fw-semibold">Attendance Rate</p>
                    <h3 className="fw-bold mb-0">96.4%</h3>
                    <small className="text-success mt-1">21 of 22 working days</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="bg-info-subtle text-info p-3 rounded-circle mb-3">
                      <i className="bi bi-hourglass-split fs-3"></i>
                    </div>
                    <p className="text-muted mb-1 small fw-semibold">Total Hours (Month)</p>
                    <h3 className="fw-bold mb-0">168.5 hrs</h3>
                    <small className="text-muted mt-1">Avg 8.1 hrs/day</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="bg-warning-subtle text-warning p-3 rounded-circle mb-3">
                      <i className="bi bi-lightning-charge fs-3"></i>
                    </div>
                    <p className="text-muted mb-1 small fw-semibold">Active Streak</p>
                    <h3 className="fw-bold mb-0">14 Days</h3>
                    <small className="text-warning mt-1">On track for Streak Badge!</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="bg-success-subtle text-success p-3 rounded-circle mb-3">
                      <i className="bi bi-shield-check fs-3"></i>
                    </div>
                    <p className="text-muted mb-1 small fw-semibold">Punctuality Score</p>
                    <h3 className="fw-bold mb-0">100%</h3>
                    <small className="text-success mt-1">Zero late marks</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Attendance Log Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Recent Attendance Logs</h5>
            <span className="badge bg-light text-dark border">September 2026</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Date</th>
                  <th scope="col">Clock In</th>
                  <th scope="col">Clock Out</th>
                  <th scope="col">Logged Hours</th>
                  <th scope="col">Mode</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="ps-4 fw-medium">{log.date}</td>
                    <td>{log.clockIn}</td>
                    <td>{log.clockOut}</td>
                    <td><span className="fw-semibold">{log.hours}</span></td>
                    <td>
                      <span className="badge bg-light text-secondary border">
                        {log.mode}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${log.status === 'PRESENT' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
