import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { communicationApi } from '../../../services/api/communicationApi'
import { providerApi } from '../../../services/api/providerApi'
import { templateApi } from '../../../services/api/templateApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function TutorCommunications() {
  const [providers, setProviders] = useState([])
  const [templates, setTemplates] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)

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

  useEffect(() => {
    loadData()
  }, [])

  return (
    <AdminPage
      title="Communication Hub"
      subtitle="Communicate with your students and manage templates"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={() => setComposeOpen(true)}>
          Compose Message
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Channels</div>
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
          <div className="statLabel">Messages Sent</div>
          <div className="statValue">{logs.length}</div>
        </div>
      </div>

      <div className="card mb4">
        <div className="cardHeader">
          <h3 className="cardTitle">Recent Messages</h3>
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
                  <td colSpan="4" className="textCenter textMuted py4">
                    No messages sent yet
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

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Templates</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="3" className="textCenter textMuted py4">
                    No templates available
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id}>
                    <td className="fontSemibold">{template.name}</td>
                    <td>{template.type}</td>
                    <td>
                      <span className={`statusTag ${template.isActive ? 'active' : 'pending'}`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
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
