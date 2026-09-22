import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getActivities, createActivity, deleteActivity } from '../../../services/api/salesApi.js';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    activity_type: 'CALL',
    title: '',
    duration_minutes: 15,
    scheduled_at: new Date().toISOString().slice(0, 16),
    outcome: 'CONNECTED',
    description: '',
    meeting_link: ''
  });

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await getActivities({ activity_type: typeFilter || undefined });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setActivities(items);
      } else {
        setActivities([
          { id: '1', activity_type: 'CALL', title: 'Introductory Discovery Call with VP Tech', lead_company: 'Zenith Tech', deal_title: '50-Seat Corporate Upskill', duration_minutes: 25, outcome: 'CONNECTED', scheduled_at: '2026-09-09 11:30:00', description: 'Discussed cohort timelines and seat counts. Sent brochure.' },
          { id: '2', activity_type: 'MEETING', title: 'Platform Architecture Deep Dive', lead_company: 'EduGlobal Institute', deal_title: 'Institutional LMS White-label', duration_minutes: 45, outcome: 'COMPLETED', scheduled_at: '2026-09-08 15:00:00', meeting_link: 'https://meet.google.com/xyz-abcd-efg', description: 'Demonstrated SSO integration, student grading workflows, and compliance reporting.' },
          { id: '3', activity_type: 'DEMO', title: 'Live Product Walkthrough with Dean', lead_company: 'Symbiosis Academic Network', deal_title: 'Higher Ed LMS Suite', duration_minutes: 60, outcome: 'MEETING_BOOKED', scheduled_at: '2026-09-07 16:30:00', description: 'Scheduled follow-up meeting for legal contract sign-off.' },
          { id: '4', activity_type: 'EMAIL', title: 'Revised Pricing Proposal Sent', lead_company: 'Quantum Labs', deal_title: 'Custom AI Curriculum', duration_minutes: 10, outcome: 'COMPLETED', scheduled_at: '2026-09-06 09:15:00', description: 'Forwarded formal quote with 10% volume discount.' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [typeFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createActivity({
        ...form,
        duration_minutes: parseInt(form.duration_minutes, 10)
      });
      setShowModal(false);
      setForm({ activity_type: 'CALL', title: '', duration_minutes: 15, scheduled_at: new Date().toISOString().slice(0, 16), outcome: 'CONNECTED', description: '', meeting_link: '' });
      loadActivities();
    } catch (err) {
      alert('Failed to log activity: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity log?')) return;
    try {
      await deleteActivity(id);
      loadActivities();
    } catch (err) {
      alert('Failed to delete activity: ' + err.message);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CALL': return 'bi-telephone text-primary';
      case 'MEETING': return 'bi-people text-success';
      case 'DEMO': return 'bi-display text-warning';
      case 'EMAIL': return 'bi-envelope text-info';
      case 'NOTE': return 'bi-journal-text text-secondary';
      default: return 'bi-dot';
    }
  };

  return (
    <AdminPage
      title="Sales Activities & Engagement Log"
      subtitle="Unified omni-channel activity timeline across client phone calls, video meetings, and product demos"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i>
          <span>Log Activity</span>
        </button>
      }
    >
      {/* Type Filter Header */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <select
              className="form-select"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">All Activity Types</option>
              <option value="CALL">Phone Calls</option>
              <option value="MEETING">Video Meetings</option>
              <option value="DEMO">Product Demos</option>
              <option value="EMAIL">Emails</option>
              <option value="NOTE">Internal Notes</option>
            </select>
          </div>
          <div className="col-md-8 text-md-end">
            <span className="badge bg-light text-secondary border px-3 py-2">
              {activities.length} Recorded Touchpoints
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <div className="timeline">
          {loading ? (
            <div className="py-4 text-center">Loading activity timeline...</div>
          ) : activities.length === 0 ? (
            <div className="py-4 text-center text-muted">No activities found matching criteria.</div>
          ) : (
            activities.map(act => (
              <div key={act.id} className="d-flex gap-3 mb-4 pb-3 border-bottom position-relative">
                <div className="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                  <i className={`bi ${getTypeIcon(act.activity_type)} fs-5`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">{act.title}</h6>
                      <small className="text-muted">
                        <span className="fw-semibold text-primary">{act.lead_company || act.deal_title || 'Direct Account'}</span> &bull; {new Date(act.scheduled_at).toLocaleString()} ({act.duration_minutes || 15} mins)
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge ${
                        act.outcome === 'CONNECTED' || act.outcome === 'COMPLETED' ? 'bg-success' :
                        act.outcome === 'MEETING_BOOKED' ? 'bg-primary' : 'bg-secondary'
                      }`}>
                        {act.outcome}
                      </span>
                      <button
                        className="btn btn-sm btn-link text-danger p-0"
                        title="Delete"
                        onClick={() => handleDelete(act.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  {act.description && (
                    <p className="mt-2 mb-1 text-dark small bg-light p-2 rounded-2">{act.description}</p>
                  )}
                  {act.meeting_link && (
                    <a href={act.meeting_link} target="_blank" rel="noreferrer" className="small text-decoration-none">
                      <i className="bi bi-camera-video me-1"></i>Join Video Call
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Activity Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Log Engagement Activity</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Activity Type *</label>
                      <select
                        className="form-select"
                        value={form.activity_type}
                        onChange={e => setForm({ ...form, activity_type: e.target.value })}
                      >
                        <option value="CALL">Phone Call</option>
                        <option value="MEETING">Video Meeting</option>
                        <option value="DEMO">Product Demo</option>
                        <option value="EMAIL">Email</option>
                        <option value="NOTE">Internal Note</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Outcome</label>
                      <select
                        className="form-select"
                        value={form.outcome}
                        onChange={e => setForm({ ...form, outcome: e.target.value })}
                      >
                        <option value="CONNECTED">Connected</option>
                        <option value="MEETING_BOOKED">Meeting Booked</option>
                        <option value="BUSY">Busy</option>
                        <option value="NO_ANSWER">No Answer</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Activity Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Discovery call with technical leadership"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={form.scheduled_at}
                        onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Duration (Minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.duration_minutes}
                        onChange={e => setForm({ ...form, duration_minutes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Meeting URL (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://meet.google.com/..."
                      value={form.meeting_link}
                      onChange={e => setForm({ ...form, meeting_link: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Summary & Insights</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Key takeaways, objections, immediate action items..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Log Activity</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
