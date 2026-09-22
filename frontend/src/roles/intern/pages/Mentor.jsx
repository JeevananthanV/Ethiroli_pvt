import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Mentor() {
  const mentor = {
    name: 'Karthik Raja',
    role: 'Lead Full-Stack Architect & Engineering Mentor',
    email: 'karthik@ethiroli.net',
    phone: '+91 98400 12345',
    officeHours: 'Mon – Fri: 04:00 PM – 06:00 PM',
    expertise: ['React / Vite', 'Node.js & Express', 'PostgreSQL', 'System Design']
  };

  const [doubtForm, setDoubtForm] = useState({ subject: '', category: 'BUG', priority: 'MEDIUM', description: '' });
  const [doubtsList, setDoubtsList] = useState([
    {
      id: 'd1',
      subject: 'JWT Refresh Token Rotation replay mitigation in Redis',
      category: 'SECURITY',
      priority: 'HIGH',
      status: 'RESOLVED',
      createdAt: '2026-09-08',
      response: 'Use Redis key family invalidation whenever an expired or duplicated refresh token is presented.'
    },
    {
      id: 'd2',
      subject: 'Framer motion initial render hydration layout shift',
      category: 'UI_BUG',
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: '2026-09-06',
      response: 'Wrap motion elements inside an AnimatePresence or apply layout="position" to stabilize.'
    },
    {
      id: 'd3',
      subject: 'Socket.IO disconnect handling on mobile network switches',
      category: 'ARCHITECTURE',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdAt: '2026-09-09',
      response: 'Investigating reconnection backoff delays.'
    }
  ]);

  const [alert, setAlert] = useState({ type: '', text: '' });
  const [meetingRequested, setMeetingRequested] = useState(false);

  const handleRaiseDoubt = (e) => {
    e.preventDefault();
    if (!doubtForm.subject.trim() || !doubtForm.description.trim()) {
      setAlert({ type: 'danger', text: 'Please fill in both subject and description.' });
      return;
    }

    const newDoubt = {
      id: Date.now().toString(),
      subject: doubtForm.subject,
      category: doubtForm.category,
      priority: doubtForm.priority,
      status: 'OPEN',
      createdAt: new Date().toISOString().slice(0, 10),
      response: 'Under mentor review'
    };

    setDoubtsList([newDoubt, ...doubtsList]);
    setDoubtForm({ subject: '', category: 'BUG', priority: 'MEDIUM', description: '' });
    setAlert({ type: 'success', text: 'Doubt ticket submitted to your mentor successfully!' });
  };

  return (
    <AdminPage
      title="Mentor Support & Doubt Resolution"
      subtitle="Connect with your assigned engineering mentor, schedule 1-on-1 sessions, and resolve blockers"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row g-4 mb-4">
          {/* Assigned Mentor Card */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-person-badge me-2"></i>Assigned Mentor
                </h5>
              </div>
              <div className="card-body p-4 pt-0 text-center">
                <div className="avatar-circle bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {mentor.name.charAt(0)}
                </div>
                <h4 className="fw-bold mb-1">{mentor.name}</h4>
                <p className="text-muted small mb-3">{mentor.role}</p>

                <div className="d-flex flex-wrap gap-1 justify-content-center mb-4">
                  {mentor.expertise.map((exp) => (
                    <span key={exp} className="badge bg-light text-dark border small">
                      {exp}
                    </span>
                  ))}
                </div>

                <div className="border-top pt-3 text-start small mb-4">
                  <div className="mb-2">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    <a href={`mailto:${mentor.email}`} className="text-decoration-none">{mentor.email}</a>
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    <span>{mentor.phone}</span>
                  </div>
                  <div>
                    <i className="bi bi-clock me-2 text-primary"></i>
                    <span>{mentor.officeHours}</span>
                  </div>
                </div>

                <button
                  className="btn btn-outline-primary w-100 py-2"
                  onClick={() => setMeetingRequested(true)}
                  disabled={meetingRequested}
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  {meetingRequested ? '1-on-1 Meeting Requested' : 'Schedule 1-on-1 Review'}
                </button>
              </div>
            </div>
          </div>

          {/* Raise a Doubt Ticket */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-question-circle me-2"></i>Raise a Technical Doubt / Blocker
                </h5>
              </div>
              <div className="card-body p-4 pt-0">
                <form onSubmit={handleRaiseDoubt}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subject / Question Summary</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Error configuring CORS on socket gateway"
                      value={doubtForm.subject}
                      onChange={(e) => setDoubtForm({ ...doubtForm, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={doubtForm.category}
                        onChange={(e) => setDoubtForm({ ...doubtForm, category: e.target.value })}
                      >
                        <option value="BUG">Technical Bug / Error</option>
                        <option value="CONCEPT">Curriculum Concept</option>
                        <option value="ARCHITECTURE">Architecture & DB</option>
                        <option value="WORKFLOW">Git / Tooling Workflow</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Priority</label>
                      <select
                        className="form-select"
                        value={doubtForm.priority}
                        onChange={(e) => setDoubtForm({ ...doubtForm, priority: e.target.value })}
                      >
                        <option value="LOW">Low (Not blocking)</option>
                        <option value="MEDIUM">Medium (Normal priority)</option>
                        <option value="HIGH">High (Blocking daily work)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description & Error Logs</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Paste terminal logs, error messages, or explanation of what you tried..."
                      value={doubtForm.description}
                      onChange={(e) => setDoubtForm({ ...doubtForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                    <i className="bi bi-send me-2"></i>Submit Doubt Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Doubts History Table */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Recent Doubt Tickets</h5>
            <span className="badge bg-light text-muted border">{doubtsList.length} Total Tickets</span>
          </div>
          <div className="card-body p-3">
            <div className="d-flex flex-column gap-3">
              {doubtsList.map((d) => (
                <div key={d.id} className="card border p-3 rounded-3 shadow-none bg-light-subtle">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="fw-bold fs-6 text-dark me-2">{d.subject}</span>
                      <span className="badge bg-secondary-subtle text-dark small">{d.category}</span>
                    </div>
                    <span className={`badge ${
                      d.status === 'RESOLVED' ? 'bg-success' :
                      d.status === 'IN_PROGRESS' ? 'bg-warning text-dark' : 'bg-primary'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="border-top pt-2 mt-2">
                    <small className="text-muted d-block">
                      <strong>Mentor Advice:</strong> {d.response}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
