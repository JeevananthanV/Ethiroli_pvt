import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { integrationApi } from '../../../services/api/integrationApi'
import Button from '../../../common/components/Button'

function IntegrationCard({ integration, onRefresh }) {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await integrationApi.testConnection(integration.id)
        setHealth(data)
      } catch (error) {
        setHealth({ status: 'error', message: error.message })
      }
    }
    fetchHealth()
  }, [integration.id])

  const handleTest = async () => {
    setLoading(true)
    try {
      const data = await integrationApi.testConnection(integration.id)
      setHealth(data)
    } catch (error) {
      setHealth({ status: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = () => {
    if (!health) return 'pending'
    return health.status === 'connected' || health.status === 'success' ? 'active' : 'error'
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <h3 className="cardTitle">{integration.name}</h3>
          <span className={`statusTag ${getStatusClass()} mt2`}>
            {health?.status || 'pending'}
          </span>
        </div>
      </div>
      <div className="cardBody">
        <p className="textSecondary textSm">{integration.description || 'No description'}</p>
        {health?.message && (
          <p className={`textSm mt2 ${health.status === 'error' ? 'textDanger' : 'textSuccess'}`}>
            {health.message}
          </p>
        )}
        <div className="flex gap3 mt4">
          <button className="btn primary small" onClick={handleTest} disabled={loading}>
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          <button className="btn secondary small" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchIntegrations = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await integrationApi.getAll()
      setIntegrations(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntegrations()
  }, [])

  return (
    <AdminPage
      title="Integrations"
      subtitle="Manage third-party service integrations"
      loading={loading}
      error={error}
      onRetry={fetchIntegrations}
      actions={
        <Button onClick={fetchIntegrations}>
          Refresh
        </Button>
      }
    >
      <div className="grid gridCols3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} onRefresh={fetchIntegrations} />
        ))}
      </div>
      {integrations.length === 0 && (
        <div className="emptyState">
          <h3>No integrations configured</h3>
          <p>Add a new integration to get started.</p>
        </div>
      )}
    </AdminPage>
  )
}
