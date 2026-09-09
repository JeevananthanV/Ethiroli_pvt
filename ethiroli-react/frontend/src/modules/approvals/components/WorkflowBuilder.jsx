import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getWorkflows, createWorkflow } from '../../services/api/approvalApi.js';
import { getWorkflows as getAutomationWorkflows, createWorkflow as createAutomationWorkflow } from '../../services/api/workflowApi.js';

export default function WorkflowBuilder() {
  const [approvalWorkflows, setApprovalWorkflows] = useState([]);
  const [automationWorkflows, setAutomationWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('approval');
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '', steps: '' });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appRes, autoRes] = await Promise.all([
        getWorkflows().catch(() => []),
        getAutomationWorkflows().catch(() => []),
      ]);
      setApprovalWorkflows(Array.isArray(appRes) ? appRes : []);
      setAutomationWorkflows(Array.isArray(autoRes) ? autoRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load workflow data');
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
      const workflowData = {
        name: newWorkflow.name,
        description: newWorkflow.description,
        steps: newWorkflow.steps ? JSON.parse(newWorkflow.steps) : [],
      };
      if (activeTab === 'approval') {
        await createWorkflow(workflowData);
      } else {
        await createAutomationWorkflow(workflowData);
      }
      setShowCreate(false);
      setNewWorkflow({ name: '', description: '', steps: '' });
      loadData();
    } catch (err) {
      alert(`Failed to create workflow: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusTag = (status) => {
    const cls = status?.toLowerCase() || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'ACTIVE'}</span>;
  };

  const currentWorkflows = activeTab === 'approval' ? approvalWorkflows : automationWorkflows;

  return (
    <AdminPage
      title="Workflow Builder"
      subtitle="Design and manage approval and automation workflows"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <button className="btn primary" onClick={() => setShowCreate(true)}>
          + New Workflow
        </button>
      }
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className={`btn ${activeTab === 'approval' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('approval')}
        >
          Approval Workflows
        </button>
        <button
          className={`btn ${activeTab === 'automation' ? 'primary' : 'secondary'}`}
          onClick={() => setActiveTab('automation')}
        >
          Automation Workflows
        </button>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">
            {activeTab === 'approval' ? 'Active Approval Workflows' : 'Active Automation Workflows'}
          </h3>
        </div>
        <div className="cardBody">
          {currentWorkflows.length === 0 ? (
            <div className="emptyState">
              <h3>No workflows configured</h3>
              <p>Create a new workflow to get started.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Steps</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWorkflows.map((wf) => (
                    <tr key={wf.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{wf.name}</td>
                      <td className="textSecondary">{wf.description || '-'}</td>
                      <td className="textSecondary">{wf.steps?.length || wf.node_count || 0}</td>
                      <td>{getStatusTag(wf.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="modalOverlay" onClick={() => setShowCreate(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Create Workflow</h3>
              <button className="closeBtn" onClick={() => setShowCreate(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <form onSubmit={handleCreate}>
                <div className="formGroup">
                  <label className="label required">Workflow Name</label>
                  <input
                    className="inputField"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Description</label>
                  <input
                    className="inputField"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Steps (JSON array)</label>
                  <textarea
                    className="textarea"
                    value={newWorkflow.steps}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, steps: e.target.value })}
                    placeholder='[{"name": "Step 1", "type": "approval"}, ...]'
                    rows={4}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button type="button" className="btn secondary" onClick={() => setShowCreate(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={saving}>
                    {saving ? 'Creating...' : 'Create Workflow'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
