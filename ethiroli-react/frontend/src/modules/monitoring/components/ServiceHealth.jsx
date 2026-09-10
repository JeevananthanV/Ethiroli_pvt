import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import { systemApi } from '../../services/api/systemApi'

export default function ServiceHealth() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHealth()
  }, [])

  const loadHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await systemApi.getHealth()
      setServices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'healthy':
        return 'active'
      case 'degraded':
        return 'pending'
      case 'down':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Service Health"
      subtitle="Monitor individual service health and metrics"
      loading={loading}
      error={error}
      onRetry={loadHealth}
      actions={
        <Button variant="secondary" onClick={loadHealth}>
          Refresh
        </Button>
      }
    >
      <div className="grid gridCols3">
        {services.length === 0 ? (
          <div className="emptyState" style={{ gridColumn: '1 / -1' }}>
            <p className="textMuted">No services found</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="card">
              <div className="cardHeader">
                <h3 className="cardTitle">{service.name}</h3>
                <span className={`statusTag ${getStatusClass(service.status)}`}>
                  {service.status}
                </span>
              </div>
              <div className="cardBody">
                <div className="form">
                  <div className="formGroup">
                    <label className="label">Uptime</label>
                    <span className="textSecondary textSm">{service.uptime || '-'}</span>
                  </div>
                  <div className="formGroup">
                    <label className="label">Response Time</label>
                    <span className="textSecondary textSm">{service.responseTime ? `${service.responseTime}ms` : '-'}</span>
                  </div>
                  <div className="formGroup">
                    <label className="label">Last Check</label>
                    <span className="textSecondary textSm">
                      {service.lastCheck ? new Date(service.lastCheck).toLocaleString() : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  )
}
