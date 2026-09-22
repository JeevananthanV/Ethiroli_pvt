import React, { useEffect, useState } from 'react';
import { getLeads } from '../../../../services/api/leadApi.js';

export default function UserFilters() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getLeads().catch(() => []);
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load leads:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading leads...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Leads</h2>
          <p className="pageSubtitle">Sales leads overview</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {leads.length === 0 ? (
            <div className="emptyState"><h3>No Leads</h3><p>No leads found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Course</th><th>Budget</th></tr></thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.full_name || lead.name}</td>
                    <td>{lead.course || '—'}</td>
                    <td>{lead.budget || '—'}</td>
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
