import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import lmsApi from '../../../services/api/lmsApi.js';

const QUICK_ACTIONS = [
  { label: 'My Courses',     to: '/app/student/courses',       icon: 'bi-book'              },
  { label: 'Course Player',  to: '/app/student/course-player', icon: 'bi-play-circle'       },
  { label: 'Quizzes',        to: '/app/student/quiz',          icon: 'bi-patch-question'    },
  { label: 'Live Arena',     to: '/app/student/live-quiz',     icon: 'bi-lightning-charge'  },
  { label: 'Doubts & Q&A',   to: '/app/student/doubts',        icon: 'bi-chat-square-dots'  },
  { label: 'Assignments',    to: '/app/student/assignments',   icon: 'bi-clipboard-check'   },
  { label: 'Attendance',     to: '/app/student/attendance',    icon: 'bi-calendar-check'    },
  { label: 'Forum',          to: '/app/student/forum',         icon: 'bi-people'            },
  { label: 'Mind Map',       to: '/app/student/mindmap',       icon: 'bi-diagram-3'         },
  { label: 'Certificates',   to: '/app/student/certificates',  icon: 'bi-award'             },
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
      setError(err.message || 'Failed to load LMS dashboard overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  const courses            = data?.courses || [];
  const batches            = data?.batches || [];
  const upcomingQuizzes    = data?.upcomingQuizzes || [];
  const upcomingAssignments = data?.upcomingAssignments || [];
  const attendance         = data?.attendance || { percentage: 100, presentDays: 0, totalDays: 0 };
  const unresolvedDoubts   = data?.unresolvedDoubts || [];

  return (
    <AdminPage
      title="Student Learning Portal"
      subtitle="Welcome back to your personalized learning dashboard, live classes, and assessments."
      loading={loading}
      error={error}
      onRetry={fetchOverview}
    >
      {/* KPI Stat Cards */}
      <div className="lmsStatGrid">
        <div className="lmsStatCard primary">
          <div className="lmsStatIcon"><i className="bi bi-book-half"></i></div>
          <div className="lmsStatLabel">Enrolled Courses</div>
          <div className="lmsStatValue">{courses.length}</div>
          <div className="lmsStatMeta">{batches.length} active cohort{batches.length !== 1 ? 's' : ''}</div>
          <Link to="/app/student/courses" className="lmsStatLink">
            Explore courses <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="lmsStatCard success">
          <div className="lmsStatIcon"><i className="bi bi-calendar-check"></i></div>
          <div className="lmsStatLabel">Attendance Rate</div>
          <div className="lmsStatValue">{attendance.percentage}%</div>
          <div className="lmsStatMeta">{attendance.presentDays} of {attendance.totalDays} sessions</div>
          <Link to="/app/student/attendance" className="lmsStatLink">
            <span className={`statusTag ${attendance.percentage >= 75 ? 'success' : 'danger'}`} style={{ padding: '2px 8px', fontSize: 11 }}>
              {attendance.percentage >= 75 ? 'Good Standing' : 'Needs Attention'}
            </span>
          </Link>
        </div>

        <div className="lmsStatCard warning">
          <div className="lmsStatIcon"><i className="bi bi-journal-check"></i></div>
          <div className="lmsStatLabel">Assessments Due</div>
          <div className="lmsStatValue">{upcomingQuizzes.length + upcomingAssignments.length}</div>
          <div className="lmsStatMeta">{upcomingAssignments.length} assignments · {upcomingQuizzes.length} quizzes</div>
          <Link to="/app/student/quiz" className="lmsStatLink">
            Start assessments <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        <div className="lmsStatCard info">
          <div className="lmsStatIcon"><i className="bi bi-question-circle"></i></div>
          <div className="lmsStatLabel">Live Doubts</div>
          <div className="lmsStatValue">{unresolvedDoubts.length}</div>
          <div className="lmsStatMeta">Awaiting instructor reply</div>
          <Link to="/app/student/doubts" className="lmsStatLink">
            Ask a doubt <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* Active Learning Tracks */}
      <div className="lmsCard">
        <div className="lmsCardHead">
          <h3><i className="bi bi-play-circle" style={{ marginRight: 8, opacity: 0.7 }}></i>Active Learning Tracks</h3>
          <Link to="/app/student/courses">View All ({courses.length})</Link>
        </div>
        <div className="lmsCardBody">
          {courses.length === 0 ? (
            <div className="lmsEmpty" style={{ border: 'none', padding: '32px 0 8px' }}>
              <i className="bi bi-book lmsEmptyIcon"></i>
              <h4>No courses enrolled yet</h4>
              <p>Browse the course catalog or wait for your tutor to assign coursework.</p>
            </div>
          ) : (
            <div className="courseCardGrid">
              {courses.slice(0, 3).map((c) => {
                const progress = Number(c.progress_percentage ?? 0);
                const courseId = c.course_id || c.id;
                return (
                  <div key={courseId} className="courseCard">
                    <div className="courseCardBanner"></div>
                    <div className="courseCardHeader">
                      <div className="courseCardMeta">
                        <h4 className="courseCardTitle">{c.name || 'Course'}</h4>
                        {c.code && <span className="courseCode">{c.code}</span>}
                      </div>
                      {c.duration_days && (
                        <div className="lmsStatMeta">{c.duration_days} day program</div>
                      )}
                    </div>
                    <div className="courseCardBody">
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                        {c.description || 'Master software engineering concepts and technical best practices.'}
                      </p>
                      <div>
                        <div className="progressRow">
                          <span>Progress</span>
                          <span className="pct">{progress}%</span>
                        </div>
                        <div className="progressTrack">
                          <div className="progressFill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="courseCardFooter">
                      <Link to={`/app/student/course-player?courseId=${courseId}`} className="btnResume">
                        <i className="bi bi-play-circle"></i>
                        {progress > 0 ? 'Continue Learning' : 'Start Course'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="lmsCard">
        <div className="lmsCardHead">
          <h3><i className="bi bi-grid-3x3-gap" style={{ marginRight: 8, opacity: 0.7 }}></i>Academic & Engagement</h3>
        </div>
        <div className="lmsCardBody">
          <div className="quickNavGrid">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.to} to={action.to} className="quickNavBtn">
                <i className={`bi ${action.icon}`}></i>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Quizzes & Assignments */}
      <div className="lmsTwoCol">
        <div className="lmsCard" style={{ marginBottom: 0 }}>
          <div className="lmsCardHead">
            <h3><i className="bi bi-patch-question" style={{ marginRight: 8, opacity: 0.7 }}></i>Upcoming Quizzes</h3>
            <Link to="/app/student/quiz">View All</Link>
          </div>
          {upcomingQuizzes.length === 0 ? (
            <div className="lmsCardBody" style={{ padding: '24px 22px' }}>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center' }}>
                No quizzes scheduled right now — check back later.
              </p>
            </div>
          ) : (
            <div className="lmsList">
              {upcomingQuizzes.slice(0, 4).map((q) => (
                <div key={q.id} className="lmsListItem">
                  <div>
                    <div className="lmsListItemTitle">{q.title}</div>
                    <div className="lmsListItemMeta">{q.course_name} · {q.time_limit_minutes} min</div>
                  </div>
                  <Link to="/app/student/quiz" className="btn small primary">Take Quiz</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lmsCard" style={{ marginBottom: 0 }}>
          <div className="lmsCardHead">
            <h3><i className="bi bi-clipboard-check" style={{ marginRight: 8, opacity: 0.7 }}></i>Assignment Deadlines</h3>
            <Link to="/app/student/assignments">View All</Link>
          </div>
          {upcomingAssignments.length === 0 ? (
            <div className="lmsCardBody" style={{ padding: '24px 22px' }}>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center' }}>
                No pending assignments — great work staying on top!
              </p>
            </div>
          ) : (
            <div className="lmsList">
              {upcomingAssignments.slice(0, 4).map((a) => (
                <div key={a.id} className="lmsListItem">
                  <div>
                    <div className="lmsListItemTitle">{a.title}</div>
                    <div className="lmsListItemMeta">
                      Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'Flexible'}
                    </div>
                  </div>
                  <span className={`statusTag ${a.submission_status ? 'success' : 'pending'}`}>
                    {a.submission_status ? 'Submitted' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
