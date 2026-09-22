import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';

export default function TutorStudents() {
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
      setError(err.message || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return (
    <AdminPage
      title="Student Progress Tracker"
      subtitle="Monitor student enrollment progress and engagement"
      loading={loading}
      error={error}
      onRetry={fetchEnrollments}
    >
      <div className="dashboard">
        {enrollments.length === 0 ? (
          <div className="emptyState">
            <h3>No students enrolled yet</h3>
            <p>Student enrollments will appear here once they join your courses.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Student Progress</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.slice(0, 20).map((enr) => (
                    <tr key={enr.id}>
                      <td style={{ fontWeight: 600 }}>{enr.student_name || enr.user_name || '—'}</td>
                      <td>{enr.course_title || enr.course?.title || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--admin-border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(Number(enr.progress || 0), 100)}%`, height: '100%', background: 'var(--admin-primary)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', minWidth: 36 }}>{enr.progress || 0}%</span>
                        </div>
                      </td>
                      <td>{enr.last_login ? new Date(enr.last_login).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}