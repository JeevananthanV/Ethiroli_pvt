import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx'
import Button from '../../common/components/Button/Button.jsx'
import Modal from '../../common/components/Modal/Modal.jsx'
import Input from '../../common/components/Input/Input.jsx'
import { payrollApi } from '../../services/api/payrollApi.js'

export default function PayrollHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [monthFilter, setMonthFilter] = useState('')

  useEffect(() => {
    loadHistory()
  }, [monthFilter, loadHistory])

  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await payrollApi.getHistory()
      let items = Array.isArray(data) ? data : []
      if (monthFilter) {
        items = items.filter((r) => r.month === monthFilter)
      }
      setRecords(items)
    } catch (err) {
      setError(err.message || 'Failed to load payroll history')
    } finally {
      setLoading(false)
    }
  }, [monthFilter])

  const formatCurrency = (val) => {
    if (!val) return '$0.00'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <AdminPage
      title="Payroll History"
      subtitle="View processed payroll records"
      loading={loading}
      error={error}
      onRetry={loadHistory}
      actions={
        <Input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          placeholder="Filter by month"
          style={{ width: '180px' }}
        />
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Bonus</th>
                <th>Net Salary</th>
                <th>Processed On</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No payroll records found</span>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 500 }}>{record.employeeName || record.employeeId || '-'}</td>
                    <td>{record.month || '-'}</td>
                    <td>{formatCurrency(record.basicSalary)}</td>
                    <td className="textSuccess">+{formatCurrency(record.allowances)}</td>
                    <td className="textDanger">-{formatCurrency(record.deductions)}</td>
                    <td className="textSuccess">+{formatCurrency(record.bonus)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(record.netSalary)}</td>
                    <td>{formatDate(record.processedAt || record.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}
