import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';

export default function TutorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCourses();
      setCourses(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <AdminPage
      title="My Courses"
      subtitle="Manage your courses and curriculum"
      loading={loading}
      error={error}
      onRetry={fetchCourses}
    >
      <div className="dashboard">
        {courses.length === 0 ? (
          <div className="emptyState">
            <h3>No courses found</h3>
            <p>Create your first course to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {courses.map((course) => {
              const published = course.is_active === true || course.is_active === 1 || course.status === 'published';
              const lessonCount = course.lessons_count ?? course.lessonCount ?? null;

              return (
                <div key={course.id} className="card">
                  <div className="cardHeader">
                    <h3 className="cardTitle">{course.name || course.code}</h3>
                    {course.code && (
                      <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{course.code}</span>
                    )}
                  </div>
                  <div className="cardBody">
                    {course.description && (
                      <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                        {course.description}
                      </p>
                    )}
                    <p style={{ margin: '8px 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                      {lessonCount !== null && lessonCount !== undefined ? `${lessonCount} Lessons • ` : ''}
                      {course.duration_days ? `${course.duration_days} days` : 'Duration not set'}
                    </p>
                    <span className={`statusTag ${published ? 'active' : 'pending'}`}>
                      {published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminPage>
  );
}