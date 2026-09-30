import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { providerApi } from '../../services/api/providerApi'
import { integrationApi } from '../../services/api/integrationApi'

export default function ProviderConfig() {
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await providerApi.getAll()
      setProviders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProviderSelect = async (providerId) => {
    const provider = providers.find((p) => p.id === providerId)
    setSelectedProvider(provider)
    setTestResult(null)
    try {
      const data = await integrationApi.getConfig(providerId)
      setConfig(data)
    } catch (err) {
      console.error('Failed to load config', err)
    }
  }

  const handleSave = async () => {
    if (!selectedProvider) return
    setSaving(true)
    try {
      await integrationApi.updateConfig(selectedProvider.id, config)
      alert('Configuration saved successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!selectedProvider) return
    setTesting(true)
    setTestResult(null)
    try {
      const result = await integrationApi.testConnection(selectedProvider.id)
      setTestResult(result)
    } catch (err) {
      setTestResult({ success: false, message: err.message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <AdminPage
      title="Provider Configuration"
      subtitle="Configure communication providers and test connections"
      loading={loading}
      error={error}
      onRetry={loadProviders}
    >
      <div className="grid gridCols2">
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Select Provider</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label required">Provider</label>
                <select
                  className="select"
                  value={selectedProvider?.id || ''}
                  onChange={(e) => handleProviderSelect(e.target.value)}
                >
                  <option value="">Select Provider</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {selectedProvider && (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">{selectedProvider.name} Config</h3>
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
                    <span>{testResult.success ? 'Connection successful' : `Connection failed: ${testResult.message}`}</span>
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
