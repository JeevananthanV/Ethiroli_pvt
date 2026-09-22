import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getDeals, createDeal, updateDealStage, deleteDeal } from '../../../services/api/salesApi.js';

export default function SalesDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    deal_value: '',
    stage: 'QUALIFICATION',
    probability: 20,
    expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    notes: ''
  });

  const loadDeals = async () => {
    try {
      setLoading(true);
      const res = await getDeals();
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setDeals(items);
      } else {
        setDeals([
          { id: '1', title: 'Full Stack Cohort License', client_name: 'Alpha Infotech', deal_value: 150000, contact_name: 'Kiran K.', stage: 'QUALIFICATION', probability: 20, expected_close_date: '2026-10-15' },
          { id: '2', title: 'LMS White-label Deployment', client_name: 'EduGlobal Inst', deal_value: 600000, contact_name: 'Dr. Ramesh', stage: 'DISCOVERY', probability: 40, expected_close_date: '2026-10-30' },
          { id: '3', title: '50-Seat Corporate Upskill', client_name: 'Zenith Tech', deal_value: 350000, contact_name: 'Vikramaditya', stage: 'PROPOSAL_SENT', probability: 60, expected_close_date: '2026-09-30' },
          { id: '4', title: 'Custom AI Curriculum', client_name: 'Quantum Labs', deal_value: 220000, contact_name: 'Rohan Mehra', stage: 'NEGOTIATION', probability: 80, expected_close_date: '2026-09-25' },
          { id: '5', title: 'Dev Bootcamp In-House', client_name: 'FinServe Corp', deal_value: 480000, contact_name: 'Meera N.', stage: 'CLOSED_WON', probability: 100, expected_close_date: '2026-09-10' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      await createDeal(form);
      setShowModal(false);
      setForm({
        title: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        deal_value: '',
        stage: 'QUALIFICATION',
        probability: 20,
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        notes: ''
      });
      loadDeals();
    } catch (err) {
      alert('Failed to create deal: ' + err.message);
    }
  };

  const handleStageChange = async (dealId, nextStage) => {
    try {
      await updateDealStage(dealId, nextStage);
      loadDeals();
    } catch (err) {
      alert('Failed to update stage: ' + err.message);
    }
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      await deleteDeal(dealId);
      loadDeals();
    } catch (err) {
      alert('Failed to delete deal: ' + err.message);
    }
  };

  const STAGES = [
    { key: 'QUALIFICATION', label: 'Qualification', color: 'border-secondary', badge: 'bg-secondary' },
    { key: 'DISCOVERY', label: 'Discovery', color: 'border-info', badge: 'bg-info text-dark' },
    { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'border-warning', badge: 'bg-warning text-dark' },
    { key: 'NEGOTIATION', label: 'Negotiation', color: 'border-primary', badge: 'bg-primary' },
    { key: 'CLOSED_WON', label: 'Closed Won', color: 'border-success', badge: 'bg-success' }
  ];

  return (
    <AdminPage
      title="Sales Deals Pipeline"
      subtitle="Interactive stage pipeline, deal negotiations, probability weighting, and win transitions"
      actions={
        <div className="d-flex gap-2">
          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('kanban')}
            >
              <i className="bi bi-kanban me-1"></i> Kanban
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('table')}
            >
              <i className="bi bi-table me-1"></i> List
            </button>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg"></i>
            <span>New Deal</span>
          </button>
        </div>
      }
    >
      {viewMode === 'kanban' ? (
        <div className="row g-3 overflow-auto pb-3" style={{ minHeight: '600px' }}>
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            const stageTotal = stageDeals.reduce((acc, d) => acc + (parseFloat(d.deal_value) || 0), 0);

            return (
              <div key={stage.key} className="col-12 col-md-6 col-lg" style={{ minWidth: '260px' }}>
                <div className={`card border-0 shadow-sm rounded-3 bg-light p-3 border-top border-4 ${stage.color} h-100`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0 text-dark small text-uppercase">{stage.label}</h6>
                    <span className={`badge ${stage.badge}`}>{stageDeals.length}</span>
                  </div>
                  <div className="text-muted small mb-3">
                    ₹{stageTotal.toLocaleString()}
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {stageDeals.map(deal => (
                      <div key={deal.id} className="card border-0 shadow-sm p-3 rounded-3 bg-white">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-dark">{deal.title}</span>
                          <button
                            className="btn btn-sm btn-link text-danger p-0 ms-1"
                            title="Delete"
                            onClick={() => handleDelete(deal.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                        <small className="text-muted d-block mb-2">{deal.client_name || 'Direct Account'}</small>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-success">₹{(deal.deal_value || 0).toLocaleString()}</strong>
                          <span className="badge bg-light text-secondary border">{deal.probability || 0}%</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>{deal.contact_name || 'Contact'}
                          </small>
                          {stage.key !== 'CLOSED_WON' ? (
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-secondary py-0 px-2 dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                Move
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                {STAGES.filter(s => s.key !== stage.key).map(s => (
                                  <li key={s.key}>
                                    <button
                                      className="dropdown-item small"
                                      onClick={() => handleStageChange(deal.id, s.key)}
                                    >
                                      Move to {s.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <a href="#/handover" className="btn btn-sm btn-outline-success py-0 px-2" title="Handover to PM/Ops">
                              Handover <i className="bi bi-arrow-right"></i>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Deal Title</th>
                  <th>Client</th>
                  <th>Value</th>
                  <th>Stage</th>
                  <th>Win %</th>
                  <th>Target Close Date</th>
                  <th>Owner</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div className="fw-semibold text-dark">{d.title}</div>
                      <small className="text-muted">{d.contact_name}</small>
                    </td>
                    <td>{d.client_name || 'Direct Lead'}</td>
                    <td className="fw-bold text-success">₹{(d.deal_value || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        d.stage === 'CLOSED_WON' ? 'bg-success' :
                        d.stage === 'NEGOTIATION' ? 'bg-primary' :
                        d.stage === 'PROPOSAL_SENT' ? 'bg-warning text-dark' : 'bg-secondary'
                      }`}>
                        {d.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{d.probability}%</td>
                    <td className="text-muted">{d.expected_close_date || '—'}</td>
                    <td><small className="text-muted">{d.owner_name || 'Sales Rep'}</small></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Deal Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Create New Sales Deal</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateDeal}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Deal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Enterprise LMS Campus Deployment"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Deal Value (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={form.deal_value}
                        onChange={e => setForm({ ...form, deal_value: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Expected Close *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.expected_close_date}
                        onChange={e => setForm({ ...form, expected_close_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Contact Person *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={form.contact_name}
                        onChange={e => setForm({ ...form, contact_name: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Contact Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.contact_email}
                        onChange={e => setForm({ ...form, contact_email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Initial Stage</label>
                      <select
                        className="form-select"
                        value={form.stage}
                        onChange={e => setForm({ ...form, stage: e.target.value })}
                      >
                        <option value="QUALIFICATION">Qualification</option>
                        <option value="DISCOVERY">Discovery</option>
                        <option value="PROPOSAL_SENT">Proposal Sent</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="CLOSED_WON">Closed Won</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Probability (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={form.probability}
                        onChange={e => setForm({ ...form, probability: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Deal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
