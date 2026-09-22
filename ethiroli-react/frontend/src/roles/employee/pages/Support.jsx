import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: 'IT_SUPPORT',
    priority: 'MEDIUM',
    subject: '',
    description: '',
  });

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getSupportTickets();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setTickets(list);
    } catch (err) {
      setError(err.message || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await employeePortalApi.createSupportTicket(formData);
      setShowModal(false);
      setFormData({ category: 'IT_SUPPORT', priority: 'MEDIUM', subject: '', description: '' });
      await loadTickets();
    } catch (err) {
      setError(err.message || 'Failed to submit support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge bg-primary">Open</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-info text-dark">In Progress</span>;
      case 'RESOLVED':
        return <span className="badge bg-success">Resolved</span>;
      case 'CLOSED':
        return <span className="badge bg-secondary">Closed</span>;
      default:
        return <span className="badge bg-light text-dark border">{status || 'Pending'}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="badge bg-danger">Urgent</span>;
      case 'HIGH':
        return <span className="badge bg-warning text-dark">High</span>;
      default:
        return <span className="badge bg-light text-dark border">{priority || 'Medium'}</span>;
    }
  };

  return (
    <AdminPage
      title="Help Desk & Support"
      subtitle="Submit service requests for IT equipment, HR inquiries, and payroll assistance"
      loading={loading}
      error={error}
      onRetry={loadTickets}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0 fw-bold">My Support Tickets</h5>
          <small className="text-muted">Track resolutions and support ticket status</small>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle"></i>
          <span>Create Ticket</span>
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-life-preserver fs-2 d-block mb-2"></i>
                    No support tickets logged. If you need any assistance, click Create Ticket.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <code className="text-primary fw-bold">{t.ticket_number || t.id.slice(0, 8)}</code>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{t.subject}</div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '300px' }}>
                        {t.description}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {t.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{getPriorityBadge(t.priority)}</td>
                    <td className="text-muted small">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>{getStatusBadge(t.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Open Support Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="IT_SUPPORT">IT Support & Hardware</option>
                      <option value="HR_QUERY">HR Policy & Leave Inquiries</option>
                      <option value="PAYROLL_ISSUE">Payroll & Reimbursements</option>
                      <option value="FACILITIES">Facilities & Office Access</option>
                      <option value="ADMIN">Administrative Requests</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Priority Level</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent / Critical</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Brief summary of the issue"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Detailed Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Explain the problem or request in detail..."
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Create Ticket'}
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
