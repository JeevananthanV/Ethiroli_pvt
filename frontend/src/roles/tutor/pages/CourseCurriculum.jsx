import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';

export default function TutorCurriculum() {
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
      setError(err.message || 'Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <AdminPage
      title="Curriculum Lesson Planner"
      subtitle="Define syllabus modules and organize lessons and quizzes"
      loading={loading}
      error={error}
      onRetry={fetchCourses}
    >
      <div className="dashboard">
        {courses.length === 0 ? (
          <div className="emptyState">
            <h3>No courses available</h3>
            <p>Create a course first to plan its curriculum.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="cardHeader">
                  <h3 className="cardTitle">{course.title}</h3>
                  <span className={`statusTag ${course.status === 'published' ? 'active' : 'pending'}`}>
                    {course.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="cardBody">
                  <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                    {course.description || 'No description provided.'}
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: 'var(--admin-text-muted)' }}>
                    <span>Level: {course.level || 'All Levels'}</span>
                    <span>Price: {course.price ? `₹${Number(course.price).toLocaleString()}` : 'Free'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}