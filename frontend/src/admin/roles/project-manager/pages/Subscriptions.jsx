import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { subscriptionApi } from '../../../services/api/subscriptionApi'
import { paymentApi } from '../../../services/api/paymentApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function PMSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, type: 'subscription', status: 'active' })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [subsData, paymentsData] = await Promise.all([
        subscriptionApi.getAll().catch(() => []),
        paymentApi.getAll().catch(() => []),
      ])
      setSubscriptions(subsData)
      setPayments(paymentsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedItem) {
        await subscriptionApi.update(selectedItem.id, formData)
      } else {
        await subscriptionApi.create(formData)
      }
      setShowModal(false)
      setSelectedItem(null)
      setFormData({ name: '', description: '', price: 0, type: 'subscription', status: 'active' })
      loadData()
    } catch (err) {
      alert('Failed to save subscription: ' + err.message)
    }
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      type: item.type || 'subscription',
      status: item.status || 'active',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return
    try {
      await subscriptionApi.delete(id)
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      alert('Failed to delete subscription: ' + error.message)
    }
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <AdminPage
      title="Subscriptions"
      subtitle="Manage subscription plans and billing"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={() => { setSelectedItem(null); setFormData({ name: '', description: '', price: 0, type: 'subscription', status: 'active' }); setShowModal(true) }}>
          Add Plan
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Revenue</div>
          <div className="statValue">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active Plans</div>
          <div className="statValue">{subscriptions.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Total Payments</div>
          <div className="statValue">{payments.length}</div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="fontSemibold">{sub.name}</td>
                  <td>{sub.type || 'subscription'}</td>
                  <td>${sub.price?.toLocaleString() || '0'}</td>
                  <td>
                    <span className={`statusTag ${sub.status === 'active' ? 'active' : 'pending'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleEdit(sub)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(sub.id)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedItem ? 'Edit Plan' : 'Add Plan'}>
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
              <label className="label">Price</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedItem ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
