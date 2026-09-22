import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getHandovers, createHandover, updateHandoverStatus, getDeals, getClients } from '../../../services/api/salesApi.js';

export default function Handover() {
  const [handovers, setHandovers] = useState([]);
  const [wonDeals, setWonDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    deal_id: '',
    client_id: '',
    handover_to: 'PROJECT_MANAGER',
    scope_summary: '',
    kickoff_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'PENDING'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [hRes, dRes, cRes] = await Promise.all([
        getHandovers(),
        getDeals({ stage: 'CLOSED_WON' }).catch(() => ({ items: [] })),
        getClients().catch(() => ({ items: [] }))
      ]);

      const items = hRes?.items || (Array.isArray(hRes) ? hRes : []);
      if (items.length > 0) {
        setHandovers(items);
      } else {
        setHandovers([
          { id: '1', deal_title: 'Enterprise LMS Campus Deployment', deal_value: 650000, client_name: 'Apex Infotech Solutions', handover_to: 'PROJECT_MANAGER', scope_summary: 'Full LMS instance with single-sign-on integration, 50-course library, and student database synchronization.', kickoff_date: '2026-09-15', status: 'PENDING', handover_by_name: 'Rahul Sharma' },
          { id: '2', deal_title: 'Corporate Upskilling 50-Seats', deal_value: 350000, client_name: 'Zenith Tech Solutions', handover_to: 'ACADEMIC_COORDINATOR', scope_summary: 'Batch of 50 trainee software engineers for 12-week Full Stack Python & React curriculum.', kickoff_date: '2026-09-18', status: 'ACCEPTED', handover_by_name: 'Ananya Deshmukh' },
          { id: '3', deal_title: 'Cloud Infrastructure Migration', deal_value: 480000, client_name: 'FinServe Corp', handover_to: 'OPERATIONS', scope_summary: 'Provisioning multi-tenant AWS environments and automated daily database backups.', kickoff_date: '2026-09-05', status: 'ONBOARDED', handover_by_name: 'Rahul Sharma' }
        ]);
      }

      setWonDeals(dRes?.items || (Array.isArray(dRes) ? dRes : []));
      setClients(cRes?.items || (Array.isArray(cRes) ? cRes : []));
    } catch (err) {
      console.error('Failed to load customer handovers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createHandover(form);
      setShowModal(false);
      setForm({
        deal_id: '',
        client_id: '',
        handover_to: 'PROJECT_MANAGER',
        scope_summary: '',
        kickoff_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: 'PENDING'
      });
      loadData();
    } catch (err) {
      alert('Failed to initiate handover: ' + err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateHandoverStatus(id, status);
      loadData();
    } catch (err) {
      alert('Failed to update handover status: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ONBOARDED': return <span className="badge bg-success">Onboarded & Active</span>;
      case 'ACCEPTED': return <span className="badge bg-info text-dark">Accepted by PM</span>;
      default: return <span className="badge bg-warning text-dark">Pending Handover</span>;
    }
  };

  return (
    <AdminPage
      title="Customer Handover & Post-Sales Onboarding"
      subtitle="Seamless transition of closed-won deals to Project Managers, Academic Coordinators, and Operations teams"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Initiate Handover</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Post-Sales Onboarding Queue</h6>
          <span className="badge bg-light text-secondary border px-3 py-2">
            {handovers.length} Handovers Tracked
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Deal & Account</th>
                <th>Contract Value</th>
                <th>Transferred To</th>
                <th>Kickoff Date</th>
                <th>Scope Summary</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading handovers...</td></tr>
              ) : handovers.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No client handovers in queue.</td></tr>
              ) : (
                handovers.map(h => (
                  <tr key={h.id}>
                    <td>
                      <div className="fw-semibold text-dark">{h.deal_title || 'Won Deal'}</div>
                      <small className="text-muted">{h.client_name || 'Enterprise Client'}</small>
                    </td>
                    <td><strong className="text-success">₹{parseFloat(h.deal_value || 0).toLocaleString()}</strong></td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-arrow-right-circle me-1"></i>
                        {h.handover_to.replace('_', ' ')}
                      </span>
                    </td>
                    <td><span className="fw-semibold text-dark">{h.kickoff_date}</span></td>
                    <td style={{ maxWidth: '280px' }}>
                      <small className="text-muted text-truncate d-block">{h.scope_summary}</small>
                    </td>
                    <td>{getStatusBadge(h.status)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {h.status === 'PENDING' && (
                          <button
                            className="btn btn-outline-info"
                            title="Acknowledge Receipt"
                            onClick={() => handleStatusChange(h.id, 'ACCEPTED')}
                          >
                            Accept
                          </button>
                        )}
                        {h.status === 'ACCEPTED' && (
                          <button
                            className="btn btn-outline-success"
                            title="Complete Onboarding"
                            onClick={() => handleStatusChange(h.id, 'ONBOARDED')}
                          >
                            Mark Onboarded
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Handover Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Initiate Customer Handover</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Closed Won Deal *</label>
                    <select
                      className="form-select"
                      required
                      value={form.deal_id}
                      onChange={e => {
                        const d = wonDeals.find(deal => deal.id === e.target.value);
                        setForm({
                          ...form,
                          deal_id: e.target.value,
                          client_id: d?.client_id || form.client_id
                        });
                      }}
                    >
                      <option value="">Select Won Deal...</option>
                      {wonDeals.map(d => (
                        <option key={d.id} value={d.id}>{d.title} (₹{parseFloat(d.deal_value || 0).toLocaleString()})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Client Organization *</label>
                    <select
                      className="form-select"
                      required
                      value={form.client_id}
                      onChange={e => setForm({ ...form, client_id: e.target.value })}
                    >
                      <option value="">Select Client Account...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.company_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Handover Destination *</label>
                      <select
                        className="form-select"
                        value={form.handover_to}
                        onChange={e => setForm({ ...form, handover_to: e.target.value })}
                      >
                        <option value="PROJECT_MANAGER">Project Manager (PM)</option>
                        <option value="ACADEMIC_COORDINATOR">Academic Coordinator</option>
                        <option value="OPERATIONS">Operations & Infrastructure</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Kickoff Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.kickoff_date}
                        onChange={e => setForm({ ...form, kickoff_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Commercial Scope & Deliverables *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      required
                      placeholder="Detailed deliverables, client expectations, contract clauses, timeline agreements..."
                      value={form.scope_summary}
                      onChange={e => setForm({ ...form, scope_summary: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Handover</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
