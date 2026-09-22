import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getActivities, createActivity, deleteActivity } from '../../../services/api/salesApi.js';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    activity_type: 'MEETING',
    title: '',
    duration_minutes: 45,
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    outcome: 'MEETING_BOOKED',
    description: ''
  });

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const res = await getActivities({ activity_type: ['MEETING', 'DEMO'] });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setMeetings(items);
      } else {
        setMeetings([
          { id: '1', title: 'Product Architecture & Cloud Security Walkthrough', lead_company: 'EduGlobal Institute', duration_minutes: 45, outcome: 'MEETING_BOOKED', scheduled_at: '2026-09-12 11:00:00', meeting_link: 'https://meet.google.com/edu-demo-2026', description: 'Presenting ISO 27001 data protection and multi-tenant student database isolation.' },
          { id: '2', title: 'Commercial Contract & SLA Terms Review', lead_company: 'Zenith Tech Solutions', duration_minutes: 30, outcome: 'COMPLETED', scheduled_at: '2026-09-10 15:30:00', meeting_link: 'https://meet.google.com/zenith-sla-review', description: 'Agreed on 99.9% uptime guarantee and Tier-1 escalation matrix.' },
          { id: '3', title: 'Custom AI Curriculum Co-Design Session', lead_company: 'Quantum Labs', duration_minutes: 60, outcome: 'MEETING_BOOKED', scheduled_at: '2026-09-14 16:00:00', meeting_link: 'https://zoom.us/j/9876543210', description: 'Aligning capstone project topics with industry mentor assignments.' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createActivity({
        ...form,
        activity_type: 'MEETING',
        duration_minutes: parseInt(form.duration_minutes, 10)
      });
      setShowModal(false);
      setForm({ activity_type: 'MEETING', title: '', duration_minutes: 45, scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), meeting_link: 'https://meet.google.com/abc-defg-hij', outcome: 'MEETING_BOOKED', description: '' });
      loadMeetings();
    } catch (err) {
      alert('Failed to schedule meeting: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this meeting?')) return;
    try {
      await deleteActivity(id);
      loadMeetings();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <AdminPage
      title="Sales Meetings & Client Demos"
      subtitle="Virtual and in-person executive briefings, live software demonstrations, and commercial negotiations"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-calendar-event"></i>
          <span>Schedule Meeting</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Scheduled Demonstrations & Reviews</h6>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
            {meetings.length} Scheduled Sessions
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Session Title</th>
                <th>Client Account</th>
                <th>Scheduled Date & Time</th>
                <th>Duration</th>
                <th>Conference Link</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading meetings...</td></tr>
              ) : meetings.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No meetings scheduled.</td></tr>
              ) : (
                meetings.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="fw-semibold text-dark">{m.title}</div>
                      {m.description && <small className="text-muted">{m.description}</small>}
                    </td>
                    <td>{m.lead_company || m.deal_title || 'Enterprise Account'}</td>
                    <td>
                      <span className="fw-bold text-dark">{new Date(m.scheduled_at).toLocaleString()}</span>
                    </td>
                    <td>{m.duration_minutes} Mins</td>
                    <td>
                      {m.meeting_link ? (
                        <a
                          href={m.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-camera-video me-1"></i>Join Video
                        </a>
                      ) : (
                        <span className="text-muted">In-person</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        m.outcome === 'COMPLETED' ? 'bg-success' : 'bg-primary'
                      }`}>
                        {m.outcome === 'MEETING_BOOKED' ? 'UPCOMING' : m.outcome}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}>
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

      {/* Schedule Meeting Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Schedule Client Demonstration</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Meeting Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Platform Architecture & Pricing Review"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Scheduled Date & Time *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        required
                        value={form.scheduled_at}
                        onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                      />
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
                    <label className="form-label small fw-semibold">Video Conference Link *</label>
                    <input
                      type="url"
                      className="form-control"
                      required
                      placeholder="https://meet.google.com/..."
                      value={form.meeting_link}
                      onChange={e => setForm({ ...form, meeting_link: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Agenda & Talking Points</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Stakeholders attending, product modules to demonstrate..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Schedule Session</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
