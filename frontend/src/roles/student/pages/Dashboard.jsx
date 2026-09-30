import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import lmsApi from '../../../services/api/lmsApi.js';

const QUICK_ACTIONS = [
  { label: 'My Courses',     to: '/app/student/courses',       icon: 'bi-book-half',        color: 'primary' },
  { label: 'Learning Path',  to: '/app/student/learning-path', icon: 'bi-compass',          color: 'indigo'  },
  { label: 'Course Player',  to: '/app/student/course-player', icon: 'bi-play-circle-fill', color: 'success' },
  { label: 'Live Classes',   to: '/app/student/live-classes',  icon: 'bi-camera-video-fill',color: 'danger'  },
  { label: 'Live Arena',     to: '/app/student/live-quiz',     icon: 'bi-lightning-charge', color: 'warning' },
  { label: 'Quizzes',        to: '/app/student/quiz',          icon: 'bi-patch-question',   color: 'primary' },
  { label: 'Assignments',    to: '/app/student/assignments',   icon: 'bi-clipboard-check',  color: 'success' },
  { label: 'Projects',       to: '/app/student/projects',      icon: 'bi-code-square',      color: 'purple'  },
  { label: 'Attendance',     to: '/app/student/attendance',    icon: 'bi-calendar-check',   color: 'teal'    },
  { label: 'Doubts & Q&A',   to: '/app/student/doubts',        icon: 'bi-chat-square-dots', color: 'info'    },
  { label: 'Resources',      to: '/app/student/resources',     icon: 'bi-folder-symlink',   color: 'secondary'},
  { label: 'Achievements',   to: '/app/student/achievements',  icon: 'bi-trophy-fill',      color: 'warning' },
  { label: 'Certificates',   to: '/app/student/certificates',  icon: 'bi-award-fill',       color: 'success' },
  { label: 'Career Hub',     to: '/app/student/career',        icon: 'bi-briefcase-fill',   color: 'primary' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await lmsApi.getLMSOverview();
      setData(res?.data || res);
    } catch (err) {
      console.warn('Using enriched fallback LMS overview data:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const courses = data?.courses || [];
  const attendance = data?.attendance || { percentage: 94, presentDays: 22, totalDays: 24 };
  const upcomingQuizzes = data?.upcomingQuizzes || [];
  const upcomingAssignments = data?.upcomingAssignments || [];

  return (
    <AdminPage
      title="Student Learning Portal"
      subtitle="Welcome back, Jeeva! Continue your full stack learning journey, complete today's day lesson, and track your certifications."
      loading={loading}
      error={error}
      onRetry={fetchOverview}
    >
      {/* 6 Key Performance Metric Cards */}
      <div className="lmsStatGrid mb-4">
        <div className="lmsStatCard primary">
          <div className="lmsStatIcon"><i className="bi bi-book-half" /></div>
          <div className="lmsStatLabel">Current Course</div>
          <div className="lmsStatValue" style={{ fontSize: 18, fontWeight: 700 }}>Full Stack + AI</div>
          <div className="lmsStatMeta">Phase 2 · Day 18 of 32</div>
          <Link to="/app/student/learning-path" className="lmsStatLink">
            View Roadmap <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="lmsStatCard info">
          <div className="lmsStatIcon"><i className="bi bi-pie-chart-fill" /></div>
          <div className="lmsStatLabel">Overall Progress</div>
          <div className="lmsStatValue">68%</div>
          <div className="lmsStatMeta">On Track for Completion</div>
          <div className="progressTrack mt-2" style={{ height: 6 }}>
            <div className="progressFill" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="lmsStatCard success">
          <div className="lmsStatIcon"><i className="bi bi-calendar-check-fill" /></div>
          <div className="lmsStatLabel">Attendance Rate</div>
          <div className="lmsStatValue">{attendance.percentage || 94}%</div>
          <div className="lmsStatMeta">{attendance.presentDays || 22} of {attendance.totalDays || 24} Sessions</div>
          <Link to="/app/student/attendance" className="lmsStatLink">
            Attendance Log <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="lmsStatCard warning">
          <div className="lmsStatIcon"><i className="bi bi-star-fill" /></div>
          <div className="lmsStatLabel">Quiz Average</div>
          <div className="lmsStatValue">82%</div>
          <div className="lmsStatMeta">Top 15% of Batch Cohort</div>
          <Link to="/app/student/quiz" className="lmsStatLink">
            Review Quizzes <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="lmsStatCard primary">
          <div className="lmsStatIcon"><i className="bi bi-clipboard-check-fill" /></div>
          <div className="lmsStatLabel">Assignments</div>
          <div className="lmsStatValue">7 / 10</div>
          <div className="lmsStatMeta">3 Pending Submissions</div>
          <Link to="/app/student/assignments" className="lmsStatLink">
            Submit Now <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="lmsStatCard secondary">
          <div className="lmsStatIcon"><i className="bi bi-kanban-fill" /></div>
          <div className="lmsStatLabel">Capstone Projects</div>
          <div className="lmsStatValue">1 / 2</div>
          <div className="lmsStatMeta">Milestone 2 In Progress</div>
          <Link to="/app/student/projects" className="lmsStatLink">
            Open Project <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </div>

      {/* Today's Learning Action Hero Box */}
      <div className="card shadow-sm border-0 mb-4 bg-gradient bg-light border-start border-primary border-4">
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-8">
              <span className="badge bg-primary text-white fw-bold px-3 py-1 rounded-pill mb-2">
                <i className="bi bi-sun-fill me-1 text-warning" /> TODAY'S LEARNING OBJECTIVE
              </span>
              <h3 className="h4 fw-bold text-dark mb-1">Day 18 — React Hooks & Async State Lifecycle</h3>
              <p className="text-muted small mb-3">
                Master <code>useState</code>, <code>useEffect</code> dependency hygiene, custom hooks, and in-browser sandboxed practice exercises.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="d-flex align-items-center gap-1 text-success small fw-semibold">
                  <i className="bi bi-check-circle-fill" /> 1. Watch Lesson (Completed)
                </div>
                <div className="d-flex align-items-center gap-1 text-success small fw-semibold">
                  <i className="bi bi-check-circle-fill" /> 2. Complete Practice (Completed)
                </div>
                <div className="d-flex align-items-center gap-1 text-warning small fw-semibold">
                  <i className="bi bi-circle" /> 3. Take Quiz (Pending)
                </div>
                <div className="d-flex align-items-center gap-1 text-secondary small fw-semibold">
                  <i className="bi bi-circle" /> 4. Submit Assignment (Pending)
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link
                to="/app/student/course-player?courseId=CRS-001&day=18"
                className="btn btn-primary btn-lg px-4 shadow d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-play-circle-fill" /> Continue Learning
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Classroom Alert Banner */}
      <div className="card border-danger border-2 shadow-sm mb-4 bg-danger bg-opacity-10">
        <div className="card-body p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-3">
            <span className="spinner-grow spinner-grow-sm text-danger" role="status" aria-hidden="true" />
            <div>
              <strong className="text-dark">Upcoming Live Class Today at 10:00 AM IST</strong>
              <div className="small text-muted">React Custom Hooks & Async Lifecycle with Jeeva Karthik (Lead Architect)</div>
            </div>
          </div>
          <Link to="/app/student/live-classes" className="btn btn-sm btn-danger px-3">
            <i className="bi bi-camera-video me-1" /> View Live Room
          </Link>
        </div>
      </div>

      {/* Quick Nav Grid */}
      <div className="lmsCard mb-4">
        <div className="lmsCardHead">
          <h3><i className="bi bi-grid-3x3-gap-fill me-2 opacity-75" /> Academic & Learning Navigation</h3>
        </div>
        <div className="lmsCardBody p-3">
          <div className="row g-2">
            {QUICK_ACTIONS.map((action) => (
              <div key={action.to} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <Link
                  to={action.to}
                  className="card text-decoration-none h-100 border p-3 text-center transition-hover shadow-sm"
                  style={{ borderRadius: 10 }}
                >
                  <i className={`bi ${action.icon} fs-3 text-${action.color} mb-2`} />
                  <span className="fw-semibold text-dark small">{action.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Quizzes & Deadlines Split */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="lmsCard h-100 mb-0">
            <div className="lmsCardHead d-flex justify-content-between align-items-center">
              <h3><i className="bi bi-patch-question-fill me-2 text-primary opacity-75" /> Upcoming Quizzes & Tests</h3>
              <Link to="/app/student/quiz" className="small">View All</Link>
            </div>
            <div className="lmsCardBody p-3">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center p-2">
                  <div>
                    <div className="fw-semibold text-dark small">React Hooks & State Mastery Quiz</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>20 Questions · 30 Mins · Module 4</div>
                  </div>
                  <Link to="/app/student/quiz" className="btn btn-sm btn-primary">Take Quiz</Link>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center p-2">
                  <div>
                    <div className="fw-semibold text-dark small">Phase 2 Comprehensive Assessment</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>Scheduled for Oct 02 · 45 Mins</div>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary">Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="lmsCard h-100 mb-0">
            <div className="lmsCardHead d-flex justify-content-between align-items-center">
              <h3><i className="bi bi-clipboard-check-fill me-2 text-success opacity-75" /> Assignment Deadlines</h3>
              <Link to="/app/student/assignments" className="small">View All</Link>
            </div>
            <div className="lmsCardBody p-3">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center p-2">
                  <div>
                    <div className="fw-semibold text-dark small">Assignment: React Todo App with Hooks</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>Due: Oct 05, 2026 · Score: 85/100 (Evaluated)</div>
                  </div>
                  <span className="badge bg-success">Approved</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center p-2">
                  <div>
                    <div className="fw-semibold text-dark small">Assignment: Weather Dashboard with API</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>Due: Oct 08, 2026 · Awaiting Submission</div>
                  </div>
                  <Link to="/app/student/assignments" className="btn btn-sm btn-outline-primary">Submit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
