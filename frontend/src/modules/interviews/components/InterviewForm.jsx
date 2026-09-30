import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { interviewApi } from '../../services/api/interviewApi'
import { candidateApi } from '../../services/api/candidateApi'

export default function InterviewForm() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    candidateId: '',
    candidateName: '',
    interviewer: '',
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    notes: '',
  })

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await candidateApi.getAll()
      setCandidates(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCandidateChange = (e) => {
    const candidate = candidates.find((c) => c.id === e.target.value)
    setForm({
      ...form,
      candidateId: candidate?.id || '',
      candidateName: candidate?.name || '',
    })
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        duration: parseInt(form.duration, 10) || 60,
      }
      await interviewApi.create(payload)
      setModalOpen(false)
      setForm({ candidateId: '', candidateName: '', interviewer: '', date: '', time: '', duration: '60', type: 'video', notes: '' })
      alert('Interview scheduled successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Schedule Interview"
      subtitle="Schedule a new interview with a candidate"
      loading={loading}
      error={error}
      onRetry={loadCandidates}
      actions={
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Schedule Interview
        </Button>
      }
    >
      <div className="card">
        <div className="cardBody">
          <div className="form">
            <div className="formGroup">
              <label className="label required">Candidate</label>
              <select className="select" value={form.candidateId} onChange={handleCandidateChange}>
                <option value="">Select Candidate</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label required">Interviewer</label>
              <Input
                value={form.interviewer}
                onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                placeholder="Interviewer name"
              />
            </div>
            <div className="grid gridCols2">
              <div className="formGroup">
                <label className="label required">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label required">Time</label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="grid gridCols2">
              <div className="formGroup">
                <label className="label">Duration (minutes)</label>
                <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Type</label>
                <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
            </div>
            <div className="formGroup">
              <label className="label">Notes</label>
              <textarea
                className="inputField"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <Button variant="primary" onClick={handleSubmit}>
              Schedule Interview
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Interview">
        <div className="form">
          <div className="formGroup">
            <label className="label required">Candidate</label>
            <select className="select" value={form.candidateId} onChange={handleCandidateChange}>
              <option value="">Select Candidate</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label className="label required">Interviewer</label>
            <Input
              value={form.interviewer}
              onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
              placeholder="Interviewer name"
            />
          </div>
          <div className="grid gridCols2">
            <div className="formGroup">
              <label className="label required">Date</label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="formGroup">
              <label className="label required">Time</label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div className="grid gridCols2">
            <div className="formGroup">
              <label className="label">Duration (minutes)</label>
              <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="formGroup">
              <label className="label">Type</label>
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="video">Video</option>
                <option value="phone">Phone</option>
                <option value="in_person">In Person</option>
              </select>
            </div>
          </div>
          <div className="formGroup">
            <label className="label">Notes</label>
            <textarea
              className="inputField"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
