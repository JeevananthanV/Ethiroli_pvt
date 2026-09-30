import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { projectApi } from '../../services/api/projectApi'

export default function GitHubRepoList() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRepo, setEditingRepo] = useState(null)
  const [form, setForm] = useState({
    name: '',
    url: '',
    branch: 'main',
    status: 'pending',
  })

  useEffect(() => {
    loadRepos()
  }, [])

  const loadRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectApi.getAll()
      setRepos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingRepo(null)
    setForm({ name: '', url: '', branch: 'main', status: 'pending' })
    setModalOpen(true)
  }

  const handleEdit = (repo) => {
    setEditingRepo(repo)
    setForm({
      name: repo.name || '',
      url: repo.url || '',
      branch: repo.branch || 'main',
      status: repo.status || 'pending',
    })
    setModalOpen(true)
  }

  const handleSync = async (id) => {
    try {
      await projectApi.update(id, { status: 'syncing' })
      setRepos(repos.map((r) => (r.id === id ? { ...r, status: 'syncing' } : r)))
      setTimeout(async () => {
        await projectApi.update(id, { status: 'synced' })
        setRepos(repos.map((r) => (r.id === id ? { ...r, status: 'synced' } : r)))
      }, 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingRepo) {
        await projectApi.update(editingRepo.id, form)
        setRepos(repos.map((r) => (r.id === editingRepo.id ? { ...r, ...form } : r)))
      } else {
        const data = await projectApi.create(form)
        setRepos([...repos, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'synced':
        return 'active'
      case 'syncing':
        return 'pending'
      case 'error':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="GitHub Repositories"
      subtitle="Manage GitHub repository connections"
      loading={loading}
      error={error}
      onRetry={loadRepos}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Add Repository
        </Button>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No repositories found</span>
                  </td>
                </tr>
              ) : (
                repos.map((repo) => (
                  <tr key={repo.id}>
                    <td>{repo.name}</td>
                    <td className="truncate" style={{ maxWidth: '200px' }}>
                      {repo.url}
                    </td>
                    <td>{repo.branch}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(repo.status)}`}>
                        {repo.status}
                      </span>
                    </td>
                    <td>{repo.lastSync ? new Date(repo.lastSync).toLocaleString() : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(repo)}>
                          Edit
                        </Button>
                        <Button size="small" variant="primary" onClick={() => handleSync(repo.id)} disabled={repo.status === 'syncing'}>
                          Sync
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingRepo ? 'Edit Repository' : 'Add Repository'}>
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
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingRepo ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
