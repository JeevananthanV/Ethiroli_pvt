import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import DetailModal, { DetailRow, DetailSection, DetailBadge } from '../components/DetailModal.jsx';

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Renders a date column.
 *
 * A MySQL DATE arrives as an ISO timestamp (`2026-10-01T18:30:00.000Z` for the
 * stored day 2026-10-02 in Asia/Kolkata), so a bare `toLocaleDateString()`
 * renders the previous day. Date-only strings are pinned to local midnight and
 * timestamps are rendered in local time, which gives the day the user expects.
 */
const formatDay = (value) => {
  if (!value) return null;
  const raw = String(value);
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
};

const formatDayTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

export default function Leaves() {
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [formData, setFormData] = useState({
    leave_type: 'CASUAL',
    start_date: '',
    end_date: '',
    reason: '',
  });

  /**
   * Inclusive calendar-day count between two `yyyy-mm-dd` values.
   * A single selected day counts as 1, and an end before the start yields 0.
   */
  const countDays = (start, end) => {
    if (!start || !end) return 0;
    // Accept both a plain yyyy-mm-dd value and an ISO timestamp.
    const toDay = (v) => {
      const m = String(v).match(/^(\d{4}-\d{2}-\d{2})/);
      return m ? new Date(`${m[1]}T00:00:00`) : new Date(v);
    };
    const a = toDay(start);
    const b = toDay(end);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
    const diff = Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : 0;
  };

  // Live day count shown in the Apply for Leave modal.
  const requestedDays = countDays(formData.start_date, formData.end_date);

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
    if (formData.end_date && formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      setError('End date must be on or after the start date.');
      setSubmitting(false);
      return;
    }
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
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-2" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Balances Row */}
      <div className="row g-3 mb-2">
        {balances.length === 0 ? (
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center gap-3 py-4">
                <i className="bi bi-info-circle text-primary fs-3"></i>
                <div>
                  <div className="fw-bold text-dark">No leave balance on record</div>
                  <div className="text-muted small mb-0">
                    HR has not published a leave entitlement for you yet, so no balance is
                    shown. You can still submit a request below and HR will review it.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
        balances.map((b) => (
          <div key={b.leave_type} className="col-md-4">
            <div className="card shadow-sm border-0 h-100 p-3 bg-white">
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
                Credited: {b.total_credited || 0} day{(b.total_credited || 0) === 1 ? '' : 's'}
                {' · '}Consumed: {b.consumed || 0} day{(b.consumed || 0) === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        ))
        )}
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
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Decision</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <i className="bi bi-calendar-x fs-2 d-block mb-2"></i>
                    No leave requests found. Click &quot;Apply for Leave&quot; to request time off.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="emp-row-clickable"
                    onClick={() => setSelectedRequest(req)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${req.leave_type} leave from ${formatDay(req.start_date)}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedRequest(req);
                      }
                    }}
                  >
                    <td>
                      <span className="badge bg-light text-dark border">{req.leave_type}</span>
                    </td>
                    <td className="fw-medium text-dark">{formatDay(req.start_date)}</td>
                    <td className="fw-medium text-dark">{formatDay(req.end_date)}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {countDays(req.start_date, req.end_date)} day{countDays(req.start_date, req.end_date) === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="text-muted small emp-clamp-cell">{req.reason}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    {/* Who approved or declined it, and when. Resolved server-side
                        from leaves.approved_by - without this column the employee
                        could see only a bare APPROVED badge. */}
                    <td>
                      {req.status === 'PENDING' ? (
                        <span className="text-muted small">Awaiting review</span>
                      ) : (
                        <div className="emp-decision__by">
                          <div className="fw-semibold text-dark">
                            {req.reviewed_by_name || 'Reviewer'}
                          </div>
                          <div className="text-muted">
                            {req.reviewed_by_role
                              ? humanise(req.reviewed_by_role)
                              : 'Approved by HR'}
                            {req.reviewed_at ? ` · ${formatDay(req.reviewed_at)}` : ''}
                          </div>
                          {req.review_note && (
                            <div className="text-muted fst-italic mt-1">
                              &ldquo;{req.review_note}&rdquo;
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="text-muted small">
                      {req.created_at ? formatDay(req.created_at) : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full request detail, including who reviewed it and when. */}
      <DetailModal
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        icon="bi-calendar-check"
        accent={
          selectedRequest?.status === 'APPROVED' ? 'success'
            : selectedRequest?.status === 'REJECTED' ? 'danger'
              : 'warning'
        }
        title={selectedRequest ? `${humanise(selectedRequest.leave_type)} leave` : 'Leave request'}
        subtitle={
          selectedRequest
            ? `${formatDay(selectedRequest.start_date)} → ${formatDay(selectedRequest.end_date)}`
            : ''
        }
        badge={selectedRequest && getStatusBadge(selectedRequest.status)}
        footer={
          selectedRequest && (
            <button type="button" className="btn btn-light" onClick={() => setSelectedRequest(null)}>
              Close
            </button>
          )
        }
      >
        {selectedRequest && (
          <>
            <DetailSection title="Request">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Leave type" value={humanise(selectedRequest.leave_type)} />
                <DetailRow label="From" value={formatDay(selectedRequest.start_date)} />
                <DetailRow label="To" value={formatDay(selectedRequest.end_date)} />
                <DetailRow
                  label="Duration"
                  value={`${countDays(selectedRequest.start_date, selectedRequest.end_date)} day${countDays(selectedRequest.start_date, selectedRequest.end_date) === 1 ? '' : 's'}`}
                />
                <DetailRow label="Applied on" value={formatDayTime(selectedRequest.created_at)} />
                <DetailRow label="Request ID" value={selectedRequest.id} mono />
              </dl>
            </DetailSection>

            <DetailSection title="Reason" icon="bi-chat-left-text">
              <p className="emp-detail__prose mb-0">{selectedRequest.reason}</p>
            </DetailSection>

            <DetailSection title="Decision" icon="bi-person-check">
              {selectedRequest.status === 'PENDING' ? (
                <div className="emp-decision emp-decision--pending">
                  <div className="fw-semibold text-dark">
                    <i className="bi bi-hourglass-split me-2" aria-hidden="true"></i>
                    Waiting for review
                  </div>
                  <div className="emp-decision__by">
                    Your request has been sent to HR. You will be notified here and on the
                    Notifications page as soon as a decision is made.
                  </div>
                </div>
              ) : (
                <div
                  className={`emp-decision emp-decision--${selectedRequest.status === 'APPROVED' ? 'approved' : 'rejected'}`}
                >
                  <div className="fw-semibold text-dark">
                    <i
                      className={`bi ${selectedRequest.status === 'APPROVED' ? 'bi-check-circle' : 'bi-x-circle'} me-2`}
                      aria-hidden="true"
                    ></i>
                    {selectedRequest.status === 'APPROVED' ? 'Approved' : 'Declined'}
                  </div>
                  <div className="emp-decision__by">
                    {selectedRequest.reviewed_by_name || 'HR'} ({humanise(selectedRequest.reviewed_by_role) || 'Reviewer'})
                    {selectedRequest.reviewed_at ? ` · ${formatDayTime(selectedRequest.reviewed_at)}` : ''}
                  </div>
                  {selectedRequest.review_note && (
                    <div className="emp-decision__by fst-italic">
                      &ldquo;{selectedRequest.review_note}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </DetailSection>
          </>
        )}
      </DetailModal>

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
                    {requestedDays > 0 && (
                      <div className="alert alert-info d-flex align-items-center gap-2 py-2 mb-3">
                        <i className="bi bi-calendar-range" aria-hidden="true"></i>
                        <span>
                          Requesting <strong>{requestedDays}</strong> day{requestedDays === 1 ? '' : 's'} of leave
                          {' '}({formData.start_date} &rarr; {formData.end_date})
                        </span>
                      </div>
                    )}
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
