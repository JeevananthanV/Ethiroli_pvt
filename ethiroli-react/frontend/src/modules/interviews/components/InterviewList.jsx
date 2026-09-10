import React, { useState, useEffect, useCallback } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import { interviewApi } from '../../services/api/interviewApi'

export default function InterviewList() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const loadInterviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await interviewApi.getAll()
      const filtered = statusFilter ? data.filter((i) => i.status === statusFilter) : data
      setInterviews(filtered)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    loadInterviews()
  }, [loadInterviews])

  const handleStatusUpdate = async (id, status) => {
    try {
      await interviewApi.updateStatus(id, status)
      setInterviews(interviews.map((i) => (i.id === id ? { ...i, status } : i)))
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'pending'
      case 'completed':
        return 'active'
      case 'cancelled':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Interviews"
      subtitle="Manage scheduled interviews"
      loading={loading}
      error={error}
      onRetry={loadInterviews}
      actions={
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Interviewer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No interviews found</span>
                  </td>
                </tr>
              ) : (
                interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>{interview.candidateName || interview.candidateId}</td>
                    <td>{interview.interviewer}</td>
                    <td>{interview.date ? new Date(interview.date).toLocaleDateString() : '-'}</td>
                    <td>{interview.time || '-'}</td>
                    <td>{interview.type}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td>
                      {interview.status === 'scheduled' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="small" variant="success" onClick={() => handleStatusUpdate(interview.id, 'completed')}>
                            Complete
                          </Button>
                          <Button size="small" variant="danger" onClick={() => handleStatusUpdate(interview.id, 'cancelled')}>
                            Cancel
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
      </div>
    </AdminPage>
  )
}
