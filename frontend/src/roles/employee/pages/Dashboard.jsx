import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [punching, setPunching] = useState(false);
  const [punchMsg, setPunchMsg] = useState('');

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getDashboardOverview();
      const overview = res?.data || res;
      setData(overview);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handlePunch = async (action) => {
    setPunching(true);
    setPunchMsg('');
    try {
      await employeePortalApi.punchAttendance(action);
      setPunchMsg(`Successfully ${action === 'CHECK_IN' ? 'punched in' : 'punched out'}!`);
      await fetchOverview();
    } catch (err) {
      setError(err.message || `Failed to ${action.toLowerCase()}`);
    } finally {
      setPunching(false);
    }
  };

  const todayAttendance = data?.todayAttendance;
  const isCheckedIn = Boolean(todayAttendance?.check_in_time);
  const isCheckedOut = Boolean(todayAttendance?.check_out_time);
  const leaveBalances = data?.leaveBalances || [];
  const upcomingTasks = data?.upcomingTasks || [];
  const announcements = data?.recentAnnouncements || [];

  return (
    <AdminPage
      title="Employee Self-Service Portal"
      subtitle="Welcome back! Here is your daily work summary, attendance, and team updates."
      loading={loading}
      error={error}
      onRetry={fetchOverview}
    >
      {punchMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-2" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{punchMsg}</div>
          <button type="button" className="btn-close" onClick={() => setPunchMsg('')}></button>
        </div>
      )}

      {/* Row 1: KPI Summary Cards */}
      <div className="row g-3 mb-2">
        {/* Clock In / Out Card */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Attendance</span>
              <span className={`badge ${todayAttendance?.status === 'PRESENT' ? 'bg-success' : 'bg-secondary'}`}>
                {todayAttendance?.status || 'NOT LOGGED'}
              </span>
            </div>
            <div className="fw-bold fs-5 text-dark mb-2">
              {isCheckedIn
                ? `In: ${new Date(todayAttendance.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Not Punched Today'}
            </div>
            <div className="mt-auto d-flex gap-2">
              <button
                className="btn btn-sm btn-primary w-100"
                disabled={punching || isCheckedIn}
                onClick={() => handlePunch('CHECK_IN')}
              >
                {isCheckedIn ? 'Punched In' : 'Punch In'}
              </button>
              <button
                className="btn btn-sm btn-outline-danger w-100"
                disabled={punching || !isCheckedIn || isCheckedOut}
                onClick={() => handlePunch('CHECK_OUT')}
              >
                {isCheckedOut ? 'Punched Out' : 'Punch Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Leave Balance Card */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Leave Balance</span>
              <i className="bi bi-calendar-check text-primary fs-5"></i>
            </div>
            <div className="d-flex justify-content-between align-items-baseline mb-1">
              {leaveBalances.slice(0, 3).map((b) => (
                <div key={b.leave_type} className="text-center">
                  <div className="fw-bold text-dark fs-5">{b.balance ?? b.total_credited}</div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>{b.leave_type}</small>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-2 border-top">
              <Link to="/app/employee/leaves" className="text-primary text-decoration-none small fw-semibold">
                Apply for leave &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Tasks Assigned Card */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Pending Tasks</span>
              <i className="bi bi-check2-square text-warning fs-5"></i>
            </div>
            <div className="fw-bold fs-3 text-dark mb-1">{upcomingTasks.length}</div>
            <div className="text-muted small mb-2">Deliverables assigned to you</div>
            <div className="mt-auto pt-2 border-top">
              <Link to="/app/employee/tasks" className="text-primary text-decoration-none small fw-semibold">
                View task list &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Projects & Team Card */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Projects</span>
              <i className="bi bi-kanban text-info fs-5"></i>
            </div>
            <div className="fw-bold fs-3 text-dark mb-1">{data?.projectsCount || 0}</div>
            <div className="text-muted small mb-2">Active engineering projects</div>
            <div className="mt-auto pt-2 border-top">
              <Link to="/app/employee/projects" className="text-primary text-decoration-none small fw-semibold">
                Explore projects &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation Hub across 5 Core Domains */}
      <div className="card shadow-sm border-0 mb-2">
        <div className="card-header bg-white py-3">
          <h6 className="mb-0 fw-bold">Employee Navigation Hub</h6>
        </div>
        <div className="card-body p-3">
          <div className="row g-3">
            {/* Employee Management */}
            <div className="col-md-6 col-lg-3">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-briefcase text-primary"></i>
                  <span>Employee Management</span>
                </div>
                <div className="d-flex flex-column gap-1 small">
                  <Link to="/app/employee/tasks" className="text-decoration-none text-secondary py-1">
                    &bull; My Tasks
                  </Link>
                  <Link to="/app/employee/projects" className="text-decoration-none text-secondary py-1">
                    &bull; My Projects
                  </Link>
                  <Link to="/app/employee/attendance" className="text-decoration-none text-secondary py-1">
                    &bull; Attendance & Time
                  </Link>
                  <Link to="/app/employee/leaves" className="text-decoration-none text-secondary py-1">
                    &bull; Leave Management
                  </Link>
                  <Link to="/app/employee/calendar" className="text-decoration-none text-secondary py-1">
                    &bull; Company Calendar
                  </Link>
                </div>
              </div>
            </div>

            {/* Learning & Development */}
            <div className="col-md-6 col-lg-3">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-mortarboard text-success"></i>
                  <span>Learning & Growth</span>
                </div>
                <div className="d-flex flex-column gap-1 small">
                  <Link to="/app/employee/training" className="text-decoration-none text-secondary py-1">
                    &bull; My Training Courses
                  </Link>
                  <Link to="/app/employee/assignments" className="text-decoration-none text-secondary py-1">
                    &bull; Assignments & Evaluations
                  </Link>
                  <Link to="/app/employee/performance" className="text-decoration-none text-secondary py-1">
                    &bull; Performance Reviews
                  </Link>
                  <Link to="/app/employee/achievements" className="text-decoration-none text-secondary py-1">
                    &bull; Badges & Achievements
                  </Link>
                </div>
              </div>
            </div>

            {/* Personal Records */}
            <div className="col-md-6 col-lg-3">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-person-badge text-warning"></i>
                  <span>Personal Records</span>
                </div>
                <div className="d-flex flex-column gap-1 small">
                  <Link to="/app/employee/documents" className="text-decoration-none text-secondary py-1">
                    &bull; My Documents Vault
                  </Link>
                  <Link to="/app/employee/payslips" className="text-decoration-none text-secondary py-1">
                    &bull; Payslips & Compensation
                  </Link>
                  <Link to="/app/employee/profile" className="text-decoration-none text-secondary py-1">
                    &bull; My Profile & KYC
                  </Link>
                </div>
              </div>
            </div>

            {/* Communication & Governance */}
            <div className="col-md-6 col-lg-3">
              <div className="p-3 border rounded-3 h-100 bg-light">
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-chat-square-dots text-danger"></i>
                  <span>Communication</span>
                </div>
                <div className="d-flex flex-column gap-1 small">
                  <Link to="/app/employee/approvals" className="text-decoration-none text-secondary py-1">
                    &bull; Approval Requests
                  </Link>
                  <Link to="/app/employee/announcements" className="text-decoration-none text-secondary py-1">
                    &bull; Announcements
                  </Link>
                  <Link to="/app/employee/messages" className="text-decoration-none text-secondary py-1">
                    &bull; Team Messages
                  </Link>
                  <Link to="/app/employee/notifications" className="text-decoration-none text-secondary py-1">
                    &bull; Notifications
                  </Link>
                  <Link to="/app/employee/support" className="text-decoration-none text-secondary py-1">
                    &bull; Help & Support Desk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Tasks & Recent Announcements */}
      <div className="row g-4">
        {/* Tasks */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">My Next Tasks</h6>
              <Link to="/app/employee/tasks" className="small text-primary text-decoration-none">
                View All
              </Link>
            </div>
            <div className="card-body p-3">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-4 text-muted small">No pending tasks assigned!</div>
              ) : (
                <div className="list-group list-group-flush">
                  {upcomingTasks.map((t) => (
                    <div key={t.id} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold text-dark small">{t.description}</div>
                        <small className="text-muted">
                          Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'No deadline'}
                        </small>
                      </div>
                      <span className={`badge ${t.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Company Bulletins</h6>
              <Link to="/app/employee/announcements" className="small text-primary text-decoration-none">
                View All
              </Link>
            </div>
            <div className="card-body p-3">
              {announcements.length === 0 ? (
                <div className="text-center py-4 text-muted small">No recent announcements.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {announcements.map((a) => (
                    <div key={a.id} className="list-group-item px-0 py-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="fw-semibold text-dark small">{a.subject}</div>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {new Date(a.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="text-muted small mb-0 text-truncate">{a.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
