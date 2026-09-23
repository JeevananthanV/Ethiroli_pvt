import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';

export default function StudentCourses() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyEnrollments().catch(() => []);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return (
    <AdminPage
      title="My Courses"
      subtitle="Continue learning from where you left off"
      loading={loading}
      error={error}
      onRetry={fetchEnrollments}
    >
      <div className="dashboard">
        {enrollments.length === 0 ? (
          <div className="emptyState">
            <h3>No courses enrolled</h3>
            <p>Browse the course catalog and enroll to start learning.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {enrollments.map((enr) => (
              <div key={enr.id} className="card">
                <div className="cardHeader">
                  <h3 className="cardTitle">{enr.course_title || enr.course?.title || 'Course'}</h3>
                </div>
                <div className="cardBody">
                  <p style={{ margin: '8px 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                    {enr.progress || 0}% complete
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--admin-border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(Number(enr.progress || 0), 100)}%`, height: '100%', background: 'var(--admin-primary)', borderRadius: 3 }} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/app/student/course-player?courseId=${enr.course_id || enr.courseId}`)}
                    className="btn primary"
                    style={{ marginTop: 12, width: '100%' }}
                  >
                    {Number(enr.progress_percentage || enr.progress || 0) > 0 ? 'Resume Class' : 'Start Course'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}