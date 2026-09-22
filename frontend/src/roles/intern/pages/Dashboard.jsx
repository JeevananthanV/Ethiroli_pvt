import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { fetchInternDashboardData } from '../../../store/slices/internsSlice.js';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.interns || {});

  useEffect(() => {
    dispatch(fetchInternDashboardData());
  }, [dispatch]);

  const profile = dashboard?.profile || {};

  // Dynamically driven by database payload with fallback resilience
  const todayFocusList = useMemo(() => {
    if (dashboard?.todayFocus && Array.isArray(dashboard.todayFocus)) {
      return dashboard.todayFocus;
    }
    return [
      { id: 'f1', text: 'Clock-in Attendance for today', done: false, link: '/app/intern/attendance' },
      { id: 'f2', text: 'Complete Task: Implement Login API & JWT Guard', done: false, link: '/app/intern/tasks' },
      { id: 'f3', text: 'Attend Mentor Doubt Clearing Session at 4:00 PM', done: false, link: '/app/intern/mentor' },
      { id: 'f4', text: 'Submit Daily Work Log before checkout', done: false, link: '/app/intern/work-log' }
    ];
  }, [dashboard]);

  const [todayFocus, setTodayFocus] = useState(todayFocusList);

  useEffect(() => {
    if (dashboard?.todayFocus) {
      setTodayFocus(dashboard.todayFocus);
    }
  }, [dashboard]);

  const toggleFocus = (id) => {
    setTodayFocus((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedFocusCount = todayFocus.filter((f) => f.done).length;
  const focusProgress = todayFocus.length > 0 ? Math.round((completedFocusCount / todayFocus.length) * 100) : 0;

  // 6 Metric Cards - Dynamically supplied by database aggregation
  const kpiCards = useMemo(() => {
    if (dashboard?.kpiCards && Array.isArray(dashboard.kpiCards) && dashboard.kpiCards.length > 0) {
      return dashboard.kpiCards;
    }
    return [
      {
        title: 'Internship Duration',
        value: `Day ${profile.day_number || 18} / ${profile.total_days || 45}`,
        subtext: `${profile.duration_progress || 40}% of duration elapsed`,
        icon: 'bi-calendar-range',
        bgClass: 'kpi-blue',
        progress: profile.duration_progress || 40
      },
      {
        title: 'Daily Tasks',
        value: `${dashboard?.stats?.tasks_completed || 12} / ${dashboard?.stats?.total_tasks || 15}`,
        subtext: '80% Completed',
        icon: 'bi-check2-square',
        bgClass: 'kpi-emerald',
        progress: 80
      },
      {
        title: 'Attendance',
        value: `${dashboard?.stats?.attendance_rate || 94}%`,
        subtext: '38 of 40 days present',
        icon: 'bi-clock-history',
        bgClass: 'kpi-cyan',
        progress: dashboard?.stats?.attendance_rate || 94
      },
      {
        title: 'Training Modules',
        value: '68%',
        subtext: 'Phase 2: In Progress',
        icon: 'bi-journal-code',
        bgClass: 'kpi-indigo',
        progress: 68
      },
      {
        title: 'Active Projects',
        value: '2 Active',
        subtext: 'Ethiroli Web Portal v2',
        icon: 'bi-kanban',
        bgClass: 'kpi-amber',
        progress: 65
      },
      {
        title: 'Overall Progress',
        value: `${dashboard?.stats?.overall_progress || 72}%`,
        subtext: 'On Track for Distinction',
        icon: 'bi-award-fill',
        bgClass: 'kpi-purple',
        progress: dashboard?.stats?.overall_progress || 72
      }
    ];
  }, [dashboard, profile]);

  const curriculum = dashboard?.curriculum || {
    track: 'Full Stack Web Development (MERN)',
    progress: 72,
    currentModule: 'React.js → State Management & Routing',
    currentDescription: 'Mastering Redux Toolkit slices, selectors, and async thunks.',
    nextModule: 'Node.js → Express → MySQL'
  };

  const mentorCard = dashboard?.mentorCard || {
    name: profile.mentor_name || 'Arun Kumar',
    role: 'Senior Full Stack Developer • Lead Mentor',
    status: 'Online',
    nextSession: 'Today • 4:00 PM (30 min)',
    avatar: 'AK'
  };

  const upcomingSchedule = dashboard?.upcomingSchedule || [
    {
      badge: 'TODAY',
      time: '4:00',
      color: 'primary',
      title: 'Mentor Doubt Clearing Session',
      desc: 'Live code review on Redux thunk slice errors with Arun Kumar.'
    },
    {
      badge: 'TOM',
      time: '23:59',
      color: 'danger',
      title: 'Assignment 3 Submission Deadline',
      desc: 'PostgreSQL Schema Design & Relational Constraints verification.'
    },
    {
      badge: 'FRI',
      time: '15:00',
      color: 'info',
      title: 'Weekly Project Sprint Review',
      desc: 'Demoing responsive admin dashboard navigation to project lead.'
    }
  ];

  const recentActivity = dashboard?.recentActivity || [
    {
      icon: 'bi-check2',
      color: 'success',
      title: 'Completed task "Create Navbar & Search Component"',
      meta: '2 hours ago • Daily Tasks'
    },
    {
      icon: 'bi-chat-quote',
      color: 'primary',
      title: 'Mentor Arun Kumar reviewed and approved your Daily Work Log',
      meta: 'Yesterday at 6:30 PM • Rated ⭐⭐⭐⭐ (4/5)'
    },
    {
      icon: 'bi-award',
      color: 'warning',
      title: 'Assignment 2 "REST API Integration & RBAC Guards" was graded: 92/100',
      meta: '2 days ago • Assignments'
    }
  ];

  const quickNavCategories = [
    {
      category: 'Learning & Curriculum',
      icon: 'bi-mortarboard-fill',
      items: [
        { title: 'Training Plan', desc: '45-Day curriculum roadmap', path: '/app/intern/training-plan', icon: 'bi-journal-code' },
        { title: 'LMS Courses', desc: 'Video lectures & lesson tests', path: '/app/intern/courses', icon: 'bi-collection-play-fill' },
        { title: 'Assignments', desc: 'Code submissions & grades', path: '/app/intern/assignments', icon: 'bi-file-earmark-code-fill' },
        { title: 'Achievements', desc: 'Badges & performance rank', path: '/app/intern/achievements', icon: 'bi-trophy-fill' }
      ]
    },
    {
      category: 'Daily Execution',
      icon: 'bi-briefcase-fill',
      items: [
        { title: 'Daily Tasks', desc: 'Jira-style task manager', path: '/app/intern/tasks', icon: 'bi-list-task' },
        { title: 'Attendance', desc: 'Clock-in & monthly grid', path: '/app/intern/attendance', icon: 'bi-calendar-check-fill' },
        { title: 'Daily Work Log', desc: 'Daily activity & learning report', path: '/app/intern/work-log', icon: 'bi-pencil-square' },
        { title: 'Projects', desc: 'Team deliverables & links', path: '/app/intern/projects', icon: 'bi-kanban-fill' }
      ]
    },
    {
      category: 'Mentorship & Growth',
      icon: 'bi-stars',
      items: [
        { title: 'Mentor & Doubts', desc: 'Ask doubts & 1-on-1 sessions', path: '/app/intern/mentor', icon: 'bi-chat-left-dots-fill' },
        { title: 'Messages', desc: 'Direct chat with mentor & HR', path: '/app/intern/messages', icon: 'bi-chat-text-fill' },
        { title: 'Feedback', desc: 'Weekly evaluations & scores', path: '/app/intern/feedback', icon: 'bi-chat-heart-fill' },
        { title: 'Support Help Desk', desc: 'Submit help tickets', path: '/app/intern/help', icon: 'bi-question-circle-fill' }
      ]
    },
    {
      category: 'Portal Records',
      icon: 'bi-folder-fill',
      items: [
        { title: 'Calendar', desc: 'Events, sprints & deadlines', path: '/app/intern/calendar', icon: 'bi-calendar3' },
        { title: 'Documents', desc: 'Offer letters, policies & vault', path: '/app/intern/documents', icon: 'bi-file-earmark-text-fill' },
        { title: 'Certificates', desc: 'Eligibility & verified credential', path: '/app/intern/certificates', icon: 'bi-award-fill' },
        { title: 'My Profile', desc: 'Academic, skills & security', path: '/app/intern/profile', icon: 'bi-person-circle' }
      ]
    }
  ];

  return (
    <AdminPage
      title="Intern Command Center"
      subtitle="Your unified dashboard for daily tasks, curriculum learning, mentorship, and deliverables"
      loading={loading}
      error={error}
      onRetry={() => dispatch(fetchInternDashboardData())}
    >
      <div className="intern-dashboard">
        {/* Top Command Center Banner */}
        <section aria-labelledby="welcome-heading">
          <div className="intern-welcome-card shadow-sm">
            <div className="intern-welcome-info">
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="badge bg-primary-subtle text-primary border px-2 py-1 small fw-semibold">
                  <i className="bi bi-code-slash me-1"></i> Full Stack Web Development (MERN)
                </span>
                <span className="badge bg-success-subtle text-success border px-2 py-1 small fw-semibold">
                  <i className="bi bi-clock-history me-1"></i> Day 18 of 45
                </span>
                <span className="badge bg-info-subtle text-info border px-2 py-1 small fw-semibold">
                  <i className="bi bi-patch-check-fill me-1"></i> Active Intern
                </span>
              </div>
              <h2 id="welcome-heading" className="fw-bold mb-1">
                Good Morning, {profile.full_name || 'Jeevananthan'} 👋
              </h2>
              <p className="text-muted small mb-0">
                You're making great strides on the Ethiroli Web Portal. Here's your mission plan for today.
              </p>
            </div>
            <div className="intern-welcome-action d-flex flex-wrap gap-2">
              <Link to="/app/intern/attendance" className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm">
                <i className="bi bi-clock-fill"></i> Today's Attendance
              </Link>
              <Link to="/app/intern/tasks" className="btn btn-outline-primary d-inline-flex align-items-center gap-2 bg-white">
                <i className="bi bi-list-check"></i> Today's Tasks
              </Link>
              <Link to="/app/intern/mentor" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 bg-white">
                <i className="bi bi-chat-dots-fill"></i> Ask Mentor
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Key Performance Metric Cards */}
        <section aria-label="Key Performance Indicators">
          <div className="row g-3">
            {kpiCards.map((kpi) => (
              <div key={kpi.title} className="col-12 col-sm-6 col-lg-4 col-xl-2">
                <div className="intern-kpi-card shadow-sm">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="kpi-title">{kpi.title}</span>
                    <div className={`kpi-icon-pill ${kpi.bgClass}`}>
                      <i className={`bi ${kpi.icon}`}></i>
                    </div>
                  </div>
                  <h3 className="kpi-value mb-1">{kpi.value}</h3>
                  <div className="progress kpi-progress mb-2" style={{ height: '4px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${kpi.progress}%` }}
                      aria-valuenow={kpi.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="kpi-subtext">{kpi.subtext}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Middle Row: Today's Focus & Training Progress + Mentor Card */}
        <div className="row g-4">
          {/* Left Column: Today's Focus (Must Do Today) */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-bullseye text-danger"></i> Today’s Focus (Must Do Today)
                  </h5>
                  <small className="text-muted">High priority execution items scheduled for today</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success-subtle text-success fw-semibold">
                    {completedFocusCount}/{todayFocus.length} Done ({focusProgress}%)
                  </span>
                </div>
              </div>

              <div className="card-body p-4 pt-0">
                <div className="progress mb-3" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${focusProgress}%` }}
                    role="progressbar"
                  ></div>
                </div>

                <div className="list-group list-group-flush">
                  {todayFocus.map((item) => (
                    <div
                      key={item.id}
                      className={`list-group-item px-0 py-3 d-flex align-items-center justify-content-between border-bottom ${
                        item.done ? 'bg-light-subtle' : ''
                      }`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <button
                          type="button"
                          className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${
                            item.done ? 'btn-success text-white' : 'btn-outline-secondary'
                          }`}
                          style={{ width: '26px', height: '26px' }}
                          onClick={() => toggleFocus(item.id)}
                          aria-label={item.done ? 'Mark pending' : 'Mark done'}
                        >
                          <i className={`bi ${item.done ? 'bi-check' : ''}`}></i>
                        </button>
                        <span className={`fw-medium ${item.done ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                          {item.text}
                        </span>
                      </div>
                      <Link to={item.link} className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                        Open <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Training Progress & Assigned Mentor */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3 h-100">
              {/* Training Progress Widget */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-0">
                  <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-mortarboard-fill text-primary"></i> Curriculum Progress
                  </h5>
                </div>
                <div className="card-body p-4 pt-0">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-dark">{curriculum.track}</span>
                    <span className="fw-bold text-primary">{curriculum.progress}% Completed</span>
                  </div>
                  <div className="progress mb-3" style={{ height: '8px' }}>
                    <div className="progress-bar bg-primary" style={{ width: `${curriculum.progress}%` }}></div>
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-3">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-warning text-dark small">Current Module</span>
                      <strong className="small text-dark">{curriculum.currentModule}</strong>
                    </div>
                    <p className="text-muted small mb-0">
                      {curriculum.currentDescription}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center text-muted small">
                    <span><strong>Next Up:</strong> {curriculum.nextModule}</span>
                    <Link to="/app/intern/training-plan" className="fw-semibold text-primary text-decoration-none">
                      Roadmap <i className="bi bi-chevron-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mentor Card */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-person-workspace text-info"></i> Assigned Mentor
                  </h5>
                  <span className="badge bg-success-subtle text-success">{mentorCard.status}</span>
                </div>
                <div className="card-body p-4 pt-0">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: '48px', height: '48px' }}>
                      {mentorCard.avatar}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{mentorCard.name}</h6>
                      <small className="text-muted d-block">{mentorCard.role}</small>
                    </div>
                  </div>

                  <div className="p-2 bg-info-subtle rounded-2 border border-info-subtle mb-3 small d-flex align-items-center justify-content-between">
                    <span><i className="bi bi-calendar-event me-2 text-info"></i>Next Session:</span>
                    <strong className="text-dark">{mentorCard.nextSession}</strong>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => alert('Opening Google Meet session...')}>
                      <i className="bi bi-camera-video-fill me-1"></i> Join Session
                    </button>
                    <Link to="/app/intern/messages" className="btn btn-outline-secondary btn-sm flex-grow-1">
                      <i className="bi bi-chat-dots me-1"></i> Message
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule / Deadlines & Activity Feed */}
        <div className="row g-4">
          {/* Upcoming Schedule & Deadlines */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-calendar3-event text-warning"></i> Upcoming Deadlines & Schedule
                </h5>
                <Link to="/app/intern/calendar" className="small text-decoration-none fw-semibold">
                  Full Calendar <i className="bi bi-chevron-right"></i>
                </Link>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="d-flex flex-column gap-3">
                  {upcomingSchedule.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                      <div className={`badge bg-${item.color} p-2 text-center rounded-2`} style={{ minWidth: '46px' }}>
                        <span className="d-block small text-uppercase">{item.badge}</span>
                        <strong className="fs-6">{item.time}</strong>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{item.title}</h6>
                        <p className="text-muted small mb-0">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-secondary"></i> Recent Activity Stream
                </h5>
              </div>
              <div className="card-body p-4 pt-0">
                <ul className="timeline-list list-unstyled mb-0">
                  {recentActivity.map((act, idx) => (
                    <li key={idx} className="timeline-item d-flex gap-3 pb-3 border-bottom mb-3">
                      <div className={`timeline-icon bg-${act.color}-subtle text-${act.color} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
                        <i className={`bi ${act.icon}`}></i>
                      </div>
                      <div>
                        <p className="mb-0 text-dark small">{act.title}</p>
                        <small className="text-muted">{act.meta}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Categorized Quick Access Portal Navigation */}
        <section aria-labelledby="portal-nav-heading">
          <div className="intern-section-header mb-3">
            <h5 id="portal-nav-heading" className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <i className="bi bi-grid-fill text-primary"></i> Intern Portal Modules
            </h5>
          </div>
          <div className="row g-3">
            {quickNavCategories.map((cat) => (
              <div key={cat.category} className="col-12 col-md-6 col-lg-3">
                <div className="intern-portal-category shadow-sm">
                  <h6 className="intern-category-title">
                    <i className={`bi ${cat.icon}`}></i> {cat.category}
                  </h6>
                  <ul className="intern-tile-list" role="list">
                    {cat.items.map((item) => (
                      <li key={item.path} role="listitem">
                        <Link to={item.path} className="intern-nav-tile">
                          <div className="intern-tile-icon">
                            <i className={`bi ${item.icon}`}></i>
                          </div>
                          <div className="intern-tile-content">
                            <span className="intern-tile-name">{item.title}</span>
                            <span className="intern-tile-desc">{item.desc}</span>
                          </div>
                          <i className="bi bi-chevron-right intern-tile-arrow"></i>
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