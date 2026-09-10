import React, { useEffect, useState } from 'react';
import { getEnrollments } from '../../../../services/api/enrollmentApi.js';

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getEnrollments().catch(() => []);
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading enrollments...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Enrollment List</h2>
          <p className="pageSubtitle">Student enrollments</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {enrollments.length === 0 ? (
            <div className="emptyState"><h3>No Enrollments</h3><p>No enrollment records found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Student</th><th>Course</th><th>Progress</th></tr></thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id}>
                    <td>{enr.student_name || enr.student_id}</td>
                    <td>{enr.course_title || enr.course_id}</td>
                    <td>{enr.progress || 0}%</td>
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
