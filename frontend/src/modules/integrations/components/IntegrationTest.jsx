import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { integrationApi } from '../../services/api/integrationApi'

export default function IntegrationTest() {
  const [integrations, setIntegrations] = useState([])
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [testPayload, setTestPayload] = useState('{\n  "test": true\n}')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
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

  const handleTest = async () => {
    if (!selectedIntegration) return
    setTesting(true)
    setResponse(null)
    try {
      let parsedPayload
      try {
        parsedPayload = JSON.parse(testPayload)
      } catch {
        parsedPayload = { raw: testPayload }
      }
      const result = await integrationApi.testConnection(selectedIntegration.id, parsedPayload)
      setResponse(result)
    } catch (err) {
      setResponse({ success: false, error: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <AdminPage
      title="Integration Test"
      subtitle="Test third-party integration connections"
      loading={loading}
      error={error}
      onRetry={loadIntegrations}
    >
      <div className="grid gridCols2">
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Select Integration</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label required">Integration</label>
                <select
                  className="select"
                  value={selectedIntegration?.id || ''}
                  onChange={(e) => {
                    const integration = integrations.find((i) => i.id === e.target.value)
                    setSelectedIntegration(integration)
                    setResponse(null)
                  }}
                >
                  <option value="">Select Integration</option>
                  {integrations.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedIntegration && (
                <div className="formGroup">
                  <label className="label">URL</label>
                  <Input value={selectedIntegration.url || ''} disabled />
                </div>
              )}
              <Button variant="primary" onClick={handleTest} disabled={testing || !selectedIntegration} style={{ marginTop: '16px' }}>
                {testing ? 'Testing...' : 'Run Test'}
              </Button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Test Payload</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label">JSON Payload</label>
                <textarea
                  className="inputField"
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  rows={10}
                  style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {response && (
        <div className="card mt4">
          <div className="cardHeader">
            <h3 className="cardTitle">Test Result</h3>
            <span className={`statusTag ${response.success ? 'active' : 'error'}`}>
              {response.success ? 'Passed' : 'Failed'}
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
