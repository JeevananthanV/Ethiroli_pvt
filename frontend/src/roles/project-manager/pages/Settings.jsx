import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { systemApi } from '../../../services/api/systemApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function PMSettings() {
  const [settings, setSettings] = useState({ companyName: '', email: '', phone: '', address: '', timezone: 'UTC' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await systemApi.getSettings()
      if (data) {
        setSettings(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await systemApi.updateSettings(settings)
      alert('Settings saved successfully!')
    } catch (err) {
      alert('Failed to save settings: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminPage
      title="Settings"
      subtitle="Manage your project management settings"
      loading={loading}
      error={error}
      onRetry={loadSettings}
    >
      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="cardBody">
          <form onSubmit={handleSubmit}>
            <div className="form">
              <div className="formGroup">
                <label className="label required">Company Name</label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label required">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  required
                />
              </div>
              <div className="formGroup">
                <label className="label">Phone</label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div className="formGroup">
                <label className="label">Address</label>
                <textarea
                  className="inputField"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="formGroup">
                <label className="label">Timezone</label>
                <select
                  className="select"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={loadSettings}>
                  Reset
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminPage>
  )
}
