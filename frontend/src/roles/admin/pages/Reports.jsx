import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { integrationApi } from '../../../services/api/integrationApi'
import { systemApi } from '../../../services/api/systemApi'
import Button from '../../../common/components/Button'

export default function AdminReports() {
  const [integrations, setIntegrations] = useState([])
  const [systemHealth, setSystemHealth] = useState({ status: 'loading', uptime: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [integrationsData, healthData] = await Promise.all([
        integrationApi.getAll().catch(() => []),
        systemApi.getHealth().catch(() => ({ status: 'unknown', uptime: 0 })),
      ])
      setIntegrations(integrationsData)
      setSystemHealth(healthData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const exportReport = (type) => {
    alert(`Exporting ${type} report...`)
  }

  return (
    <AdminPage
      title="Reports"
      subtitle="Generate, schedule, and review platform reports"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={loadData}>
          Refresh
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Integrations</div>
          <div className="statValue">{integrations.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">System Status</div>
          <div className="statValue" style={{ color: systemHealth.status === 'ok' ? 'var(--admin-success)' : 'var(--admin-warning)' }}>
            {systemHealth.status?.toUpperCase() || 'UNKNOWN'}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Uptime</div>
          <div className="statValue">
            {Math.floor((systemHealth.uptime || 0) / 60)}m
          </div>
        </div>
      </div>

      <div className="card mb4">
        <div className="cardHeader">
          <h3 className="cardTitle">Available Reports</h3>
        </div>
        <div className="cardBody">
          <div className="grid gridCols2" style={{ gap: '12px' }}>
            <button className="btn secondary" style={{ justifyContent: 'flex-start' }} onClick={() => exportReport('Integration')}>
              Integration Health Report
            </button>
            <button className="btn secondary" style={{ justifyContent: 'flex-start' }} onClick={() => exportReport('System')}>
              System Health Report
            </button>
            <button className="btn secondary" style={{ justifyContent: 'flex-start' }} onClick={() => exportReport('Performance')}>
              Performance Report
            </button>
            <button className="btn secondary" style={{ justifyContent: 'flex-start' }} onClick={() => exportReport('Usage')}>
              Usage Analytics Report
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Recent Reports</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No reports generated yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}
