import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Leaves() {
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    leave_type: 'CASUAL',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const loadLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getLeavesAndBalances();
      const payload = res?.data || res;
      setBalances(payload?.balances || []);
      setRequests(payload?.requests || []);
    } catch (err) {
      setError(err.message || 'Failed to load leaves and balances');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      await employeePortalApi.applyLeave(formData);
      setSuccessMsg('Leave request submitted successfully for manager approval!');
      setShowModal(false);
      setFormData({ leave_type: 'CASUAL', start_date: '', end_date: '', reason: '' });
      await loadLeaves();
    } catch (err) {
      setError(err.message || 'Failed to submit leave application');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (String(status).toUpperCase()) {
      case 'APPROVED':
        return <span className="badge bg-success">Approved</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  return (
    <AdminPage
      title="Leave Management & Balances"
      subtitle="Track your statutory leave allocations, balance quotas, and submit time-off requests"
      loading={loading}
      error={error}
      onRetry={loadLeaves}
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Balances Row */}
      <div className="row g-3 mb-4">
        {balances.map((b) => (
          <div key={b.leave_type} className="col-md-4">
            <div className="card shadow-sm border-0 h-100 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                  {b.leave_type} LEAVE
                </span>
                <i className="bi bi-calendar-check text-muted"></i>
              </div>
              <div className="d-flex align-items-baseline gap-2 mt-2">
                <span className="fw-bold fs-2 text-dark">{b.balance ?? b.total_credited}</span>
                <span className="text-muted small">days remaining</span>
              </div>
              <div className="text-muted small mt-2">
                Credited: {b.total_credited || 0} | Consumed: {b.consumed || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Table & Action */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">My Leave Applications</h6>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle"></i>
            <span>Apply for Leave</span>
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-calendar-x fs-2 d-block mb-2"></i>
                    No leave requests found. Click "Apply for Leave" to request time off.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span className="badge bg-light text-dark border">{req.leave_type}</span>
                    </td>
                    <td className="fw-medium text-dark">{new Date(req.start_date).toLocaleDateString()}</td>
                    <td className="fw-medium text-dark">{new Date(req.end_date).toLocaleDateString()}</td>
                    <td className="text-muted small" style={{ maxWidth: '250px' }}>{req.reason}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td className="text-muted small">
                      {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Apply for Time Off</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Leave Type</label>
                    <select
                      className="form-select"
                      value={formData.leave_type}
                      onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    >
                      <option value="CASUAL">Casual Leave</option>
                      <option value="SICK">Sick / Medical Leave</option>
                      <option value="EARNED">Earned / Privilege Leave</option>
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Reason for Absence</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Brief explanation for your manager..."
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
