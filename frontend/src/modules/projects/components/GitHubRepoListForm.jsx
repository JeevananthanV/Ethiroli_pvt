import React, { useState } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { projectApi } from '../../services/api/projectApi'

export default function GitHubRepoListForm({ repo, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: repo?.name || '',
    url: repo?.url || '',
    branch: repo?.branch || 'main',
    status: repo?.status || 'pending',
  }))

  const handleSubmit = async () => {
    try {
      const payload = { ...form }
      if (repo) {
        await projectApi.update(repo.id, payload)
      } else {
        await projectApi.create(payload)
      }
      onSave?.(payload)
      onClose?.()
    } catch (err) {
      console.error('Failed to save repository', err)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={repo ? 'Edit Repository' : 'Add Repository'}>
      <div className="form">
        <div className="formGroup">
          <label className="label required">Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Repository name" />
        </div>
        <div className="formGroup">
          <label className="label required">URL</label>
          <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://github.com/user/repo" />
        </div>
        <div className="formGroup">
          <label className="label">Branch</label>
          <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="main" />
        </div>
        <div className="formGroup">
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="synced">Synced</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {repo ? 'Update' : 'Add'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
