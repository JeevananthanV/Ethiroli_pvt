import React, { useEffect, useState } from 'react';
import { getPendingApprovals } from '../../../../services/api/approvalApi.js';

export default function ApprovalQueue() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPendingApprovals().catch(() => []);
        setApprovals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load approvals:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading approvals...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Approval Queue</h2>
          <p className="pageSubtitle">Pending tasks requiring approval</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {approvals.length === 0 ? (
            <div className="emptyState"><h3>No Pending Approvals</h3><p>All caught up!</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>ID</th><th>Type</th><th>Requested By</th><th>Status</th></tr></thead>
              <tbody>
                {approvals.map((app) => (
                  <tr key={app.id}>
                    <td><code>{app.id}</code></td>
                    <td>{app.type || 'Approval'}</td>
                    <td>{app.requested_by || '—'}</td>
                    <td><span className="statusTag pending">Pending</span></td>
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
