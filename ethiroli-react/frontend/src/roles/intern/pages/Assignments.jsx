import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Assignments() {
  const [assignments, setAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Module 1: Responsive Dashboard UI Implementation',
      course: 'Full-Stack Web Engineering',
      dueDate: '2026-09-12',
      priority: 'HIGH',
      status: 'SUBMITTED',
      submissionLink: 'https://github.com/ethiroli/intern-dashboard-ui',
      score: '95/100',
      feedback: 'Excellent use of Bootstrap flexbox and responsive offcanvas drawer.'
    },
    {
      id: 'asg-2',
      title: 'Module 2: RESTful API Integration & RBAC Guard Implementation',
      course: 'Backend Architecture & Security',
      dueDate: '2026-09-15',
      priority: 'HIGH',
      status: 'PENDING',
      submissionLink: '',
      score: 'Pending Review',
      feedback: 'Awaiting submission'
    },
    {
      id: 'asg-3',
      title: 'Module 3: PostgreSQL Database Schema Migration & Indexing',
      course: 'Relational Database Systems',
      dueDate: '2026-09-20',
      priority: 'MEDIUM',
      status: 'PENDING',
      submissionLink: '',
      score: 'Pending Review',
      feedback: 'Awaiting submission'
    },
    {
      id: 'asg-4',
      title: 'Module 4: Real-time Notification Engine via Socket.IO',
      course: 'Event-Driven Systems',
      dueDate: '2026-09-28',
      priority: 'CRITICAL',
      status: 'PENDING',
      submissionLink: '',
      score: 'Pending Review',
      feedback: 'Awaiting submission'
    }
  ]);

  const [selectedAsg, setSelectedAsg] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ repoUrl: '', liveUrl: '', notes: '' });
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const handleOpenSubmit = (asg) => {
    setSelectedAsg(asg);
    setSubmissionForm({ repoUrl: asg.submissionLink || '', liveUrl: '', notes: '' });
    setShowModal(true);
  };

  const handleSaveSubmission = (e) => {
    e.preventDefault();
    if (!submissionForm.repoUrl) {
      setAlert({ type: 'danger', text: 'Please provide your GitHub repository or solution URL.' });
      return;
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAsg.id
          ? {
              ...a,
              status: 'SUBMITTED',
              submissionLink: submissionForm.repoUrl,
              feedback: 'Under review by mentor'
            }
          : a
      )
    );

    setShowModal(false);
    setSelectedAsg(null);
    setAlert({ type: 'success', text: `Solution for "${selectedAsg.title}" submitted successfully!` });
  };

  return (
    <AdminPage
      title="Internship Deliverables & Assignments"
      subtitle="View curriculum assignments, submit repository links, and receive graded mentor feedback"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'info-circle'} me-2`}></i>
            {alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Assignments Grid */}
        <div className="row g-4">
          {assignments.map((asg) => (
            <div key={asg.id} className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-secondary border small">{asg.course}</span>
                    <span className={`badge px-2 py-1 ${
                      asg.status === 'SUBMITTED' ? 'bg-success' : 'bg-warning text-dark'
                    }`}>
                      {asg.status}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2 text-dark">{asg.title}</h5>

                  <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                    <span><i className="bi bi-calendar-event me-1"></i>Due: {asg.dueDate}</span>
                    <span>
                      <i className="bi bi-flag-fill me-1 text-danger"></i>
                      Priority: {asg.priority}
                    </span>
                  </div>

                  {asg.submissionLink && (
                    <div className="p-2 mb-3 bg-light rounded-2 border">
                      <small className="text-muted d-block fw-semibold">Submitted Link:</small>
                      <a href={asg.submissionLink} target="_blank" rel="noreferrer" className="small text-truncate d-block">
                        <i className="bi bi-github me-1"></i>{asg.submissionLink}
                      </a>
                    </div>
                  )}

                  <div className="mt-auto border-top pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <small className="text-muted d-block">Score / Grade:</small>
                        <span className="fw-bold text-primary">{asg.score}</span>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">Feedback:</small>
                        <span className="small text-dark fst-italic">{asg.feedback}</span>
                      </div>
                    </div>

                    <button
                      className={`btn w-100 ${asg.status === 'SUBMITTED' ? 'btn-outline-primary' : 'btn-primary'}`}
                      onClick={() => handleOpenSubmit(asg)}
                    >
                      <i className={`bi bi-${asg.status === 'SUBMITTED' ? 'arrow-repeat' : 'upload'} me-2`}></i>
                      {asg.status === 'SUBMITTED' ? 'Update Submission' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submission Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Submit Assignment</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveSubmission}>
                  <div className="modal-body">
                    <p className="fw-semibold text-primary mb-3">{selectedAsg?.title}</p>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        GitHub / Project Repository URL <span className="text-danger">*</span>
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://github.com/username/project"
                        value={submissionForm.repoUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, repoUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Live Demo Link (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://your-demo-app.com"
                        value={submissionForm.liveUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, liveUrl: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Notes / Implementation Remarks</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Highlight any additional features or dependencies..."
                        value={submissionForm.notes}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Confirm & Submit
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
