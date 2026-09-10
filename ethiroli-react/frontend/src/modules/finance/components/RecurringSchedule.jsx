import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { transactionApi } from '../../services/api/transactionApi'

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

export default function RecurringSchedule() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [form, setForm] = useState({
    name: '',
    type: 'transaction',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    isActive: true,
  })

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await transactionApi.getAll()
      setSchedules(data.filter((s) => s.isRecurring))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingSchedule(null)
    setForm({ name: '', type: 'transaction', amount: '', frequency: 'monthly', startDate: '', endDate: '', isActive: true })
    setModalOpen(true)
  }

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule)
    setForm({
      name: schedule.name || '',
      type: schedule.type || 'transaction',
      amount: schedule.amount || '',
      frequency: schedule.frequency || 'monthly',
      startDate: schedule.startDate || '',
      endDate: schedule.endDate || '',
      isActive: schedule.isActive ?? true,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        isRecurring: true,
      }
      if (editingSchedule) {
        await transactionApi.update(editingSchedule.id, payload)
        setSchedules(schedules.map((s) => (s.id === editingSchedule.id ? { ...s, ...payload } : s)))
      } else {
        const data = await transactionApi.create(payload)
        setSchedules([...schedules, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Recurring Schedules"
      subtitle="Manage recurring transactions and invoices"
      loading={loading}
      error={error}
      onRetry={loadSchedules}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          Create Schedule
        </Button>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No recurring schedules found</span>
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.name}</td>
                    <td>{schedule.type}</td>
                    <td>${(schedule.amount || 0).toLocaleString()}</td>
                    <td>{schedule.frequency}</td>
                    <td>{schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : '-'}</td>
                    <td>{schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className={`statusTag ${schedule.isActive ? 'active' : 'pending'}`}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(schedule)}>
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
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSchedule ? 'Edit Schedule' : 'Create Schedule'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Schedule name" />
          </div>
          <div className="formGroup">
            <label className="label required">Type</label>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="transaction">Transaction</option>
              <option value="invoice">Invoice</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label required">Amount</label>
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
          </div>
          <div className="formGroup">
            <label className="label required">Frequency</label>
            <select className="select" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label className="label required">Start Date</label>
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div className="formGroup">
            <label className="label">End Date</label>
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingSchedule ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
