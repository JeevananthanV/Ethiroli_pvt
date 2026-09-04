import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listCourses } from '../../../services/api/courseApi.js';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';
import styles from './Lms.module.css';

export default function CourseList({ view = 'tutor', courseId: propCourseId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === 'student') {
        const data = await getMyEnrollments();
        setCourses(data);
      } else {
        const data = await listCourses();
        setCourses(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [view]);

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTutorView = () => (
    <div className="card" style={{overflow: 'hidden', padding: 0}}>
      <table className="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Code</th>
            <th>Instructor</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(course => (
            <tr key={course.id}>
              <td>
                <div style={{fontWeight: 600}}>{course.title || course.name}</div>
                <div style={{fontSize: 12, color: 'var(--admin-text-muted)'}}>
                  {course.description?.slice(0, 60)}...
                </div>
              </td>
              <td>
                <span className="statusTag active" style={{background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.2)'}}>
                  {course.code || course.courseCode || 'N/A'}
                </span>
              </td>
              <td>{course.instructor?.name || course.instructor || '—'}</td>
              <td>{course.enrollmentCount ?? course.enrollments?.length ?? '—'}</td>
              <td>
                <span className={`statusTag ${course.status === 'active' ? 'active' : course.status === 'draft' ? 'inactive' : 'pending'}`}>
                  {course.status || 'active'}
                </span>
              </td>
              <td>
                <div style={{display: 'flex', gap: 6}}>
                  <button className="btn secondary btnSm">Edit</button>
                  <button className="btn primary btnSm">View</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStudentView = () => (
    <div className={styles.courseGrid}>
      {filtered.map(enrollment => {
        const course = enrollment.course || enrollment;
        const progress = enrollment.progress ?? 0;
        return (
          <div key={course.id} className="card" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <span className="statusTag active" style={{background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.2)'}}>
                {course.code || course.courseCode || 'N/A'}
              </span>
              <span className={`statusTag ${enrollment.status === 'active' ? 'active' : 'pending'}`}>
                {enrollment.status || 'Enrolled'}
              </span>
            </div>
            <h4 style={{margin: 0, fontSize: 16, fontWeight: 600}}>{course.title || course.name}</h4>
            <p style={{margin: 0, fontSize: 13, color: 'var(--admin-text-muted)'}}>
              {course.instructor?.name || course.instructor || 'Instructor TBD'}
            </p>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, color: 'var(--admin-text-secondary)'}}>
                <span>Progress</span>
                <span style={{fontWeight: 600}}>{progress}%</span>
              </div>
              <div style={{height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: 3, transition: 'width 0.3s ease'}} />
              </div>
            </div>
            <button className="btn primary" style={{marginTop: 'auto'}}>
              {progress > 0 ? 'Resume Learning' : 'Start Course'}
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <AdminPage
      title={view === 'tutor' ? 'Course Management' : 'My Learning Dashboard'}
      subtitle={view === 'tutor' ? 'Manage and monitor all courses' : 'Track your enrolled courses and resume your lessons'}
      loading={loading}
      error={error}
      onRetry={fetchCourses}
      actions={
        <div style={{display: 'flex', gap: 8}}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="inputField"
            style={{width: 240}}
          />
          {view === 'tutor' && (
            <button className="btn primary">+ New Course</button>
          )}
        </div>
      }
    >
      {filtered.length === 0 ? (
        <div className="emptyState">
          <h3>No courses found</h3>
          <p>{searchTerm ? 'Try adjusting your search term' : 'No courses available yet'}</p>
        </div>
      ) : view === 'tutor' ? renderTutorView() : renderStudentView()}
    </AdminPage>
  );
}
