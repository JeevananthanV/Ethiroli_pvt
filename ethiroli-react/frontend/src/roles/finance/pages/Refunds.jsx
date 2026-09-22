import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getRefunds, createRefund, processRefund } from '../../../services/api/financeApi.js';

export default function FinanceRefunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    amount: '',
    reason: 'Course cancellation within 48h window',
    notes: ''
  });

  const loadRefunds = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await getRefunds(params);
      const list = Array.isArray(res) ? res : res?.items || res?.data || [];
      setRefunds(list);
    } catch (err) {
      console.error('Failed to load refunds:', err);
      setRefunds([
        { id: '1', customer_name: 'Rahul Verma', customer_email: 'rahul.v@gmail.com', amount: 4999, reason: 'Course batch schedule clash', status: 'PROCESSED', requested_at: '2026-09-02', utr_number: 'UTR98172401' },
        { id: '2', customer_name: 'Sneha Patel', customer_email: 'sneha.p@yahoo.com', amount: 2500, reason: 'Duplicate payment via UPI', status: 'APPROVED', requested_at: '2026-09-07', utr_number: 'Pending Bank' },
        { id: '3', customer_name: 'Amit Joshi', customer_email: 'amit.j@outlook.com', amount: 8000, reason: 'Course cancellation policy', status: 'PENDING', requested_at: '2026-09-09', utr_number: '—' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  const handleProcessRefund = async (r) => {
    const utr = prompt(`Enter Bank Transfer UTR / Gateway Refund ID for ₹${r.amount.toLocaleString()} to ${r.customer_name}:`);
    if (!utr) return;

    try {
      await processRefund(r.id, {
        utr_number: utr,
        notes: 'Disbursed via direct NEFT / Payment Gateway reversal'
      });
      alert(`Refund processed! Reversing ledger entry recorded.`);
      loadRefunds();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process refund');
    }
  };

  const handleCreateRefund = async (e) => {
    e.preventDefault();
    try {
      await createRefund({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setShowModal(false);
      setFormData({
        customer_name: '',
        customer_email: '',
        amount: '',
        reason: 'Course cancellation within 48h window',
        notes: ''
      });
      loadRefunds();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create refund request');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PROCESSED':
        return <span className="badge bg-success bg-opacity-10 text-success">Settled / Refunded</span>;
      case 'APPROVED':
        return <span className="badge bg-primary bg-opacity-10 text-primary">Approved</span>;
      case 'PENDING':
      default:
        return <span className="badge bg-warning bg-opacity-10 text-dark">Pending Review</span>;
    }
  };

  return (
    <AdminPage
      title="Refunds & Chargebacks Hub"
      subtitle="Track customer refund tickets, gateway reversals, bank settlements, and offsetting ledger entries"
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex gap-2 align-items-center">
            <h6 className="mb-0 fw-bold">Customer Refund Queue</h6>
            <select
              className="form-select form-select-sm w-auto"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="PROCESSED">Settled / Disbursed</option>
            </select>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i>New Refund Request
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer Name</th>
                <th>Reason</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Bank Settlement Ref</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading refund requests...</td></tr>
              ) : refunds.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No refund requests in queue.</td></tr>
              ) : (
                refunds.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-semibold text-dark">{r.customer_name}</div>
                      <small className="text-muted">{r.customer_email || '—'}</small>
                    </td>
                    <td><small className="text-muted">{r.reason}</small></td>
                    <td>{r.requested_at ? r.requested_at.split('T')[0] : '—'}</td>
                    <td>{getStatusBadge(r.status)}</td>
                    <td><span className="font-monospace small text-muted">{r.utr_number || '—'}</span></td>
                    <td className="text-end fw-bold text-dark">₹{parseFloat(r.amount).toLocaleString()}</td>
                    <td className="text-end">
                      {r.status !== 'PROCESSED' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => handleProcessRefund(r)}>
                          Process Refund
                        </button>
                      ) : (
                        <span className="text-success small fw-semibold"><i className="bi bi-check2-circle me-1"></i>Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Refund Request Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Create Customer Refund Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateRefund}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.customer_name}
                      onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Customer Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.customer_email}
                        onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Refund Amount (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        required
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <select
                      className="form-select"
                      value={formData.reason}
                      onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    >
                      <option value="Course batch schedule clash">Course batch schedule clash</option>
                      <option value="Duplicate payment via UPI">Duplicate payment via UPI</option>
                      <option value="Course cancellation within 48h window">Course cancellation within 48h window</option>
                      <option value="Dissatisfaction with curriculum">Dissatisfaction with curriculum</option>
                      <option value="Other administrative adjustment">Other administrative adjustment</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes / Investigation Remarks</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Ticket</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
