import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { monitoringApi } from '../../../services/api/monitoringApi'
import Button from '../../../common/components/Button'

export default function AdminMonitoring() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await monitoringApi.getAll()
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return 'active'
      case 'degraded':
      case 'warning':
        return 'pending'
      case 'down':
      case 'error':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="System Monitoring"
      subtitle="Monitor service health and performance"
      loading={loading}
      error={error}
      onRetry={fetchServices}
      actions={
        <Button onClick={fetchServices}>
          Refresh
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Services</div>
          <div className="statValue">{services.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Healthy</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {services.filter((s) => s.status === 'healthy' || s.status === 'up').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Issues</div>
          <div className="statValue" style={{ color: 'var(--admin-danger)' }}>
            {services.filter((s) => s.status === 'down' || s.status === 'error').length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Service Health</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Uptime</th>
                <th>Latency</th>
                <th>Last Check</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="textCenter textMuted py4">
                    No services found
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="fontSemibold">{service.name}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(service.status)}`}>
                        {service.status}
                      </span>
                    </td>
                    <td>{service.uptime || 'N/A'}</td>
                    <td>{service.latency ? `${service.latency}ms` : 'N/A'}</td>
                    <td className="textSecondary">
                      {service.lastCheck ? new Date(service.lastCheck).toLocaleString() : '-'}
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
