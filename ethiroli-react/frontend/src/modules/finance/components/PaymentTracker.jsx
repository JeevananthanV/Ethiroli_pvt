import React, { useState, useEffect, useCallback } from 'react'
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx'
import Button from '../../common/components/Button/Button.jsx'
import { paymentApi } from '../../services/api/paymentApi.js'

export default function PaymentTracker() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const loadPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentApi.getAll()
      let items = Array.isArray(data) ? data : []
      if (statusFilter) {
        items = items.filter((p) => p.status === statusFilter)
      }
      setPayments(items)
    } catch (err) {
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const handleStatusUpdate = async (id, status) => {
    try {
      await paymentApi.updateStatus(id, status)
      setPayments(payments.map((p) => (p.id === id ? { ...p, status } : p)))
    } catch (err) {
      setError(err.message || 'Failed to update payment status')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'active'
      case 'pending':
        return 'pending'
      case 'failed':
        return 'error'
      case 'refunded':
        return 'pending'
      default:
        return 'pending'
    }
  }

  const formatCurrency = (val) => {
    if (!val) return '$0.00'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const due = new Date(dueDate)
    const today = new Date()
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <AdminPage
      title="Payment Tracker"
      subtitle="Track and manage payments"
      loading={loading}
      error={error}
      onRetry={loadPayments}
      actions={
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Invoice</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No payments found</span>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const daysUntilDue = getDaysUntilDue(payment.dueDate)
                  return (
                    <tr key={payment.id}>
                      <td style={{ fontWeight: 500 }}>{payment.paymentNumber || `PAY-${payment.id}`}</td>
                      <td>{payment.invoiceId || payment.invoiceNumber || '-'}</td>
                      <td>{payment.clientName || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(payment.amount)}</td>
                      <td>
                        {formatDate(payment.dueDate)}
                        {daysUntilDue !== null && payment.status === 'pending' && (
                          <span className={`textMuted`} style={{ marginLeft: '8px', fontSize: '12px' }}>
                            ({daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? 'Due today' : `${Math.abs(daysUntilDue)} days overdue`})
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`statusTag ${getStatusClass(payment.status)}`}>
                          {payment.status || 'pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {payment.status === 'pending' && (
                            <Button size="small" variant="success" onClick={() => handleStatusUpdate(payment.id, 'completed')}>
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}
