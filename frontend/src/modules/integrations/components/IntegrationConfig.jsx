import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { integrationApi } from '../../services/api/integrationApi'

export default function IntegrationConfig() {
  const [integrations, setIntegrations] = useState([])
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const integrationsData = await integrationApi.getAll()
      setIntegrations(integrationsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleIntegrationSelect = async (integrationId) => {
    const integration = integrations.find((i) => i.id === integrationId)
    setSelectedIntegration(integration)
    setTestResult(null)
    try {
      const data = await integrationApi.getConfig(integrationId)
      setConfig(data)
    } catch (err) {
      console.error('Failed to load config', err)
    }
  }

  const handleSave = async () => {
    if (!selectedIntegration) return
    setSaving(true)
    try {
      await integrationApi.updateConfig(selectedIntegration.id, config)
      alert('Configuration saved successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!selectedIntegration) return
    setTesting(true)
    setTestResult(null)
    try {
      const result = await integrationApi.testConnection(selectedIntegration.id)
      setTestResult(result)
    } catch (err) {
      setTestResult({ success: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <AdminPage
      title="Integration Configuration"
      subtitle="Configure third-party integrations"
      loading={loading}
      error={error}
      onRetry={loadData}
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
                  onChange={(e) => handleIntegrationSelect(e.target.value)}
                >
                  <option value="">Select Integration</option>
                  {integrations.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {selectedIntegration && (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Configuration</h3>
            </div>
            <div className="cardBody">
              <div className="form">
                <div className="formGroup">
                  <label className="label required">API Key</label>
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
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <Button variant="secondary" onClick={handleTest} disabled={testing}>
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                  <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  )
}
