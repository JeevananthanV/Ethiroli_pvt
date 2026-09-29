import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getActivities, createActivity, updateActivity, deleteActivity, getDeals, getLeads } from '../../../services/api/salesApi.js';

export default function SalesFollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterOutcome, setFilterOutcome] = useState('');

  const [form, setForm] = useState({
    title: '',
    activity_type: 'FOLLOW_UP',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    deal_id: '',
    lead_id: '',
    description: '',
    outcome: 'BUSY'
  });

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      const [actRes, dRes, lRes] = await Promise.all([
        getActivities({ activity_type: 'FOLLOW_UP', outcome: filterOutcome || undefined }),
        getDeals().catch(() => ({ items: [] })),
        getLeads().catch(() => ({ items: [] }))
      ]);

      const items = actRes?.items || (Array.isArray(actRes) ? actRes : []);
      if (items.length > 0) {
        setFollowUps(items);
      } else {
        setFollowUps([
          { id: '1', title: 'Check on CFO review of LMS pricing', lead_company: 'Zenith Tech', deal_title: '50-Seat Corporate License', scheduled_at: '2026-09-11 10:00:00', outcome: 'MEETING_BOOKED', description: 'CFO requested payment milestones breakdown' },
          { id: '2', title: 'Follow-up on MOU legal compliance draft', lead_company: 'EduGlobal Institute', deal_title: 'Institutional LMS Cloud Tier', scheduled_at: '2026-09-12 14:30:00', outcome: 'CONNECTED', description: 'Verify clause 4.2 data residency terms' },
          { id: '3', title: 'Quarterly upsell touchpoint', lead_company: 'Quantum Labs', deal_title: 'Custom AI Curriculum', scheduled_at: '2026-09-15 16:00:00', outcome: 'NO_ANSWER', description: 'Client out of office till Monday' }
        ]);
      }

      setDeals(dRes?.items || (Array.isArray(dRes) ? dRes : []));
      setLeads(lRes?.items || (Array.isArray(lRes) ? lRes : []));
    } catch (err) {
      console.error('Failed to load followups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, [filterOutcome]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createActivity(form);
      setShowModal(false);
      setForm({
        title: '',
        activity_type: 'FOLLOW_UP',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        deal_id: '',
        lead_id: '',
        description: '',
        outcome: 'BUSY'
      });
      loadFollowUps();
    } catch (err) {
      alert('Failed to schedule follow-up: ' + err.message);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await updateActivity(id, {
        outcome: 'COMPLETED',
        completed_at: new Date().toISOString()
      });
      loadFollowUps();
    } catch (err) {
      alert('Failed to update follow-up: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this follow-up?')) return;
    try {
      await deleteActivity(id);
      loadFollowUps();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <AdminPage
      title="Sales Follow-Ups & Cadences"
      subtitle="Prioritize active prospect callbacks, overdue touchpoint alerts, and closing cadences"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-clock-history"></i>
          <span>Schedule Follow-Up</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-2">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <select
              className="form-select"
              value={filterOutcome}
              onChange={e => setFilterOutcome(e.target.value)}
            >
              <option value="">All Follow-Up Statuses</option>
              <option value="CONNECTED">Connected</option>
              <option value="MEETING_BOOKED">Meeting Booked</option>
              <option value="NO_ANSWER">No Answer / Busy</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="col-md-8 text-md-end">
            <span className="badge bg-warning bg-opacity-10 text-dark px-3 py-2">
              {followUps.length} Cadence Reminders
            </span>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Follow-Up Task</th>
                <th>Target Company / Lead</th>
                <th>Associated Deal</th>
                <th>Scheduled Date & Time</th>
                <th>Outcome / Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading follow-ups...</td></tr>
              ) : followUps.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No pending follow-ups found.</td></tr>
              ) : (
                followUps.map(f => (
                  <tr key={f.id}>
                    <td>
                      <div className="fw-semibold text-dark">{f.title}</div>
                      <small className="text-muted">{f.description || 'Routine check-in'}</small>
                    </td>
                    <td>{f.lead_company || f.lead_name || 'Prospect'}</td>
                    <td>
                      <span className="fw-semibold text-primary">{f.deal_title || 'General Account'}</span>
                    </td>
                    <td>
                      <span className="text-dark fw-bold">{new Date(f.scheduled_at).toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        f.outcome === 'COMPLETED' ? 'bg-success' :
                        f.outcome === 'MEETING_BOOKED' ? 'bg-primary' :
                        f.outcome === 'CONNECTED' ? 'bg-info text-dark' : 'bg-warning text-dark'
                      }`}>
                        {f.outcome}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {f.outcome !== 'COMPLETED' && (
                          <button
                            className="btn btn-outline-success"
                            title="Mark Completed"
                            onClick={() => handleMarkDone(f.id)}
                          >
                            <i className="bi bi-check-lg me-1"></i>Done
                          </button>
                        )}
                        <button
                          className="btn btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(f.id)}
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

      {/* Schedule Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Schedule Prospect Follow-Up</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Call Rajesh regarding pricing concession"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Link Deal (Optional)</label>
                      <select
                        className="form-select"
                        value={form.deal_id}
                        onChange={e => setForm({ ...form, deal_id: e.target.value })}
                      >
                        <option value="">Select Deal...</option>
                        {deals.map(d => (
                          <option key={d.id} value={d.id}>{d.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Link Lead (Optional)</label>
                      <select
                        className="form-select"
                        value={form.lead_id}
                        onChange={e => setForm({ ...form, lead_id: e.target.value })}
                      >
                        <option value="">Select Lead...</option>
                        {leads.map(l => (
                          <option key={l.id} value={l.id}>{l.first_name} ({l.company_name})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Scheduled Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      required
                      value={form.scheduled_at}
                      onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Notes & Context</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Target talking points, objections to address..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Schedule Follow-Up</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
