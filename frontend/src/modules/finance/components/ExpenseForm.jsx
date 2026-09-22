import React, { useState, useEffect } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { transactionApi } from '../../../services/api/transactionApi.js'

export default function ExpenseForm({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    paymentMethod: '',
    reference: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setForm({ amount: '', category: '', date: new Date().toISOString().slice(0, 10), description: '', paymentMethod: '', reference: '' })
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!form.amount || !form.category) {
      setError('Amount and category are required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = { ...form, type: 'expense', amount: parseFloat(form.amount) || 0 }
      const data = await transactionApi.create(payload)
      onSaved?.(data)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Failed to record expense')
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Expense">
      <div className="form">
        <div className="formGroup">
          <label className="label required">Amount ($)</label>
          <Input type="number" value={form.amount} onChange={(e) => updateField('amount', e.target.value)} placeholder="0.00" />
        </div>
        <div className="formGroup">
          <label className="label required">Category</label>
          <select className="select" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
            <option value="">Select Category</option>
            <option value="salary">Salary</option>
            <option value="rent">Rent</option>
            <option value="utilities">Utilities</option>
            <option value="supplies">Supplies</option>
            <option value="marketing">Marketing</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label required">Date</label>
          <Input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} />
        </div>
        <div className="formGroup">
          <label className="label">Description</label>
          <textarea
            className="inputField"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Expense description"
            style={{ resize: 'vertical' }}
          />
        </div>
        <div className="formGroup">
          <label className="label">Payment Method</label>
          <select className="select" value={form.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)}>
            <option value="">Select Method</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="check">Check</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Reference</label>
          <Input value={form.reference} onChange={(e) => updateField('reference', e.target.value)} placeholder="Invoice or receipt number" />
        </div>
        {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Expense'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
