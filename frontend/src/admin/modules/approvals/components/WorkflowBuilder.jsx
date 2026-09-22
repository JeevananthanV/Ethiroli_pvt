import React, { useEffect, useState } from 'react';
import { getWorkflows, createWorkflow } from '../../../services/api/approvalApi.js';
import { getPendingApprovals } from '../../../services/api/approvalApi.js';

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', steps: '' });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [wfRes, appRes] = await Promise.all([
        getWorkflows().catch(() => []),
        getPendingApprovals().catch(() => []),
      ]);
      setWorkflows(Array.isArray(wfRes) ? wfRes : []);
      setApprovals(Array.isArray(appRes) ? appRes : []);
    } catch (err) {
      console.error('Failed to load workflow data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createWorkflow({ name: newWorkflow.name, steps: newWorkflow.steps });
      setShowCreate(false);
      setNewWorkflow({ name: '', steps: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create workflow:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading workflows...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Approvals & Workflows</h2>
          <p className="pageSubtitle">Manage approval workflows and pending approvals</p>
        </div>
        <div className="pageActions">
          <button onClick={() => setShowCreate(true)} className="btn btnPrimary">+ New Workflow</button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Active Workflows</h3></div>
          <div className="cardBody">
            {workflows.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No workflows configured.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Steps</th><th>Status</th></tr></thead>
                <tbody>
                  {workflows.map((wf) => (
                    <tr key={wf.id}>
                      <td>{wf.name}</td>
                      <td>{wf.steps?.length || 0}</td>
                      <td><span className="statusTag active">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Pending Approvals ({approvals.length})</h3></div>
          <div className="cardBody">
            {approvals.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No pending approvals.</p>
            ) : (
              <table className="table">
                <thead><tr><th>ID</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {approvals.map((app) => (
                    <tr key={app.id}>
                      <td><code>{app.id}</code></td>
                      <td>{app.type || 'Approval'}</td>
                      <td><span className="statusTag pending">Pending</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showCreate && (
        <div className="modalOverlay" onClick={() => setShowCreate(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Create Workflow</h3>
            <form onSubmit={handleCreate}>
              <div className="formGroup">
                <label className="label">Workflow Name</label>
                <input className="input" value={newWorkflow.name} onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Steps (JSON array)</label>
                <textarea className="textarea" value={newWorkflow.steps} onChange={(e) => setNewWorkflow({ ...newWorkflow, steps: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowCreate(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Creating...' : 'Create Workflow'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
