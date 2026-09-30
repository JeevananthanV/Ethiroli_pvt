import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { workflowApi } from '../../../services/api/workflowApi'
import Button from '../../../common/components/Button'

export default function EmployeeApprovals() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadWorkflows = async () => {
    setLoading(true)
    setError(null)
    try {
      await workflowApi.getAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const handleApprove = async (runId) => {
    try {
      await workflowApi.approve(runId)
      setRuns((prev) => [...prev, { id: runId, status: 'approved' }])
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (runId) => {
    try {
      await workflowApi.reject(runId)
      setRuns((prev) => [...prev, { id: runId, status: 'rejected' }])
    } catch (err) {
      setError(err.message)
    }
  }

  const pendingRuns = runs.filter((r) => r.status === 'pending')

  return (
    <AdminPage
      title="My Approvals"
      subtitle="Review and act on pending approval requests"
      loading={loading}
      error={error}
      onRetry={loadWorkflows}
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Pending</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {pendingRuns.length}
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

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Pending Approvals</h3>
        </div>
        <div className="overflowAuto">
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
              {pendingRuns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="textCenter textMuted py4">
                    No pending approvals
                  </td>
                </tr>
              ) : (
                pendingRuns.map((run) => (
                  <tr key={run.id}>
                    <td className="fontSemibold">{run.name || run.id}</td>
                    <td>{run.type || 'Approval'}</td>
                    <td className="textSecondary">
                      {run.createdAt ? new Date(run.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <span className="statusTag pending">{run.status}</span>
                    </td>
                    <td>
                      <div className="flex gap2">
                        <Button size="small" variant="success" onClick={() => handleApprove(run.id)}>
                          Approve
                        </Button>
                        <Button size="small" variant="danger" onClick={() => handleReject(run.id)}>
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}
