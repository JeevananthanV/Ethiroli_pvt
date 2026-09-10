import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import { interviewApi } from '../../../services/api/interviewApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function SalesFollowUps() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', followUpDate: '', notes: '', status: 'pending' })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [leadsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
      ])
      setLeads(leadsData)
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
      if (selectedLead) {
        await candidateApi.update(selectedLead.id, formData)
      } else {
        await candidateApi.create(formData)
      }
      setShowModal(false)
      setSelectedLead(null)
      setFormData({ name: '', email: '', followUpDate: '', notes: '', status: 'pending' })
      loadData()
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  }

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      followUpDate: lead.followUpDate || '',
      notes: lead.notes || '',
      status: lead.status || 'pending',
    })
    setShowModal(true)
  }

  const handleScheduleInterview = async (leadId) => {
    try {
      await interviewApi.create({
        candidateName: leads.find((l) => l.id === leadId)?.name,
        interviewer: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        type: 'phone',
        status: 'scheduled',
      })
      alert('Interview scheduled successfully!')
    } catch (err) {
      alert('Failed to schedule interview: ' + err.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'pending'
      case 'contacted':
        return 'pending'
      case 'scheduled':
        return 'pending'
      case 'completed':
        return 'active'
      case 'lost':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Follow-ups"
      subtitle="Manage and schedule lead follow-ups"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={() => { setSelectedLead(null); setFormData({ name: '', email: '', followUpDate: '', notes: '', status: 'pending' }); setShowModal(true) }}>
          Add Follow-up
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Pending</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {leads.filter((l) => l.status === 'pending' || l.status === 'new').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Contacted</div>
          <div className="statValue" style={{ color: 'var(--admin-info)' }}>
            {leads.filter((l) => l.status === 'contacted').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Converted</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {leads.filter((l) => l.status === 'converted').length}
          </div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Follow-up Date</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="textCenter textMuted py4">
                  No follow-ups found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="fontSemibold">{lead.name}</td>
                  <td className="textSecondary">{lead.email}</td>
                  <td>{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '-'}</td>
                  <td className="textSecondary">{lead.notes || 'N/A'}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleScheduleInterview(lead.id)}>
                        Schedule
                      </Button>
                      <Button size="small" onClick={() => handleEdit(lead)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedLead ? 'Edit Follow-up' : 'Add Follow-up'}>
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
              <label className="label">Follow-up Date</label>
              <Input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Notes</label>
              <textarea
                className="inputField"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
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
