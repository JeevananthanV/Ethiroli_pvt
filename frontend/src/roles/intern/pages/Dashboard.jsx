import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { fetchInternDashboardData } from '../../../store/slices/internsSlice.js';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.interns || {});

  const [localGoals, setLocalGoals] = useState([]);

  useEffect(() => {
    dispatch(fetchInternDashboardData());
  }, [dispatch]);

  // Sync goals when dashboard data arrives
  useEffect(() => {
    if (dashboard?.goals && Array.isArray(dashboard.goals)) {
      setLocalGoals(dashboard.goals);
    }
  }, [dashboard]);

  const profile = dashboard?.profile || {};
  const statsData = dashboard?.stats || {};

  const stats = useMemo(() => [
    {
      label: 'Tasks Completed',
      value: String(statsData.tasks_completed ?? 0),
      subtitle: statsData.total_tasks ? `of ${statsData.total_tasks} assigned` : 'Total finished',
      icon: 'bi-check2-circle',
      colorClass: 'icon-blue'
    },
    {
      label: 'Hours Logged',
      value: String(statsData.hours_logged ?? '0.0'),
      subtitle: 'Attendance tracked',
      icon: 'bi-clock-history',
      colorClass: 'icon-emerald'
    },
    {
      label: 'Mentor Sessions',
      value: String(statsData.mentor_sessions ?? 0),
      subtitle: profile.mentor_name ? `With ${profile.mentor_name}` : 'Sessions completed',
      icon: 'bi-people-fill',
      colorClass: 'icon-purple'
    },
    {
      label: 'Current Streak',
      value: `${statsData.current_streak ?? 0} days`,
      subtitle: 'Consistent attendance',
      icon: 'bi-fire',
      colorClass: 'icon-amber'
    }
  ], [statsData, profile]);

  const toggleGoal = (id) => {
    setLocalGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const completedGoalsCount = localGoals.filter((g) => g.done).length;
  const goalsProgressPercent = localGoals.length > 0 
    ? Math.round((completedGoalsCount / localGoals.length) * 100) 
    : 0;

  const quickNavCategories = [
    {
      category: 'Learning & Curriculum',
      icon: 'bi-mortarboard-fill',
      items: [
        { title: 'Training Plan', desc: 'Curriculum & roadmap', path: '/app/intern/training-plan', icon: 'bi-journal-code' },
        { title: 'LMS Courses', desc: 'Video lectures & tests', path: '/app/intern/courses', icon: 'bi-collection-play-fill' },
        { title: 'Assignments', desc: 'Code submissions & grades', path: '/app/intern/assignments', icon: 'bi-file-earmark-code-fill' }
      ]
    },
    {
      category: 'Daily Execution',
      icon: 'bi-briefcase-fill',
      items: [
        { title: 'Daily Tasks', desc: 'Sprint items & backlogs', path: '/app/intern/tasks', icon: 'bi-list-task' },
        { title: 'Attendance', desc: 'Clock-in & work logs', path: '/app/intern/attendance', icon: 'bi-calendar-check-fill' },
        { title: 'Daily Work Log', desc: 'Daily activity reports', path: '/app/intern/work-log', icon: 'bi-pencil-square' },
        { title: 'Projects', desc: 'Team deliverables', path: '/app/intern/projects', icon: 'bi-kanban-fill' }
      ]
    },
    {
      category: 'Mentorship & Growth',
      icon: 'bi-stars',
      items: [
        { title: 'Mentor & Doubts', desc: 'Ask questions & reviews', path: '/app/intern/mentor', icon: 'bi-chat-left-dots-fill' },
        { title: 'Achievements', desc: 'Badges & milestones', path: '/app/intern/achievements', icon: 'bi-trophy-fill' },
        { title: 'Certificates', desc: 'Completed certificates', path: '/app/intern/certificates', icon: 'bi-award-fill' },
        { title: 'Feedback', desc: 'Evaluations & ratings', path: '/app/intern/feedback', icon: 'bi-chat-heart-fill' }
      ]
    },
    {
      category: 'Portal Records',
      icon: 'bi-folder-fill',
      items: [
        { title: 'Documents', desc: 'Offer letters & policies', path: '/app/intern/documents', icon: 'bi-file-earmark-text-fill' },
        { title: 'Calendar', desc: 'Events & deadlines', path: '/app/intern/calendar', icon: 'bi-calendar3' },
        { title: 'Profile', desc: 'Personal & college details', path: '/app/intern/profile', icon: 'bi-person-circle' }
      ]
    }
  ];

  return (
    <AdminPage
      title="Intern Dashboard"
      subtitle="Track your learning goals, daily tasks, and mentorship progress"
      loading={loading}
      error={error}
      onRetry={() => dispatch(fetchInternDashboardData())}
    >
      <div className="intern-dashboard">
        {/* Welcome & Overview Header */}
        <section aria-labelledby="welcome-heading">
          <div className="intern-welcome-card">
            <div className="intern-welcome-info">
              <h2 id="welcome-heading">
                Welcome back, {profile.full_name || 'Intern'}!
              </h2>
              <div className="intern-welcome-badges">
                <span className="intern-badge intern-badge-active">
                  <i className="bi bi-patch-check-fill" aria-hidden="true"></i> Active Intern
                </span>
                {profile.college_name && (
                  <span className="intern-badge">
                    <i className="bi bi-building" aria-hidden="true"></i> {profile.college_name}
                  </span>
                )}
                {profile.mentor_name ? (
                  <span className="intern-badge">
                    <i className="bi bi-person-badge" aria-hidden="true"></i> Mentor: {profile.mentor_name}
                  </span>
                ) : (
                  <span className="intern-badge">
                    <i className="bi bi-person-badge" aria-hidden="true"></i> Mentor Assigned
                  </span>
                )}
              </div>
            </div>
            <div className="intern-welcome-action">
              <Link to="/app/intern/attendance" className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm">
                <i className="bi bi-clock-fill" aria-hidden="true"></i> Check-in / Attendance
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Metric Cards */}
        <section aria-label="Key Performance Indicators">
          <div className="row g-3">
            {stats.map((stat) => (
              <div key={stat.label} className="col-6 col-lg-3">
                <div className="intern-stat-card">
                  <div className={`intern-stat-icon-wrapper ${stat.colorClass}`} aria-hidden="true">
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <div className="intern-stat-content">
                    <div className="intern-stat-label">{stat.label}</div>
                    <h3 className="intern-stat-value">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Goals Widget */}
        <section aria-labelledby="goals-heading">
          <div className="intern-goals-card">
            <div className="intern-goals-header">
              <h2 id="goals-heading" className="intern-goals-title">
                <i className="bi bi-bullseye text-primary" aria-hidden="true"></i> Weekly Goals & Milestones
              </h2>
              {localGoals.length > 0 && (
                <div className="goals-progress-wrapper" aria-label={`Goal progress: ${completedGoalsCount} of ${localGoals.length} completed (${goalsProgressPercent}%)`}>
                  <div className="goals-progress-bar-bg" role="progressbar" aria-valuenow={goalsProgressPercent} aria-valuemin="0" aria-valuemax="100">
                    <div className="goals-progress-bar-fill" style={{ width: `${goalsProgressPercent}%` }}></div>
                  </div>
                  <span className="goals-progress-text">
                    {completedGoalsCount}/{localGoals.length} ({goalsProgressPercent}%)
                  </span>
                </div>
              )}
            </div>

            {localGoals.length === 0 ? (
              <div className="goals-empty-state">
                <div className="goals-empty-icon" aria-hidden="true">
                  <i className="bi bi-clipboard-check"></i>
                </div>
                <h3>No goals assigned yet</h3>
                <p>Your mentor will assign this week's goals and milestone targets here.</p>
              </div>
            ) : (
              <ul className="intern-goals-list" role="list">
                {localGoals.map((goal) => (
                  <li key={goal.id} className="intern-goal-item" role="listitem">
                    <button
                      type="button"
                      className={`goal-checkbox-btn ${goal.done ? 'completed' : 'pending'}`}
                      onClick={() => toggleGoal(goal.id)}
                      role="checkbox"
                      aria-checked={goal.done}
                      aria-label={`Mark goal as ${goal.done ? 'incomplete' : 'complete'}: ${goal.text}`}
                    >
                      <i className={`bi ${goal.done ? 'bi-check-circle-fill' : 'bi-circle'}`} aria-hidden="true"></i>
                    </button>
                    <span className={`goal-text ${goal.done ? 'completed' : ''}`}>
                      {goal.text}
                    </span>
                    <span className={`goal-status-badge ${goal.done ? 'badge-completed' : 'badge-pending'}`}>
                      {goal.done ? 'Completed' : 'In Progress'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Categorized Quick Access Portal Navigation */}
        <section aria-labelledby="portal-nav-heading">
          <div className="intern-section-header">
            <h2 id="portal-nav-heading" className="intern-section-title">
              <i className="bi bi-grid-fill text-primary" aria-hidden="true"></i> Intern Portal Modules
            </h2>
          </div>
          <div className="row g-3">
            {quickNavCategories.map((cat) => (
              <div key={cat.category} className="col-12 col-md-6 col-lg-3">
                <div className="intern-portal-category">
                  <h3 className="intern-category-title">
                    <i className={`bi ${cat.icon}`} aria-hidden="true"></i> {cat.category}
                  </h3>
                  <ul className="intern-tile-list" role="list">
                    {cat.items.map((item) => (
                      <li key={item.path} role="listitem">
                        <Link to={item.path} className="intern-nav-tile">
                          <div className="intern-tile-icon" aria-hidden="true">
                            <i className={`bi ${item.icon}`}></i>
                          </div>
                          <div className="intern-tile-content">
                            <span className="intern-tile-name">{item.title}</span>
                            <span className="intern-tile-desc">{item.desc}</span>
                          </div>
                          <i className="bi bi-chevron-right intern-tile-arrow" aria-hidden="true"></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminPage>
  );
}