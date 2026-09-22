import React, { useState, useEffect } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { payrollApi } from '../../../services/api/payrollApi.js'

export default function SalaryStructureForm({ isOpen, onClose, onSaved, structure }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    basicSalary: '',
    allowances: [{ name: 'HRA', amount: '' }, { name: 'TA', amount: '' }],
    deductions: [{ name: 'PF', amount: '' }, { name: 'ESI', amount: '' }],
    effectiveFrom: new Date().toISOString().slice(0, 10),
    isActive: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      if (structure) {
        setForm({
          name: structure.name || '',
          description: structure.description || '',
          basicSalary: structure.basicSalary || '',
          allowances: structure.allowances?.length ? structure.allowances : [{ name: 'HRA', amount: '' }, { name: 'TA', amount: '' }],
          deductions: structure.deductions?.length ? structure.deductions : [{ name: 'PF', amount: '' }, { name: 'ESI', amount: '' }],
          effectiveFrom: structure.effectiveFrom ? structure.effectiveFrom.slice(0, 10) : new Date().toISOString().slice(0, 10),
          isActive: structure.isActive ?? true,
        })
      } else {
        setForm({
          name: '',
          description: '',
          basicSalary: '',
          allowances: [{ name: 'HRA', amount: '' }, { name: 'TA', amount: '' }],
          deductions: [{ name: 'PF', amount: '' }, { name: 'ESI', amount: '' }],
          effectiveFrom: new Date().toISOString().slice(0, 10),
          isActive: true,
        })
      }
      setError(null)
    }
  }, [isOpen, structure])

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const updateAllowance = (index, field, value) => {
    const newAllowances = [...form.allowances]
    newAllowances[index] = { ...newAllowances[index], [field]: value }
    setForm({ ...form, allowances: newAllowances })
  }

  const updateDeduction = (index, field, value) => {
    const newDeductions = [...form.deductions]
    newDeductions[index] = { ...newDeductions[index], [field]: value }
    setForm({ ...form, deductions: newDeductions })
  }

  const addAllowance = () => {
    setForm({ ...form, allowances: [...form.allowances, { name: '', amount: '' }] })
  }

  const addDeduction = () => {
    setForm({ ...form, deductions: [...form.deductions, { name: '', amount: '' }] })
  }

  const removeAllowance = (index) => {
    if (form.allowances.length > 1) {
      setForm({ ...form, allowances: form.allowances.filter((_, i) => i !== index) })
    }
  }

  const removeDeduction = (index) => {
    if (form.deductions.length > 1) {
      setForm({ ...form, deductions: form.deductions.filter((_, i) => i !== index) })
    }
  }

  const calculateTotalAllowances = () => {
    return form.allowances.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0)
  }

  const calculateTotalDeductions = () => {
    return form.deductions.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  }

  const calculateGross = () => {
    return (parseFloat(form.basicSalary) || 0) + calculateTotalAllowances()
  }

  const calculateNet = () => {
    return calculateGross() - calculateTotalDeductions()
  }

  const handleSubmit = async () => {
    if (!form.name || !form.basicSalary) {
      setError('Name and basic salary are required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...form,
        basicSalary: parseFloat(form.basicSalary) || 0,
        allowances: form.allowances.map((a) => ({ ...a, amount: parseFloat(a.amount) || 0 })),
        deductions: form.deductions.map((d) => ({ ...d, amount: parseFloat(d.amount) || 0 })),
      }
      if (structure?.id) {
        await payrollApi.updateStructure(structure.id, payload)
      } else {
        await payrollApi.createStructure(payload)
      }
      onSaved?.(payload)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Failed to save salary structure')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={structure ? 'Edit Salary Structure' : 'Create Salary Structure'} style={{ maxWidth: '700px' }}>
      <div className="form">
        <div className="formGroup">
          <label className="label required">Structure Name</label>
          <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g., Software Engineer L1" />
        </div>
        <div className="formGroup">
          <label className="label">Description</label>
          <Input value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Structure description" />
        </div>
        <div className="formGroup">
          <label className="label required">Basic Salary ($)</label>
          <Input type="number" value={form.basicSalary} onChange={(e) => updateField('basicSalary', e.target.value)} placeholder="0.00" />
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Allowances</h3>
            <Button size="small" variant="secondary" onClick={addAllowance}>
              Add
            </Button>
          </div>
          <div className="cardBody">
            {form.allowances.map((allowance, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <label className="label">Name</label>
                  <Input value={allowance.name} onChange={(e) => updateAllowance(index, 'name', e.target.value)} placeholder="HRA" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Amount ($)</label>
                  <Input type="number" value={allowance.amount} onChange={(e) => updateAllowance(index, 'amount', e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <Button size="small" variant="danger" onClick={() => removeAllowance(index)} disabled={form.allowances.length <= 1}>
                    &times;
                  </Button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'right', fontWeight: 600, color: 'var(--admin-success)' }}>
              Total Allowances: ${calculateTotalAllowances().toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Deductions</h3>
            <Button size="small" variant="secondary" onClick={addDeduction}>
              Add
            </Button>
          </div>
          <div className="cardBody">
            {form.deductions.map((deduction, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <label className="label">Name</label>
                  <Input value={deduction.name} onChange={(e) => updateDeduction(index, 'name', e.target.value)} placeholder="PF" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Amount ($)</label>
                  <Input type="number" value={deduction.amount} onChange={(e) => updateDeduction(index, 'amount', e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <Button size="small" variant="danger" onClick={() => removeDeduction(index)} disabled={form.deductions.length <= 1}>
                    &times;
                  </Button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'right', fontWeight: 600, color: 'var(--admin-danger)' }}>
              Total Deductions: ${calculateTotalDeductions().toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div className="formGroup" style={{ flex: 1 }}>
            <label className="label">Effective From</label>
            <Input type="date" value={form.effectiveFrom} onChange={(e) => updateField('effectiveFrom', e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px', background: 'var(--admin-bg-light)' }}>
          <div className="cardBody" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="textSecondary">Gross Salary</span>
              <span style={{ color: 'var(--admin-text-primary)', fontWeight: 600 }}>${calculateGross().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="textSecondary">Total Deductions</span>
              <span style={{ color: 'var(--admin-danger)', fontWeight: 600 }}>-${calculateTotalDeductions().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: 'var(--admin-text-primary)' }}>Net Salary</span>
              <span className="textSuccess" style={{ fontSize: '18px' }}>${calculateNet().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : structure ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
