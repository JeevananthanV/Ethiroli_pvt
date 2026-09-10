import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function SalesLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', position: '', status: 'new' })

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await candidateApi.getAll()
      setLeads(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedLead) {
        await candidateApi.update(selectedLead.id, formData)
      } else {
        await candidateApi.create(formData)
      }
      setShowModal(false)
      setSelectedLead(null)
      setFormData({ name: '', email: '', position: '', status: 'new' })
      fetchLeads()
    } catch (err) {
      alert('Failed to save lead: ' + err.message)
    }
  }

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      position: lead.position || '',
      status: lead.status || 'new',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return
    try {
      await candidateApi.delete(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch (error) {
      alert('Failed to delete lead: ' + error.message)
    }
  }

  const filteredLeads = filterStatus
    ? leads.filter((l) => l.status === filterStatus)
    : leads

  const getStatusClass = (status) => {
    switch (status) {
      case 'new':
        return 'pending'
      case 'contacted':
        return 'pending'
      case 'qualified':
        return 'active'
      case 'converted':
        return 'active'
      case 'lost':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Leads"
      subtitle="Manage and track your sales leads"
      loading={loading}
      error={error}
      onRetry={fetchLeads}
      actions={
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <Button onClick={() => { setSelectedLead(null); setFormData({ name: '', email: '', position: '', status: 'new' }); setShowModal(true) }}>
            Add Lead
          </Button>
        </div>
      }
    >
      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <div className="statLabel">Total Leads</div>
          <div className="statValue">{leads.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">New</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {leads.filter((l) => l.status === 'new').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Qualified</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {leads.filter((l) => l.status === 'qualified' || l.status === 'converted').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Conversion</div>
          <div className="statValue" style={{ color: 'var(--admin-info)' }}>
            {leads.length > 0 ? Math.round((leads.filter((l) => l.status === 'converted').length / leads.length) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="fontSemibold">{lead.name}</td>
                  <td className="textSecondary">{lead.email}</td>
                  <td>{lead.position || 'N/A'}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleEdit(lead)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(lead.id)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedLead ? 'Edit Lead' : 'Add Lead'}>
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
              <label className="label">Position</label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedLead ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
