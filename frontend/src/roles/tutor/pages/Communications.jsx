import React, { useEffect, useState } from 'react';
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
  const [compose, setCompose] = useState({ channel: 'EMAIL', recipient: '', subject: '', content: '', template_id: '' })
  const [sending, setSending] = useState(false)
  const [composeError, setComposeError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [providersData, templatesData, logsData] = await Promise.all([
        providerApi.getAll(),
        templateApi.getAll(),
        communicationApi.getLogs(),
      ])
      setProviders(Array.isArray(providersData) ? providersData : (providersData?.data || []))
      setTemplates(Array.isArray(templatesData) ? templatesData : (templatesData?.data || []))
      setLogs(Array.isArray(logsData) ? logsData : (logsData?.data || []))
    } catch (err) {
      setError(err.message || 'Failed to load communications data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!compose.recipient.trim() || !compose.content.trim()) return
    setSending(true)
    setComposeError(null)
    try {
      await communicationApi.send({
        channel: compose.channel,
        recipient: compose.recipient.trim(),
        subject: compose.subject.trim() || undefined,
        content: compose.content,
        template_id: compose.template_id || undefined,
      })
      setComposeOpen(false)
      setCompose({ channel: 'EMAIL', recipient: '', subject: '', content: '', template_id: '' })
      loadData()
    } catch (err) {
      setComposeError(err.response?.data?.message || err.message || 'Could not send the message.')
    } finally {
      setSending(false)
    }
  }

  const enabledProviders = providers.filter((p) => p.is_enabled === true || p.is_enabled === 1).length
  const providerChannels = new Set(providers.map((p) => p.provider)).size
  const sentCount = logs.filter((l) => ['SENT', 'DELIVERED', 'READ'].includes(String(l.status || '').toUpperCase())).length

  const logStatusClass = (status) => {
    const s = String(status || '').toUpperCase()
    if (['SENT', 'DELIVERED', 'READ'].includes(s)) return 'active'
    if (s === 'FAILED') return 'error'
    return 'pending'
  }

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
          <div className="statValue">{providerChannels}</div>
          <div className="textSecondary textSm mt2">
            {enabledProviders} of {providers.length} settings enabled
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Templates</div>
          <div className="statValue">{templates.length}</div>
          <div className="textSecondary textSm mt2">
            {templates.filter((t) => String(t.channel || '').toUpperCase() === 'EMAIL').length} email ·{' '}
            {templates.filter((t) => String(t.channel || '').toUpperCase() !== 'EMAIL').length} messaging
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Messages Sent</div>
          <div className="statValue">{sentCount}</div>
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
                      <span className={`statusTag ${logStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        const at = log.sent_at || log.delivered_at || log.created_at
                        return at ? new Date(at).toLocaleString() : '—'
                      })()}
                    </td>
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
                <th>Channel</th>
                <th>Subject</th>
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
                    <td>{template.channel}</td>
                    <td>{template.subject || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={composeOpen} onClose={() => setComposeOpen(false)} title="Compose Message">
        <form onSubmit={handleSend}>
          <div style={{ display: 'grid', gap: 12 }}>
            <label style={{ display: 'block', fontSize: 13 }}>
              Channel
              <select
                value={compose.channel}
                onChange={(e) => setCompose({ ...compose, channel: e.target.value })}
                style={{ width: '100%', marginTop: 4, padding: '8px 10px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'inherit', border: '1px solid var(--admin-border-subtle)' }}
              >
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
            </label>

            <label style={{ display: 'block', fontSize: 13 }}>
              Template <span style={{ opacity: 0.6 }}>(optional)</span>
              <select
                value={compose.template_id}
                onChange={(e) => {
                  const chosen = templates.find((t) => t.id === e.target.value)
                  setCompose((prev) => ({
                    ...prev,
                    template_id: e.target.value,
                    subject: chosen?.subject || prev.subject,
                    content: chosen?.body || prev.content,
                  }))
                }}
                style={{ width: '100%', marginTop: 4, padding: '8px 10px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'inherit', border: '1px solid var(--admin-border-subtle)' }}
              >
                <option value="">No template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', fontSize: 13 }}>
              Recipient
              <input
                type="text"
                required
                value={compose.recipient}
                onChange={(e) => setCompose({ ...compose, recipient: e.target.value })}
                placeholder="student@example.com or +91..."
                style={{ width: '100%', marginTop: 4, padding: '8px 10px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'inherit', border: '1px solid var(--admin-border-subtle)' }}
              />
            </label>

            <label style={{ display: 'block', fontSize: 13 }}>
              Subject <span style={{ opacity: 0.6 }}>(optional)</span>
              <input
                type="text"
                value={compose.subject}
                onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                style={{ width: '100%', marginTop: 4, padding: '8px 10px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'inherit', border: '1px solid var(--admin-border-subtle)' }}
              />
            </label>

            <label style={{ display: 'block', fontSize: 13 }}>
              Message
              <textarea
                rows={5}
                required
                value={compose.content}
                onChange={(e) => setCompose({ ...compose, content: e.target.value })}
                placeholder="Write the message you want to send..."
                style={{ width: '100%', marginTop: 4, padding: '8px 10px', borderRadius: 6, background: 'var(--admin-card-bg)', color: 'inherit', border: '1px solid var(--admin-border-subtle)', resize: 'vertical' }}
              />
            </label>

            {composeError && (
              <p style={{ margin: 0, fontSize: 13, color: '#ff5252' }}>{composeError}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button type="button" variant="secondary" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
