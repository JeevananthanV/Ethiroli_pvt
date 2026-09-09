import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getPendingApprovals } from '../../services/api/approvalApi.js';
import { updateWorkflow } from '../../services/api/workflowApi.js';

export default function ApprovalQueue() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [note, setNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadApprovals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingApprovals();
      setApprovals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    try {
      await updateWorkflow(id, { status, note });
      setApprovals((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      setNote('');
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} approval: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusTag = (status) => {
    const cls = status?.toLowerCase() || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'PENDING'}</span>;
  };

  const filteredApprovals = approvals.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (app.type || '').toLowerCase().includes(term) ||
        (app.id || '').toLowerCase().includes(term) ||
        (app.created_by || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const stats = {
    total: approvals.length,
    pending: approvals.filter((a) => a.status === 'PENDING').length,
    approved: approvals.filter((a) => a.status === 'APPROVED').length,
    rejected: approvals.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <AdminPage
      title="Approval Queue"
      subtitle="Manage and process pending approval requests"
      loading={loading}
      error={error}
      onRetry={loadApprovals}
      actions={
        <button className="btn primary" onClick={loadApprovals}>
          Refresh
        </button>
      }
    >
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">Total</p>
          <p className="statValue">{stats.total}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Pending</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', WebkitBackgroundClip: 'text' }}>
            {stats.pending}
          </p>
        </div>
        <div className="statCard">
          <p className="statLabel">Approved</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text' }}>
            {stats.approved}
          </p>
        </div>
        <div className="statCard">
          <p className="statLabel">Rejected</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', WebkitBackgroundClip: 'text' }}>
            {stats.rejected}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <h3 className="cardTitle">Pending Approvals</h3>
          <select
            className="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: 140 }}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <input
            className="inputField"
            type="text"
            placeholder="Search approvals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 200 }}
          />
        </div>
        <div className="cardBody">
          {filteredApprovals.length === 0 ? (
            <div className="emptyState">
              <h3>No approvals found</h3>
              <p>Approval requests will appear here once submitted.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map((app) => (
                    <tr key={app.id}>
                      <td className="textSecondary"><code>{app.id}</code></td>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{app.type || 'Approval'}</td>
                      <td>{getStatusTag(app.status)}</td>
                      <td className="textSecondary">{app.created_by || '-'}</td>
                      <td className="textSecondary">
                        {app.created_at ? new Date(app.created_at).toLocaleString() : '-'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="btn success btnSm"
                            disabled={processingId === app.id || app.status === 'APPROVED'}
                            onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                          >
                            {processingId === app.id ? '...' : 'Approve'}
                          </button>
                          <button
                            className="btn danger btnSm"
                            disabled={processingId === app.id || app.status === 'REJECTED'}
                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                          >
                            {processingId === app.id ? '...' : 'Reject'}
                          </button>
                          <button
                            className="btn secondary btnSm"
                            onClick={() => {
                              setSelectedApproval(app);
                              setNote('');
                            }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedApproval && (
        <div className="modalOverlay" onClick={() => setSelectedApproval(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Approval Details</h3>
              <button className="closeBtn" onClick={() => setSelectedApproval(null)}>&times;</button>
            </div>
            <div className="modalBody">
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <p className="statLabel">Type</p>
                  <p className="textPrimary" style={{ fontWeight: 500, marginTop: 4 }}>
                    {selectedApproval.type || 'General Approval'}
                  </p>
                </div>
                <div>
                  <p className="statLabel">Status</p>
                  <p style={{ marginTop: 4 }}>{getStatusTag(selectedApproval.status)}</p>
                </div>
                <div>
                  <p className="statLabel">Created By</p>
                  <p className="textSecondary" style={{ marginTop: 4 }}>
                    {selectedApproval.created_by || 'System'}
                  </p>
                </div>
                <div>
                  <p className="statLabel">Created At</p>
                  <p className="textSecondary" style={{ marginTop: 4 }}>
                    {selectedApproval.created_at
                      ? new Date(selectedApproval.created_at).toLocaleString()
                      : '-'}
                  </p>
                </div>
                <div className="formGroup">
                  <label className="label">Note</label>
                  <textarea
                    className="textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button className="btn secondary" onClick={() => setSelectedApproval(null)}>
                    Close
                  </button>
                  <button
                    className="btn success"
                    disabled={processingId === selectedApproval.id}
                    onClick={() => {
                      handleStatusUpdate(selectedApproval.id, 'APPROVED');
                      setSelectedApproval(null);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn danger"
                    disabled={processingId === selectedApproval.id}
                    onClick={() => {
                      handleStatusUpdate(selectedApproval.id, 'REJECTED');
                      setSelectedApproval(null);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
