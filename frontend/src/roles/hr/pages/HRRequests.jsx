import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listHRRequests, updateHRRequestStatus, createHRRequest } from '../../../../services/api/hrApi.standardized.js';

const REQUEST_TYPES = [
  'ALL',
  'Work from home',
  'Salary certificate',
  'Experience letter',
  'Document request',
  'Profile correction',
  'Bank details update',
  'Address change',
  'Other HR request'
];

const REQUEST_STATUSES = ['ALL', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED'];

const INITIAL_REQUESTS_MOCK = [
  {
    id: 'REQ-101',
    requester_name: 'Priya Raman',
    role: 'EMPLOYEE',
    designation: 'Frontend Engineer',
    department: 'Engineering',
    request_type: 'Work from home',
    priority: 'HIGH',
    details: 'Requesting remote access for 2 days due to personal transit and family function in hometown.',
    status: 'PENDING',
    submitted_date: '2026-09-28',
    hr_remarks: ''
  },
  {
    id: 'REQ-102',
    requester_name: 'Rahul Venkat',
    role: 'INTERN',
    designation: 'React & Node Intern',
    department: 'Engineering',
    request_type: 'Experience letter',
    priority: 'MEDIUM',
    details: 'Need official university endorsement / internship completion letter for semester evaluation.',
    status: 'IN_REVIEW',
    submitted_date: '2026-09-27',
    hr_remarks: 'Document drafted, pending final signature.'
  },
  {
    id: 'REQ-103',
    requester_name: 'Arun Prasad',
    role: 'EMPLOYEE',
    designation: 'Backend Tech Lead',
    department: 'Engineering',
    request_type: 'Salary certificate',
    priority: 'MEDIUM',
    details: 'Annual compensation certificate for housing finance bank loan verification.',
    status: 'APPROVED',
    submitted_date: '2026-09-25',
    hr_remarks: 'Digitally signed certificate issued to registered email.'
  },
  {
    id: 'REQ-104',
    requester_name: 'Divya Natarajan',
    role: 'EMPLOYEE',
    designation: 'HR Coordinator',
    department: 'Human Resources',
    request_type: 'Bank details update',
    priority: 'LOW',
    details: 'Updated HDFC account salary credit coordinates with attached cancelled cheque.',
    status: 'COMPLETED',
    submitted_date: '2026-09-24',
    hr_remarks: 'Payroll master database updated successfully.'
  },
  {
    id: 'REQ-105',
    requester_name: 'Siddharth M.',
    role: 'INTERN',
    designation: 'UI/UX Intern',
    department: 'Design',
    request_type: 'Document request',
    priority: 'LOW',
    details: 'Requesting verified copy of signed internship agreement.',
    status: 'PENDING',
    submitted_date: '2026-09-29',
    hr_remarks: ''
  }
];

export default function HRRequests() {
  const {
    data: fetchedRequests,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listHRRequests,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localRequests, setLocalRequests] = useState(INITIAL_REQUESTS_MOCK);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [newRequest, setNewRequest] = useState({
    requester_name: '',
    role: 'EMPLOYEE',
    department: 'Engineering',
    request_type: 'Work from home',
    priority: 'MEDIUM',
    details: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const requestsList = useMemo(() => {
    if (Array.isArray(fetchedRequests) && fetchedRequests.length > 0) {
      return fetchedRequests;
    }
    return localRequests;
  }, [fetchedRequests, localRequests]);

  const filteredRequests = useMemo(() => {
    return requestsList.filter((req) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (req.requester_name || '').toLowerCase().includes(q) ||
        (req.request_type || '').toLowerCase().includes(q) ||
        (req.details || '').toLowerCase().includes(q) ||
        (req.id || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || req.status === statusFilter;
      const matchType = typeFilter === 'ALL' || req.request_type === typeFilter;
      const matchRole = roleFilter === 'ALL' || req.role === roleFilter;

      return matchSearch && matchStatus && matchType && matchRole;
    });
  }, [requestsList, search, statusFilter, typeFilter, roleFilter]);

  const handleUpdateStatus = (reqId, newStatus) => {
    setLocalRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: newStatus, hr_remarks: remarks || r.hr_remarks } : r))
    );
    if (selectedRequest && selectedRequest.id === reqId) {
      setSelectedRequest(prev => ({ ...prev, status: newStatus, hr_remarks: remarks || prev.hr_remarks }));
    }
    updateHRRequestStatus(reqId, newStatus, remarks);
    showToast(`Request status updated to ${newStatus}`);
    setRemarks('');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      requester_name: newRequest.requester_name,
      role: newRequest.role,
      designation: newRequest.role === 'INTERN' ? 'Intern' : 'Employee',
      department: newRequest.department,
      request_type: newRequest.request_type,
      priority: newRequest.priority,
      details: newRequest.details,
      status: 'PENDING',
      submitted_date: new Date().toISOString().split('T')[0],
      hr_remarks: ''
    };
    setLocalRequests([created, ...localRequests]);
    createHRRequest(created);
    setShowCreateModal(false);
    showToast('HR request created successfully!');
    setNewRequest({
      requester_name: '',
      role: 'EMPLOYEE',
      department: 'Engineering',
      request_type: 'Work from home',
      priority: 'MEDIUM',
      details: ''
    });
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'APPROVED':
      case 'COMPLETED':
        return <span className="badge bg-success">{st}</span>;
      case 'IN_REVIEW':
        return <span className="badge bg-info text-dark">IN REVIEW</span>;
      case 'PENDING':
        return <span className="badge bg-warning text-dark">PENDING</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">REJECTED</span>;
      default:
        return <span className="badge bg-secondary">{st}</span>;
    }
  };

  return (
    <AdminPage
      title="HR Requests & Helpdesk"
      subtitle="Manage employee and intern requests for WFH, letters, profile corrections, and document approvals"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-1" /> Log HR Request
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by requester, type, details, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            {REQUEST_STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            {REQUEST_TYPES.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Request Types' : t}</option>)}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="ALL">All Roles</option>
            <option value="EMPLOYEE">Employees</option>
            <option value="INTERN">Interns</option>
          </select>
        </div>

        {/* Requests Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">HR Requests Inbox ({filteredRequests.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredRequests.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-inbox" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No requests match the criteria</h4>
                <p style={{ color: '#64748b' }}>All submitted requests are processed or clear filters to view history.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Requester & Role</th>
                      <th>Request Category</th>
                      <th>Details</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id}>
                        <td><span className="badge bg-light text-dark font-monospace">{req.id}</span></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{req.requester_name}</div>
                          <span className={`badge ${req.role === 'INTERN' ? 'bg-info text-dark' : 'bg-primary'}`}>
                            {req.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{req.request_type}</div>
                          {req.priority === 'HIGH' && <span className="badge bg-danger text-white">HIGH PRIORITY</span>}
                        </td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {req.details}
                        </td>
                        <td>{req.submitted_date || '—'}</td>
                        <td>{getStatusBadge(req.status)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedRequest(req);
                              setRemarks(req.hr_remarks || '');
                              setShowDetailModal(true);
                            }}
                          >
                            <i className="bi bi-pencil-square me-1" /> Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Review Request — ${selectedRequest?.id}`}
        >
          {selectedRequest && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0">{selectedRequest.requester_name} ({selectedRequest.role})</h5>
                  <small className="text-muted">{selectedRequest.department} • Submitted: {selectedRequest.submitted_date}</small>
                </div>
                <div>{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <div className="mb-3">
                <strong>Request Type:</strong> {selectedRequest.request_type}
              </div>

              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>REQUEST DETAILS</div>
                  <div>{selectedRequest.details}</div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">HR Remarks / Feedback</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter approval note, reason for rejection, or fulfillment reference..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'IN_REVIEW')}
                >
                  Mark In Review
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'APPROVED')}
                >
                  Approve Request
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'COMPLETED')}
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'REJECTED')}
                >
                  Reject Request
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Request Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create / Log HR Request"
        >
          <form onSubmit={handleCreateSubmit}>
            <div className="mb-3">
              <label className="form-label">Requester Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Ramesh Kumar"
                value={newRequest.requester_name}
                onChange={(e) => setNewRequest({ ...newRequest, requester_name: e.target.value })}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Role Type *</label>
                <select
                  className="form-select"
                  value={newRequest.role}
                  onChange={(e) => setNewRequest({ ...newRequest, role: e.target.value })}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={newRequest.department}
                  onChange={(e) => setNewRequest({ ...newRequest, department: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Request Type *</label>
                <select
                  className="form-select"
                  value={newRequest.request_type}
                  onChange={(e) => setNewRequest({ ...newRequest, request_type: e.target.value })}
                >
                  {REQUEST_TYPES.filter(t => t !== 'ALL').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Details / Justification *</label>
              <textarea
                required
                className="form-control"
                rows="3"
                placeholder="Explain the background and requirements for this request..."
                value={newRequest.details}
                onChange={(e) => setNewRequest({ ...newRequest, details: e.target.value })}
              />
            </div>
            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}
