import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getActivities, createActivity, deleteActivity } from '../../../services/api/salesApi.js';

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    activity_type: 'CALL',
    title: '',
    duration_minutes: 15,
    scheduled_at: new Date().toISOString().slice(0, 16),
    outcome: 'CONNECTED',
    description: ''
  });

  const loadCalls = async () => {
    try {
      setLoading(true);
      const res = await getActivities({ activity_type: 'CALL' });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setCalls(items);
      } else {
        setCalls([
          { id: '1', title: 'Outbound pitch to CTO Rajesh Varma', lead_company: 'CloudBridge Tech', duration_minutes: 18, outcome: 'CONNECTED', scheduled_at: '2026-09-09 14:00:00', description: 'Pitching our custom learning paths. Wants demo on Thursday.' },
          { id: '2', title: 'Cold call to HR Director Priya Sundaram', lead_company: 'EduGlobal Institute', duration_minutes: 8, outcome: 'CONNECTED', scheduled_at: '2026-09-08 11:15:00', description: 'Discussed faculty certification requirements.' },
          { id: '3', title: 'Callback to Procurement Lead', lead_company: 'Zenith Logistics', duration_minutes: 2, outcome: 'NO_ANSWER', scheduled_at: '2026-09-08 16:45:00', description: 'Voicemail left regarding contract amendments.' },
          { id: '4', title: 'Follow-up call to CFO', lead_company: 'Quantum Labs', duration_minutes: 14, outcome: 'CONNECTED', scheduled_at: '2026-09-07 10:30:00', description: 'Discussed invoice payment milestones.' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load calls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createActivity({
        ...form,
        activity_type: 'CALL',
        duration_minutes: parseInt(form.duration_minutes, 10)
      });
      setShowModal(false);
      setForm({ activity_type: 'CALL', title: '', duration_minutes: 15, scheduled_at: new Date().toISOString().slice(0, 16), outcome: 'CONNECTED', description: '' });
      loadCalls();
    } catch (err) {
      alert('Failed to log call: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete call log?')) return;
    try {
      await deleteActivity(id);
      loadCalls();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const totalCalls = calls.length;
  const connectedCalls = calls.filter(c => c.outcome === 'CONNECTED').length;
  const connectRate = totalCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 0;
  const avgDuration = totalCalls > 0 ? Math.round(calls.reduce((a, b) => a + (b.duration_minutes || 0), 0) / totalCalls) : 0;

  return (
    <AdminPage
      title="Telephony & Call Logs"
      subtitle="Outbound prospecting calls, connection ratios, duration analytics, and conversation outcomes"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-telephone-plus"></i>
          <span>Log Call</span>
        </button>
      }
    >
      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-uppercase fw-semibold text-muted">Total Calls Logged</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">{totalCalls}</h3>
            <small className="text-muted">Outbound prospecting cycles</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-uppercase fw-semibold text-muted">Connect Rate</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">{connectRate}%</h3>
            <small className="text-success">{connectedCalls} successful conversations</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <small className="text-uppercase fw-semibold text-muted">Average Duration</small>
            <h3 className="mb-0 fw-bold mt-1 text-info">{avgDuration} Mins</h3>
            <small className="text-muted">Per phone call</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Call Subject</th>
                <th>Account / Prospect</th>
                <th>Duration</th>
                <th>Outcome</th>
                <th>Timestamp</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading calls...</td></tr>
              ) : calls.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No calls logged yet.</td></tr>
              ) : (
                calls.map(call => (
                  <tr key={call.id}>
                    <td>
                      <div className="fw-semibold text-dark">{call.title}</div>
                      {call.description && <small className="text-muted">{call.description}</small>}
                    </td>
                    <td>{call.lead_company || call.lead_name || 'Prospect'}</td>
                    <td><span className="badge bg-light text-dark border">{call.duration_minutes} mins</span></td>
                    <td>
                      <span className={`badge ${
                        call.outcome === 'CONNECTED' ? 'bg-success' :
                        call.outcome === 'BUSY' ? 'bg-warning text-dark' : 'bg-secondary'
                      }`}>
                        {call.outcome}
                      </span>
                    </td>
                    <td className="text-muted">{new Date(call.scheduled_at).toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(call.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Call Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Log Outbound Call</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subject / Prospect Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Call with CTO Rajesh Varma"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Outcome</label>
                      <select
                        className="form-select"
                        value={form.outcome}
                        onChange={e => setForm({ ...form, outcome: e.target.value })}
                      >
                        <option value="CONNECTED">Connected</option>
                        <option value="BUSY">Busy</option>
                        <option value="NO_ANSWER">No Answer</option>
                        <option value="MEETING_BOOKED">Meeting Booked</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Duration (Mins)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.duration_minutes}
                        onChange={e => setForm({ ...form, duration_minutes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      required
                      value={form.scheduled_at}
                      onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Conversation Summary</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Key questions asked, prospect interest level, follow-up agreement..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Call Log</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
