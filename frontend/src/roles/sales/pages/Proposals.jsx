import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getProposals, createProposal, updateProposalStatus, deleteProposal, getDeals } from '../../../services/api/salesApi.js';

const COMMERCIAL_TIERS = [
  { name: 'Essential Growth', price: 25000, desc: 'Google My Business, Local SEO, WhatsApp Chatbot, 2 Campaigns/mo' },
  { name: 'Scale & Optimize', price: 55000, desc: 'Omnichannel Performance Ads, CRM Funnel, Review Automation, Weekly Lead Report' },
  { name: 'Enterprise Automation', price: 120000, desc: 'Custom Software Portal, AI Voice Assistant, Automated Patient Retention, Dedicated AE' },
  { name: 'Web & UI/UX Portal Setup', price: 75000, desc: 'High-speed clinic booking portal, doctor profiles, payment integration' },
  { name: 'Reels & Video Production Pack', price: 30000, desc: '4 High-definition clinical reels, scriptwriting, professional editing' },
  { name: 'AI Workflow Automation', price: 20000, desc: 'Direct WhatsApp API notification loop, calendar synchronization' }
];

export default function SalesProposals() {
  const [proposals, setProposals] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [previewProposal, setPreviewProposal] = useState(null);

  const [form, setForm] = useState({
    title: 'Scale & Optimize Commercial Agreement',
    deal_id: '',
    total_amount: 55000,
    discount_percentage: 0,
    valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'DRAFT',
    deliverables: [{ title: 'Software License & Performance Marketing', amount: 55000 }]
  });

  const loadProposals = async () => {
    try {
      setLoading(true);
      const [pRes, dRes] = await Promise.all([
        getProposals({ status: statusFilter || undefined }),
        getDeals().catch(() => ({ items: [] }))
      ]);

      const items = pRes?.items || (Array.isArray(pRes) ? pRes : []);
      setProposals(items);
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

  const handleSelectTier = (tier) => {
    setForm(prev => ({
      ...prev,
      title: `${tier.name} Agreement`,
      total_amount: tier.price,
      deliverables: [{ title: tier.desc, amount: tier.price }]
    }));
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      await createProposal({
        ...form,
        total_amount: parseFloat(form.total_amount),
        discount_percentage: parseFloat(form.discount_percentage || 0)
      });
      setShowModal(false);
      loadProposals();
      alert('Proposal generated successfully!');
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
    if (!window.confirm('Delete this proposal?')) return;
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
        return <span className="badge bg-success">Accepted & Contracted</span>;
      case 'SENT':
        return <span className="badge bg-primary">Sent & Awaiting Sign</span>;
      case 'EXPIRED':
        return <span className="badge bg-secondary">Expired</span>;
      case 'DECLINED':
        return <span className="badge bg-danger">Declined</span>;
      default:
        return <span className="badge bg-warning text-dark">Draft Quotation</span>;
    }
  };

  const netPayable = form.total_amount * (1 - (parseFloat(form.discount_percentage) || 0) / 100);

  return (
    <AdminPage
      title="Commercial Proposals & Quotations"
      subtitle="Standardized B2B SaaS service tiers, legal scope quotation, and client contract execution"
      actions={
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-file-earmark-plus-fill"></i>
          <span>Create Proposal</span>
        </button>
      }
    >
      {/* Top Filter & Count */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <select
              className="form-select bg-light"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Proposal Statuses</option>
              <option value="DRAFT">Drafts</option>
              <option value="SENT">Sent & Awaiting Signature</option>
              <option value="ACCEPTED">Accepted & Won</option>
              <option value="DECLINED">Declined</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
          <div className="col-md-8 text-md-end">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
              {proposals.length} Formal Quotations
            </span>
          </div>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="sales-table-card">
        <div className="table-responsive">
          <table className="table sales-table align-middle">
            <thead>
              <tr>
                <th>Quote ID</th>
                <th>Proposal Title</th>
                <th>Client / Deal</th>
                <th>Contract Value</th>
                <th>Discount</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                    Loading quotations...
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No proposals created yet. Click "Create Proposal" to generate an official quote.
                  </td>
                </tr>
              ) : (
                proposals.map(p => (
                  <tr key={p.id}>
                    <td><span className="font-monospace text-primary fw-bold small">{p.proposal_number || `ETH-PROP-${p.id}`}</span></td>
                    <td>
                      <div className="fw-bold text-dark">{p.title}</div>
                      <small className="text-muted">Ethiroli SaaS Services</small>
                    </td>
                    <td><div className="fw-semibold text-dark">{p.client_name || p.deal_title || 'Direct Healthcare Deal'}</div></td>
                    <td><strong className="text-success">₹{(parseFloat(p.total_amount) || 0).toLocaleString('en-IN')}</strong></td>
                    <td>{p.discount_percentage ? `${p.discount_percentage}%` : '0%'}</td>
                    <td><small className="text-muted">{p.valid_until ? String(p.valid_until).slice(0, 10) : '—'}</small></td>
                    <td>{getBadge(p.status)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-info"
                          title="Preview Agreement"
                          onClick={() => setPreviewProposal(p)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        {p.status === 'DRAFT' && (
                          <button
                            className="btn btn-outline-primary"
                            title="Mark as Sent to Client"
                            onClick={() => handleStatusChange(p.id, 'SENT')}
                          >
                            <i className="bi bi-send me-1"></i>Send
                          </button>
                        )}
                        {p.status === 'SENT' && (
                          <button
                            className="btn btn-outline-success"
                            title="Client Accepted Agreement"
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
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Generate Commercial Quotation</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateProposal}>
                <div className="modal-body p-4">
                  {/* 1-Click Preset Tiers */}
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-2">Select Service Package Preset</label>
                  <div className="row g-2 mb-3">
                    {COMMERCIAL_TIERS.map(tier => (
                      <div className="col-md-4" key={tier.name}>
                        <div
                          className="p-2 border rounded-3 cursor-pointer text-start h-100 bg-light hover-shadow"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSelectTier(tier)}
                        >
                          <div className="fw-bold text-dark small">{tier.name}</div>
                          <div className="text-success fw-bold">₹{tier.price.toLocaleString('en-IN')}</div>
                          <small className="text-muted d-block text-truncate mt-1" style={{ fontSize: '0.75rem' }}>{tier.desc}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Proposal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Attach to Commercial Deal (Optional)</label>
                    <select
                      className="form-select"
                      value={form.deal_id}
                      onChange={e => setForm({ ...form, deal_id: e.target.value })}
                    >
                      <option value="">Select Deal...</option>
                      {deals.map(d => (
                        <option key={d.id} value={d.id}>{d.title} (₹{parseFloat(d.deal_value || 0).toLocaleString('en-IN')})</option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Package Value (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={form.total_amount}
                        onChange={e => setForm({ ...form, total_amount: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
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
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Net Payable (₹)</label>
                      <input
                        type="text"
                        className="form-control fw-bold text-success bg-light"
                        readOnly
                        value={`₹${Math.round(netPayable).toLocaleString('en-IN')}`}
                      />
                    </div>
                  </div>

                  <div className="row g-2">
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
                        <option value="SENT">Sent to Doctor Immediately</option>
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

      {/* Preview Modal */}
      {previewProposal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-dark text-white">
                <div>
                  <h5 className="modal-title fw-bold mb-0">Commercial Proposal Preview</h5>
                  <small className="text-muted font-monospace">{previewProposal.proposal_number || `ETH-PROP-${previewProposal.id}`}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewProposal(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="p-4 bg-white rounded-3 border shadow-sm">
                  <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                    <div>
                      <h4 className="fw-bold text-primary mb-0">ETHIROLI PVT LTD</h4>
                      <small className="text-muted">Healthcare SaaS & Growth Marketing Solutions</small>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light text-dark border px-3 py-2">
                        Status: {previewProposal.status}
                      </span>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <span className="small text-muted fw-bold text-uppercase">Client Account</span>
                      <h6 className="fw-bold text-dark mt-1">{previewProposal.client_name || previewProposal.deal_title || 'Healthcare Client'}</h6>
                    </div>
                    <div className="col-6 text-end">
                      <span className="small text-muted fw-bold text-uppercase">Valid Until</span>
                      <h6 className="fw-bold text-dark mt-1">{previewProposal.valid_until ? String(previewProposal.valid_until).slice(0, 10) : '15 Days'}</h6>
                    </div>
                  </div>

                  <div className="table-responsive mb-4">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Description</th>
                          <th className="text-end">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>{previewProposal.title}</strong>
                            <div className="text-muted small">Standard SaaS deployment, support, and marketing services.</div>
                          </td>
                          <td className="text-end fw-bold">
                            ₹{(parseFloat(previewProposal.total_amount) || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                        {previewProposal.discount_percentage > 0 && (
                          <tr>
                            <td className="text-end text-muted">Special Healthcare Discount ({previewProposal.discount_percentage}%):</td>
                            <td className="text-end text-danger">
                              -₹{(previewProposal.total_amount * previewProposal.discount_percentage / 100).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        )}
                        <tr className="table-light">
                          <td className="text-end fw-bold">Net Total:</td>
                          <td className="text-end fw-bold text-success fs-5">
                            ₹{(previewProposal.total_amount * (1 - (previewProposal.discount_percentage || 0) / 100)).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-light rounded-3 border">
                    <small className="text-muted d-block">
                      <strong>Payment Terms:</strong> 50% upon agreement signoff, 50% upon delivery milestone / monthly retainer.
                      All payments via official bank transfer to Ethiroli Pvt Ltd.
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPreviewProposal(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  <i className="bi bi-printer me-1"></i> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
