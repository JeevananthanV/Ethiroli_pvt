import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import { communicationApi } from '../../services/api/communicationApi'
import { providerApi } from '../../services/api/providerApi'
import { templateApi } from '../../services/api/templateApi'

export default function CommunicationCenter() {
  const [providers, setProviders] = useState([])
  const [templates, setTemplates] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [providersData, templatesData, logsData] = await Promise.all([
        providerApi.getAll(),
        templateApi.getAll(),
        communicationApi.getLogs(),
      ])
      setProviders(providersData)
      setTemplates(templatesData)
      setLogs(logsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPage
      title="Communication Center"
      subtitle="Manage communication providers, templates, and logs"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button variant="primary" onClick={() => setComposeOpen(true)}>
          Compose Message
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Providers</div>
          <div className="statValue">{providers.length}</div>
          <div className="textSecondary textSm mt2">
            {providers.filter((p) => p.status === 'active').length} active
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Templates</div>
          <div className="statValue">{templates.length}</div>
          <div className="textSecondary textSm mt2">
            {templates.filter((t) => t.isActive).length} active
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Recent Logs</div>
          <div className="statValue">{logs.length}</div>
          <div className="textSecondary textSm mt2">
            {logs.filter((l) => l.status === 'sent').length} sent today
          </div>
        </div>
      </div>

      <div className="card mb4">
        <div className="cardHeader">
          <h3 className="cardTitle">Provider Status</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No providers configured</span>
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.id}>
                    <td>{provider.name}</td>
                    <td>{provider.type}</td>
                    <td>
                      <span className={`statusTag ${provider.status === 'active' ? 'active' : 'pending'}`}>
                        {provider.status}
                      </span>
                    </td>
                    <td>{provider.lastSync ? new Date(provider.lastSync).toLocaleString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Recent Logs</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No logs available</span>
                  </td>
                </tr>
              ) : (
                logs.slice(0, 10).map((log) => (
                  <tr key={log.id}>
                    <td>{log.recipient}</td>
                    <td>{log.channel}</td>
                    <td>
                      <span className={`statusTag ${log.status === 'sent' ? 'active' : 'error'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>{new Date(log.sentAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={composeOpen} onClose={() => setComposeOpen(false)} title="Compose Message">
        <p className="textSecondary">Message composition form coming soon.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setComposeOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </AdminPage>
  )
}
