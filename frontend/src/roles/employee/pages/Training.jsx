import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';
import DetailModal, { DetailRow, DetailSection, DetailBadge } from '../components/DetailModal.jsx';

/**
 * My Training & Development.
 *
 * Real enrolment data from `GET /v1/employee/courses` (enrollments joined to
 * courses, scoped to the signed-in employee). No sample courses: if the grid is
 * empty the employee simply has no enrolments yet.
 *
 * Each card summarises progress; clicking it opens the full enrolment record.
 */

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

/**
 * `enrollments.progress_percentage` is a DECIMAL, so mysql2 returns it as a
 * string ("42.5000"). Coerce to a bounded integer so the bar can never render
 * NaN% or a width the browser cannot lay out.
 */
const progressOf = (course) => {
  const n = Number(course?.progress_percentage);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
};

const progressTone = (pct) => {
  if (pct >= 75) return 'success';
  if (pct >= 40) return 'warning';
  return 'danger';
};

const progressLabel = (pct) => {
  if (pct >= 100) return 'Completed';
  if (pct > 0) return 'In progress';
  return 'Not started';
};

export default function Training() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getEnrolledCourses();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setCourses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load training courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const FILTERS = useMemo(() => {
    const active = courses.filter((c) => progressOf(c) > 0 && progressOf(c) < 100).length;
    const completed = courses.filter((c) => progressOf(c) >= 100).length;
    const notStarted = courses.filter((c) => progressOf(c) === 0).length;
    return [
      { key: 'ALL', label: 'All', count: courses.length },
      { key: 'ACTIVE', label: 'In progress', count: active },
      { key: 'COMPLETED', label: 'Completed', count: completed },
      { key: 'NOT_STARTED', label: 'Not started', count: notStarted }
    ];
  }, [courses]);

  const visible = useMemo(() => {
    if (filter === 'ALL') return courses;
    const pct = (c) => progressOf(c);
    if (filter === 'ACTIVE') return courses.filter((c) => pct(c) > 0 && pct(c) < 100);
    if (filter === 'COMPLETED') return courses.filter((c) => pct(c) >= 100);
    return courses.filter((c) => pct(c) === 0);
  }, [courses, filter]);

  const overallPct = useMemo(() => {
    if (courses.length === 0) return 0;
    return Math.round(courses.reduce((sum, c) => sum + progressOf(c), 0) / courses.length);
  }, [courses]);

  return (
    <AdminPage
      title="My Training & Development"
      subtitle="Upskill with personalized learning tracks, technical workshops, and courses"
      loading={loading}
      error={error}
      onRetry={loadCourses}
    >
      {courses.length === 0 ? (
        <div className="card shadow-sm border-0">
          <EmptyState
            icon="bi-mortarboard"
            title="No training courses yet"
            text="You are not enrolled in any courses at the moment. Enrolments assigned to you will appear here with your progress."
          />
        </div>
      ) : (
        <>
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body d-flex align-items-center gap-3 flex-wrap">
              <div
                className="emp-ring-stat"
                style={{
                  background: `conic-gradient(var(--emp-olive) ${overallPct * 3.6}deg, rgba(26,75,72,0.09) 0deg)`
                }}
                aria-hidden="true"
              >
                <span>{overallPct}%</span>
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold text-dark">Overall progress</div>
                <div className="text-muted small">
                  {courses.length} course{courses.length === 1 ? '' : 's'} enrolled &middot;{' '}
                  {courses.filter((c) => progressOf(c) >= 100).length} completed
                </div>
              </div>
              <div className="btn-group flex-wrap" role="group">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`btn btn-sm ${filter === f.key ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter(f.key)}
                    aria-pressed={filter === f.key}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="card shadow-sm border-0">
              <EmptyState
                icon="bi-funnel"
                title="No courses in this view"
                text="No enrolled course matches this filter."
                compact
              />
            </div>
          ) : (
            <div className="row g-4">
              {visible.map((course) => {
                const pct = progressOf(course);
                return (
                  <div key={course.id || course.course_id} className="col-md-6 col-xl-4">
                    <div
                      className="card h-100 shadow-sm border-0 emp-project-card"
                      role="button"
                      tabIndex={0}
                      aria-label={`View full details for ${course.name}`}
                      onClick={() => setSelectedCourse(course)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedCourse(course);
                        }
                      }}
                    >
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt=""
                          className="card-img-top"
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="card-img-top emp-course-banner"
                          aria-hidden="true"
                        >
                          <i className="bi bi-mortarboard"></i>
                        </div>
                      )}

                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                          <DetailBadge tone={course.category ? 'teal' : 'secondary'}>
                            {humanise(course.category) || 'General'}
                          </DetailBadge>
                          <span className="badge bg-light text-dark border">
                            {humanise(course.level) || 'Level not set'}
                          </span>
                        </div>

                        {/* `courses` has a `name` column, not `title`. */}
                        <h5 className="card-title fw-bold text-dark">{course.name}</h5>

                        <p className="card-text text-muted small flex-grow-1 emp-project-card__desc">
                          {course.description || 'No description provided for this course.'}
                        </p>

                        <div className="mt-3 pt-3 border-top">
                          <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                            <span>{progressLabel(pct)}</span>
                            <span className="fw-semibold text-dark">{pct}%</span>
                          </div>
                          <div
                            className="progress"
                            style={{ height: '6px' }}
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label={`${course.name} progress`}
                          >
                            <div
                              className={`progress-bar bg-${progressTone(pct)}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <DetailModal
        open={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        icon="bi-mortarboard"
        accent={selectedCourse ? progressTone(progressOf(selectedCourse)) : 'primary'}
        title={selectedCourse?.name || 'Course'}
        subtitle={selectedCourse ? humanise(selectedCourse.category) || 'General course' : ''}
        badge={
          selectedCourse && (
            <DetailBadge tone={progressTone(progressOf(selectedCourse))}>
              {progressOf(selectedCourse)}% &middot; {progressLabel(progressOf(selectedCourse))}
            </DetailBadge>
          )
        }
        footer={
          selectedCourse && (
            <button type="button" className="btn btn-light" onClick={() => setSelectedCourse(null)}>
              Close
            </button>
          )
        }
      >
        {selectedCourse && (
          <>
            <DetailSection title="About this course">
              <p className="emp-detail__prose mb-0">
                {selectedCourse.description || 'No description provided for this course.'}
              </p>
            </DetailSection>

            <DetailSection title="Your progress" icon="bi-graph-up-arrow">
              <div className="mb-3">
                <div className="progress" style={{ height: '10px' }} role="progressbar"
                  aria-valuenow={progressOf(selectedCourse)} aria-valuemin="0" aria-valuemax="100"
                  aria-label={`${selectedCourse.name} progress`}>
                  <div
                    className={`progress-bar bg-${progressTone(progressOf(selectedCourse))}`}
                    style={{ width: `${progressOf(selectedCourse)}%` }}
                  ></div>
                </div>
              </div>
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Progress" value={`${progressOf(selectedCourse)}%`} />
                <DetailRow label="Status" value={progressLabel(progressOf(selectedCourse))} />
              </dl>
            </DetailSection>

            <DetailSection title="Course details" icon="bi-info-circle">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Category" value={humanise(selectedCourse.category)} />
                <DetailRow label="Level" value={humanise(selectedCourse.level)} />
                <DetailRow label="Instructor" value={selectedCourse.instructor_name} />
                <DetailRow label="Enrolled on" value={formatDateTime(selectedCourse.enrolled_at || selectedCourse.created_at)} />
                <DetailRow label="Last activity" value={formatDateTime(selectedCourse.last_accessed_at || selectedCourse.updated_at)} />
                {selectedCourse.completed_at && (
                  <DetailRow label="Completed on" value={formatDate(selectedCourse.completed_at)} />
                )}
                <DetailRow label="Course ID" value={selectedCourse.course_id || selectedCourse.id} mono />
              </dl>
            </DetailSection>
          </>
        )}
      </DetailModal>
    </AdminPage>
  );
}
