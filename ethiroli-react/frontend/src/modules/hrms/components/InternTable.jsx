import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listInterns } from '../../services/api/internApi.js';

export default function InternTable() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInterns();
      setInterns(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch interns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  return (
    <AdminPage
      title="Interns"
      subtitle="Intern mentorship mapping and stipend management"
      loading={loading}
      error={error}
      onRetry={fetchInterns}
      actions={
        <button className="btn primary" onClick={() => alert('Add Intern modal placeholder')}>
          + Add Intern
        </button>
      }
    >
      <div className="card">
        {interns.length === 0 ? (
          <div className="emptyState">
            <h3>No interns found</h3>
            <p>Add your first intern to get started.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Stipend</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Mentor</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{intern.full_name}</td>
                    <td className="textSecondary">{intern.email}</td>
                    <td className="textSecondary">{intern.college_name || '-'}</td>
                    <td className="textSecondary">{intern.stipend ? `$${Number(intern.stipend).toFixed(2)}` : '-'}</td>
                    <td className="textSecondary">{intern.start_date || '-'}</td>
                    <td className="textSecondary">{intern.end_date || '-'}</td>
                    <td className="textSecondary">{intern.mentor_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
