import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { tenantApi } from '../../services/api/tenantApi'

export default function WhiteLabelConfig() {
  const [tenants, setTenants] = useState([])
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [config, setConfig] = useState({
    logo: '',
    primaryColor: '#6366f1',
    secondaryColor: '#22c55e',
    customDomain: '',
    favicon: '',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tenantApi.getAll()
      setTenants(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTenantSelect = async (tenantId) => {
    const tenant = tenants.find((t) => t.id === tenantId)
    setSelectedTenant(tenant)
    try {
      const data = await tenantApi.getById(tenantId)
      setConfig({
        logo: data.logo || '',
        primaryColor: data.primaryColor || '#6366f1',
        secondaryColor: data.secondaryColor || '#22c55e',
        customDomain: data.customDomain || '',
        favicon: data.favicon || '',
      })
    } catch (err) {
      console.error('Failed to load tenant config', err)
    }
  }

  const handleSave = async () => {
    if (!selectedTenant) return
    setSaving(true)
    try {
      await tenantApi.update(selectedTenant.id, config)
      alert('White-label configuration saved successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminPage
      title="White-Label Configuration"
      subtitle="Customize branding and colors for tenants"
      loading={loading}
      error={error}
      onRetry={loadTenants}
    >
      <div className="grid gridCols2">
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Select Tenant</h3>
          </div>
          <div className="cardBody">
            <div className="form">
              <div className="formGroup">
                <label className="label required">Tenant</label>
                <select
                  className="select"
                  value={selectedTenant?.id || ''}
                  onChange={(e) => handleTenantSelect(e.target.value)}
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {selectedTenant && (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Branding Configuration</h3>
            </div>
            <div className="cardBody">
              <div className="form">
                <div className="formGroup">
                  <label className="label">Logo URL</label>
                  <Input
                    value={config.logo}
                    onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="grid gridCols2">
                  <div className="formGroup">
                    <label className="label">Primary Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
                      />
                      <Input value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} />
                    </div>
                  </div>
                  <div className="formGroup">
                    <label className="label">Secondary Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                        style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
                      />
                      <Input value={config.secondaryColor} onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="formGroup">
                  <label className="label">Custom Domain</label>
                  <Input
                    value={config.customDomain}
                    onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                    placeholder="app.example.com"
                  />
                </div>
                <div className="formGroup">
                  <label className="label">Favicon URL</label>
                  <Input
                    value={config.favicon}
                    onChange={(e) => setConfig({ ...config, favicon: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                <Button variant="primary" onClick={handleSave} disabled={saving} style={{ marginTop: '16px' }}>
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  )
}
