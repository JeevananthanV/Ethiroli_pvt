import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx'
import Button from '../../common/components/Button/Button.jsx'
import Modal from '../../common/components/Modal/Modal.jsx'
import Input from '../../common/components/Input/Input.jsx'
import { badgeApi } from '../../services/api/badgeApi.js'

export default function BadgeList() {
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
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadBadges()
  }, [])

  const loadBadges = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await badgeApi.getAll()
      setBadges(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load badges')
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
    if (!form.name || !form.criteria) {
      setError('Name and criteria are required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form, threshold: parseInt(form.threshold, 10) || 0 }
      if (editingBadge?.id) {
        const data = await badgeApi.update(editingBadge.id, payload)
        setBadges(badges.map((b) => (b.id === editingBadge.id ? { ...b, ...data } : b)))
      } else {
        const data = await badgeApi.create(payload)
        setBadges([...badges, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to save badge')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminPage
      title="Badges"
      subtitle="Manage available badges and rewards"
      loading={loading}
      error={error}
      onRetry={loadBadges}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Create Badge
        </Button>
      }
    >
      <div className="grid gridCols3">
        {badges.length === 0 ? (
          <div className="emptyState" style={{ gridColumn: '1 / -1' }}>
            <p className="textMuted">No badges found</p>
          </div>
        ) : (
          badges.map((badge) => (
            <div key={badge.id} className="card">
              <div className="cardBody" style={{ padding: '20px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: badge.isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--admin-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '28px',
                  }}
                >
                  {badge.icon || '🏆'}
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--admin-text-primary)' }}>{badge.name}</h4>
                <p className="textSecondary" style={{ fontSize: '13px', margin: '0 0 8px' }}>{badge.description}</p>
                <span className={`statusTag ${badge.isActive ? 'active' : 'pending'}`} style={{ marginBottom: '12px' }}>
                  {badge.isActive ? 'Active' : 'Inactive'}
                </span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                  <Button size="small" variant="secondary" onClick={() => handleEdit(badge)}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingBadge ? 'Edit Badge' : 'Create Badge'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Badge name" />
          </div>
          <div className="formGroup">
            <label className="label">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Badge description" />
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
          {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingBadge ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
