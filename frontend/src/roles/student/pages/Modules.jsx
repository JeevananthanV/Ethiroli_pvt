import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMyProgress } from '../../../services/api/progressApi.js';
import { getCourseCurriculum } from '../../../services/api/progressApi.js';
import { useSocket } from '../../../common/contexts/SocketContext.jsx';

const fmtMinutes = (minutes) => {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
};

const statusColor = (status) => {
  switch (status) {
    case 'COMPLETED': return { background: 'rgba(16,185,129,0.15)', color: '#059669' };
    case 'DROPPED': return { background: 'rgba(239,68,68,0.15)', color: '#dc2626' };
    default: return { background: 'rgba(129,158,53,0.15)', color: 'var(--admin-primary)' };
  }
};

function ProgressBar({ value }) {
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div style={{ height: 8, background: 'var(--admin-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: pct === 100
            ? 'linear-gradient(90deg, var(--admin-primary), #059669)'
            : 'var(--admin-primary)',
          borderRadius: 4,
          transition: 'width 0.35s ease'
        }}
      />
    </div>
  );
}

/**
 * Course Modules - the learner's view of the course -> module -> lesson tree
 * with per-module completion, resume pointers and certificate state.
 */
export default function StudentModules() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawSocket = useSocket();
  const socket = rawSocket?.socket || rawSocket;

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get('courseId') || '');
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  // 1. Enrolled courses (drives the picker and the default selection)
  const fetchCourses = useCallback(async () => {
    try {
      const list = await getMyProgress().catch(() => []);
      const safe = Array.isArray(list) ? list : [];
      setCourses(safe);
      setSelectedCourseId((current) => {
        if (current) return current;
        if (safe.length > 0) return safe[0].course_id;
        return '';
      });
    } catch (err) {
      setError(err.message || 'Failed to load your courses');
    }
  }, []);

  // 2. Full module/lesson tree for the active course
  const fetchCurriculum = useCallback(async (courseId) => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCourseCurriculum(courseId);
      setCurriculum(data);
      // Auto-expand the first incomplete module so learners land on real work.
      if (data?.modules?.length) {
        const firstOpen = data.modules.findIndex((mod) => !mod.is_complete);
        const index = firstOpen === -1 ? 0 : firstOpen;
        setExpanded({ [data.modules[index]?.id]: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to load course modules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCurriculum(selectedCourseId);
    if (selectedCourseId) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('courseId', selectedCourseId);
        return next;
      }, { replace: true });
    }
  }, [selectedCourseId, fetchCurriculum, setSearchParams]);

  // 3. Live refresh when a tutor edits the curriculum
  useEffect(() => {
    if (!socket || !selectedCourseId) return;
    socket.emit('join_room', `course:${selectedCourseId}`);
    const handleUpdate = () => fetchCurriculum(selectedCourseId);
    socket.on('course_curriculum_updated', handleUpdate);
    socket.on('lesson_progress_updated', handleUpdate);
    return () => {
      socket.emit('leave_room', `course:${selectedCourseId}`);
      socket.off('course_curriculum_updated', handleUpdate);
      socket.off('lesson_progress_updated', handleUpdate);
    };
  }, [socket, selectedCourseId, fetchCurriculum]);

  const toggleModule = (moduleId) => {
    setExpanded((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const openLesson = (lessonId) => {
    if (!selectedCourseId) return;
    navigate(`/app/student/course-player?courseId=${selectedCourseId}&lessonId=${lessonId}`);
  };

  const continueLearning = () => {
    if (!selectedCourseId) return;
    const next = curriculum?.next_lesson;
    const suffix = next ? `&lessonId=${next.id}` : '';
    navigate(`/app/student/course-player?courseId=${selectedCourseId}${suffix}`);
  };

  const summary = useMemo(() => {
    if (!curriculum) return null;
    const { progress, course, enrollment, certificate } = curriculum;
    return { progress, course, enrollment, certificate };
  }, [curriculum]);

  const showEmpty = !loading && !error && courses.length === 0;

  return (
    <AdminPage
      title="Course Modules"
      subtitle="Browse the syllabus, track module progress and resume where you left off"
      loading={loading}
      error={error}
      onRetry={() => fetchCurriculum(selectedCourseId)}
      actions={
        courses.length > 1 ? (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="select"
            style={{ minWidth: 240 }}
            aria-label="Select course"
          >
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.name}{course.code ? ` (${course.code})` : ''}
              </option>
            ))}
          </select>
        ) : null
      }
    >
      {showEmpty ? (
        <div className="emptyState">
          <h3>No courses yet</h3>
          <p>You are not enrolled in any course. Ask your tutor to assign one, or browse the catalog.</p>
          <button className="btn primary" style={{ marginTop: 12 }} onClick={() => navigate('/app/student/courses')}>
            Go to My Courses
          </button>
        </div>
      ) : summary ? (
        <>
          {/* ---- Course header ---- */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="cardHeader">
              <div>
                <h3 className="cardTitle" style={{ marginBottom: 4 }}>
                  {summary.course?.name}
                  {summary.course?.code && (
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(129,158,53,0.14)',
                        color: 'var(--admin-primary)',
                        verticalAlign: 'middle'
                      }}
                    >
                      {summary.course.code}
                    </span>
                  )}
                </h3>
                {summary.course?.description && (
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-secondary)', maxWidth: 720 }}>
                    {summary.course.description}
                  </p>
                )}
              </div>
              {summary.enrollment?.status && (
                <span className="statusTag" style={{ ...statusColor(summary.enrollment.status), fontSize: 11, padding: '3px 10px', borderRadius: 12 }}>
                  {summary.enrollment.status}
                </span>
              )}
            </div>

            <div className="cardBody">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 6 }}>
                <span>
                  {summary.progress.completed_lessons} of {summary.progress.total_lessons} lessons ·{' '}
                  {summary.progress.completed_modules}/{summary.progress.total_modules} modules
                </span>
                <strong style={{ color: 'var(--admin-primary)' }}>{summary.progress.percentage}%</strong>
              </div>
              <ProgressBar value={summary.progress.percentage} />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                <button
                  className="btn primary"
                  onClick={continueLearning}
                  disabled={summary.progress.total_lessons === 0}
                >
                  {summary.progress.percentage === 0 ? 'Start Course' : summary.progress.is_complete ? 'Review Course' : 'Continue Learning'}
                </button>

                {summary.enrollment?.due_date && (
                  <span
                    style={{
                      alignSelf: 'center',
                      fontSize: 12,
                      color: '#d97706',
                      padding: '6px 12px',
                      borderRadius: 6,
                      background: 'rgba(217,119,6,0.12)'
                    }}
                  >
                    Due {new Date(summary.enrollment.due_date).toLocaleDateString()}
                  </span>
                )}

                {summary.certificate && (
                  <button
                    className="btn secondary"
                    onClick={() => navigate('/app/student/certificates')}
                  >
                    🎓 View Certificate
                  </button>
                )}
              </div>

              {summary.progress.is_complete && !summary.certificate && (
                <p style={{ marginTop: 14, fontSize: 12, color: 'var(--admin-text-muted)' }}>
                  Every lesson is complete. Your certificate is being issued…
                </p>
              )}
            </div>
          </div>

          {/* ---- Module tree ---- */}
          {curriculum.modules.length === 0 ? (
            <div className="emptyState">
              <h3>No modules published yet</h3>
              <p>This course does not have any modules. Your tutor has not published the syllabus.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {curriculum.modules.map((mod, index) => {
                const isOpen = Boolean(expanded[mod.id]);
                const duration = fmtMinutes(mod.duration_minutes);

                return (
                  <div key={mod.id} className="card" style={{ overflow: 'hidden' }}>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 18px',
                        background: isOpen ? 'rgba(129,158,53,0.06)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: 'inherit'
                      }}
                    >
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          flexShrink: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          background: mod.is_complete ? 'var(--admin-primary)' : 'rgba(129,158,53,0.15)',
                          color: mod.is_complete ? '#fff' : 'var(--admin-primary)'
                        }}
                      >
                        {mod.is_complete ? '✓' : index + 1}
                      </span>

                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: 600, fontSize: 15 }}>{mod.title}</span>
                        {mod.description && (
                          <span style={{ display: 'block', fontSize: 12, color: 'var(--admin-text-secondary)', marginTop: 2 }}>
                            {mod.description}
                          </span>
                        )}
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 4 }}>
                          {mod.completed_lessons}/{mod.total_lessons} lessons
                          {duration ? ` · ${duration}` : ''}
                        </span>
                      </span>

                      <span style={{ width: 140, flexShrink: 0 }}>
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--admin-text-secondary)', marginBottom: 4, textAlign: 'right' }}>
                          {mod.percentage}%
                        </span>
                        <ProgressBar value={mod.percentage} />
                      </span>

                      <span style={{ fontSize: 14, color: 'var(--admin-text-muted)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                        ▶
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--admin-border-subtle)', padding: '8px 12px 14px' }}>
                        {mod.lessons.length === 0 ? (
                          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontStyle: 'italic', padding: '8px 10px' }}>
                            No lessons published in this module yet.
                          </p>
                        ) : (
                          mod.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => openLesson(lesson.id)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 6,
                                border: '1px solid transparent',
                                background: 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: 'inherit',
                                transition: 'background 0.15s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span
                                style={{
                                  width: 22,
                                  height: 22,
                                  flexShrink: 0,
                                  borderRadius: '50%',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontSize: 11,
                                  background: lesson.is_completed ? 'var(--admin-primary)' : 'transparent',
                                  color: lesson.is_completed ? '#fff' : 'var(--admin-text-muted)',
                                  border: lesson.is_completed ? 'none' : '1px solid var(--admin-border)'
                                }}
                              >
                                {lesson.is_completed ? '✓' : lessonIndex + 1}
                              </span>

                              <span style={{ flex: 1, fontSize: 14, textDecoration: lesson.is_completed ? 'none' : 'none' }}>
                                {lesson.title}
                              </span>

                              {lesson.video_url && (
                                <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>📹 Video</span>
                              )}

                              <span
                                style={{
                                  fontSize: 11,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  background: lesson.is_completed ? 'rgba(5,150,105,0.14)' : 'rgba(129,158,53,0.12)',
                                  color: lesson.is_completed ? '#059669' : 'var(--admin-primary)'
                                }}
                              >
                                {lesson.is_completed ? 'Completed' : 'Not started'}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : null}
    </AdminPage>
  );
}
