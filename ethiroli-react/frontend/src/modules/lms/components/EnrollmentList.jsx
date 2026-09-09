import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getEnrollments } from '../../services/api/enrollmentApi.js';

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setEnrollments((await getEnrollments().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Enrollments" subtitle="Course enrollments and progress" loading={loading} error={null} onRetry={load}>
      <div className="card">
        <div className="cardBody">
          {enrollments.length === 0 ? <p className="textSecondary">No enrollments found.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Student</th><th>Course</th><th>Status</th><th>Progress</th><th>Enrolled</th></tr></thead>
                <tbody>
                  {enrollments.map((en) => (
                    <tr key={en.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{en.student_name || en.student_id}</td>
                      <td className="textSecondary">{en.course_name || en.course_id}</td>
                      <td><span className={'statusTag ' + (en.status === 'active' ? 'active' : 'pending')}>{en.status}</span></td>
                      <td className="textSecondary">{en.progress != null ? en.progress + '%' : '-'}</td>
                      <td className="textSecondary">{en.enrolled_at ? new Date(en.enrolled_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
