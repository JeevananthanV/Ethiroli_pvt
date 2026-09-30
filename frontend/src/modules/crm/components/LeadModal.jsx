import React, { useState, useEffect } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { leadApi } from '../../../services/api/leadApi.js'

export default function LeadModal({ isOpen, onClose, lead, onSaved }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: 'new',
    value: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || '',
        status: lead.status || 'new',
        value: lead.value || '',
        notes: lead.notes || '',
      })
    } else {
      setForm({ name: '', email: '', phone: '', company: '', source: '', status: 'new', value: '', notes: '' })
    }
    setError(null)
  }, [lead, isOpen])

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Name is required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form, value: parseFloat(form.value) || 0 }
      let data
      if (lead?.id) {
        data = await leadApi.update(lead.id, payload)
      } else {
        data = await leadApi.create(payload)
      }
      onSaved?.(data)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Failed to save lead')
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead?.id ? 'Edit Lead' : 'Create Lead'}>
      <div className="form">
        <div className="formGroup">
          <label className="label required">Name</label>
          <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Lead name" />
        </div>
        <div className="formGroup">
          <label className="label">Email</label>
          <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="formGroup">
          <label className="label">Phone</label>
          <Input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 234 567 8900" />
        </div>
        <div className="formGroup">
          <label className="label">Company</label>
          <Input value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Company name" />
        </div>
        <div className="formGroup">
          <label className="label">Source</label>
          <select className="select" value={form.source} onChange={(e) => updateField('source', e.target.value)}>
            <option value="">Select Source</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social">Social Media</option>
            <option value="email">Email Campaign</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Value ($)</label>
          <Input type="number" value={form.value} onChange={(e) => updateField('value', e.target.value)} placeholder="0.00" />
        </div>
        <div className="formGroup">
          <label className="label">Notes</label>
          <textarea
            className="inputField"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>
        {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : lead?.id ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
