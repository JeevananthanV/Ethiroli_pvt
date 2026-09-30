import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { jobBoardApi } from '../../services/api/jobBoardApi'

const PLATFORMS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'SimplyHired', 'CareerBuilder']

export default function PlatformConfig() {
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState(null)
  const [form, setForm] = useState({
    name: '',
    apiKey: '',
    enabled: true,
  })

  useEffect(() => {
    loadPlatforms()
  }, [])

  const loadPlatforms = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobBoardApi.getAll()
      setPlatforms(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPlatform(null)
    setForm({ name: '', apiKey: '', enabled: true })
    setModalOpen(true)
  }

  const handleEdit = (platform) => {
    setEditingPlatform(platform)
    setForm({
      name: platform.name || '',
      apiKey: platform.apiKey || '',
      enabled: platform.enabled ?? true,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingPlatform) {
        await jobBoardApi.update(editingPlatform.id, form)
        setPlatforms(platforms.map((p) => (p.id === editingPlatform.id ? { ...p, ...form } : p)))
      } else {
        const data = await jobBoardApi.create(form)
        setPlatforms([...platforms, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Platform Configuration"
      subtitle="Configure job board platforms"
      loading={loading}
      error={error}
      onRetry={loadPlatforms}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Add Platform
        </Button>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {platforms.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No platforms configured</span>
                  </td>
                </tr>
              ) : (
                platforms.map((platform) => (
                  <tr key={platform.id}>
                    <td>{platform.name}</td>
                    <td>
                      <span className={`statusTag ${platform.enabled ? 'active' : 'pending'}`}>
                        {platform.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(platform)}>
                          Edit
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPlatform ? 'Edit Platform' : 'Add Platform'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Platform</label>
            <select className="select" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}>
              <option value="">Select Platform</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label className="label required">API Key</label>
            <Input type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} placeholder="Enter API key" />
          </div>
          <div className="formGroup">
            <label className="label">Enabled</label>
            <select className="select" value={form.enabled ? 'true' : 'false'} onChange={(e) => setForm({ ...form, enabled: e.target.value === 'true' })}>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingPlatform ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
