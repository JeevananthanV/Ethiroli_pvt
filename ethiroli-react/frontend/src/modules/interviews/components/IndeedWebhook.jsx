import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { webhookApi } from '../../services/api/webhookApi'
import { integrationApi } from '../../services/api/integrationApi'

export default function IndeedWebhook() {
  const [webhooks, setWebhooks] = useState([])
  const [integrations, setIntegrations] = useState([])
  const [selectedWebhook, setSelectedWebhook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', method: 'POST', events: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [webhooksData, integrationsData] = await Promise.all([
        webhookApi.getAll(),
        integrationApi.getAll(),
      ])
      setWebhooks(webhooksData)
      setIntegrations(integrationsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedWebhook(null)
    setForm({ name: '', url: '', method: 'POST', events: '' })
    setModalOpen(true)
  }

  const handleEdit = (webhook) => {
    setSelectedWebhook(webhook)
    setForm({
      name: webhook.name || '',
      url: webhook.url || '',
      method: webhook.method || 'POST',
      events: webhook.events?.join(', ') || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        events: form.events.split(',').map((e) => e.trim()).filter(Boolean),
      }
      if (selectedWebhook) {
        await webhookApi.update(selectedWebhook.id, payload)
        setWebhooks(webhooks.map((w) => (w.id === selectedWebhook.id ? { ...w, ...payload } : w)))
      } else {
        const data = await webhookApi.create(payload)
        setWebhooks([...webhooks, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleTest = async (webhook) => {
    setTesting(true)
    setTestResult(null)
    try {
      const result = await webhookApi.test(webhook.id)
      setTestResult(result)
    } catch (err) {
      setTestResult({ success: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <AdminPage
      title="Indeed Webhook"
      subtitle="Configure Indeed integration webhooks"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Add Webhook
        </Button>
      }
    >
      <div className="card mb4">
        <div className="cardHeader">
          <h3 className="cardTitle">Indeed Integration Status</h3>
        </div>
        <div className="cardBody">
          {integrations.length === 0 ? (
            <p className="textMuted">No integrations configured</p>
          ) : (
            <div className="grid gridCols2">
              {integrations.map((integration) => (
                <div key={integration.id} className="statCard">
                  <div className="statLabel">{integration.name}</div>
                  <span className={`statusTag ${integration.status === 'active' ? 'active' : 'pending'}`}>
                    {integration.status}
                  </span>
                  <p className="textSecondary textSm mt2">{integration.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Webhooks</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No webhooks configured</span>
                  </td>
                </tr>
              ) : (
                webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td>{webhook.name}</td>
                    <td className="truncate" style={{ maxWidth: '200px' }}>
                      {webhook.url}
                    </td>
                    <td>{webhook.method}</td>
                    <td>
                      <span className={`statusTag ${webhook.status === 'active' ? 'active' : 'pending'}`}>
                        {webhook.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(webhook)}>
                          Edit
                        </Button>
                        <Button size="small" variant="primary" onClick={() => handleTest(webhook)} disabled={testing}>
                          Test
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {testResult && (
        <div className="card mt4">
          <div className="cardHeader">
            <h3 className="cardTitle">Test Result</h3>
          </div>
          <div className="cardBody">
            <pre
              style={{
                background: '#0f172a',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedWebhook ? 'Edit Webhook' : 'Add Webhook'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Webhook name" />
          </div>
          <div className="formGroup">
            <label className="label required">URL</label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://example.com/webhook" />
          </div>
          <div className="formGroup">
            <label className="label">Method</label>
            <select className="select" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Events (comma-separated)</label>
            <Input value={form.events} onChange={(e) => setForm({ ...form, events: e.target.value })} placeholder="job.created, candidate.updated" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {selectedWebhook ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
