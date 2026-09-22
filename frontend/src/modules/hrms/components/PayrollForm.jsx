import React, { useState, useEffect } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { payrollApi } from '../../../services/api/payrollApi.js'

export default function PayrollForm({ isOpen, onClose, onSaved, employees }) {
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    month: new Date().toISOString().slice(0, 7),
    basicSalary: '',
    allowances: '',
    deductions: '',
    bonus: '',
    netSalary: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setForm({
        employeeId: '',
        employeeName: '',
        month: new Date().toISOString().slice(0, 7),
        basicSalary: '',
        allowances: '',
        deductions: '',
        bonus: '',
        netSalary: '',
      })
      setError(null)
    }
  }, [isOpen])

  const calculateNet = () => {
    const basic = parseFloat(form.basicSalary) || 0
    const allowances = parseFloat(form.allowances) || 0
    const deductions = parseFloat(form.deductions) || 0
    const bonus = parseFloat(form.bonus) || 0
    return basic + allowances + bonus - deductions
  }

  const handleSubmit = async () => {
    if (!form.employeeId || !form.basicSalary) {
      setError('Employee and basic salary are required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const netSalary = calculateNet()
      const payload = { ...form, basicSalary: parseFloat(form.basicSalary) || 0, allowances: parseFloat(form.allowances) || 0, deductions: parseFloat(form.deductions) || 0, bonus: parseFloat(form.bonus) || 0, netSalary }
      const data = await payrollApi.create(payload)
      onSaved?.(data)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Failed to process payroll')
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Payroll">
      <div className="form">
        <div className="formGroup">
          <label className="label required">Employee</label>
          <select
            className="select"
            value={form.employeeId}
            onChange={(e) => {
              const emp = employees?.find((emp) => emp.id === e.target.value)
              updateField('employeeId', e.target.value)
              updateField('employeeName', emp?.name || '')
            }}
          >
            <option value="">Select Employee</option>
            {employees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div className="formGroup">
          <label className="label required">Month</label>
          <Input type="month" value={form.month} onChange={(e) => updateField('month', e.target.value)} />
        </div>
        <div className="formGroup">
          <label className="label required">Basic Salary ($)</label>
          <Input type="number" value={form.basicSalary} onChange={(e) => updateField('basicSalary', e.target.value)} placeholder="0.00" />
        </div>
        <div className="formGroup">
          <label className="label">Allowances ($)</label>
          <Input type="number" value={form.allowances} onChange={(e) => updateField('allowances', e.target.value)} placeholder="0.00" />
        </div>
        <div className="formGroup">
          <label className="label">Deductions ($)</label>
          <Input type="number" value={form.deductions} onChange={(e) => updateField('deductions', e.target.value)} placeholder="0.00" />
        </div>
        <div className="formGroup">
          <label className="label">Bonus ($)</label>
          <Input type="number" value={form.bonus} onChange={(e) => updateField('bonus', e.target.value)} placeholder="0.00" />
        </div>
        <div className="card" style={{ marginBottom: '16px', background: 'var(--admin-bg-light)' }}>
          <div className="cardBody" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span style={{ color: 'var(--admin-text-primary)' }}>Net Salary</span>
              <span className="textSuccess" style={{ fontSize: '18px' }}>
                ${calculateNet().toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Processing...' : 'Process Payroll'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
