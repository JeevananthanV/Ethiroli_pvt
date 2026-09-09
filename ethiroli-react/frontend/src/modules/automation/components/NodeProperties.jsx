import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getAutomationWorkflows, createAutomationWorkflow } from '../../services/api/automationApi.js';

const NODE_TYPE_FIELDS = {
  trigger: [
    { key: 'event_type', label: 'Event Type', type: 'select', options: ['on_create', 'on_update', 'on_delete', 'on_schedule'] },
    { key: 'cron', label: 'Cron Expression', type: 'text' },
  ],
  action: [
    { key: 'action_type', label: 'Action Type', type: 'select', options: ['send_email', 'send_sms', 'update_record', 'call_api'] },
    { key: 'target_url', label: 'Target URL', type: 'text' },
    { key: 'payload', label: 'Payload (JSON)', type: 'textarea' },
  ],
  condition: [
    { key: 'field', label: 'Field', type: 'text' },
    { key: 'operator', label: 'Operator', type: 'select', options: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains'] },
    { key: 'value', label: 'Value', type: 'text' },
  ],
  delay: [
    { key: 'delay_seconds', label: 'Delay (seconds)', type: 'number' },
    { key: 'delay_type', label: 'Delay Type', type: 'select', options: ['fixed', 'random'] },
  ],
  notification: [
    { key: 'channel', label: 'Channel', type: 'select', options: ['email', 'sms', 'push', 'in_app'] },
    { key: 'template_id', label: 'Template ID', type: 'text' },
    { key: 'recipient', label: 'Recipient', type: 'text' },
  ],
};

export default function NodeProperties() {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadNodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAutomationWorkflows();
      const workflows = Array.isArray(data) ? data : [];
      const allNodes = [];
      workflows.forEach((wf) => {
        if (Array.isArray(wf.nodes)) {
          wf.nodes.forEach((node) => {
            allNodes.push({ ...node, workflowName: wf.name, workflowId: wf.id });
          });
        }
      });
      setNodes(allNodes);
    } catch (err) {
      setError(err.message || 'Failed to load nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  const handleFieldChange = (key, value) => {
    if (!selectedNode) return;
    const updated = { ...selectedNode, config: { ...selectedNode.config, [key]: value } };
    setSelectedNode(updated);
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleSaveNode = async () => {
    if (!selectedNode) return;
    setSaving(true);
    try {
      await createAutomationWorkflow({
        id: selectedNode.workflowId,
        nodes: nodes.filter((n) => n.workflowId === selectedNode.workflowId).map((n) => ({ id: n.id, config: n.config })),
        connections: [],
      });
      alert('Node configuration saved');
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getFieldsForType = (type) => NODE_TYPE_FIELDS[type] || NODE_TYPE_FIELDS.action;

  return (
    <AdminPage
      title="Node Properties"
      subtitle="Configure automation node parameters"
      loading={loading}
      error={error}
      onRetry={loadNodes}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Available Nodes</h3></div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            {nodes.length === 0 ? (
              <div className="emptyState">No nodes found. Create a workflow first.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Type</th>
                    <th>Workflow</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node) => (
                    <tr
                      key={node.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{node.label}</td>
                      <td className="textSecondary">{node.type}</td>
                      <td className="textSecondary">{node.workflowName}</td>
                      <td>
                        <button
                          className={`btn ${selectedNode?.id === node.id ? 'primary' : 'secondary'}`}
                          onClick={() => setSelectedNode(node)}
                        >
                          {selectedNode?.id === node.id ? 'Editing' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Configure Node</h3>
            {selectedNode && (
              <button className="btn primary" onClick={handleSaveNode} disabled={saving} style={{ marginLeft: 'auto' }}>
                {saving ? 'Saving...' : 'Save Config'}
              </button>
            )}
          </div>
          <div className="cardBody">
            {!selectedNode ? (
              <div className="emptyState">Select a node from the list to configure its properties.</div>
            ) : (
              <form className="form" onSubmit={(e) => { e.preventDefault(); handleSaveNode(); }}>
                <div className="formGroup">
                  <label className="label">Label</label>
                  <input
                    className="inputField"
                    value={selectedNode.label}
                    onChange={(e) => handleFieldChange('label', e.target.value)}
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Type</label>
                  <input className="inputField" value={selectedNode.type} disabled />
                </div>
                {getFieldsForType(selectedNode.type).map((field) => (
                  <div className="formGroup" key={field.key}>
                    <label className="label">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        className="select"
                        value={selectedNode.config?.[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="textarea"
                        value={selectedNode.config?.[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <input
                        className="inputField"
                        type={field.type}
                        value={selectedNode.config?.[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
