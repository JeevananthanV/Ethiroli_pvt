import React, { useState, useEffect } from 'react'
import Modal from '../../../common/components/Modal/Modal.jsx'
import Input from '../../../common/components/Input/Input.jsx'
import Button from '../../../common/components/Button/Button.jsx'
import { payrollApi } from '../../../services/api/payrollApi.js'
import { employeeApi } from '../../../services/api/employeeApi.js'

export default function PayrollRunForm({ isOpen, onClose, onSaved }) {
  const [employees, setEmployees] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadEmployees()
      setSelectedEmployees([])
      setMonth(new Date().toISOString().slice(0, 7))
      setError(null)
      setResult(null)
    }
  }, [isOpen])

  const loadEmployees = async () => {
    try {
      const data = await employeeApi.getAll()
      setEmployees(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    }
  }

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) => (prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]))
  }

  const selectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employees.map((e) => e.id))
    }
  }

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      setError('Please select at least one employee')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = { employeeIds: selectedEmployees, month }
      const data = await payrollApi.runBulk(payload)
      setResult(data)
      onSaved?.(data)
    } catch (err) {
      setError(err.message || 'Failed to run payroll')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Run Bulk Payroll" style={{ maxWidth: '700px' }}>
      <div className="form">
        <div className="formGroup">
          <label className="label required">Month</label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Select Employees</h3>
            <Button size="small" variant="secondary" onClick={selectAll}>
              {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <div className="cardBody">
            {employees.length === 0 ? (
              <div className="emptyState">
                <p className="textMuted">No employees found</p>
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--admin-border)',
                      cursor: 'pointer',
                      background: selectedEmployees.includes(emp.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--admin-primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--admin-text-primary)', fontSize: '14px' }}>{emp.name}</div>
                      <div className="textMuted" style={{ fontSize: '12px' }}>{emp.department || emp.role || '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <div className="emptyState" style={{ marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}

        {result && (
          <div className="card" style={{ marginBottom: '16px', border: '1px solid var(--admin-success)' }}>
            <div className="cardBody" style={{ padding: '16px' }}>
              <p className="textSuccess" style={{ fontWeight: 600, marginBottom: '4px' }}>Payroll Processed Successfully!</p>
              <p className="textSecondary" style={{ fontSize: '13px' }}>
                Processed {result.processedCount || selectedEmployees.length} employee(s) for {month}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting || selectedEmployees.length === 0}>
            {submitting ? 'Processing...' : `Run Payroll (${selectedEmployees.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
