import React, { useEffect, useState } from 'react';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';

export default function StudentProgressCard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyEnrollments();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
      </div>
    );
  }

  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;
  const completed = enrollments.filter(e => (e.progress || 0) >= 100).length;
  const inProgress = enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;

  return (
    <div className="dashboard" style={{gap: 20}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16}}>
        <div className="statCard">
          <p className="statLabel">Enrolled Courses</p>
          <p className="statValue">{enrollments.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">In Progress</p>
          <p className="statValue">{inProgress}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Completed</p>
          <p className="statValue">{completed}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Average Progress</p>
          <p className="statValue">{avgProgress}%</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="emptyState">
          <h3>No enrollments yet</h3>
          <p>Start learning by enrolling in a course</p>
        </div>
      ) : (
        <div className="card" style={{padding: 0, overflow: 'hidden'}}>
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Last Accessed</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => {
                const course = enrollment.course || {};
                const progress = enrollment.progress || 0;
                return (
                  <tr key={enrollment.id}>
                    <td>
                      <div style={{fontWeight: 600, fontSize: 14}}>{course.title || course.name || 'Untitled Course'}</div>
                      <div style={{fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2}}>
                        {course.instructor?.name || course.instructor || 'Instructor TBD'}
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <div style={{flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', maxWidth: 120}}>
                          <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: progress >= 100 ? 'var(--admin-success)' : 'linear-gradient(90deg, #a855f7, #6366f1)',
                            borderRadius: 3,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{fontSize: 12, fontWeight: 600, minWidth: 36}}>{progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`statusTag ${progress >= 100 ? 'active' : progress > 0 ? 'pending' : 'inactive'}`}>
                        {progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </td>
                    <td style={{fontSize: 13.5, color: 'var(--admin-text-secondary)'}}>
                      {enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
