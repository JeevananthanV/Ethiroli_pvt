import React, { useState, useEffect, useRef } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { workflowApi } from '../../../services/api/workflowApi'

const NODE_TYPES = [
  { type: 'trigger', label: 'Trigger', color: '#6366f1' },
  { type: 'action', label: 'Action', color: '#22c55e' },
  { type: 'condition', label: 'Condition', color: '#f59e0b' },
  { type: 'delay', label: 'Delay', color: '#94a3b8' },
  { type: 'notification', label: 'Notification', color: '#3b82f6' },
]

export default function AutomationCanvas() {
  const [workflows, setWorkflows] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await workflowApi.getAll()
      setWorkflows(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkflowSelect = async (workflow) => {
    setSelectedWorkflow(workflow)
    setWorkflowName(workflow.name || '')
    try {
      const data = await workflowApi.getById(workflow.id)
      setNodes(data.nodes || [])
      setConnections(data.connections || [])
    } catch (err) {
      console.error('Failed to load workflow details', err)
    }
  }

  const handleSave = async () => {
    if (!selectedWorkflow) return
    try {
      await workflowApi.update(selectedWorkflow.id, {
        name: workflowName,
        nodes,
        connections,
      })
      setSaveModalOpen(false)
      loadWorkflows()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newNode = {
        id: `node_${Date.now()}`,
        type: 'action',
        x,
        y,
        label: 'New Action',
        config: {},
      }
      setNodes([...nodes, newNode])
    }
  }

  const handleNodeDrag = (nodeId, e) => {
    if (e.type === 'mousemove' && e.buttons === 1) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)))
    }
  }

  const handleDeleteNode = (nodeId) => {
    setNodes(nodes.filter((n) => n.id !== nodeId))
    setConnections(connections.filter((c) => c.from !== nodeId && c.to !== nodeId))
  }

  return (
    <AdminPage
      title="Automation Canvas"
      subtitle="Design and manage workflow automations"
      loading={loading}
      error={error}
      onRetry={loadWorkflows}
      actions={
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="select"
            value={selectedWorkflow?.id || ''}
            onChange={(e) => {
              const wf = workflows.find((w) => w.id === e.target.value)
              if (wf) handleWorkflowSelect(wf)
            }}
            style={{ width: '200px' }}
          >
            <option value="">Select Workflow</option>
            {workflows.map((wf) => (
              <option key={wf.id} value={wf.id}>
                {wf.name}
              </option>
            ))}
          </select>
          <Button onClick={() => setIsPaletteOpen(true)}>Add Node</Button>
          {selectedWorkflow && (
            <Button variant="primary" onClick={() => setSaveModalOpen(true)}>
              Save
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gridCols3" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Canvas</h3>
            <span className="textMuted textSm">{nodes.length} nodes, {connections.length} connections</span>
          </div>
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              flex: 1,
              position: 'relative',
              background: '#0f172a',
              overflow: 'hidden',
              cursor: 'crosshair',
              minHeight: '400px',
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
                const fromNode = nodes.find((n) => n.id === conn.from)
                const toNode = nodes.find((n) => n.id === conn.to)
                if (!fromNode || !toNode) return null
                return (
                  <line
                    key={idx}
                    x1={fromNode.x + 60}
                    y1={fromNode.y + 20}
                    x2={toNode.x + 60}
                    y2={toNode.y + 20}
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>
            {nodes.map((node) => {
              const nodeType = NODE_TYPES.find((t) => t.type === node.type) || NODE_TYPES[1]
              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeDrag(node.id, e)}
                  onMouseMove={(e) => handleNodeDrag(node.id, e)}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    background: nodeType.color,
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'move',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
                    userSelect: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    minWidth: '120px',
                  }}
                >
                  {node.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNode(node.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
            {nodes.length === 0 && (
              <div className="emptyState" style={{ position: 'absolute', inset: 0 }}>
                <p>Click on the canvas to add a node or select a workflow</p>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Properties</h3>
          </div>
          <div className="cardBody">
            {selectedWorkflow ? (
              <div className="form">
                <div className="formGroup">
                  <label className="label">Workflow Name</label>
                  <input
                    className="inputField"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Status</label>
                  <span className={`statusTag ${selectedWorkflow.status === 'active' ? 'active' : 'pending'}`}>
                    {selectedWorkflow.status}
                  </span>
                </div>
                <div className="formGroup">
                  <label className="label">Nodes</label>
                  <p className="textSecondary textSm">{nodes.length} configured</p>
                </div>
              </div>
            ) : (
              <p className="textMuted">Select a workflow to view properties</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} title="Add Node">
        <div className="form">
          {NODE_TYPES.map((nodeType) => (
            <button
              key={nodeType.type}
              className="btn secondary"
              style={{ justifyContent: 'flex-start', background: nodeType.color, color: '#fff' }}
              onClick={() => {
                const newNode = {
                  id: `node_${Date.now()}`,
                  type: nodeType.type,
                  x: 100 + Math.random() * 200,
                  y: 100 + Math.random() * 200,
                  label: nodeType.label,
                  config: {},
                }
                setNodes([...nodes, newNode])
                setIsPaletteOpen(false)
              }}
            >
              {nodeType.label}
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} title="Save Workflow">
        <div className="form">
          <div className="formGroup">
            <label className="label required">Workflow Name</label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name"
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
