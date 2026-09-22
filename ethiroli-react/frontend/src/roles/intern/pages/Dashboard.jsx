import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { fetchInterns } from '../../../store/slices/internsSlice.js';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: interns } = useSelector((state) => state.interns || {});

  useEffect(() => {
    dispatch(fetchInterns());
  }, [dispatch]);

  const myRecord = Array.isArray(interns) && interns.length > 0 ? interns[0] : null;
  const goals = myRecord?.goals || [];
  const stats = [
    { label: 'Tasks Completed', value: String(myRecord?.tasks_completed || 0) },
    { label: 'Hours Logged', value: String(myRecord?.hours_logged || 0) },
    { label: 'Mentor Sessions', value: String(myRecord?.mentor_sessions || 0) },
    { label: 'Current Streak', value: myRecord?.current_streak ? `${myRecord.current_streak} days` : '0 days' }
  ];

  return (
    <AdminPage
      title="Intern Dashboard"
      subtitle="Track your learning goals, tasks, and mentor progress"
    >
      <div className="dashboard">
        <div className="row g-3 mb-4">
          {stats.map((stat) => (
            <div key={stat.label} className="col-md-3">
              <div className="card bg-light border h-100">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <p className="mb-1 text-muted small">{stat.label}</p>
                  <h3 className="mb-0">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-12">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">Intern Portal Navigation</h6>
              </div>
              <div className="card-body">
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/app/intern/training-plan" className="btn btn-outline-primary">My Training Plan</Link>
                  <Link to="/app/intern/tasks" className="btn btn-outline-info">Daily Tasks</Link>
                  <Link to="/app/intern/attendance" className="btn btn-outline-success">Attendance</Link>
                  <Link to="/app/intern/work-log" className="btn btn-outline-dark">Daily Work Log</Link>
                  <Link to="/app/intern/projects" className="btn btn-outline-warning">Projects</Link>
                  <Link to="/app/intern/assignments" className="btn btn-outline-secondary">Assignments</Link>
                  <Link to="/app/intern/courses" className="btn btn-outline-primary">LMS Courses</Link>
                  <Link to="/app/intern/mentor" className="btn btn-outline-secondary">Mentor & Doubts</Link>
                  <Link to="/app/intern/achievements" className="btn btn-outline-warning">Achievements</Link>
                  <Link to="/app/intern/certificates" className="btn btn-outline-success">Certificates</Link>
                  <Link to="/app/intern/documents" className="btn btn-outline-secondary">Documents</Link>
                  <Link to="/app/intern/feedback" className="btn btn-outline-secondary">Feedback</Link>
                  <Link to="/app/intern/calendar" className="btn btn-outline-secondary">Calendar</Link>
                  <Link to="/app/intern/profile" className="btn btn-outline-dark">Profile</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h6 className="mb-0">Weekly Goals</h6>
          </div>
          <div className="card-body">
            {goals.length === 0 ? (
              <div className="emptyState">
                <h3>No goals set</h3>
                <p>Your mentor will assign weekly goals here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {goals.map((goal) => (
                  <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--admin-border-subtle)' }}>
                    <span style={{ fontSize: 18 }}>{goal.done ? '✅' : '🔵'}</span>
                    <span style={{ color: goal.done ? 'var(--admin-text-muted)' : 'var(--admin-text-primary)', textDecoration: goal.done ? 'line-through' : 'none' }}>
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}