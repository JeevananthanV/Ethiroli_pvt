import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Training() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="col-12 text-center py-5">
            <div className="rounded-circle bg-light d-inline-flex p-3 mb-3 text-muted">
              <i className="bi bi-book fs-1"></i>
            </div>
            <h5>No Training Courses Enrolled</h5>
            <p className="text-muted">You are not currently enrolled in any professional training courses.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id || course.course_id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
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
                      {course.level || 'Intermediate'}
                    </span>
                  </div>

                  <h5 className="card-title fw-bold text-dark">{course.title}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {course.description || 'Comprehensive training curriculum to advance domain knowledge and team performance.'}
                  </p>

                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                      <span>Progress</span>
                      <span className="fw-semibold text-dark">{course.progress || 0}%</span>
                    </div>
                    <div className="progress mb-3" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${course.progress || 0}%` }}
                        aria-valuenow={course.progress || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>

                    <button className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-play-circle"></i>
                      <span>Resume Course</span>
                    </button>
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
