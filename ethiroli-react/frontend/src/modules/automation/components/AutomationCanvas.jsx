import React, { useEffect, useState, useRef, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getAutomationWorkflows, createAutomationWorkflow } from '../../services/api/automationApi.js';
import { getWorkflows } from '../../services/api/workflowApi.js';

const NODE_TYPES = [
  { type: 'trigger', label: 'Trigger', color: '#a855f7' },
  { type: 'action', label: 'Action', color: '#3b82f6' },
  { type: 'condition', label: 'Condition', color: '#f59e0b' },
  { type: 'delay', label: 'Delay', color: '#10b981' },
  { type: 'notification', label: 'Notification', color: '#f43f5e' },
];

export default function AutomationCanvas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef(null);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const [autoRes, wfRes] = await Promise.all([
        getAutomationWorkflows().catch(() => []),
        getWorkflows().catch(() => []),
      ]);
      const workflows = [...(Array.isArray(autoRes) ? autoRes : []), ...(Array.isArray(wfRes) ? wfRes : [])];
      if (Array.isArray(workflows) && workflows.length > 0) {
        const latest = workflows[0];
        if (latest.nodes) setNodes(latest.nodes);
        if (latest.connections) setConnections(latest.connections);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const addNode = useCallback((type, x, y) => {
    const nodeType = NODE_TYPES.find((n) => n.type === type) || NODE_TYPES[0];
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      label: `${nodeType.label} ${nodes.length + 1}`,
      x,
      y,
      config: {},
    };
    setNodes((prev) => [...prev, newNode]);
  }, [nodes.length]);

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null);
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setSelectedNode(node);
    setDragging({
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    });
  };

  const handleNodeMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragging.id
          ? { ...n, x: dragging.nodeX + dx, y: dragging.nodeY + dy }
          : n
      )
    );
  };

  const handleNodeMouseUp = () => {
    setDragging(null);
  };

  const handleConnect = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    const exists = connections.some(
      (c) => c.source === sourceId && c.target === targetId
    );
    if (!exists) {
      setConnections((prev) => [...prev, { source: sourceId, target: targetId }]);
    }
  };

  const updateNodeConfig = (field, value) => {
    if (!selectedNode) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id ? { ...n, config: { ...n.config, [field]: value } } : n
      )
    );
    setSelectedNode((prev) => ({ ...prev, config: { ...prev.config, [field]: value } }));
  };

  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    if (!workflowName.trim()) {
      alert('Workflow name is required');
      return;
    }
    setSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes.map((n) => ({ id: n.id, type: n.type, label: n.label, x: n.x, y: n.y, config: n.config })),
        connections,
      };
      await createAutomationWorkflow(workflowData);
      setShowSaveModal(false);
      setWorkflowName('');
      setWorkflowDescription('');
      loadWorkflows();
    } catch (err) {
      alert(`Failed to save workflow: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
  };

  return (
    <AdminPage
      title="Automation Canvas"
      subtitle="Visual drag-and-drop workflow designer"
      loading={loading}
      error={error}
      onRetry={loadWorkflows}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={clearCanvas}>Clear Canvas</button>
          <button className="btn primary" onClick={() => setShowSaveModal(true)}>Save Workflow</button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, minHeight: 600 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Node Palette</h3></div>
          <div className="cardBody">
            <div style={{ display: 'grid', gap: 8 }}>
              {NODE_TYPES.map((nodeType) => (
                <div
                  key={nodeType.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('nodeType', nodeType.type);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: `${nodeType.color}20`,
                    border: `1px solid ${nodeType.color}40`,
                    color: nodeType.color,
                    cursor: 'grab',
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {nodeType.label}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--admin-text-muted)' }}>
              Drag nodes onto the canvas. Click a node to select, then drag to move. Shift-click another node to connect.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleNodeMouseMove}
            onMouseUp={handleNodeMouseUp}
            onMouseLeave={handleNodeMouseUp}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const nodeType = e.dataTransfer.getData('nodeType');
              if (nodeType && canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                addNode(nodeType, e.clientX - rect.left, e.clientY - rect.top);
              }
            }}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 600,
              background: 'var(--admin-bg-dark)',
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              cursor: dragging ? 'grabbing' : 'default',
            }}
          >
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {connections.map((conn, idx) => {
                const source = nodes.find((n) => n.id === conn.source);
                const target = nodes.find((n) => n.id === conn.target);
                if (!source || !target) return null;
                return (
                  <line
                    key={idx}
                    x1={source.x + 80}
                    y1={source.y + 24}
                    x2={target.x + 80}
                    y2={target.y + 24}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                </marker>
              </defs>
            </svg>

            {nodes.map((node) => {
              const nodeType = NODE_TYPES.find((n) => n.type === node.type) || NODE_TYPES[0];
              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  onMouseUp={(e) => {
                    if (e.shiftKey && selectedNode && selectedNode.id !== node.id) {
                      handleConnect(selectedNode.id, node.id);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    width: 160,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: `${nodeType.color}20`,
                    border: `1px solid ${selectedNode?.id === node.id ? nodeType.color : `${nodeType.color}40`}`,
                    color: nodeType.color,
                    cursor: dragging?.id === node.id ? 'grabbing' : 'grab',
                    fontWeight: 500,
                    fontSize: 13,
                    userSelect: 'none',
                    boxShadow: selectedNode?.id === node.id ? `0 0 0 2px ${nodeType.color}40` : 'none',
                  }}
                >
                  {node.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="cardHeader"><h3 className="cardTitle">Node Properties</h3></div>
          <div className="cardBody">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div className="formGroup">
                <label className="label">Label</label>
                <input
                  className="inputField"
                  value={selectedNode.label}
                  onChange={(e) => updateNodeConfig('label', e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <input className="inputField" value={selectedNode.type} disabled />
              </div>
              <div className="formGroup">
                <label className="label">Position X</label>
                <input
                  className="inputField"
                  type="number"
                  value={Math.round(selectedNode.x)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setNodes((prev) => prev.map((n) => n.id === selectedNode.id ? { ...n, x: val } : n));
                    setSelectedNode((prev) => ({ ...prev, x: val }));
                  }}
                />
              </div>
              <div className="formGroup">
                <label className="label">Position Y</label>
                <input
                  className="inputField"
                  type="number"
                  value={Math.round(selectedNode.y)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setNodes((prev) => prev.map((n) => n.id === selectedNode.id ? { ...n, y: val } : n));
                    setSelectedNode((prev) => ({ ...prev, y: val }));
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">Config (JSON)</label>
              <textarea
                className="textarea"
                value={JSON.stringify(selectedNode.config || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateNodeConfig('_json', parsed);
                  } catch {
                    // ignore invalid JSON while typing
                  }
                }}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modalOverlay" onClick={() => setShowSaveModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Save Workflow</h3>
              <button className="closeBtn" onClick={() => setShowSaveModal(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <form onSubmit={handleSaveWorkflow}>
                <div className="formGroup">
                  <label className="label required">Workflow Name</label>
                  <input
                    className="inputField"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Description</label>
                  <textarea
                    className="textarea"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 12 }}>
                  Nodes: {nodes.length} | Connections: {connections.length}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button type="button" className="btn secondary" onClick={() => setShowSaveModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary" disabled={saving || nodes.length === 0}>
                    {saving ? 'Saving...' : 'Save Workflow'}
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
