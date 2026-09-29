import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Mentor() {
  const [activeTab, setActiveTab] = useState('doubts'); // 'doubts' | 'sessions' | 'reviews' | 'messages'
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const mentor = {
    name: 'Arun Kumar',
    role: 'Senior Full Stack Developer & Lead Mentor',
    experience: '6+ years',
    specialization: 'React 19, Node.js, Express, MySQL, System Design',
    email: 'arun.kumar@ethiroli.net',
    officeHours: 'Mon – Fri: 04:00 PM – 05:00 PM',
    status: 'Online',
    avatar: 'AK'
  };

  const [doubtForm, setDoubtForm] = useState({
    title: '',
    category: 'React',
    priority: 'MEDIUM',
    description: '',
    visibility: 'PUBLIC',
    codeSnippet: ''
  });

  const [doubts, setDoubts] = useState([
    {
      id: 'd1',
      title: 'How to handle JWT refresh token rotation without race conditions on concurrent requests?',
      category: 'Node & Auth',
      priority: 'HIGH',
      visibility: 'PUBLIC',
      status: 'ANSWERED',
      createdAt: 'Yesterday, 3:30 PM',
      description: 'When multiple parallel API calls receive 401 simultaneously, they all trigger /refresh at once, invalidating each other.',
      mentorAnswer: 'Implement a request queue with an isRefreshing lock flag in your Axios response interceptor so subsequent 401s subscribe to the single in-flight refresh promise.',
      answeredAt: 'Yesterday, 4:15 PM'
    },
    {
      id: 'd2',
      title: 'Best practice for structuring Redux Toolkit slices in a monorepo',
      category: 'React',
      priority: 'MEDIUM',
      visibility: 'PUBLIC',
      status: 'ANSWERED',
      createdAt: 'Sep 15, 2026',
      description: 'Should common auth and user states reside in a shared package or inside frontend/src/store?',
      mentorAnswer: 'Keep presentation state local to frontend/src/store/slices. Export common TypeScript interfaces or schema types from a shared packages/types folder if needed.',
      answeredAt: 'Sep 15, 2026'
    },
    {
      id: 'd3',
      title: 'PostgreSQL deadlocks during bulk insert migration',
      category: 'Database',
      priority: 'LOW',
      visibility: 'PRIVATE',
      status: 'OPEN',
      createdAt: 'Today, 11:20 AM',
      description: 'Migration script times out when inserting 10k mock records with foreign keys.',
      mentorAnswer: 'Will review during today 4:00 PM session.',
      answeredAt: 'Pending'
    }
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 's1',
      title: 'Weekly 1-on-1 Code Review & Blocker Clearing',
      date: 'Today, September 18, 2026',
      time: '04:00 PM – 04:30 PM',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'CONFIRMED',
      agenda: 'Reviewing Redux thunk slice errors and Capstone deliverable progress.'
    },
    {
      id: 's2',
      title: 'Mid-Term Internship Progress Evaluation',
      date: 'Friday, September 25, 2026',
      time: '03:00 PM – 03:45 PM',
      meetLink: 'https://meet.google.com/xyz-uvwx-rst',
      status: 'UPCOMING',
      agenda: 'Evaluating core competencies, attendance records, and project contributions.'
    }
  ]);

  const [reviews] = useState([
    {
      id: 'r1',
      period: 'Week 2 Review',
      date: 'Sep 14, 2026',
      rating: 4.5,
      notes: 'Strong performance on responsive layout conversion and Redux state structuring. Need to write cleaner git commit messages.',
      strengths: ['Quick learner', 'Clean React component patterns', 'High punctuality'],
      improvements: ['Write unit tests for custom hooks', 'Add ARIA attributes for accessibility']
    },
    {
      id: 'r2',
      period: 'Week 1 Review',
      date: 'Sep 07, 2026',
      rating: 4.0,
      notes: 'Good understanding of HTML5/CSS3 and Git branching workflows.',
      strengths: ['Proactive communicator', 'Fast turnaround on tasks'],
      improvements: ['Deepen understanding of asynchronous JavaScript Promises']
    }
  ]);

  const handleAskDoubt = (e) => {
    e.preventDefault();
    if (!doubtForm.title.trim() || !doubtForm.description.trim()) {
      setAlert({ type: 'danger', text: 'Please fill in both title and description.' });
      return;
    }

    const newDoubt = {
      id: Date.now().toString(),
      title: doubtForm.title,
      category: doubtForm.category,
      priority: doubtForm.priority,
      visibility: doubtForm.visibility,
      status: 'OPEN',
      createdAt: 'Just now',
      description: doubtForm.description,
      mentorAnswer: 'Under mentor review',
      answeredAt: 'Pending'
    };

    setDoubts([newDoubt, ...doubts]);
    setShowDoubtModal(false);
    setDoubtForm({
      title: '',
      category: 'React',
      priority: 'MEDIUM',
      description: '',
      visibility: 'PUBLIC',
      codeSnippet: ''
    });
    setAlert({ type: 'success', text: 'Your doubt has been submitted to Arun Kumar!' });
  };

  return (
    <AdminPage
      title="Mentorship & Doubt Clearing System"
      subtitle="Direct access to your assigned engineering mentor, scheduled 1-on-1 sessions, doubt tickets, and evaluations"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Assigned Mentor Profile Card */}
        <div className="card shadow-sm border-0 mb-2">
          <div className="card-body p-3">
            <div className="row align-items-center g-4">
              <div className="col-md-7 d-flex align-items-center gap-3">
                <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: '72px', height: '72px' }}>
                  {mentor.avatar}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h4 className="fw-bold mb-0 text-dark">{mentor.name}</h4>
                    <span className="badge bg-success-subtle text-success border border-success-subtle small">
                      <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.55rem' }}></i>{mentor.status}
                    </span>
                  </div>
                  <p className="text-muted small mb-1">{mentor.role} • {mentor.experience} Exp</p>
                  <div className="d-flex flex-wrap gap-1">
                    {mentor.specialization.split(', ').map((s) => (
                      <span key={s} className="badge bg-light text-secondary border small">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-5 text-md-end">
                <div className="mb-2">
                  <small className="text-muted d-block">
                    <i className="bi bi-clock me-1 text-primary"></i>Office Hours: {mentor.officeHours}
                  </small>
                  <small className="text-muted d-block">
                    <i className="bi bi-envelope me-1 text-primary"></i>{mentor.email}
                  </small>
                </div>
                <div className="d-flex gap-2 justify-content-md-end">
                  <Link to="/app/intern/messages" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-chat-dots me-1"></i> Chat with Mentor
                  </Link>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowDoubtModal(true)}
                  >
                    <i className="bi bi-question-circle me-1"></i> Ask a Doubt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs: Doubts | 1-on-1 Sessions | Mentor Reviews */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0 pt-3 pb-0">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'doubts' ? 'active fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab('doubts')}
                >
                  <i className="bi bi-chat-left-quote me-1"></i> Doubts & Discussions ({doubts.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'sessions' ? 'active fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  <i className="bi bi-calendar-check me-1"></i> 1-on-1 Sessions ({sessions.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'reviews' ? 'active fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  <i className="bi bi-star-half me-1"></i> Mentor Reviews ({reviews.length})
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-3">
            {/* Doubts Tab */}
            {activeTab === 'doubts' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark mb-0">Doubt Tickets & Peer Discussions</h6>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowDoubtModal(true)}>
                    + Ask New Doubt
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {doubts.map((d) => (
                    <div key={d.id} className="card border p-3 rounded-3 shadow-none bg-light-subtle">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge bg-light text-primary border me-2 small">{d.category}</span>
                          <span className="badge bg-light text-secondary border me-2 small">
                            {d.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                          </span>
                          <span
                            className={`badge small ${
                              d.status === 'ANSWERED'
                                ? 'bg-success-subtle text-success border border-success-subtle'
                                : 'bg-warning-subtle text-warning border border-warning-subtle'
                            }`}
                          >
                            {d.status === 'ANSWERED' ? 'Answered' : 'Open'}
                          </span>
                        </div>
                        <small className="text-muted">{d.createdAt}</small>
                      </div>

                      <h6 className="fw-bold text-dark mb-2">{d.title}</h6>
                      <p className="text-muted small mb-3">{d.description}</p>

                      <div className="p-3 bg-white rounded-3 border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-primary small">
                            <i className="bi bi-chat-quote-fill me-1"></i>Mentor Response:
                          </strong>
                          <small className="text-muted">{d.answeredAt}</small>
                        </div>
                        <p className="mb-0 text-dark small">{d.mentorAnswer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1-on-1 Sessions Tab */}
            {activeTab === 'sessions' && (
              <div>
                <h6 className="fw-bold text-dark mb-3">Scheduled 1-on-1 Mentorship Sessions</h6>
                <div className="row g-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="col-lg-6">
                      <div className="card border p-3 rounded-3 h-100 bg-light-subtle">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-primary-subtle text-primary border">{s.status}</span>
                          <span className="small text-muted">{s.time}</span>
                        </div>
                        <h5 className="fw-bold text-dark mb-1">{s.title}</h5>
                        <p className="text-primary fw-semibold small mb-2">
                          <i className="bi bi-calendar-event me-1"></i>{s.date}
                        </p>
                        <p className="text-muted small mb-3">{s.agenda}</p>
                        <a
                          href={s.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm w-100"
                        >
                          <i className="bi bi-camera-video me-1"></i> Join Google Meet
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentor Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h6 className="fw-bold text-dark mb-3">All Mentor Evaluations & Feedback</h6>
                <div className="d-flex flex-column gap-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="card border p-3 rounded-3 bg-light-subtle">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0 text-dark">{r.period}</h6>
                        <span className="text-warning fw-bold">
                          {'★'.repeat(Math.floor(r.rating))} ({r.rating} / 5.0)
                        </span>
                      </div>
                      <p className="text-muted small mb-3">"{r.notes}"</p>
                      <div className="row g-3 small">
                        <div className="col-sm-6">
                          <strong className="text-success d-block mb-1">
                            <i className="bi bi-check-circle me-1"></i>Strengths:
                          </strong>
                          <ul className="mb-0 ps-3 text-muted">
                            {r.strengths.map((st, idx) => (
                              <li key={idx}>{st}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-sm-6">
                          <strong className="text-danger d-block mb-1">
                            <i className="bi bi-arrow-up-right-circle me-1"></i>Areas to Improve:
                          </strong>
                          <ul className="mb-0 ps-3 text-muted">
                            {r.improvements.map((im, idx) => (
                              <li key={idx}>{im}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ask a Doubt Modal */}
        {showDoubtModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Ask Mentor a Technical Doubt</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDoubtModal(false)}></button>
                </div>
                <form onSubmit={handleAskDoubt}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Doubt Title / Summary <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Redux Toolkit selector causes unnecessary re-renders"
                        value={doubtForm.title}
                        onChange={(e) => setDoubtForm({ ...doubtForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Category</label>
                        <select
                          className="form-select"
                          value={doubtForm.category}
                          onChange={(e) => setDoubtForm({ ...doubtForm, category: e.target.value })}
                        >
                          <option value="React">React.js</option>
                          <option value="Node & Auth">Node.js & Auth</option>
                          <option value="Database">MySQL / PostgreSQL</option>
                          <option value="Git & Tooling">Git & Tooling</option>
                          <option value="Architecture">System Architecture</option>
                        </select>
                      </div>
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Priority</label>
                        <select
                          className="form-select"
                          value={doubtForm.priority}
                          onChange={(e) => setDoubtForm({ ...doubtForm, priority: e.target.value })}
                        >
                          <option value="LOW">Low (Conceptual question)</option>
                          <option value="MEDIUM">Medium (Normal priority)</option>
                          <option value="HIGH">High (Blocking daily work)</option>
                        </select>
                      </div>
                      <div className="col-sm-4">
                        <label className="form-label small fw-semibold">Visibility</label>
                        <select
                          className="form-select"
                          value={doubtForm.visibility}
                          onChange={(e) => setDoubtForm({ ...doubtForm, visibility: e.target.value })}
                        >
                          <option value="PUBLIC">Public (All Interns can learn)</option>
                          <option value="PRIVATE">Private (Only Mentor & You)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Description & What You've Tried <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Explain what happened vs what you expected..."
                        value={doubtForm.description}
                        onChange={(e) => setDoubtForm({ ...doubtForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Code Snippet / Error Logs (Optional)</label>
                      <textarea
                        className="form-control font-monospace small"
                        rows="3"
                        placeholder="Paste code snippet or terminal error stacktrace..."
                        value={doubtForm.codeSnippet}
                        onChange={(e) => setDoubtForm({ ...doubtForm, codeSnippet: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light btn-sm" onClick={() => setShowDoubtModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Submit Doubt Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
