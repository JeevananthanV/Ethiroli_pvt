import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { subscriptionApi } from '../../../services/api/subscriptionApi'
import { paymentApi } from '../../../services/api/paymentApi'
import { invoiceApi } from '../../../services/api/invoiceApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function AdminFinance() {
  const [subscriptions, setSubscriptions] = useState([])
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [subsData, paymentsData, invoicesData] = await Promise.all([
        subscriptionApi.getAll().catch(() => []),
        paymentApi.getAll().catch(() => []),
        invoiceApi.getAll().catch(() => []),
      ])
      setSubscriptions(subsData)
      setPayments(paymentsData)
      setInvoices(invoicesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingInvoices = invoices.filter((i) => i.status === 'pending').length

  return (
    <AdminPage
      title="Finance"
      subtitle="Manage subscriptions, payments, and invoices"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <Button onClick={() => { setShowModal(true) }}>
          New Invoice
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Revenue</div>
          <div className="statValue">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active Subscriptions</div>
          <div className="statValue">{subscriptions.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Pending Invoices</div>
          <div className="statValue">{pendingInvoices}</div>
        </div>
      </div>

      <div className="card mb4">
        <div className="cardHeader">
          <h3 className="cardTitle">Recent Payments</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="textCenter textMuted py4">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.slice(0, 10).map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>${payment.amount?.toLocaleString() || '0'}</td>
                    <td>
                      <span className={`statusTag ${payment.status === 'completed' ? 'active' : 'pending'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="textSecondary">
                      {payment.date ? new Date(payment.date).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Invoices</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="textCenter textMuted py4">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.client || 'N/A'}</td>
                    <td>${invoice.amount?.toLocaleString() || '0'}</td>
                    <td>
                      <span className={`statusTag ${invoice.status === 'paid' ? 'active' : invoice.status === 'overdue' ? 'error' : 'pending'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="textSecondary">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Invoice">
        <p className="textSecondary">Invoice creation form coming soon.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </AdminPage>
  )
}
