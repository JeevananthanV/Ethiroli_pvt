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
      const data = await listCourses().catch(() => []);
      setCourses(Array.isArray(data) ? data : []);
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
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="cardHeader">
                  <h3 className="cardTitle">{course.title}</h3>
                </div>
                <div className="cardBody">
                  <p style={{ margin: '8px 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                    {course.lessons_count || course.lessonCount || 0} Lessons • {course.level || 'All Levels'}
                  </p>
                  <span className={`statusTag ${course.status === 'published' ? 'active' : 'pending'}`}>
                    {course.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}