import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { workflowApi } from '../../../services/api/workflowApi'
import Button from '../../../common/components/Button'

export default function PMApprovals() {
  const [workflows, setWorkflows] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const handleApprove = async (runId) => {
    try {
      await workflowApi.approve(runId)
      if (selectedWorkflow) {
        const data = await workflowApi.getRuns(selectedWorkflow.id)
        setRuns(data)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (runId) => {
    try {
      await workflowApi.reject(runId)
      if (selectedWorkflow) {
        const data = await workflowApi.getRuns(selectedWorkflow.id)
        setRuns(data)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Approvals"
      subtitle="Review team-specific approval requests"
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
          <Button onClick={() => { }} disabled={!selectedWorkflow}>
            Run
          </Button>
        </div>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Pending</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {runs.filter((r) => r.status === 'pending').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Approved</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {runs.filter((r) => r.status === 'approved').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Rejected</div>
          <div className="statValue" style={{ color: 'var(--admin-danger)' }}>
            {runs.filter((r) => r.status === 'rejected').length}
          </div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Type</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No approval requests
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.id}>
                  <td className="fontSemibold">{run.name || run.id}</td>
                  <td>{run.type || 'Approval'}</td>
                  <td className="textSecondary">
                    {run.createdAt ? new Date(run.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    <span className={`statusTag ${run.status === 'approved' ? 'active' : run.status === 'rejected' ? 'error' : 'pending'}`}>
                      {run.status}
                    </span>
                  </td>
                  <td>
                    {run.status === 'pending' && (
                      <div className="flex gap2">
                        <Button size="small" variant="success" onClick={() => handleApprove(run.id)}>
                          Approve
                        </Button>
                        <Button size="small" variant="danger" onClick={() => handleReject(run.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
