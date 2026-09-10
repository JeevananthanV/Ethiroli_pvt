import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { webhookApi } from '../../services/api/webhookApi'

export default function WebhookTester() {
  const [webhooks, setWebhooks] = useState([])
  const [selectedWebhook, setSelectedWebhook] = useState(null)
  const [payload, setPayload] = useState('{\n  "test": true\n}')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadWebhooks()
  }, [])

  const loadWebhooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await webhookApi.getAll()
      setWebhooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!selectedWebhook) return
    setTesting(true)
    setResponse(null)
    try {
      let parsedPayload
      try {
        parsedPayload = JSON.parse(payload)
      } catch {
        parsedPayload = { raw: payload }
      }
      const result = await webhookApi.test(selectedWebhook.id, parsedPayload)
      setResponse(result)
    } catch (err) {
      setResponse({ success: false, error: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <AdminPage
      title="Webhook Tester"
      subtitle="Test webhook endpoints with custom payloads"
      loading={loading}
      error={error}
      onRetry={loadWebhooks}
    >
      <div className="grid gridCols2">
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Configuration</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label required">Webhook</label>
                <select
                  className="select"
                  value={selectedWebhook?.id || ''}
                  onChange={(e) => {
                    const wh = webhooks.find((w) => w.id === e.target.value)
                    setSelectedWebhook(wh)
                    setResponse(null)
                  }}
                >
                  <option value="">Select Webhook</option>
                  {webhooks.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedWebhook && (
                <>
                  <div className="formGroup">
                    <label className="label">URL</label>
                    <Input value={selectedWebhook.url} disabled />
                  </div>
                  <div className="formGroup">
                    <label className="label">Method</label>
                    <Input value={selectedWebhook.method || 'POST'} disabled />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Payload</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label">JSON Payload</label>
                <textarea
                  className="inputField"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={10}
                  style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>
              <Button variant="primary" onClick={handleTest} disabled={testing || !selectedWebhook}>
                {testing ? 'Sending...' : 'Send Test'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {response && (
        <div className="card mt4">
          <div className="cardHeader">
            <h3 className="cardTitle">Response</h3>
            <span className={`statusTag ${response.success ? 'active' : 'error'}`}>
              {response.success ? 'Success' : 'Failed'}
            </span>
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
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </AdminPage>
  )
}
