import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { badgeApi } from '../../services/api/badgeApi'

export default function BadgeCriteria() {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBadge, setEditingBadge] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    criteria: '',
    threshold: '',
    reward: '',
    isActive: true,
  })

  useEffect(() => {
    loadBadges()
  }, [])

  const loadBadges = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await badgeApi.getAll()
      setBadges(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBadge(null)
    setForm({ name: '', description: '', criteria: '', threshold: '', reward: '', isActive: true })
    setModalOpen(true)
  }

  const handleEdit = (badge) => {
    setEditingBadge(badge)
    setForm({
      name: badge.name || '',
      description: badge.description || '',
      criteria: badge.criteria || '',
      threshold: badge.threshold || '',
      reward: badge.reward || '',
      isActive: badge.isActive ?? true,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = { ...form, threshold: parseInt(form.threshold, 10) || 0 }
      if (editingBadge) {
        await badgeApi.update(editingBadge.id, payload)
        setBadges(badges.map((b) => (b.id === editingBadge.id ? { ...b, ...payload } : b)))
      } else {
        const data = await badgeApi.create(payload)
        setBadges([...badges, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Badge Criteria"
      subtitle="Define badge criteria, thresholds, and rewards"
      loading={loading}
      error={error}
      onRetry={loadBadges}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Create Badge
        </Button>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Criteria</th>
                <th>Threshold</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {badges.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No badges found</span>
                  </td>
                </tr>
              ) : (
                badges.map((badge) => (
                  <tr key={badge.id}>
                    <td>{badge.name}</td>
                    <td>{badge.criteria}</td>
                    <td>{badge.threshold}</td>
                    <td>{badge.reward}</td>
                    <td>
                      <span className={`statusTag ${badge.isActive ? 'active' : 'pending'}`}>
                        {badge.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(badge)}>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingBadge ? 'Edit Badge' : 'Create Badge'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Badge name" />
          </div>
          <div className="formGroup">
            <label className="label">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          </div>
          <div className="formGroup">
            <label className="label required">Criteria</label>
            <Input value={form.criteria} onChange={(e) => setForm({ ...form, criteria: e.target.value })} placeholder="e.g., courses_completed" />
          </div>
          <div className="formGroup">
            <label className="label required">Threshold</label>
            <Input type="number" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} placeholder="0" />
          </div>
          <div className="formGroup">
            <label className="label">Reward</label>
            <Input value={form.reward} onChange={(e) => setForm({ ...form, reward: e.target.value })} placeholder="Reward points or description" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingBadge ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
