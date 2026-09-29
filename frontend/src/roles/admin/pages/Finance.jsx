import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { subscriptionApi } from '../../../services/api/subscriptionApi'
import { paymentApi } from '../../../services/api/paymentApi'
import { invoiceApi } from '../../../services/api/invoiceApi'
import axiosInstance from '../../../services/api/axiosInstance.js'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function AdminFinance() {
  const [subscriptions, setSubscriptions] = useState([])
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [reconcileForm, setReconcileForm] = useState({ adjustmentAmount: 0, resolutionNotes: 'Hours verified against LMS live delivery records' })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [subsData, paymentsData, invoicesData, disputesRes] = await Promise.all([
        subscriptionApi.getAll().catch(() => []),
        paymentApi.getAll().catch(() => []),
        invoiceApi.getAll().catch(() => []),
        axiosInstance.get('/v1/payroll/disputes').catch(() => ({ data: { data: [] } }))
      ])
      setSubscriptions(subsData)
      setPayments(paymentsData)
      setInvoices(invoicesData)
      setDisputes(disputesRes.data?.data || disputesRes.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleResolveDispute = async (e) => {
    e.preventDefault()
    if (!selectedDispute) return
    setSubmitting(true)
    setFeedback(null)
    try {
      await axiosInstance.post(`/v1/payroll/${selectedDispute.id}/resolve-dispute`, {
        adjustmentAmount: parseFloat(reconcileForm.adjustmentAmount) || 0,
        resolutionNotes: reconcileForm.resolutionNotes
      })
      setFeedback({
        type: 'success',
        message: `Dispute resolved successfully. Adjustment of ₹${reconcileForm.adjustmentAmount} recorded and payroll scheduled for payout.`
      })
      setSelectedDispute(null)
      loadData()
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to resolve dispute.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingInvoices = invoices.filter((i) => i.status === 'pending').length

  return (
    <AdminPage
      title="Finance & Ledger Governance"
      subtitle="Manage subscriptions, payments, accounts receivable, and cross-departmental payroll disputes"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => { setShowModal(true) }}>
            New Invoice
          </Button>
        </div>
      }
    >
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show shadow-sm mb-2`} role="alert">
          <div>{feedback.message}</div>
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      <div className="grid gridCols4 mb4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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
        <div className="statCard" style={{ borderColor: disputes.length > 0 ? 'var(--admin-warning, #f59e0b)' : undefined }}>
          <div className="statLabel">Disputed Payrolls</div>
          <div className="statValue" style={{ color: disputes.length > 0 ? '#d97706' : undefined }}>{disputes.length}</div>
          <div className="statTrend textMuted">Cross-dept alerts</div>
        </div>
      </div>

      {/* Disputed Payroll Escalations Section */}
      {disputes.length > 0 && (
        <div className="card mb4 border-warning shadow-sm" style={{ borderLeft: '4px solid #f59e0b', marginBottom: '24px' }}>
          <div className="cardHeader bg-warning bg-opacity-10 d-flex justify-content-between align-items-center p-3">
            <h4 className="cardTitle text-warning-emphasis mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill text-warning"></i>
              Cross-Departmental Payroll Disputes Awaiting Admin Reconciliation
            </h4>
            <span className="badge bg-warning text-dark">{disputes.length} Action Required</span>
          </div>
          <div className="overflowAuto p-3">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee / Tutor</th>
                  <th>Month</th>
                  <th>Current Net</th>
                  <th>Dispute Reason</th>
                  <th>Escalated At</th>
                  <th className="text-end">Administrative Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div className="fw-bold">{d.employee_name || 'Staff Member'}</div>
                      <small className="text-muted">{d.employee_email || d.employee_id}</small>
                    </td>
                    <td>{d.month_year ? new Date(d.month_year).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '-'}</td>
                    <td className="fw-semibold">₹{parseFloat(d.net_salary || 0).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-warning bg-opacity-10 text-dark border border-warning text-wrap text-start">
                        {d.dispute_reason || 'Discrepancy in hours/attendance logged'}
                      </span>
                    </td>
                    <td className="small text-muted">{d.disputed_at ? new Date(d.disputed_at).toLocaleDateString() : 'Recent'}</td>
                    <td className="text-end">
                      <button 
                        className="btn btn-primary btn-sm py-1 px-3 shadow-sm"
                        onClick={() => {
                          setSelectedDispute(d)
                          setReconcileForm({ adjustmentAmount: 0, resolutionNotes: 'Hours verified against LMS live delivery records' })
                        }}
                      >
                        Reconcile & Settle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* Reconcile Dispute Modal */}
      {selectedDispute && (
        <Modal 
          isOpen={Boolean(selectedDispute)} 
          onClose={() => setSelectedDispute(null)} 
          title="Administrative Payroll Dispute Reconciliation"
        >
          <form onSubmit={handleResolveDispute}>
            <div className="alert alert-info py-2 small mb-3">
              <i className="bi bi-info-circle-fill me-1"></i>
              Cross-reference LMS lecture delivery hours and HR attendance logs to calculate approved remuneration adjustments.
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Staff / Tutor</label>
              <div className="form-control bg-light">{selectedDispute.employee_name || 'Staff Member'} ({selectedDispute.employee_email})</div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Dispute Claim Notes</label>
              <div className="form-control bg-light text-danger">{selectedDispute.dispute_reason}</div>
            </div>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Current Net Salary</label>
                <div className="form-control bg-light font-monospace">₹{parseFloat(selectedDispute.net_salary || 0).toLocaleString()}</div>
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">Adjustment Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-control font-monospace"
                  required
                  placeholder="e.g. 18000"
                  value={reconcileForm.adjustmentAmount}
                  onChange={e => setReconcileForm({ ...reconcileForm, adjustmentAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Resolution Audit Notes</label>
              <textarea 
                className="form-control"
                rows="2"
                required
                value={reconcileForm.resolutionNotes}
                onChange={e => setReconcileForm({ ...reconcileForm, resolutionNotes: e.target.value })}
              ></textarea>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setSelectedDispute(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Reconciling...' : 'Authorize Adjustment & Payout'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

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
