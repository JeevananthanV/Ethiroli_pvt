import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { fetchInternDashboardData } from '../../../store/slices/internsSlice.js';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.interns || {});
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchInternDashboardData());
  }, [dispatch]);

  const profile = dashboard?.profile || {};

  /**
   * Dynamic greeting derived from authenticated user or profile
   */
  const firstName = useMemo(() => {
    const candidate = user?.full_name || user?.name || profile.full_name || '';
    const trimmed = String(candidate).trim();
    return trimmed ? trimmed.split(/\s+/)[0] : '';
  }, [user?.full_name, user?.name, profile.full_name]);

  const greetingName = firstName || 'Intern';

  // Dynamic Today Focus items with fallback resilience
  const initialFocus = useMemo(() => {
    if (dashboard?.todayFocus && Array.isArray(dashboard.todayFocus) && dashboard.todayFocus.length > 0) {
      return dashboard.todayFocus;
    }
    return [
      { id: 'f1', text: 'Clock-in Attendance for today', done: false, link: '/app/intern/attendance' },
      { id: 'f2', text: 'Complete Task: Implement Login API & JWT Guard', done: false, link: '/app/intern/tasks' },
      { id: 'f3', text: 'Attend Mentor Doubt Clearing Session at 4:00 PM', done: false, link: '/app/intern/mentor' },
      { id: 'f4', text: 'Submit Daily Work Log before checkout', done: false, link: '/app/intern/work-log' }
    ];
  }, [dashboard]);

  const [todayFocus, setTodayFocus] = useState(initialFocus);

  useEffect(() => {
    if (dashboard?.todayFocus && Array.isArray(dashboard.todayFocus)) {
      setTodayFocus(dashboard.todayFocus);
    }
  }, [dashboard]);

  const toggleFocus = (id) => {
    setTodayFocus((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedFocusCount = todayFocus.filter((f) => f.done).length;

  // Curriculum data
  const curriculum = dashboard?.curriculum || {
    track: profile.domain || 'Full Stack Web Development (MERN)',
    progress: 72,
    currentModule: 'React.js → State Management & Routing',
    currentDescription: 'Mastering Redux Toolkit slices, selectors, and async thunks.',
    nextModule: 'Node.js → Express → MySQL'
  };

  // 6 Metric KPI cards matching the screenshot
  const kpis = [
    {
      title: 'Internship Duration',
      value: `Day ${profile.day_number || 18} / ${profile.total_days || 45}`,
      subtext: `${profile.duration_progress || 40}% of duration elapsed`,
      progress: profile.duration_progress || 40,
      iconClass: 'bi-calendar-event',
      iconBoxStyle: { background: '#ecfdf5', color: '#10b981' },
      barColor: '#10b981'
    },
    {
      title: 'Daily Tasks',
      value: `${dashboard?.stats?.tasks_completed ?? 12} / ${dashboard?.stats?.total_tasks ?? 15}`,
      subtext: '80% Completed',
      progress: 80,
      iconClass: 'bi-check2-square',
      iconBoxStyle: { background: '#eff6ff', color: '#3b82f6' },
      barColor: '#3b82f6'
    },
    {
      title: 'Attendance',
      value: `${dashboard?.stats?.attendance_rate ?? 94}%`,
      subtext: `${profile.present_days || 38} of ${profile.working_days || 40} days present`,
      progress: dashboard?.stats?.attendance_rate ?? 94,
      iconClass: 'bi-person',
      iconBoxStyle: { background: '#f0fdf4', color: '#16a34a' },
      barColor: '#059669'
    },
    {
      title: 'Training Modules',
      value: '68%',
      subtext: 'Phase 2: In Progress',
      progress: 68,
      iconClass: 'bi-journal-code',
      iconBoxStyle: { background: '#faf5ff', color: '#9333ea' },
      barColor: '#9333ea'
    },
    {
      title: 'Active Projects',
      value: '2 Active',
      subtext: 'Ethiroli Web Portal v2',
      progress: 65,
      iconClass: 'bi-briefcase',
      iconBoxStyle: { background: '#fffbeb', color: '#f59e0b' },
      barColor: '#f59e0b'
    },
    {
      title: 'Overall Progress',
      value: `${dashboard?.stats?.overall_progress ?? 72}%`,
      subtext: 'On Track for Distinction',
      progress: dashboard?.stats?.overall_progress ?? 72,
      iconClass: 'bi-bullseye',
      iconBoxStyle: { background: '#f0fdfa', color: '#0d9488' },
      barColor: '#0d9488'
    }
  ];

  // Schedule items matching the screenshot
  const upcomingSchedule = dashboard?.upcomingSchedule || [
    {
      pillClass: 'today',
      day: 'TODAY',
      time: '4:00 PM',
      title: 'Mentor Doubt Clearing Session',
      desc: 'Live code review on Redux thunk slice errors with Arun Kumar.'
    },
    {
      pillClass: 'tom',
      day: 'TOM',
      time: '23:59',
      title: 'Assignment 3 Submission Deadline',
      desc: 'PostgreSQL Schema Design & Relational Constraints verification.'
    },
    {
      pillClass: 'fri',
      day: 'FRI',
      time: '15:00',
      title: 'Weekly Project Sprint Review',
      desc: 'Demoing responsive admin dashboard navigation to project lead.'
    }
  ];

  // Recent activity stream matching the screenshot
  const recentActivities = dashboard?.recentActivity || [
    {
      icon: 'bi-check-circle-fill text-success',
      title: 'Completed task "Create Navbar & Search Component"',
      meta: '2 hours ago • Daily Tasks'
    },
    {
      icon: 'bi-star-fill text-warning',
      title: 'Mentor Arun Kumar reviewed and approved your Daily Work Log',
      meta: 'Yesterday at 6:30 PM • Rated ⭐⭐⭐⭐ (4/5)'
    },
    {
      icon: 'bi-file-earmark-check-fill text-success',
      title: 'Assignment 2 "REST API Integration & RBAC Guards" was graded: 92/100',
      meta: '2 days ago • Assignments'
    }
  ];

  // Intern Portal Modules 4-column categories
  const portalModules = [
    {
      category: 'Learning & Curriculum',
      items: [
        {
          title: 'Training Plan',
          desc: '45-Day curriculum roadmap',
          path: '/app/intern/training-plan',
          icon: 'bi-journal-code',
          iconStyle: { background: '#ecfdf5', color: '#10b981' }
        },
        {
          title: 'LMS Courses',
          desc: 'Video lectures & lesson tests',
          path: '/app/intern/courses',
          icon: 'bi-collection-play',
          iconStyle: { background: '#eff6ff', color: '#3b82f6' }
        },
        {
          title: 'Assignments',
          desc: 'Code submissions & grades',
          path: '/app/intern/assignments',
          icon: 'bi-file-earmark-code',
          iconStyle: { background: '#faf5ff', color: '#9333ea' }
        },
        {
          title: 'Achievements',
          desc: 'Badges & performance rank',
          path: '/app/intern/achievements',
          icon: 'bi-trophy',
          iconStyle: { background: '#fffbeb', color: '#f59e0b' }
        }
      ]
    },
    {
      category: 'Daily Execution',
      items: [
        {
          title: 'Daily Tasks',
          desc: 'Jira-style task manager',
          path: '/app/intern/tasks',
          icon: 'bi-check2-square',
          iconStyle: { background: '#ecfdf5', color: '#10b981' }
        },
        {
          title: 'Attendance',
          desc: 'Clock-in & monthly grid',
          path: '/app/intern/attendance',
          icon: 'bi-calendar-check',
          iconStyle: { background: '#eff6ff', color: '#3b82f6' }
        },
        {
          title: 'Daily Work Log',
          desc: 'Daily activity & learning report',
          path: '/app/intern/work-log',
          icon: 'bi-pencil-square',
          iconStyle: { background: '#faf5ff', color: '#9333ea' }
        },
        {
          title: 'Projects',
          desc: 'Team deliverables & links',
          path: '/app/intern/projects',
          icon: 'bi-briefcase',
          iconStyle: { background: '#fffbeb', color: '#f59e0b' }
        }
      ]
    },
    {
      category: 'Mentorship & Growth',
      items: [
        {
          title: 'Mentor & Doubts',
          desc: 'Ask doubts & 1-on-1 sessions',
          path: '/app/intern/mentor',
          icon: 'bi-people',
          iconStyle: { background: '#eff6ff', color: '#3b82f6' }
        },
        {
          title: 'Messages',
          desc: 'Direct chat with mentor & HR',
          path: '/app/intern/messages',
          icon: 'bi-chat-dots',
          iconStyle: { background: '#faf5ff', color: '#9333ea' }
        },
        {
          title: 'Feedback',
          desc: 'Weekly evaluations & scores',
          path: '/app/intern/feedback',
          icon: 'bi-chat-heart',
          iconStyle: { background: '#fdf2f8', color: '#ec4899' }
        },
        {
          title: 'Support',
          desc: 'Help Desk\nSubmit help tickets',
          path: '/app/intern/help',
          icon: 'bi-question-circle',
          iconStyle: { background: '#ecfdf5', color: '#10b981' }
        }
      ]
    },
    {
      category: 'Portal Records',
      items: [
        {
          title: 'Calendar',
          desc: 'Events, sprints & deadlines',
          path: '/app/intern/calendar',
          icon: 'bi-calendar3',
          iconStyle: { background: '#faf5ff', color: '#9333ea' }
        },
        {
          title: 'Documents',
          desc: 'Offer letters, policies & vault',
          path: '/app/intern/documents',
          icon: 'bi-file-earmark-text',
          iconStyle: { background: '#fef2f2', color: '#ef4444' }
        },
        {
          title: 'Certificates',
          desc: 'Eligibility & verified credential',
          path: '/app/intern/certificates',
          icon: 'bi-award',
          iconStyle: { background: '#fffbeb', color: '#f59e0b' }
        },
        {
          title: 'My Profile',
          desc: 'Academic, skills & security',
          path: '/app/intern/profile',
          icon: 'bi-person',
          iconStyle: { background: '#f0fdfa', color: '#0d9488' }
        }
      ]
    }
  ];

  return (
    <AdminPage
      loading={loading}
      error={error}
      onRetry={() => dispatch(fetchInternDashboardData())}
    >
      <div className="intern-dashboard-root">
        {/* 1. TOP COMMAND CENTER BANNER */}
        <section className="ims-banner-card" aria-label="Intern Command Center Overview">
          <div className="ims-banner-left">
            <span className="ims-banner-pill-intern">INTERN</span>
            <h1 className="ims-banner-title">Intern Command Center</h1>
            <p className="ims-banner-subtitle">
              Your unified dashboard for daily tasks, curriculum learning, mentorship, and deliverables
            </p>
            <div className="ims-banner-chips">
              <span className="ims-banner-chip-track">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="currentColor"/>
                </svg>
                {curriculum.track || 'Full Stack Web Development (MERN)'}
              </span>
              <span className="ims-banner-chip-schedule">
                <i className="bi bi-calendar3" aria-hidden="true"></i>
                {profile.total_days > 0 ? `Day ${profile.day_number || 18} of ${profile.total_days}` : 'Schedule not set'}
              </span>
            </div>
          </div>

          <div className="ims-banner-right">
            <div className="ims-banner-brand-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#10b981"/>
              </svg>
              <span>ETHIROLI</span>
            </div>
            <h2 className="ims-banner-greeting">Good Morning, {greetingName} 👋</h2>
            <p className="ims-banner-msg1">You're making great strides on the Ethiroli Web Portal.</p>
            <p className="ims-banner-msg2">Here's your mission plan for today.</p>
          </div>

          {/* Botanical foliage illustration on the right edge */}
          <div className="ims-banner-botanical-art" aria-hidden="true">
            <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="botanicalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="60%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
                <linearGradient id="botanicalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="70%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="botanicalGrad3" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="80%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#a7f3d0" />
                </linearGradient>
              </defs>
              <path d="M120 160C120 100 80 60 70 30C95 40 140 85 145 160Z" fill="url(#botanicalGrad1)" opacity="0.85" />
              <path d="M150 160C140 90 105 30 85 0C120 10 165 60 160 160Z" fill="url(#botanicalGrad2)" opacity="0.9" />
              <path d="M100 160C90 110 50 60 25 45C60 40 120 90 130 160Z" fill="url(#botanicalGrad3)" opacity="0.95" />
              <path d="M80 160C70 125 35 90 0 80C35 70 90 105 105 160Z" fill="url(#botanicalGrad2)" opacity="0.9" />
            </svg>
          </div>
        </section>

        {/* 2. 6 KPI METRIC CARDS ROW */}
        <section className="ims-kpis-grid" aria-label="Key Performance Indicators">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="ims-kpi-card">
              <div className="ims-kpi-top">
                <div className="ims-kpi-icon-box" style={kpi.iconBoxStyle}>
                  <i className={`bi ${kpi.iconClass}`} aria-hidden="true"></i>
                </div>
                <span className="ims-kpi-title">{kpi.title}</span>
              </div>
              <div className="ims-kpi-value">{kpi.value}</div>
              <div className="ims-kpi-subtext">{kpi.subtext}</div>
              <div className="ims-kpi-progress-wrap">
                <div className="ims-kpi-progress-track">
                  <div
                    className="ims-kpi-progress-bar"
                    style={{ width: `${kpi.progress}%`, backgroundColor: kpi.barColor }}
                    aria-valuenow={kpi.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                  />
                </div>
                <span className="ims-kpi-progress-pct">{kpi.progress}%</span>
              </div>
            </div>
          ))}
        </section>

        {/* 3. MIDDLE SECTION: 3 COLUMNS */}
        <div className="ims-middle-grid">
          {/* COLUMN 1: TODAY'S FOCUS */}
          <section className="ims-card ims-focus-card" aria-label="Today's Focus">
            <div className="ims-focus-header">
              <div className="ims-focus-header-left">
                <div className="ims-focus-icon-circle">
                  <i className="bi bi-bullseye" aria-hidden="true"></i>
                </div>
                <div>
                  <h2 className="ims-focus-title">Today's Focus</h2>
                  <p className="ims-focus-subtitle">High priority execution items scheduled for today</p>
                </div>
              </div>
              <span className="ims-focus-badge-count">
                {completedFocusCount} / {todayFocus.length} tasks completed today
              </span>
            </div>

            <div className="ims-focus-list">
              {todayFocus.map((item, index) => (
                <div
                  key={item.id}
                  className="ims-focus-row"
                  onClick={() => toggleFocus(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFocus(item.id);
                    }
                  }}
                  aria-pressed={item.done}
                >
                  <div className={`ims-focus-num ${item.done ? 'done' : ''}`}>
                    {item.done ? <i className="bi bi-check-lg" aria-hidden="true"></i> : index + 1}
                  </div>
                  <div className="ims-focus-row-content">
                    <div className="ims-focus-row-title">{item.text}</div>
                    <div className="ims-focus-row-meta">
                      {item.done ? (
                        <span className="ims-focus-done-badge">Completed</span>
                      ) : (
                        <span className="ims-focus-pending-badge">Pending</span>
                      )}
                      <span className="ims-focus-hint">· tap the step to complete</span>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right ims-focus-chevron" aria-hidden="true"></i>
                </div>
              ))}
            </div>
          </section>

          {/* COLUMN 2: CURRICULUM PROGRESS */}
          <section className="ims-card ims-curriculum-card" aria-label="Curriculum Progress">
            <div className="ims-curriculum-header">
              <i className="bi bi-book" aria-hidden="true"></i>
              <h2>Curriculum Progress</h2>
            </div>

            <div className="ims-curriculum-gauge-row">
              <div className="ims-donut-gauge" aria-hidden="true">
                <svg viewBox="0 0 68 68" className="ims-donut-svg">
                  <circle className="ims-donut-track" cx="34" cy="34" r="26" />
                  <circle
                    className="ims-donut-fill"
                    cx="34"
                    cy="34"
                    r="26"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - (curriculum.progress || 72) / 100)}`}
                  />
                </svg>
                <div className="ims-donut-text">{curriculum.progress || 72}%</div>
              </div>

              <div className="ims-curriculum-gauge-info">
                <h3 className="ims-curriculum-track-name">{curriculum.track}</h3>
                <span className="ims-curriculum-pct-label">{curriculum.progress || 72}% complete</span>
                <span className="ims-curriculum-days-label">
                  Day {profile.day_number || 18} of {profile.total_days || 45}
                </span>
              </div>
            </div>

            <div className="ims-curriculum-sublabel">Current module</div>
            <div className="ims-curriculum-module-box">
              <div className="ims-curriculum-mod-icon react-icon">
                <i className="bi bi-atom" aria-hidden="true"></i>
              </div>
              <div className="ims-curriculum-mod-info">
                <div className="ims-curriculum-mod-title">{curriculum.currentModule}</div>
                <div className="ims-curriculum-mod-desc">{curriculum.currentDescription}</div>
              </div>
            </div>

            <div className="ims-curriculum-sublabel">Next</div>
            <Link to="/app/intern/training-plan" className="ims-curriculum-module-box text-decoration-none">
              <div className="ims-curriculum-mod-icon node-icon">
                <i className="bi bi-code-slash" aria-hidden="true"></i>
              </div>
              <div className="ims-curriculum-mod-info">
                <div className="ims-curriculum-mod-title">{curriculum.nextModule}</div>
              </div>
              <i className="bi bi-chevron-right text-muted" aria-hidden="true"></i>
            </Link>

            <div className="ims-curriculum-mentor-box">
              <div className="ims-mentor-avatar-icon">
                <i className="bi bi-person" aria-hidden="true"></i>
              </div>
              <div className="ims-mentor-box-info">
                <div className="ims-mentor-box-title">Assigned Mentor</div>
                <div className="ims-mentor-box-status">
                  {profile.mentor_name ? profile.mentor_name : 'Not assigned yet'}
                </div>
                <div className="ims-mentor-box-helper">
                  {profile.mentor_name
                    ? 'Your dedicated mentor for doubt clearing and reviews.'
                    : 'No mentor assigned yet.\nYour mentor will be assigned shortly.'}
                </div>
              </div>
            </div>
          </section>

          {/* COLUMN 3: STACKED SCHEDULE & ACTIVITY FEED */}
          <div className="ims-stacked-right">
            {/* Upper: Upcoming Deadlines & Schedule */}
            <section className="ims-card ims-schedule-card" aria-label="Upcoming Deadlines and Schedule">
              <div className="ims-section-top-bar">
                <div className="ims-section-top-left">
                  <i className="bi bi-calendar3" aria-hidden="true"></i>
                  <h2>Upcoming Deadlines & Schedule</h2>
                </div>
                <Link to="/app/intern/calendar" className="ims-section-link">
                  Full Calendar
                </Link>
              </div>

              <div className="ims-schedule-list">
                {upcomingSchedule.map((item, idx) => (
                  <div key={idx} className="ims-schedule-item">
                    <div className={`ims-schedule-pill ${item.pillClass}`}>
                      <span className="ims-pill-day">{item.day}</span>
                      <span className="ims-pill-time">{item.time}</span>
                    </div>
                    <div className="ims-schedule-item-info">
                      <div className="ims-schedule-item-title">{item.title}</div>
                      <div className="ims-schedule-item-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Lower: Recent Activity Stream */}
            <section className="ims-card ims-activity-card" aria-label="Recent Activity Stream">
              <div className="ims-section-top-bar">
                <div className="ims-section-top-left">
                  <i className="bi bi-clock-history" aria-hidden="true"></i>
                  <h2>Recent Activity Stream</h2>
                </div>
                <Link to="/app/intern/tasks" className="ims-section-link">
                  View All
                </Link>
              </div>

              <div className="ims-activity-list">
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="ims-activity-item">
                    <div className="ims-activity-dot-icon">
                      <i className={`bi ${act.icon}`} aria-hidden="true"></i>
                    </div>
                    <div className="ims-activity-item-info">
                      <div className="ims-activity-item-title">{act.title}</div>
                      <div className="ims-activity-item-meta">{act.meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ims-activity-empty-footer">
                <i className="bi bi-file-earmark-medical" aria-hidden="true"></i>
                <div className="ims-activity-empty-title">No recent activity.</div>
                <div className="ims-activity-empty-desc">
                  Your activity will appear here once you start completing tasks and interacting with the portal
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 4. BOTTOM SECTION: INTERN PORTAL MODULES */}
        <section className="ims-card ims-modules-card" aria-label="Intern Portal Modules">
          <div className="ims-modules-header">
            <i className="bi bi-grid-fill" aria-hidden="true"></i>
            <h2>Intern Portal Modules</h2>
          </div>

          <div className="ims-modules-grid">
            {portalModules.map((col, idx) => (
              <div key={idx} className="ims-modules-col">
                <div className="ims-modules-col-header">{col.category}</div>
                <div className="ims-modules-list">
                  {col.items.map((item, itemIdx) => (
                    <Link key={itemIdx} to={item.path} className="ims-module-tile">
                      <div className="ims-module-tile-icon" style={item.iconStyle}>
                        <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                      </div>
                      <div className="ims-module-tile-content">
                        <span className="ims-module-tile-title">{item.title}</span>
                        <span className="ims-module-tile-desc" style={{ whiteSpace: 'pre-line' }}>{item.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminPage>
  );
}