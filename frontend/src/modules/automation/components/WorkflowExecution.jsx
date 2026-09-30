import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import { workflowApi as wfApi } from '../../services/api/workflowApi'
import { automationApi } from '../../services/api/automationApi'

export default function WorkflowExecution() {
  const [workflows, setWorkflows] = useState([])
  const [runs, setRuns] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await wfApi.getAll()
      setWorkflows(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkflowChange = async (workflowId) => {
    const wf = workflows.find((w) => w.id === workflowId)
    setSelectedWorkflow(wf)
    try {
      const data = await wfApi.getRuns(workflowId)
      setRuns(data)
    } catch (err) {
      console.error('Failed to load runs', err)
    }
  }

  const handleRun = async () => {
    if (!selectedWorkflow) return
    setRunning(true)
    try {
      await wfApi.run(selectedWorkflow.id)
      const data = await wfApi.getRuns(selectedWorkflow.id)
      setRuns(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  const handleRetry = async (runId) => {
    try {
      await automationApi.execute(runId)
      if (selectedWorkflow) {
        const data = await wfApi.getRuns(selectedWorkflow.id)
        setRuns(data)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Workflow Execution"
      subtitle="Monitor workflow runs and execution status"
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
          <Button variant="primary" onClick={handleRun} disabled={running || !selectedWorkflow}>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {runs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                      <span className="textMuted">No runs yet</span>
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
                      <td>
                        {run.status === 'failed' && (
                          <Button size="small" variant="secondary" onClick={() => handleRetry(run.id)}>
                            Retry
                          </Button>
                        )}
                      </td>
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
