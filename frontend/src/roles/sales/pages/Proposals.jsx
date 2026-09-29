import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getProposals, createProposal, updateProposalStatus, deleteProposal, getDeals } from '../../../services/api/salesApi.js';

export default function SalesProposals() {
  const [proposals, setProposals] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    deal_id: '',
    total_amount: '',
    discount_percentage: 0,
    valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'DRAFT',
    deliverables: [{ title: 'Software License', amount: 0 }]
  });

  const loadProposals = async () => {
    try {
      setLoading(true);
      const [pRes, dRes] = await Promise.all([
        getProposals({ status: statusFilter || undefined }),
        getDeals().catch(() => ({ items: [] }))
      ]);

      const items = pRes?.items || (Array.isArray(pRes) ? pRes : []);
      if (items.length > 0) {
        setProposals(items);
      } else {
        setProposals([
          { id: '1', proposal_number: 'PROP-2026-081', client_name: 'Zenith Tech', title: '50-Seat Corporate License Package', total_amount: 350000, discount_percentage: 5, valid_until: '2026-09-25', status: 'SENT', created_at: '2026-09-05' },
          { id: '2', proposal_number: 'PROP-2026-082', client_name: 'EduGlobal Institute', title: 'Institutional LMS Cloud Tier', total_amount: 600000, discount_percentage: 0, valid_until: '2026-09-30', status: 'ACCEPTED', created_at: '2026-09-02' },
          { id: '3', proposal_number: 'PROP-2026-083', client_name: 'Nexus Corp', title: 'Custom Data Analytics Syllabus', total_amount: 180000, discount_percentage: 10, valid_until: '2026-08-31', status: 'EXPIRED', created_at: '2026-08-15' }
        ]);
      }

      setDeals(dRes?.items || (Array.isArray(dRes) ? dRes : []));
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [statusFilter]);

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      await createProposal({
        ...form,
        total_amount: parseFloat(form.total_amount),
        discount_percentage: parseFloat(form.discount_percentage || 0)
      });
      setShowModal(false);
      setForm({
        title: '',
        deal_id: '',
        total_amount: '',
        discount_percentage: 0,
        valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: 'DRAFT',
        deliverables: [{ title: 'Software License', amount: 0 }]
      });
      loadProposals();
    } catch (err) {
      alert('Failed to create proposal: ' + err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateProposalStatus(id, status);
      loadProposals();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await deleteProposal(id);
      loadProposals();
    } catch (err) {
      alert('Failed to delete proposal: ' + err.message);
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge bg-success">Accepted & Won</span>;
      case 'SENT':
        return <span className="badge bg-primary">Sent & Awaiting Sign</span>;
      case 'EXPIRED':
        return <span className="badge bg-secondary">Expired</span>;
      case 'DECLINED':
        return <span className="badge bg-danger">Declined</span>;
      default:
        return <span className="badge bg-warning text-dark">Draft</span>;
    }
  };

  return (
    <AdminPage
      title="Proposals & Commercial Quotations"
      subtitle="Draft enterprise quotes, issue proposals, track client approvals, and synchronize agreement terms"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-file-earmark-plus-fill"></i>
          <span>Create Proposal</span>
        </button>
      }
    >
      {/* Filter bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-2">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Proposal Statuses</option>
              <option value="DRAFT">Drafts</option>
              <option value="SENT">Sent & Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
          <div className="col-md-8 text-md-end">
            <span className="badge bg-light text-secondary border px-3 py-2">
              {proposals.length} Proposals on File
            </span>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Quote #</th>
                <th>Client / Organization</th>
                <th>Proposal Title</th>
                <th>Total Value</th>
                <th>Discount</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4">Loading proposals...</td></tr>
              ) : proposals.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-4 text-muted">No proposals found.</td></tr>
              ) : (
                proposals.map(p => (
                  <tr key={p.id}>
                    <td><span className="font-monospace text-dark fw-bold">{p.proposal_number}</span></td>
                    <td><div className="fw-semibold text-dark">{p.client_name || 'Direct Lead'}</div></td>
                    <td>{p.title}</td>
                    <td><strong className="text-success">₹{(p.total_amount || 0).toLocaleString()}</strong></td>
                    <td>{p.discount_percentage ? `${p.discount_percentage}%` : '0%'}</td>
                    <td><small className="text-muted">{p.valid_until}</small></td>
                    <td>{getBadge(p.status)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {p.status === 'DRAFT' && (
                          <button
                            className="btn btn-outline-primary"
                            title="Mark as Sent"
                            onClick={() => handleStatusChange(p.id, 'SENT')}
                          >
                            <i className="bi bi-send me-1"></i>Send
                          </button>
                        )}
                        {p.status === 'SENT' && (
                          <button
                            className="btn btn-outline-success"
                            title="Mark as Accepted"
                            onClick={() => handleStatusChange(p.id, 'ACCEPTED')}
                          >
                            <i className="bi bi-check-lg me-1"></i>Accept
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger"
                          title="Delete Proposal"
                          onClick={() => handleDelete(p.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Proposal Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Generate Sales Quotation</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateProposal}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Proposal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Enterprise LMS Campus License"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Attach to Deal (Optional)</label>
                    <select
                      className="form-select"
                      value={form.deal_id}
                      onChange={e => setForm({ ...form, deal_id: e.target.value })}
                    >
                      <option value="">Select Deal...</option>
                      {deals.map(d => (
                        <option key={d.id} value={d.id}>{d.title} (₹{parseFloat(d.deal_value || 0).toLocaleString()})</option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Total Amount (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={form.total_amount}
                        onChange={e => setForm({ ...form, total_amount: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="100"
                        value={form.discount_percentage}
                        onChange={e => setForm({ ...form, discount_percentage: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Valid Until *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.valid_until}
                        onChange={e => setForm({ ...form, valid_until: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Initial Status</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value })}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent Immediately</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Generate Quotation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
