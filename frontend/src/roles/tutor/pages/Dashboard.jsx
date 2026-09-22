import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        listCourses().catch(() => []),
        getMyEnrollments().catch(() => []),
      ]);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load tutor dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeStudents = new Set(enrollments.map(e => e.student_id || e.user_id)).size;

  return (
    <AdminPage
      title="Tutor Dashboard"
      subtitle="Track courses, students, and performance metrics"
      loading={loading}
      error={error}
      onRetry={fetchData}
    >
      <div className="dashboard">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <h6 className="card-title">Courses Taught</h6>
                <h2 className="card-text">{courses.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <h6 className="card-title">Active Students</h6>
                <h2 className="card-text">{activeStudents}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <h6 className="card-title">Total Enrollments</h6>
                <h2 className="card-text">{enrollments.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-dark h-100">
              <div className="card-body">
                <h6 className="card-title">Pending Queries</h6>
                <h2 className="card-text">5</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">My Courses</h6>
              </div>
              <div className="card-body">
                {courses.length === 0 ? (
                  <p className="text-muted">No courses found. Create your first course to get started.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table table-sm">
                      <thead>
                        <tr><th>Title</th><th>Level</th><th>Students</th></tr>
                      </thead>
                      <tbody>
                        {courses.slice(0, 5).map((course) => (
                          <tr key={course.id}>
                            <td style={{ fontWeight: 500 }}>{course.title || 'Untitled Course'}</td>
                            <td>{course.level || 'All Levels'}</td>
                            <td>{enrollments.filter(e => e.course_id === course.id).length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">Quick Navigation</h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2"><a href="/app/tutor/courses" className="text-decoration-none">Courses</a></li>
                  <li className="mb-2"><a href="/app/tutor/curriculum" className="text-decoration-none">Curriculum</a></li>
                  <li className="mb-2"><a href="/app/tutor/students" className="text-decoration-none">Students</a></li>
                  <li className="mb-2"><a href="/app/tutor/attendance" className="text-decoration-none">Attendance</a></li>
                  <li className="mb-2"><a href="/app/tutor/assignments" className="text-decoration-none">Assignments</a></li>
                  <li className="mb-2"><a href="/app/tutor/quizzes" className="text-decoration-none">Quizzes</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}