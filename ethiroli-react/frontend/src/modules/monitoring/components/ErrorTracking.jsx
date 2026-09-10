import React, { useState, useEffect, useCallback } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { monitoringApi } from '../../services/api/monitoringApi'

export default function ErrorTracking() {
  const [errors, setErrors] = useState([])
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedError, setSelectedError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [errorsData, trendsData] = await Promise.all([
        monitoringApi.getErrors(),
        monitoringApi.getTrends(),
      ])
      setErrors(errorsData)
      setTrends(trendsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error'
      case 'warning':
        return 'pending'
      default:
        return 'active'
    }
  }

  return (
    <AdminPage
      title="Error Tracking"
      subtitle="Monitor application errors and trends"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Errors</div>
          <div className="statValue textDanger">{errors.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Critical</div>
          <div className="statValue textDanger">
            {errors.filter((e) => e.severity === 'critical').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Trends</div>
          <div className="statValue">{trends.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Recent Errors</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Error</th>
                <th>Message</th>
                <th>Severity</th>
                <th>Occurrences</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {errors.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No errors found</span>
                  </td>
                </tr>
              ) : (
                errors.map((err) => (
                  <tr key={err.id}>
                    <td>{err.name || err.id}</td>
                    <td className="truncate" style={{ maxWidth: '300px' }}>
                      {err.message}
                    </td>
                    <td>
                      <span className={`statusTag ${getSeverityClass(err.severity)}`}>
                        {err.severity}
                      </span>
                    </td>
                    <td>{err.count || 1}</td>
                    <td>{new Date(err.lastSeen).toLocaleString()}</td>
                    <td>
                      <Button size="small" variant="secondary" onClick={() => setSelectedError(err)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedError} onClose={() => setSelectedError(null)} title="Error Details">
        {selectedError && (
          <div className="form">
            <div className="formGroup">
              <label className="label">Error ID</label>
              <Input value={selectedError.id} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Message</label>
              <Input value={selectedError.message || ''} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Stack Trace</label>
              <pre
                style={{
                  background: '#0f172a',
                  padding: '12px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                {selectedError.stack || 'No stack trace available'}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </AdminPage>
  )
}
