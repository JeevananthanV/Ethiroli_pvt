import React, { useState, useEffect } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { invoiceApi } from '../../../services/api/invoiceApi.js'

export default function InvoiceGenerator({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    items: [{ description: '', quantity: 1, rate: '' }],
    taxRate: '',
    notes: '',
    status: 'draft',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setForm({
        clientName: '',
        clientEmail: '',
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        items: [{ description: '', quantity: 1, rate: '' }],
        taxRate: '',
        notes: '',
        status: 'draft',
      })
      setError(null)
    }
  }, [isOpen])

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const updateItem = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setForm({ ...form, items: newItems })
  }

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, rate: '' }] })
  }

  const removeItem = (index) => {
    if (form.items.length > 1) {
      setForm({ ...form, items: form.items.filter((_, i) => i !== index) })
    }
  }

  const subtotal = form.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0)
  const taxRate = parseFloat(form.taxRate) || 0
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  const handleSubmit = async () => {
    if (!form.clientName || form.items.length === 0) {
      setError('Client name and at least one item are required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...form,
        items: form.items.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
        })),
        subtotal,
        taxAmount,
        total,
      }
      const data = await invoiceApi.create(payload)
      onSaved?.(data)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Failed to create invoice')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Invoice" style={{ maxWidth: '800px' }}>
      <div className="form">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label required">Client Name</label>
            <Input value={form.clientName} onChange={(e) => updateField('clientName', e.target.value)} placeholder="Client name" />
          </div>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label">Client Email</label>
            <Input type="email" value={form.clientEmail} onChange={(e) => updateField('clientEmail', e.target.value)} placeholder="client@example.com" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label required">Issue Date</label>
            <Input type="date" value={form.issueDate} onChange={(e) => updateField('issueDate', e.target.value)} />
          </div>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label required">Due Date</label>
            <Input type="date" value={form.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Line Items</h3>
            <Button size="small" variant="secondary" onClick={addItem}>
              Add Item
            </Button>
          </div>
          <div className="cardBody">
            {form.items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 3 }}>
                  <label className="label">Description</label>
                  <Input value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Item description" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Qty</label>
                  <Input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Rate ($)</label>
                  <Input type="number" value={item.rate} onChange={(e) => updateItem(index, 'rate', e.target.value)} />
                </div>
                <div>
                  <Button size="small" variant="danger" onClick={() => removeItem(index)} disabled={form.items.length <= 1}>
                    &times;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label">Tax Rate (%)</label>
            <Input type="number" value={form.taxRate} onChange={(e) => updateField('taxRate', e.target.value)} placeholder="0" />
          </div>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label">Notes</label>
            <Input value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Additional notes" />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px', background: 'var(--admin-bg-light)' }}>
          <div className="cardBody" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="textSecondary">Subtotal</span>
              <span style={{ color: 'var(--admin-text-primary)' }}>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="textSecondary">Tax ({taxRate}%)</span>
              <span style={{ color: 'var(--admin-warning)' }}>${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span style={{ color: 'var(--admin-text-primary)' }}>Total</span>
              <span style={{ color: 'var(--admin-text-primary)' }}>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
