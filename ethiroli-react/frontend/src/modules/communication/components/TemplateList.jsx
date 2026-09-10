import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { templateApi } from '../../services/api/templateApi'

export default function TemplateList() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [form, setForm] = useState({ name: '', content: '', variables: '', isActive: true })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await templateApi.getAll()
      setTemplates(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    setForm({ name: '', content: '', variables: '', isActive: true })
    setModalOpen(true)
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setForm({
      name: template.name || '',
      content: template.content || '',
      variables: template.variables?.join(', ') || '',
      isActive: template.isActive ?? true,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return
    try {
      await templateApi.delete(id)
      setTemplates(templates.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        content: form.content,
        variables: form.variables.split(',').map((v) => v.trim()).filter(Boolean),
        isActive: form.isActive,
      }
      if (editingTemplate) {
        await templateApi.update(editingTemplate.id, payload)
        setTemplates(templates.map((t) => (t.id === editingTemplate.id ? { ...t, ...payload } : t)))
      } else {
        const data = await templateApi.create(payload)
        setTemplates([...templates, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Templates"
      subtitle="Manage communication templates"
      loading={loading}
      error={error}
      onRetry={loadTemplates}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Create Template
        </Button>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Variables</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No templates found</span>
                  </td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id}>
                    <td>{template.name}</td>
                    <td>{template.variables?.join(', ') || '-'}</td>
                    <td>
                      <span className={`statusTag ${template.isActive ? 'active' : 'pending'}`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(template)}>
                          Edit
                        </Button>
                        <Button size="small" variant="danger" onClick={() => handleDelete(template.id)}>
                          Delete
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTemplate ? 'Edit Template' : 'Create Template'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Template name"
            />
          </div>
          <div className="formGroup">
            <label className="label required">Content</label>
            <textarea
              className="inputField"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Template content with {{variables}}"
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="formGroup">
            <label className="label">Variables (comma-separated)</label>
            <Input
              value={form.variables}
              onChange={(e) => setForm({ ...form, variables: e.target.value })}
              placeholder="name, email, company"
            />
          </div>
          <div className="formGroup">
            <label className="label">Status</label>
            <select
              className="select"
              value={form.isActive ? 'active' : 'inactive'}
              onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
