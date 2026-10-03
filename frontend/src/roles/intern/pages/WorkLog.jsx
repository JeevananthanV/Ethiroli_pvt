import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function WorkLog() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    workedOn: '',
    learnedToday: '',
    problemsFaced: '',
    howSolved: '',
    hoursWorked: 8.0,
    githubPr: '',
    hasBlocker: 'NO',
    blockerDetails: ''
  });

  const [alert, setAlert] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [logs, setLogs] = useState([
    {
      id: 'wl-1',
      date: '2026-09-17',
      hours: 8.0,
      workedOn: 'Created offcanvas mobile navigation drawer and unified navbar search with keyboard shortcut.',
      learnedToday: 'Bootstrap 5 offcanvas events, responsive breakpoints, and ARIA accessibility.',
      problemsFaced: 'Encountered backdrop overlay z-index collision on mobile devices.',
      howSolved: 'Adjusted z-index tokens in admin design system variables to 1055.',
      githubPr: 'https://github.com/ethiroli/portal/pull/39',
      hasBlocker: 'NO',
      mentorRating: 5,
      mentorComments: 'Exceptional work on the responsive navigation. Very clean implementation.',
      status: 'APPROVED',
      reviewedBy: 'Mentor Arun Kumar'
    },
    {
      id: 'wl-2',
      date: '2026-09-16',
      hours: 8.5,
      workedOn: 'Integrated JWT token refresh endpoint with HttpOnly cookies in auth slice.',
      learnedToday: 'Token rotation patterns and replay protection in Redis.',
      problemsFaced: 'CORS cookie forwarding was blocked on cross-origin requests.',
      howSolved: 'Enabled withCredentials: true on Axios client instance.',
      githubPr: 'https://github.com/ethiroli/portal/pull/37',
      hasBlocker: 'NO',
      mentorRating: 4,
      mentorComments: 'Good work on API, but please write unit tests tomorrow.',
      status: 'APPROVED',
      reviewedBy: 'Mentor Arun Kumar'
    },
    {
      id: 'wl-3',
      date: '2026-09-15',
      hours: 7.5,
      workedOn: 'Designed PostgreSQL relational schema for courses, modules, and intern enrollments.',
      learnedToday: 'Database normalization rules (3NF) and index performance benchmarks.',
      problemsFaced: 'Circular foreign key dependency between course versions and modules.',
      howSolved: 'Separated course revisions into a dedicated audit ledger table.',
      githubPr: 'https://github.com/ethiroli/portal/pull/34',
      hasBlocker: 'YES',
      blockerDetails: 'Need lead architect review on transaction isolation level.',
      mentorRating: 3,
      mentorComments: 'Please address the foreign key cascade constraints mentioned in comments.',
      status: 'REVISION_REQUESTED',
      reviewedBy: 'Lead Architect'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.workedOn.trim()) {
      setAlert({ type: 'danger', text: 'Please fill in what you worked on today.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now().toString(),
        date: formData.date,
        hours: formData.hoursWorked,
        workedOn: formData.workedOn,
        learnedToday: formData.learnedToday,
        problemsFaced: formData.problemsFaced || 'None',
        howSolved: formData.howSolved || 'N/A',
        githubPr: formData.githubPr,
        hasBlocker: formData.hasBlocker,
        blockerDetails: formData.blockerDetails,
        mentorRating: null,
        mentorComments: 'Awaiting mentor review',
        status: 'SUBMITTED',
        reviewedBy: 'Pending'
      };

      setLogs([newEntry, ...logs]);
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        workedOn: '',
        learnedToday: '',
        problemsFaced: '',
        howSolved: '',
        hoursWorked: 8.0,
        githubPr: '',
        hasBlocker: 'NO',
        blockerDetails: ''
      });
      setIsSubmitting(false);
      setAlert({ type: 'success', text: 'Daily Work Log successfully submitted for mentor review!' });
    }, 400);
  };

  const handleSaveDraft = () => {
    setAlert({ type: 'info', text: 'Draft saved locally. You can finish and submit before check-out.' });
  };

  return (
    <AdminPage
      title="Daily Work Log (Standup Report)"
      subtitle="Structured daily report of activities, learning milestones, technical blockers, and mentor evaluations"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'info-circle'} me-2`}></i>
            {alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row g-4 mb-2">
          {/* Daily Report Form */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-pencil-square me-2"></i>Daily Report Form
                </h5>
                <span className="badge bg-light text-dark border">
                  Date: {formData.date}
                </span>
              </div>
              <div className="card-body p-3 pt-0">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label htmlFor="report-date" className="form-label small fw-semibold">Report Date</label>
                      <input id="report-date"
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="hours-worked" className="form-label small fw-semibold">Hours Worked</label>
                      <input id="hours-worked"
                        type="number"
                        step="0.5"
                        min="1"
                        max="16"
                        className="form-control"
                        value={formData.hoursWorked}
                        onChange={(e) => setFormData({ ...formData, hoursWorked: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="1-what-did-you" className="form-label small fw-semibold">
                      1. What did you work on today? <span className="text-danger">*</span>
                    </label>
                    <textarea id="1-what-did-you"
                      className="form-control"
                      rows="2"
                      placeholder="Bullet points or concise overview of tasks and features built..."
                      value={formData.workedOn}
                      onChange={(e) => setFormData({ ...formData, workedOn: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="2-what-did-you" className="form-label small fw-semibold">2. What did you learn today?</label>
                    <textarea id="2-what-did-you"
                      className="form-control"
                      rows="2"
                      placeholder="Concepts, libraries, debugging insights, or engineering patterns..."
                      value={formData.learnedToday}
                      onChange={(e) => setFormData({ ...formData, learnedToday: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label htmlFor="3-what-problems-did" className="form-label small fw-semibold">3. What problems did you face?</label>
                      <textarea id="3-what-problems-did"
                        className="form-control"
                        rows="2"
                        placeholder="Bugs, syntax errors, or unclear requirements..."
                        value={formData.problemsFaced}
                        onChange={(e) => setFormData({ ...formData, problemsFaced: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="4-how-did-you" className="form-label small fw-semibold">4. How did you solve them?</label>
                      <textarea id="4-how-did-you"
                        className="form-control"
                        rows="2"
                        placeholder="Documentation lookup, mentor guidance, or refactoring..."
                        value={formData.howSolved}
                        onChange={(e) => setFormData({ ...formData, howSolved: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="5-github-commits-pr" className="form-label small fw-semibold">5. GitHub Commits / PR Link</label>
                    <input id="5-github-commits-pr"
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/ethiroli/portal/pull/123"
                      value={formData.githubPr}
                      onChange={(e) => setFormData({ ...formData, githubPr: e.target.value })}
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="6-any-blockers-for" className="form-label small fw-semibold d-block">6. Any blockers for tomorrow?</label>
                    <div className="d-flex gap-3 align-items-center mb-2">
                      <div className="form-check">
                        <input id="6-any-blockers-for"
                          className="form-check-input"
                          type="radio"
                          name="blockerRadio"
                          id="blockerNo"
                          checked={formData.hasBlocker === 'NO'}
                          onChange={() => setFormData({ ...formData, hasBlocker: 'NO' })}
                        />
                        <label className="form-check-label small" htmlFor="blockerNo">No blockers</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="blockerRadio"
                          id="blockerYes"
                          checked={formData.hasBlocker === 'YES'}
                          onChange={() => setFormData({ ...formData, hasBlocker: 'YES' })}
                        />
                        <label className="form-check-label small text-danger fw-semibold" htmlFor="blockerYes">Yes, have blockers</label>
                      </div>
                    </div>
                    {formData.hasBlocker === 'YES' && (
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Describe the blocker so mentor can assist..."
                        value={formData.blockerDetails}
                        onChange={(e) => setFormData({ ...formData, blockerDetails: e.target.value })}
                      ></textarea>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-50 py-2"
                      onClick={handleSaveDraft}
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary w-50 py-2 fw-semibold"
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-send-check me-1"></i>
                      {isSubmitting ? 'Submitting...' : 'Submit Work Log'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Work Log History Table with Mentor Ratings */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">Work Log History & Mentor Reviews</h5>
                <span className="badge bg-light text-muted border">{logs.length} Submissions</span>
              </div>
              {/* Was capped at 720px with an inner scrollbar, so entries below the fold
                  were hidden behind a nested scroll region on a page that
                  already scrolls. Let the card grow instead. */}
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3">
                  {logs.map((item) => (
                    <div key={item.id} className="card border p-3 rounded-3 shadow-none bg-light-subtle">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong className="text-dark me-2">{item.date}</strong>
                          <span className="badge bg-light text-secondary border small">
                            <i className="bi bi-clock me-1"></i>{item.hours} hrs
                          </span>
                        </div>
                        <span
                          className={`badge small ${
                            item.status === 'APPROVED'
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : item.status === 'REVISION_REQUESTED'
                              ? 'bg-warning-subtle text-warning border border-warning-subtle'
                              : 'bg-primary-subtle text-primary border border-primary-subtle'
                          }`}
                        >
                          {item.status === 'APPROVED' ? 'Approved' : item.status === 'REVISION_REQUESTED' ? 'Revision Requested' : 'Submitted'}
                        </span>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block fw-semibold">Worked On:</small>
                        <p className="mb-1 text-dark small">{item.workedOn}</p>
                      </div>

                      {item.learnedToday && (
                        <div className="mb-2">
                          <small className="text-muted d-block fw-semibold">Learned:</small>
                          <p className="mb-1 text-dark small">{item.learnedToday}</p>
                        </div>
                      )}

                      {item.githubPr && (
                        <div className="mb-2 small">
                          <i className="bi bi-github me-1"></i>
                          <a href={item.githubPr} target="_blank" rel="noreferrer" className="text-decoration-none">
                            {item.githubPr}
                          </a>
                        </div>
                      )}

                      {/* Mentor Review Rating & Notes */}
                      <div className="border-top pt-2 mt-2 bg-white p-2 rounded-2 border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small fw-semibold text-primary">
                            <i className="bi bi-chat-quote me-1"></i>Mentor Review:
                          </span>
                          {item.mentorRating && (
                            <span className="text-warning small">
                              {'★'.repeat(item.mentorRating)}{'☆'.repeat(5 - item.mentorRating)} ({item.mentorRating}/5)
                            </span>
                          )}
                        </div>
                        <p className="small text-muted mb-1 fst-italic">"{item.mentorComments}"</p>
                        <small className="text-muted d-block text-end">— {item.reviewedBy}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
