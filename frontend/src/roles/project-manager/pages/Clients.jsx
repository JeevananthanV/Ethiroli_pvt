import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function PMClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', status: 'active' })

  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await candidateApi.getAll()
      setClients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedClient) {
        await candidateApi.update(selectedClient.id, formData)
      } else {
        await candidateApi.create(formData)
      }
      setShowModal(false)
      setSelectedClient(null)
      setFormData({ name: '', email: '', company: '', phone: '', status: 'active' })
      fetchClients()
    } catch (err) {
      alert('Failed to save client: ' + err.message)
    }
  }

  const handleEdit = (client) => {
    setSelectedClient(client)
    setFormData({
      name: client.name || '',
      email: client.email || '',
      company: client.company || '',
      phone: client.phone || '',
      status: client.status || 'active',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return
    try {
      await candidateApi.delete(id)
      setClients((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      alert('Failed to delete client: ' + error.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'inactive':
        return 'error'
      case 'pending':
        return 'pending'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Clients"
      subtitle="Manage client relationships and contacts"
      loading={loading}
      error={error}
      onRetry={fetchClients}
      actions={
        <Button onClick={() => { setSelectedClient(null); setFormData({ name: '', email: '', company: '', phone: '', status: 'active' }); setShowModal(true) }}>
          Add Client
        </Button>
      }
    >
      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="textCenter textMuted py4">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td className="fontSemibold">{client.name}</td>
                  <td className="textSecondary">{client.email}</td>
                  <td>{client.company || 'N/A'}</td>
                  <td>{client.phone || 'N/A'}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleEdit(client)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(client.id)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedClient ? 'Edit Client' : 'Add Client'}>
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
              <label className="label required">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                {selectedClient ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
