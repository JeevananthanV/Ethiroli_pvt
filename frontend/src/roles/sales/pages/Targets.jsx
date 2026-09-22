import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTargets, createOrUpdateTarget, deleteTarget } from '../../../services/api/salesApi.js';

export default function Targets() {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    fiscal_year: '2026-27',
    period_type: 'QUARTERLY',
    period_label: 'Q3',
    target_revenue: 2500000,
    deals_target: 8
  });

  const loadTargets = async () => {
    try {
      setLoading(true);
      const res = await getTargets();
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setTargets(items);
      } else {
        setTargets([
          { id: '1', user_name: 'Rahul Sharma', fiscal_year: '2026-27', period_type: 'QUARTERLY', period_label: 'Q2', target_revenue: 2000000, achieved_revenue: 2150000, deals_target: 8, deals_won: 9, achievement_rate: 107.5 },
          { id: '2', user_name: 'Ananya Deshmukh', fiscal_year: '2026-27', period_type: 'QUARTERLY', period_label: 'Q2', target_revenue: 1800000, achieved_revenue: 1650000, deals_target: 7, deals_won: 6, achievement_rate: 91.7 },
          { id: '3', user_name: 'Vikramaditya Rao', fiscal_year: '2026-27', period_type: 'QUARTERLY', period_label: 'Q2', target_revenue: 1500000, achieved_revenue: 1200000, deals_target: 6, deals_won: 4, achievement_rate: 80.0 },
          { id: '4', user_name: 'Rahul Sharma', fiscal_year: '2026-27', period_type: 'QUARTERLY', period_label: 'Q3', target_revenue: 2500000, achieved_revenue: 1250000, deals_target: 10, deals_won: 4, achievement_rate: 50.0 }
        ]);
      }
    } catch (err) {
      console.error('Failed to load targets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTargets();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await createOrUpdateTarget({
        ...form,
        target_revenue: parseFloat(form.target_revenue),
        deals_target: parseInt(form.deals_target, 10)
      });
      setShowModal(false);
      loadTargets();
    } catch (err) {
      alert('Failed to save quota target: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quota target?')) return;
    try {
      await deleteTarget(id);
      loadTargets();
    } catch (err) {
      alert('Failed to delete target: ' + err.message);
    }
  };

  const totalQuota = targets.reduce((a, b) => a + (parseFloat(b.target_revenue) || 0), 0);
  const totalBooked = targets.reduce((a, b) => a + (parseFloat(b.achieved_revenue) || 0), 0);
  const overallAttainment = totalQuota > 0 ? Math.round((totalBooked / totalQuota) * 1000) / 10 : 0;

  return (
    <AdminPage
      title="Sales Targets & Quota Attainment"
      subtitle="Representative quota allocations, monthly and quarterly target pacing, and variable commission accelerators"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-award-fill"></i>
          <span>Set Quota Target</span>
        </button>
      }
    >
      {/* Metric Strip */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-uppercase fw-semibold text-muted">Cumulative Target Quota</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">₹{totalQuota.toLocaleString()}</h3>
            <small className="text-muted">Fiscal Year 2026-27</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-uppercase fw-semibold text-muted">Total Achieved Revenue</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">₹{totalBooked.toLocaleString()}</h3>
            <small className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Closed Won bookings</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <small className="text-uppercase fw-semibold text-muted">Team Quota Attainment</small>
            <h3 className="mb-0 fw-bold mt-1 text-dark">{overallAttainment}%</h3>
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${Math.min(100, overallAttainment)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Active Sales Quota Allocations</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Representative</th>
                <th>Fiscal Period</th>
                <th>Target Quota</th>
                <th>Booked Revenue</th>
                <th>Deals Target vs Won</th>
                <th>Attainment %</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading quota targets...</td></tr>
              ) : targets.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No targets defined for this period.</td></tr>
              ) : (
                targets.map(t => {
                  const rate = t.achievement_rate || 0;
                  return (
                    <tr key={t.id}>
                      <td>
                        <div className="fw-semibold text-dark">{t.user_name}</div>
                        <small className="text-muted">Account Executive</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {t.fiscal_year} &bull; {t.period_label}
                        </span>
                      </td>
                      <td><strong>₹{parseFloat(t.target_revenue || 0).toLocaleString()}</strong></td>
                      <td className="fw-bold text-success">₹{parseFloat(t.achieved_revenue || 0).toLocaleString()}</td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {t.deals_won} / {t.deals_target} Deals
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`small fw-bold ${rate >= 100 ? 'text-success' : rate >= 75 ? 'text-primary' : 'text-warning'}`}>
                            {rate}%
                          </span>
                          <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '60px' }}>
                            <div
                              className={`progress-bar ${rate >= 100 ? 'bg-success' : 'bg-primary'}`}
                              role="progressbar"
                              style={{ width: `${Math.min(100, rate)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Quota Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Set Sales Quota Target</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Fiscal Year *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={form.fiscal_year}
                        onChange={e => setForm({ ...form, fiscal_year: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Period Label *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. Q3, September"
                        value={form.period_label}
                        onChange={e => setForm({ ...form, period_label: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Target Revenue (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={form.target_revenue}
                        onChange={e => setForm({ ...form, target_revenue: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Deals Target Count</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.deals_target}
                        onChange={e => setForm({ ...form, deals_target: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Target</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
