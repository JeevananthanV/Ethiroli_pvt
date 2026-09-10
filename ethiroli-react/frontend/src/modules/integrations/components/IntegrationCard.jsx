import React, { useState } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { integrationApi } from '../../services/api/integrationApi'

export default function IntegrationCard({ integration }) {
  const [configOpen, setConfigOpen] = useState(false)
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleConfigClick = async () => {
    setConfigOpen(true)
    setTestResult(null)
    setLoading(true)
    try {
      const data = await integrationApi.getConfig(integration.id)
      setConfig(data)
    } catch (err) {
      console.error('Failed to load config', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const result = await integrationApi.testConnection(integration.id)
      setTestResult(result)
    } catch (err) {
      setTestResult({ success: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <>
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">{integration.name}</h3>
          <span className={`statusTag ${integration.status === 'active' ? 'active' : 'pending'}`}>
            {integration.status}
          </span>
        </div>
        <div className="cardBody">
          <p className="textSecondary textSm">Type: {integration.type}</p>
          <p className="textSecondary textSm">Last Sync: {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <Button size="small" variant="secondary" onClick={handleConfigClick}>
              Configure
            </Button>
            <Button size="small" variant="primary" onClick={handleTest} disabled={testing}>
              {testing ? 'Testing...' : 'Test'}
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={configOpen} onClose={() => setConfigOpen(false)} title={`Configure ${integration.name}`}>
        {loading ? (
          <div className="loading">
            <div className="skeleton" style={{ width: '100%', height: '200px' }} />
          </div>
        ) : (
          <div className="form">
            <div className="formGroup">
              <label className="label">API Key</label>
              <Input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="Enter API key"
              />
            </div>
            <div className="formGroup">
              <label className="label">Webhook URL</label>
              <Input
                value={config.webhookUrl || ''}
                onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                placeholder="https://example.com/webhook"
              />
            </div>
            {testResult && (
              <div className={`formGroup ${testResult.success ? 'textSuccess' : 'textDanger'}`}>
                <span>{testResult.success ? 'Connection successful' : `Failed: ${testResult.message}`}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setConfigOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleTest} disabled={testing}>
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
