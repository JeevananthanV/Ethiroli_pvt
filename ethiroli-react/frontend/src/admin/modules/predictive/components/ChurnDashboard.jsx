import React, { useEffect, useState } from 'react';
import { getStudents } from '../../../../services/api/userApi.js';
import { getStudentChurn } from '../../../../services/api/predictiveApi.js';

export default function ChurnDashboard() {
  const [students, setStudents] = useState([]);
  const [churnData, setChurnData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const studentsRes = await getStudents().catch(() => []);
        const studentList = Array.isArray(studentsRes) ? studentsRes.slice(0, 10) : [];
        setStudents(studentList);
        const churn = await Promise.all(studentList.map((s) => getStudentChurn(s.id).catch(() => ({ churn_probability: null }))));
        setChurnData(churn.filter((c) => c !== null));
      } catch (err) {
        console.error('Failed to load churn data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading churn analytics...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Student Churn Risk</h2>
          <p className="pageSubtitle">Predictive churn probability based on engagement</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {churnData.length === 0 ? (
            <div className="emptyState"><h3>No Data</h3><p>No churn predictions available.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Student</th><th>Churn Probability</th></tr></thead>
              <tbody>
                {churnData.map((data, idx) => (
                  <tr key={idx}>
                    <td>{students[idx]?.full_name || students[idx]?.email || `Student ${idx + 1}`}</td>
                    <td><span className={`statusTag ${data.churn_probability >= 70 ? 'error' : data.churn_probability >= 40 ? 'pending' : 'active'}`}>{data.churn_probability ?? 'N/A'}%</span></td>
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
