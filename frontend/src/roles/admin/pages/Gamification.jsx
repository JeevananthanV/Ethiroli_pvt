import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { badgeApi } from '../../../services/api/badgeApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminGamification() {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', icon: '', criteria: '' })

  const fetchBadges = async () => {
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

  useEffect(() => {
    fetchBadges()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedBadge) {
        await badgeApi.update(selectedBadge.id, formData)
      } else {
        await badgeApi.create(formData)
      }
      setShowModal(false)
      setSelectedBadge(null)
      setFormData({ name: '', description: '', icon: '', criteria: '' })
      fetchBadges()
    } catch (err) {
      alert('Failed to save badge: ' + err.message)
    }
  }

  const handleEdit = (badge) => {
    setSelectedBadge(badge)
    setFormData({
      name: badge.name || '',
      description: badge.description || '',
      icon: badge.icon || '',
      criteria: badge.criteria || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this badge?')) return
    try {
      await badgeApi.delete(id)
      setBadges((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      alert('Failed to delete badge: ' + error.message)
    }
  }

  const handleAward = async (userId, badgeId) => {
    try {
      await badgeApi.award(userId, badgeId)
      alert('Badge awarded successfully!')
    } catch (error) {
      alert('Failed to award badge: ' + error.message)
    }
  }

  return (
    <AdminPage
      title="Badges & Gamification"
      subtitle="Manage achievement badges and rewards"
      loading={loading}
      error={error}
      onRetry={fetchBadges}
      actions={
        <Button onClick={() => { setSelectedBadge(null); setFormData({ name: '', description: '', icon: '', criteria: '' }); setShowModal(true) }}>
          Create Badge
        </Button>
      }
    >
      <div className="grid gridCols3">
        {badges.map((badge) => (
          <div key={badge.id} className="card">
            <div className="cardBody">
              <div className="flex justifyBetween itemsCenter mb3">
                <span className="textXl">{badge.icon || '🏆'}</span>
                <span className="statusTag active">Achievement</span>
              </div>
              <h3 className="fontSemibold textPrimary mb2">{badge.name}</h3>
              <p className="textSecondary textSm mb3">{badge.description}</p>
              <p className="textMuted textSm mb3">Criteria: {badge.criteria || 'N/A'}</p>
              <div className="flex gap3">
                <Button size="small" onClick={() => handleAward('user', badge.id)}>
                  Award
                </Button>
                <Button size="small" onClick={() => handleEdit(badge)}>
                  Edit
                </Button>
                <Button size="small" variant="danger" onClick={() => handleDelete(badge.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {badges.length === 0 && (
        <div className="emptyState">
          <h3>No badges configured</h3>
          <p>Create a new badge to get started.</p>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedBadge ? 'Edit Badge' : 'Create Badge'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formGroup">
              <label className="label required">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Description</label>
              <textarea
                className="inputField"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="formGroup">
              <label className="label">Icon</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g. 🏆"
              />
            </div>
            <div className="formGroup">
              <label className="label">Criteria</label>
              <Input
                value={formData.criteria}
                onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                placeholder="e.g. Complete 5 courses"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedBadge ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
