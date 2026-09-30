import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { subscriptionApi } from '../../../services/api/subscriptionApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminMarketplace() {
  const [subscriptions, setSubscriptions] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, type: 'subscription' })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [subsData] = await Promise.all([
        subscriptionApi.getAll().catch(() => []),
      ])
      setSubscriptions(subsData)
      setProducts(subsData)
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
      setFormData({ name: '', description: '', price: 0, type: 'subscription' })
      loadData()
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      type: item.type || 'subscription',
    })
    setShowModal(true)
  }

  return (
    <AdminPage
      title="Marketplace"
      subtitle="Manage courses, products, and sales across the marketplace"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={() => { setSelectedItem(null); setFormData({ name: '', description: '', price: 0, type: 'subscription' }); setShowModal(true) }}>
          Add Product
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Products</div>
          <div className="statValue">{products.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active Subscriptions</div>
          <div className="statValue">{subscriptions.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Revenue</div>
          <div className="statValue">
            ${products.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Products & Subscriptions</h3>
        </div>
        <div className="overflowAuto">
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="textCenter textMuted py4">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="fontSemibold">{product.name}</td>
                    <td>{product.type || 'subscription'}</td>
                    <td>${product.price?.toLocaleString() || '0'}</td>
                    <td>
                      <span className={`statusTag ${product.status === 'active' ? 'active' : 'pending'}`}>
                        {product.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap2">
                        <Button size="small" onClick={() => handleEdit(product)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedItem ? 'Edit Product' : 'Add Product'}>
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
              <label className="label">Type</label>
              <select
                className="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="subscription">Subscription</option>
                <option value="one-time">One-Time</option>
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
