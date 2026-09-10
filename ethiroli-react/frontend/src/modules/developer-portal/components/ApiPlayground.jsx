import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx'
import Button from '../../common/components/Button/Button.jsx'
import Input from '../../common/components/Input/Input.jsx'
import { apiKeyApi } from '../../services/api/apiKeyApi.js'

export default function ApiPlayground() {
  const [apiKeys, setApiKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState(null)
  const [method, setMethod] = useState('GET')
  const [endpoint, setEndpoint] = useState('')
  const [requestBody, setRequestBody] = useState('{\n  \n}')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadKeys()
  }, [])

  const loadKeys = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiKeyApi.getAll()
      setApiKeys(Array.isArray(data) ? data.filter((k) => !k.revoked) : [])
    } catch (err) {
      setError(err.message || 'Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!selectedKey || !endpoint) return
    setTesting(true)
    setResponse(null)
    setError(null)
    try {
      let parsedBody = {}
      if (method !== 'GET' && method !== 'DELETE') {
        try {
          parsedBody = JSON.parse(requestBody)
        } catch {
          parsedBody = { raw: requestBody }
        }
      }
      const result = await apiKeyApi.test(selectedKey.id, {
        method,
        endpoint,
        body: parsedBody,
      })
      setResponse(result)
    } catch (err) {
      setResponse({ success: false, status: 500, error: err.message, data: null })
    } finally {
      setTesting(false)
    }
  }

  return (
    <AdminPage
      title="API Playground"
      subtitle="Test API endpoints with your API keys"
      loading={loading}
      error={error}
      onRetry={loadKeys}
    >
      <div className="grid gridCols2">
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Request</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label required">API Key</label>
                <select
                  className="select"
                  value={selectedKey?.id || ''}
                  onChange={(e) => {
                    const k = apiKeys.find((key) => key.id === e.target.value)
                    setSelectedKey(k)
                    setResponse(null)
                  }}
                >
                  <option value="">Select API Key</option>
                  {apiKeys.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label required">Method</label>
                <select className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="formGroup">
                <label className="label required">Endpoint</label>
                <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="/api/resource" />
              </div>
              {method !== 'GET' && method !== 'DELETE' && (
                <div className="formGroup">
                  <label className="label">Request Body (JSON)</label>
                  <textarea
                    className="inputField"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={8}
                    style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                  />
                </div>
              )}
              <Button variant="primary" onClick={handleTest} disabled={testing || !selectedKey || !endpoint}>
                {testing ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Response</h3>
            {response && (
              <span className={`statusTag ${response.success ? 'active' : 'error'}`}>
                {response.success ? `${response.status || 200} OK` : 'Error'}
              </span>
            )}
          </div>
          <div className="cardBody">
            {!response ? (
              <div className="emptyState">
                <p className="textMuted">Send a request to see the response</p>
              </div>
            ) : (
              <pre
                style={{
                  background: '#0f172a',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  margin: 0,
                }}
              >
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  )
}
