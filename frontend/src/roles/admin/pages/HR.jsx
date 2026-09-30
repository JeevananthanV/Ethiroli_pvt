import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import { interviewApi } from '../../../services/api/interviewApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminHR() {
  const [candidates, setCandidates] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', position: '', department: '', status: 'active' })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [candidatesData, employeesData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        interviewApi.getAll().catch(() => []),
      ])
      setCandidates(candidatesData)
      setEmployees(employeesData)
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
      if (selectedCandidate) {
        await candidateApi.update(selectedCandidate.id, formData)
      } else {
        await candidateApi.create(formData)
      }
      setShowModal(false)
      setSelectedCandidate(null)
      setFormData({ name: '', email: '', position: '', department: '', status: 'active' })
      loadData()
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  }

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate)
    setFormData({
      name: candidate.name || '',
      email: candidate.email || '',
      position: candidate.position || '',
      department: candidate.department || '',
      status: candidate.status || 'active',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      await candidateApi.delete(id)
      setCandidates((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  return (
    <AdminPage
      title="HR Management"
      subtitle="Manage candidates and employees"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={() => { setSelectedCandidate(null); setFormData({ name: '', email: '', position: '', department: '', status: 'active' }); setShowModal(true) }}>
          Add Candidate
        </Button>
      }
    >
      <div className="grid gridCols2" style={{ gap: '24px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Candidates</h3>
            <span className="statusTag active">{candidates.length}</span>
          </div>
          <div className="overflowAuto">
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
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="textCenter textMuted py4">
                      No candidates found
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="fontSemibold">{candidate.name}</td>
                      <td className="textSecondary">{candidate.email}</td>
                      <td>{candidate.position}</td>
                      <td>
                        <span className={`statusTag ${candidate.status === 'active' ? 'active' : 'pending'}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap2">
                          <Button size="small" onClick={() => handleEdit(candidate)}>
                            Edit
                          </Button>
                          <Button size="small" variant="danger" onClick={() => handleDelete(candidate.id)}>
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
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Interviews</h3>
            <span className="statusTag active">{employees.length}</span>
          </div>
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Interviewer</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="textCenter textMuted py4">
                      No interviews found
                    </td>
                  </tr>
                ) : (
                  employees.map((interview) => (
                    <tr key={interview.id}>
                      <td className="fontSemibold">{interview.candidateName || 'Unknown'}</td>
                      <td>{interview.interviewer}</td>
                      <td>{interview.date}</td>
                      <td>
                        <span className={`statusTag ${interview.status === 'completed' ? 'active' : interview.status === 'cancelled' ? 'error' : 'pending'}`}>
                          {interview.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedCandidate ? 'Edit Candidate' : 'Add Candidate'}>
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
              <label className="label">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                {selectedCandidate ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
