import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Training() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * `enrollments.progress_percentage` is returned as a DECIMAL string by
   * mysql2. Coerce it to a bounded number so the progress bar never renders
   * "NaN%" or a width the browser cannot lay out.
   */
  const progressOf = (course) => {
    const n = Number(course?.progress_percentage);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, Math.round(n)));
  };

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getEnrolledCourses();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setCourses(list);
    } catch (err) {
      setError(err.message || 'Failed to load training courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <AdminPage
      title="My Training & Development"
      subtitle="Upskill with personalized learning tracks, technical workshops, and courses"
      loading={loading}
      error={error}
      onRetry={loadCourses}
    >
      <div className="row g-4">
        {courses.length === 0 ? (
          <div className="col-12"><EmptyState icon="bi-mortarboard" text="No training courses enrolled yet." /></div>
        ) : (
          courses.map((course) => (
            <div key={course.id || course.course_id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.name}
                    className="card-img-top"
                    style={{ height: '160px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-dark bg-gradient d-flex align-items-center justify-content-center text-white"
                    style={{ height: '160px' }}
                  >
                    <i className="bi bi-mortarboard fs-1 text-white-50"></i>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1 small">
                      {course.category || 'General'}
                    </span>
                    <span className="badge bg-info text-dark small">
                      {course.level || 'Level not set'}
                    </span>
                  </div>

                  {/* `courses` has a `name` column, not `title`. Reading
                      `course.title` rendered an empty heading for every card. */}
                  <h5 className="card-title fw-bold text-dark">{course.name}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {course.description || 'No description provided for this course.'}
                  </p>

                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                      <span>Progress</span>
                      {/* progress lives in `enrollments.progress_percentage`; the old
                          `course.progress` read always produced 0%. */}
                      <span className="fw-semibold text-dark">{progressOf(course)}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${progressOf(course)}%` }}
                        aria-valuenow={progressOf(course)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}
