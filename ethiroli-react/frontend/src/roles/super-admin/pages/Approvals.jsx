import React, { useEffect, useState } from 'react';
import { getPendingApprovals, getWorkflows, createApprovalInstance } from '../../../services/api/approvalApi.js';

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aRes, wRes] = await Promise.all([getPendingApprovals(), getWorkflows()]);
      setApprovals(aRes?.data || aRes || []);
      setWorkflows(wRes?.data || wRes || []);
    } catch (err) {
      console.error('Failed to load approvals', err);
      setError('Failed to load approvals and workflows.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, type) => {
    setActionId(id);
    setActionType(type);
    try {
      if (type === 'approve') {
        await createApprovalInstance({ approvalId: id, decision: 'approved' });
      } else {
        await createApprovalInstance({ approvalId: id, decision: 'rejected' });
      }
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to process approval', err);
      alert('Failed to process approval.');
    } finally {
      setActionId(null);
      setActionType(null);
    }
  };

  if (loading) return <div className="loading">Loading approvals...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Platform Pending Approvals Queue</h1>
          <p className="pageSubtitle">Review and act on pending platform requests and active workflows.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnSecondary" onClick={fetchData}>Refresh</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Pending Approvals ({approvals.length})</h3>
          </div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            {approvals.length === 0 && <div className="emptyState">No pending approvals.</div>}
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Requested By</th>
                  <th>Action Requested</th>
                  <th>Department</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map(a => (
                  <tr key={a.id}>
                    <td><code>{a.requestId || a.id}</code></td>
                    <td>{a.requestedBy || a.requested_by || '-'}</td>
                    <td>{a.actionRequested || a.action_requested || '-'}</td>
                    <td>{a.department || '-'}</td>
                    <td>
                      <button className="btn btnPrimary" style={{ padding: '4px 10px', fontSize: '11px' }} disabled={actionId === a.id} onClick={() => handleAction(a.id, 'approve')}>
                        {actionId === a.id && actionType === 'approve' ? 'Processing...' : 'Approve'}
                      </button>
                      <button className="btn btnSecondary" style={{ padding: '4px 10px', fontSize: '11px', marginLeft: '6px' }} disabled={actionId === a.id} onClick={() => handleAction(a.id, 'reject')}>
                        {actionId === a.id && actionType === 'reject' ? 'Processing...' : 'Decline'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Active Workflows ({workflows.length})</h3>
          </div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            {workflows.length === 0 && <div className="emptyState">No active workflows.</div>}
            <table className="table">
              <thead>
                <tr>
                  <th>Workflow ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Steps</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map(w => (
                  <tr key={w.id}>
                    <td><code>{w.id}</code></td>
                    <td>{w.name || w.title}</td>
                    <td><span className="statusTag active">{w.status}</span></td>
                    <td>{w.steps || w.stepCount || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
