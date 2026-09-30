import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx'
import Button from '../../common/components/Button/Button.jsx'
import Modal from '../../common/components/Modal/Modal.jsx'
import Input from '../../common/components/Input/Input.jsx'
import { apiKeyApi } from '../../services/api/apiKeyApi.js'

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [form, setForm] = useState({ name: '', key: '', permissions: '', expiresAt: '' })
  const [submitting, setSubmitting] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState(null)

  useEffect(() => {
    loadKeys()
  }, [])

   const updateField = (field, value) => {
     setForm({ ...form, [field]: value })
   }

   const loadKeys = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiKeyApi.getAll()
      setApiKeys(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingKey(null)
    setForm({ name: '', key: '', permissions: '', expiresAt: '' })
    setNewKeyValue(null)
    setModalOpen(true)
  }

  const handleEdit = (apiKey) => {
    setEditingKey(apiKey)
    setForm({
      name: apiKey.name || '',
      key: apiKey.key || '',
      permissions: apiKey.permissions || '',
      expiresAt: apiKey.expiresAt ? apiKey.expiresAt.slice(0, 10) : '',
    })
    setNewKeyValue(null)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Name is required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form }
      let data
      if (editingKey?.id) {
        data = await apiKeyApi.update(editingKey.id, payload)
        setApiKeys(apiKeys.map((k) => (k.id === editingKey.id ? { ...k, ...data } : k)))
      } else {
        data = await apiKeyApi.create(payload)
        setApiKeys([...apiKeys, data])
        if (data.key) {
          setNewKeyValue(data.key)
        }
      }
      if (!newKeyValue) {
        setModalOpen(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to save API key')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) return
    try {
      await apiKeyApi.revoke(id)
      setApiKeys(apiKeys.filter((k) => k.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to revoke API key')
    }
  }

  const getStatusClass = (apiKey) => {
    if (apiKey.revoked) return 'error'
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) return 'pending'
    return 'active'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <AdminPage
      title="API Keys"
      subtitle="Manage API keys for external integrations"
      loading={loading}
      error={error}
      onRetry={loadKeys}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Create API Key
        </Button>
      }
    >
      {newKeyValue && (
        <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--admin-success)' }}>
          <div className="cardBody" style={{ padding: '16px' }}>
            <p className="textSuccess" style={{ fontWeight: 600, marginBottom: '8px' }}>API Key Created Successfully!</p>
            <p className="textSecondary" style={{ fontSize: '13px', marginBottom: '8px' }}>Copy this key now. You will not be able to see it again.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input value={newKeyValue} readOnly style={{ fontFamily: 'monospace' }} />
              <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(newKeyValue); setNewKeyValue(null) }}>
                Copy & Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Permissions</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No API keys found</span>
                  </td>
                </tr>
              ) : (
                apiKeys.map((apiKey) => (
                  <tr key={apiKey.id}>
                    <td style={{ fontWeight: 500 }}>{apiKey.name}</td>
                    <td><code style={{ background: 'var(--admin-bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{apiKey.key?.slice(0, 8)}...</code></td>
                    <td>{apiKey.permissions || '-'}</td>
                    <td>{formatDate(apiKey.expiresAt)}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(apiKey)}`}>
                        {apiKey.revoked ? 'Revoked' : apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(apiKey)}>Edit</Button>
                        {!apiKey.revoked && (
                          <Button size="small" variant="danger" onClick={() => handleRevoke(apiKey.id)}>Revoke</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setNewKeyValue(null) }} title={editingKey ? 'Edit API Key' : 'Create API Key'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="API key name" />
          </div>
          {!editingKey && (
            <div className="formGroup">
              <label className="label">Key</label>
              <Input value={form.key} onChange={(e) => updateField('key', e.target.value)} placeholder="Leave empty to auto-generate" />
            </div>
          )}
          <div className="formGroup">
            <label className="label">Permissions</label>
            <Input value={form.permissions} onChange={(e) => updateField('permissions', e.target.value)} placeholder="read,write" />
          </div>
          <div className="formGroup">
            <label className="label">Expires At</label>
            <Input type="date" value={form.expiresAt} onChange={(e) => updateField('expiresAt', e.target.value)} />
          </div>
          {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => { setModalOpen(false); setNewKeyValue(null) }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingKey ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
