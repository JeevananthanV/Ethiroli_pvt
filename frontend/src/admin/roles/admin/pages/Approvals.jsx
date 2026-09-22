import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { workflowApi } from '../../../services/api/workflowApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function AdminApprovals() {
  const [workflows, setWorkflows] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)

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

  useEffect(() => {
    loadWorkflows()
  }, [])

  const handleWorkflowChange = async (workflowId) => {
    const wf = workflows.find((w) => w.id === workflowId)
    setSelectedWorkflow(wf)
    try {
      const data = await workflowApi.getRuns(workflowId)
      setRuns(data)
    } catch (err) {
      console.error('Failed to load runs', err)
    }
  }

  const handleRun = async () => {
    if (!selectedWorkflow) return
    setRunning(true)
    try {
      await workflowApi.run(selectedWorkflow.id)
      const data = await workflowApi.getRuns(selectedWorkflow.id)
      setRuns(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <AdminPage
      title="Approvals"
      subtitle="Review and manage approval workflows"
      loading={loading}
      error={error}
      onRetry={loadWorkflows}
      actions={
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="select"
            value={selectedWorkflow?.id || ''}
            onChange={(e) => handleWorkflowChange(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">Select Workflow</option>
            {workflows.map((wf) => (
              <option key={wf.id} value={wf.id}>
                {wf.name}
              </option>
            ))}
          </select>
          <Button onClick={handleRun} disabled={running || !selectedWorkflow}>
            {running ? 'Running...' : 'Run Now'}
          </Button>
        </div>
      }
    >
      {selectedWorkflow ? (
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Run History</h3>
            <span className="textMuted textSm">{runs.length} runs</span>
          </div>
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Status</th>
                  <th>Started At</th>
                  <th>Completed At</th>
                </tr>
              </thead>
              <tbody>
                {runs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="textCenter textMuted py4">
                      No runs yet
                    </td>
                  </tr>
                ) : (
                  runs.map((run) => (
                    <tr key={run.id}>
                      <td>{run.id}</td>
                      <td>
                        <span className={`statusTag ${run.status === 'completed' ? 'active' : run.status === 'failed' ? 'error' : 'pending'}`}>
                          {run.status}
                        </span>
                      </td>
                      <td>{new Date(run.startedAt).toLocaleString()}</td>
                      <td>{run.completedAt ? new Date(run.completedAt).toLocaleString() : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="emptyState">
          <p className="textMuted">Select a workflow to view execution history</p>
        </div>
      )}
    </AdminPage>
  )
}
