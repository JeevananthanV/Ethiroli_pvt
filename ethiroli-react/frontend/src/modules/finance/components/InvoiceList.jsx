import React, { useState, useEffect, useCallback } from 'react'
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx'
import Button from '../../common/components/Button/Button.jsx'
import { invoiceApi } from '../../services/api/invoiceApi.js'

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  const loadInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await invoiceApi.getAll()
      let items = Array.isArray(data) ? data : []
      if (statusFilter) {
        items = items.filter((i) => i.status === statusFilter)
      }
      setInvoices(items)
    } catch (err) {
      setError(err.message || 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const handleStatusUpdate = async (id, status) => {
    try {
      await invoiceApi.updateStatus(id, status)
      setInvoices(invoices.map((i) => (i.id === id ? { ...i, status } : i)))
    } catch (err) {
      setError(err.message || 'Failed to update invoice status')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'active'
      case 'pending':
        return 'pending'
      case 'overdue':
        return 'error'
      case 'draft':
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

  return (
    <AdminPage
      title="Invoices"
      subtitle="Manage and track invoices"
      loading={loading}
      error={error}
      onRetry={loadInvoices}
      actions={
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No invoices found</span>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td style={{ fontWeight: 500 }}>{invoice.invoiceNumber || `INV-${invoice.id}`}</td>
                    <td>{invoice.clientName || '-'}</td>
                    <td>{formatDate(invoice.issueDate)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(invoice.total)}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(invoice.status)}`}>
                        {invoice.status || 'draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {invoice.status === 'pending' && (
                          <>
                            <Button size="small" variant="success" onClick={() => handleStatusUpdate(invoice.id, 'paid')}>
                              Mark Paid
                            </Button>
                            <Button size="small" variant="danger" onClick={() => handleStatusUpdate(invoice.id, 'overdue')}>
                              Mark Overdue
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
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
