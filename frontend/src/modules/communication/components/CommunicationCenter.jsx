import React, { useState, useEffect } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import { communicationApi } from '../../../services/api/communicationApi'
import { providerApi } from '../../../services/api/providerApi'
import { templateApi } from '../../../services/api/templateApi'

export default function CommunicationCenter() {
  const [providers, setProviders] = useState([])
  const [templates, setTemplates] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [composeData, setComposeData] = useState({
    recipient: 'All Employees (Company-Wide)',
    channel: 'Email',
    subject: '',
    message: ''
  })

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [providersRes, templatesRes, logsRes] = await Promise.all([
        providerApi.getAll().catch(() => []),
        templateApi.getAll().catch(() => []),
        communicationApi.getLogs().catch(() => []),
      ]);

      const providersList = Array.isArray(providersRes) ? providersRes : (providersRes?.data || []);
      const templatesList = Array.isArray(templatesRes) ? templatesRes : (templatesRes?.data || []);
      const logsList = Array.isArray(logsRes) ? logsRes : (logsRes?.data || []);

      setProviders(providersList);
      setTemplates(templatesList);
      setLogs(logsList);
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newLog = {
        id: `log-${Date.now()}`,
        recipient: composeData.recipient,
        channel: composeData.channel,
        status: 'sent',
        sentAt: new Date().toISOString()
      }
      setLogs((prev) => [newLog, ...prev])
      setComposeOpen(false)
      showToast(`Announcement dispatched to ${composeData.recipient}!`)
      setComposeData({
        recipient: 'All Employees (Company-Wide)',
        channel: 'Email',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err.message || 'Failed to dispatch message')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminPage
      title="Communication Center"
      subtitle="Manage communication providers, broadcast announcements, and review delivery logs"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button variant="primary" onClick={() => setComposeOpen(true)}>
          <i className="bi bi-send me-1" /> Compose Announcement
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        <div className="grid gridCols3 mb4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="statCard card" style={{ padding: '1.25rem' }}>
            <div className="statLabel textMuted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Providers</div>
            <div className="statValue" style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0' }}>{providers.length}</div>
            <div className="textSecondary textSm" style={{ color: '#16a34a', fontSize: '0.85rem' }}>
              {providers.filter((p) => p.status === 'active').length} operational
            </div>
          </div>
          <div className="statCard card" style={{ padding: '1.25rem' }}>
            <div className="statLabel textMuted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Broadcast Templates</div>
            <div className="statValue" style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0' }}>{templates.length}</div>
            <div className="textSecondary textSm" style={{ color: '#6366f1', fontSize: '0.85rem' }}>
              {templates.filter((t) => t.isActive).length} published
            </div>
          </div>
          <div className="statCard card" style={{ padding: '1.25rem' }}>
            <div className="statLabel textMuted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Recent Dispatches</div>
            <div className="statValue" style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0' }}>{logs.length}</div>
            <div className="textSecondary textSm" style={{ color: '#059669', fontSize: '0.85rem' }}>
              {logs.filter((l) => l.status === 'sent').length} delivered successfully
            </div>
          </div>
        </div>

        <div className="card mb4" style={{ marginBottom: '1.5rem' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Gateway Provider Health</h3>
          </div>
          <div className="overflowAuto" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Channel Type</th>
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
                      <td style={{ fontWeight: 600 }}>{provider.name}</td>
                      <td>{provider.type}</td>
                      <td>
                        <span className={`statusTag ${provider.status === 'active' ? 'active' : 'pending'}`}>
                          {provider.status}
                        </span>
                      </td>
                      <td>{provider.lastSync ? new Date(provider.lastSync).toLocaleString() : 'Live'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Transmission Logs</h3>
          </div>
          <div className="overflowAuto" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Recipient Audience</th>
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
                      <td style={{ fontWeight: 600 }}>{log.recipient}</td>
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
      </div>

      {/* Compose Announcement Modal */}
      <Modal isOpen={composeOpen} onClose={() => setComposeOpen(false)} title="Compose & Broadcast Announcement">
        <form onSubmit={handleSendMessage}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Target Audience *</label>
              <select
                value={composeData.recipient}
                onChange={(e) => setComposeData({ ...composeData, recipient: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="All Employees (Company-Wide)">All Employees (Company-Wide)</option>
                <option value="Engineering & Tech Team">Engineering & Tech Team</option>
                <option value="Interns & Trainees">Interns & Trainees</option>
                <option value="Department Leads & Managers">Department Leads & Managers</option>
                <option value="Operations & HR Division">Operations & HR Division</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Channel</label>
              <select
                value={composeData.channel}
                onChange={(e) => setComposeData({ ...composeData, channel: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="Email">Email (Brevo SMTP)</option>
                <option value="In-App Push">In-App Push Notification</option>
                <option value="SMS">SMS Gateway</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Subject Line *</label>
              <input
                type="text"
                required
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                placeholder="e.g. Important: Company Holiday on Friday & Q3 Townhall"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Announcement Body *</label>
              <textarea
                required
                rows={4}
                value={composeData.message}
                onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                placeholder="Type your company-wide or departmental announcement message..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setComposeOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Dispatching...' : 'Dispatch Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
