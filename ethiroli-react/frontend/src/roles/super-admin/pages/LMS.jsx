import React, { useEffect, useState } from 'react';
import { getCourses } from '../../services/api/courseApi.js';
import { getEnrollments } from '../../services/api/enrollmentApi.js';
import { getQuizzes } from '../../services/api/quizApi.js';

export default function LMS() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [courseRes, enrollRes, quizRes] = await Promise.all([
        getCourses().catch(() => []),
        getMyEnrollments?.().catch(() => []),
        getQuizzes().catch(() => []),
      ]);
      setCourses(Array.isArray(courseRes) ? courseRes : []);
      setEnrollments(Array.isArray(enrollRes) ? enrollRes : []);
      setQuizzes(Array.isArray(quizRes) ? quizRes : []);
    } catch (err) {
      console.error('Failed to load LMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading LMS data...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Learning Management System</h2>
          <p className="pageSubtitle">Courses, enrollments, and quizzes</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Courses</p>
          <p className="statValue">{courses.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Active Enrollments</p>
          <p className="statValue">{enrollments.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Quizzes</p>
          <p className="statValue">{quizzes.length}</p>
        </div>
      </div>
      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Available Courses ({courses.length})</h3></div>
        <div className="cardBody">
          {courses.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)' }}>No courses available.</p>
          ) : (
            <table className="table">
              <thead><tr><th>Title</th><th>Level</th><th>Price</th></tr></thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td><span className="statusTag active">{course.level || 'All Levels'}</span></td>
                    <td>{course.price ? `$${course.price}` : 'Free'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
