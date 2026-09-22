import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import lmsApi from '../../../services/api/lmsApi.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await lmsApi.getLMSOverview();
      const payload = res?.data || res;
      setData(payload);
    } catch (err) {
      setError(err.message || 'Failed to load LMS dashboard overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const courses = data?.courses || [];
  const batches = data?.batches || [];
  const upcomingQuizzes = data?.upcomingQuizzes || [];
  const upcomingAssignments = data?.upcomingAssignments || [];
  const attendance = data?.attendance || { percentage: 100, presentDays: 0, totalDays: 0 };
  const unresolvedDoubts = data?.unresolvedDoubts || [];

  return (
    <AdminPage
      title="Student Learning Portal"
      subtitle="Welcome back to your personalized learning dashboard, live classes, and assessments."
      loading={loading}
      error={error}
      onRetry={fetchOverview}
    >
      {/* Row 1: KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Enrolled Courses</span>
              <i className="bi bi-book text-primary fs-4"></i>
            </div>
            <div className="fw-bold fs-3 text-dark mb-1">{courses.length}</div>
            <div className="text-muted small mb-2">{batches.length} Active Cohorts</div>
            <div className="mt-auto pt-2 border-top">
              <Link to="/app/student/courses" className="text-primary text-decoration-none small fw-semibold">
                Explore courses &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Attendance Rate</span>
              <i className="bi bi-calendar-check text-success fs-4"></i>
            </div>
            <div className="fw-bold fs-3 text-dark mb-1">{attendance.percentage}%</div>
            <div className="text-muted small mb-2">{attendance.presentDays} of {attendance.totalDays} sessions attended</div>
            <div className="mt-auto pt-2 border-top">
              <span className={`badge ${attendance.percentage >= 75 ? 'bg-success' : 'bg-danger'}`}>
                {attendance.percentage >= 75 ? 'Good Standing' : 'Defaulter Alert'}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Assessments Due</span>
              <i className="bi bi-journal-check text-warning fs-4"></i>
            </div>
            <div className="fw-bold fs-3 text-dark mb-1">{upcomingQuizzes.length + upcomingAssignments.length}</div>
            <div className="text-muted small mb-2">{upcomingAssignments.length} assignments, {upcomingQuizzes.length} quizzes</div>
            <div className="mt-auto pt-2 border-top">
              <Link to="/app/student/quiz" className="text-warning text-decoration-none small fw-semibold">
                Start assessments &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small text-uppercase fw-semibold">Live Doubts</span>
              <i className="bi bi-question-circle text-info fs-4"></i>
            </div>
            <div className="fw-bold fs-3 text-dark mb-1">{unresolvedDoubts.length}</div>
            <div className="text-muted small mb-2">Awaiting instructor reply</div>
            <div className="mt-auto pt-2 border-top">
              <Link to="/app/student/doubts" className="text-info text-decoration-none small fw-semibold">
                Ask a doubt &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: In-Progress Courses & Quick Resume */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Active Learning Tracks</h6>
          <Link to="/app/student/courses" className="small text-primary text-decoration-none">
            View All ({courses.length})
          </Link>
        </div>
        <div className="card-body p-4">
          {courses.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p className="mb-2">You are not actively enrolled in any courses.</p>
              <Link to="/app/student/courses" className="btn btn-sm btn-primary">Browse Course Catalog</Link>
            </div>
          ) : (
            <div className="row g-3">
              {courses.slice(0, 3).map((c) => (
                <div key={c.id || c.course_id} className="col-md-4">
                  <div className="p-3 border rounded-3 h-100 d-flex flex-column bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary border">{c.code || 'COURSE'}</span>
                      <small className="text-muted">{c.duration_days ? `${c.duration_days} Days` : ''}</small>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">{c.name}</h6>
                    <p className="text-muted small mb-3 flex-grow-1 text-truncate">
                      {c.description || 'Master software engineering concepts and technical best practices.'}
                    </p>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Progress</span>
                        <span className="fw-semibold text-dark">{c.progress_percentage || 0}%</span>
                      </div>
                      <div className="progress mb-3" style={{ height: '6px' }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${c.progress_percentage || 0}%` }}
                        ></div>
                      </div>

                      <Link
                        to={`/app/student/course-player?courseId=${c.course_id || c.id}`}
                        className="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center gap-1"
                      >
                        <i className="bi bi-play-circle"></i>
                        <span>Continue Learning</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Navigation Quick Actions */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h6 className="mb-0 fw-bold">Academic & Engagement Navigation</h6>
        </div>
        <div className="card-body p-4">
          <div className="d-flex gap-2 flex-wrap">
            <Link to="/app/student/courses" className="btn btn-outline-primary d-flex align-items-center gap-2">
              <i className="bi bi-book"></i> My Courses
            </Link>
            <Link to="/app/student/course-player" className="btn btn-outline-info d-flex align-items-center gap-2">
              <i className="bi bi-play-circle"></i> Course Player
            </Link>
            <Link to="/app/student/quiz" className="btn btn-outline-warning d-flex align-items-center gap-2">
              <i className="bi bi-patch-question"></i> Quizzes
            </Link>
            <Link to="/app/student/live-quiz" className="btn btn-outline-danger d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge"></i> Live Arena
            </Link>
            <Link to="/app/student/doubts" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-chat-square-dots"></i> Doubts & Q&A
            </Link>
            <Link to="/app/student/forum" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-people"></i> Discussion Forum
            </Link>
            <Link to="/app/student/projects" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-kanban"></i> Projects
            </Link>
            <Link to="/app/student/certificates" className="btn btn-outline-success d-flex align-items-center gap-2">
              <i className="bi bi-award"></i> Certificates
            </Link>
            <Link to="/app/student/mindmap" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-diagram-3"></i> Architecture Mind Map
            </Link>
          </div>
        </div>
      </div>

      {/* Row 4: Upcoming Quizzes & Deadlines */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Upcoming Quizzes</h6>
              <Link to="/app/student/quiz" className="small text-primary text-decoration-none">View All</Link>
            </div>
            <div className="card-body p-3">
              {upcomingQuizzes.length === 0 ? (
                <div className="text-center py-4 text-muted small">No quizzes scheduled right now.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {upcomingQuizzes.map((q) => (
                    <div key={q.id} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold text-dark small">{q.title}</div>
                        <small className="text-muted">{q.course_name} &bull; {q.time_limit_minutes} mins</small>
                      </div>
                      <Link to={`/app/student/quiz`} className="btn btn-sm btn-outline-primary">
                        Take Quiz
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Assignment Deadlines</h6>
              <Link to="/app/student/courses" className="small text-primary text-decoration-none">View All</Link>
            </div>
            <div className="card-body p-3">
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-4 text-muted small">No pending assignments.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {upcomingAssignments.map((a) => (
                    <div key={a.id} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold text-dark small">{a.title}</div>
                        <small className="text-muted">Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'Flexible'}</small>
                      </div>
                      <span className={`badge ${a.submission_status ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {a.submission_status ? 'Submitted' : 'Pending'}
                      </span>
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