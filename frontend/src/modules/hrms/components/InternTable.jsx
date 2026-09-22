import React, { useEffect, useState } from 'react';
import { getInterns } from '../../../../services/api/internApi.js';

export default function InternTable() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getInterns().catch(() => []);
        setInterns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load interns:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading interns...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Interns</h2>
          <p className="pageSubtitle">Intern records and performance</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {interns.length === 0 ? (
            <div className="emptyState"><h3>No Interns</h3><p>No intern records found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Status</th></tr></thead>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id}>
                    <td>{intern.full_name}</td>
                    <td>{intern.email}</td>
                    <td>{intern.department || '—'}</td>
                    <td><span className={`statusTag ${intern.is_active ? 'active' : 'inactive'}`}>{intern.is_active ? 'Active' : 'Inactive'}</span></td>
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
