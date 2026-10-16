import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getDeals, createDeal, updateDealStage, deleteDeal } from '../../../services/api/salesApi.js';
import { Link } from 'react-router-dom';

const STAGES = [
  { key: 'QUALIFICATION', label: '1. Qualification', dotClass: 'stage-dot-s1', color: '#64748b', badge: 'bg-secondary' },
  { key: 'DISCOVERY', label: '2. Discovery & Demo', dotClass: 'stage-dot-s2', color: '#0ea5e9', badge: 'bg-info text-dark' },
  { key: 'PROPOSAL_SENT', label: '3. Proposal Sent', dotClass: 'stage-dot-s3', color: '#f59e0b', badge: 'bg-warning text-dark' },
  { key: 'NEGOTIATION', label: '4. Negotiation', dotClass: 'stage-dot-s4', color: '#4f46e5', badge: 'bg-primary' },
  { key: 'CLOSED_WON', label: '5. Closed Won', dotClass: 'stage-dot-won', color: '#10b981', badge: 'bg-success' }
];

export default function SalesDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [showModal, setShowModal] = useState(false);
  const [movingDealId, setMovingDealId] = useState(null);

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
      setDeals(items);
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
      setMovingDealId(dealId);
      await updateDealStage(dealId, nextStage);
      await loadDeals();
    } catch (err) {
      alert('Failed to update stage: ' + err.message);
    } finally {
      setMovingDealId(null);
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

  const totalValue = deals.reduce((acc, d) => acc + (parseFloat(d.deal_value) || 0), 0);
  const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON');
  const wonValue = wonDeals.reduce((acc, d) => acc + (parseFloat(d.deal_value) || 0), 0);
  const weightedPipeline = deals.filter(d => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST')
    .reduce((acc, d) => acc + ((parseFloat(d.deal_value) || 0) * (d.probability || 20) / 100), 0);

  return (
    <AdminPage
      title="Commercial Deals Pipeline"
      subtitle="Interactive stage gates, deal negotiations, probability weighting, and contract realization"
      actions={
        <div className="d-flex align-items-center gap-2">
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
              <i className="bi bi-table me-1"></i> List Table
            </button>
          </div>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg"></i>
            <span>New Deal</span>
          </button>
        </div>
      }
    >
      {/* Top Velocity Metrics Strip */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="sales-kpi-card kpi-indigo p-3">
            <span className="small text-muted fw-bold text-uppercase">Total Pipeline Value</span>
            <div className="kpi-metric-val mt-1">₹{totalValue.toLocaleString('en-IN')}</div>
            <small className="text-muted">{deals.length} Active Deals</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="sales-kpi-card kpi-sky p-3">
            <span className="small text-muted fw-bold text-uppercase">Weighted Pipeline</span>
            <div className="kpi-metric-val mt-1 text-primary">₹{Math.round(weightedPipeline).toLocaleString('en-IN')}</div>
            <small className="text-muted">Probability-adjusted expectation</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="sales-kpi-card kpi-emerald p-3">
            <span className="small text-muted fw-bold text-uppercase">Closed Won Realized</span>
            <div className="kpi-metric-val mt-1 text-success">₹{wonValue.toLocaleString('en-IN')}</div>
            <small className="text-muted">{wonDeals.length} Contracts Executed</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="sales-kpi-card kpi-amber p-3">
            <span className="small text-muted fw-bold text-uppercase">Win Conversion Rate</span>
            <div className="kpi-metric-val mt-1 text-warning">
              {deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0}%
            </div>
            <small className="text-muted">From qualified discovery</small>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="sales-kanban-board">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            const stageTotal = stageDeals.reduce((acc, d) => acc + (parseFloat(d.deal_value) || 0), 0);

            return (
              <div key={stage.key} className="sales-kanban-col">
                <div className="kanban-col-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className={`stage-dot ${stage.dotClass}`}></span>
                    <h6 className="fw-bold mb-0 text-dark small text-uppercase">{stage.label}</h6>
                  </div>
                  <span className={`badge ${stage.badge}`}>{stageDeals.length}</span>
                </div>

                <div className="text-muted small mb-3 fw-semibold">
                  Total: <strong className="text-dark">₹{stageTotal.toLocaleString('en-IN')}</strong>
                </div>

                <div className="d-flex flex-column gap-2 overflow-auto flex-grow-1" style={{ maxHeight: '600px' }}>
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-4 text-muted small border rounded-3 bg-white border-dashed">
                      No deals at this gate
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <div key={deal.id} className="sales-deal-card">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-dark">{deal.title}</span>
                          <button
                            className="btn btn-sm btn-link text-danger p-0 ms-1 text-decoration-none"
                            title="Delete Deal"
                            onClick={() => handleDelete(deal.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>

                        <div className="small text-muted mb-2">
                          <i className="bi bi-hospital me-1"></i>
                          {deal.client_name || deal.lead_company || 'Clinic Account'}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-success fs-6">
                            ₹{(parseFloat(deal.deal_value) || 0).toLocaleString('en-IN')}
                          </strong>
                          <span className="badge bg-light text-secondary border small">
                            {deal.probability || 20}% Win
                          </span>
                        </div>

                        {deal.contact_phone && (
                          <div className="d-flex gap-1 mb-2">
                            <a href={`tel:${deal.contact_phone}`} className="action-pill-btn action-pill-phone">
                              <i className="bi bi-telephone-fill"></i>
                            </a>
                            <a 
                              href={`https://wa.me/91${deal.contact_phone}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="action-pill-btn action-pill-whatsapp"
                            >
                              <i className="bi bi-whatsapp"></i> WhatsApp
                            </a>
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <small className="text-muted text-truncate" style={{ maxWidth: '110px' }} title={deal.contact_name}>
                            <i className="bi bi-person me-1"></i>{deal.contact_name || 'Contact'}
                          </small>

                          {stage.key !== 'CLOSED_WON' ? (
                            <select
                              className="form-select form-select-sm py-0 px-2"
                              style={{ width: 'auto', fontSize: '0.75rem' }}
                              value={deal.stage}
                              disabled={movingDealId === deal.id}
                              onChange={(e) => handleStageChange(deal.id, e.target.value)}
                            >
                              {STAGES.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                              ))}
                            </select>
                          ) : (
                            <Link to="/app/sales/handover" className="btn btn-sm btn-outline-success py-0 px-2" style={{ fontSize: '0.75rem' }}>
                              Handover <i className="bi bi-arrow-right"></i>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sales-table-card">
          <div className="table-responsive">
            <table className="table sales-table align-middle">
              <thead>
                <tr>
                  <th>Deal Title</th>
                  <th>Clinic / Decision Maker</th>
                  <th>Value (₹)</th>
                  <th>Current Stage</th>
                  <th>Win Probability</th>
                  <th>Target Close Date</th>
                  <th>Assigned Owner</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div className="fw-bold text-dark">{d.title}</div>
                      <small className="text-muted">{d.contact_name}</small>
                    </td>
                    <td>{d.client_name || d.lead_company || 'Clinic Account'}</td>
                    <td className="fw-bold text-success">₹{(parseFloat(d.deal_value) || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                        value={d.stage}
                        disabled={movingDealId === d.id}
                        onChange={(e) => handleStageChange(d.id, e.target.value)}
                      >
                        {STAGES.map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>{d.probability}%</td>
                    <td className="text-muted">{d.expected_close_date || '—'}</td>
                    <td><small className="text-muted">{d.owner_name || 'Associate'}</small></td>
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
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Create New Commercial Deal</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateDeal}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Deal Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Sree Dental Care - Scale & Optimize"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Doctor / Decision Maker *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Dr. Name"
                        value={form.contact_name}
                        onChange={e => setForm({ ...form, contact_name: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="10-digit mobile"
                        value={form.contact_phone}
                        onChange={e => setForm({ ...form, contact_phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Contract Value (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        placeholder="55000"
                        value={form.deal_value}
                        onChange={e => setForm({ ...form, deal_value: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Expected Close Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.expected_close_date}
                        onChange={e => setForm({ ...form, expected_close_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Initial Pipeline Stage</label>
                    <select
                      className="form-select"
                      value={form.stage}
                      onChange={e => setForm({ ...form, stage: e.target.value })}
                    >
                      {STAGES.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
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
