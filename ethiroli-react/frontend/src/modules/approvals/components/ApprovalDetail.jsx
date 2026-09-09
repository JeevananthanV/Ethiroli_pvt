import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getPendingApprovals } from '../../services/api/approvalApi.js';
import { getWorkflows, updateWorkflow } from '../../services/api/workflowApi.js';

export default function ApprovalDetail({ match }) {
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [reassignNote, setReassignNote] = useState('');

  const approvalId = match?.params?.id;

  const loadApproval = useCallback(async () => {
    if (!approvalId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingApprovals();
      const found = (data || []).find((a) => a.id === approvalId);
      setApproval(found || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch approval details');
    } finally {
      setLoading(false);
    }
  }, [approvalId]);

  const loadWorkflows = useCallback(async () => {
    try {
      const data = await getWorkflows();
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load workflows:', err);
    }
  }, []);

  useEffect(() => {
    if (approvalId) {
      loadApproval();
      loadWorkflows();
    }
  }, [approvalId, loadApproval, loadWorkflows]);

  const handleStatusUpdate = async (status) => {
    if (!approval) return;
    setActionLoading(true);
    try {
      await updateWorkflow(approval.id, { status, note: reassignNote });
      setApproval((prev) => ({ ...prev, status }));
      setReassignNote('');
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} approval: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const cls = status?.toLowerCase() || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'PENDING'}</span>;
  };

  if (!approvalId) {
    return (
      <AdminPage title="Approval Detail" subtitle="Select an approval to view details" loading={false}>
        <div className="emptyState">
          <h3>No approval selected</h3>
          <p>Choose an approval from the queue to view its details.</p>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Approval Detail"
      subtitle={approval ? `Approval ID: ${approval.id}` : 'Loading...'}
      loading={loading}
      error={error}
      onRetry={loadApproval}
      actions={
        <button className="btn secondary" onClick={loadApproval}>Refresh</button>
      }
    >
      {!approval && !loading ? (
        <div className="emptyState">
          <h3>Approval not found</h3>
          <p>The requested approval could not be found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Approval Information</h3>
            </div>
            <div className="cardBody">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <p className="statLabel">Type</p>
                  <p className="textPrimary" style={{ fontWeight: 500, marginTop: 4 }}>
                    {approval?.type || 'General Approval'}
                  </p>
                </div>
                <div>
                  <p className="statLabel">Status</p>
                  <p style={{ marginTop: 4 }}>{getStatusTag(approval?.status)}</p>
                </div>
                <div>
                  <p className="statLabel">Created By</p>
                  <p className="textSecondary" style={{ marginTop: 4 }}>{approval?.created_by || 'System'}</p>
                </div>
                <div>
                  <p className="statLabel">Created At</p>
                  <p className="textSecondary" style={{ marginTop: 4 }}>
                    {approval?.created_at ? new Date(approval.created_at).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {approval?.status === 'PENDING' && (
            <div className="card">
              <div className="cardHeader">
                <h3 className="cardTitle">Actions</h3>
              </div>
              <div className="cardBody">
                <div className="formGroup">
                  <label className="label">Note (optional)</label>
                  <textarea
                    className="textarea"
                    value={reassignNote}
                    onChange={(e) => setReassignNote(e.target.value)}
                    placeholder="Add a note before taking action..."
                    rows={3}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    className="btn success"
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate('APPROVED')}
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    className="btn danger"
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate('REJECTED')}
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Workflow History</h3>
            </div>
            <div className="cardBody">
              {workflows.length === 0 ? (
                <p style={{ color: 'var(--admin-text-muted)' }}>No workflow history available.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Workflow</th>
                      <th>Steps</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map((wf) => (
                      <tr key={wf.id}>
                        <td className="textPrimary" style={{ fontWeight: 500 }}>{wf.name}</td>
                        <td className="textSecondary">{wf.steps?.length || 0} steps</td>
                        <td><span className="statusTag active">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
