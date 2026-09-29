import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'GRADED'
  const [selectedAsg, setSelectedAsg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({ repoUrl: '', liveUrl: '', notes: '', zipName: '' });
  const [alert, setAlert] = useState({ type: '', text: '' });

  const [assignments, setAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Assignment 1: Git Monorepo & Responsive Navigation Offcanvas Drawer',
      course: 'Full Stack Web Development',
      dueDate: 'Sep 05, 2026',
      maxMarks: 100,
      passMarks: 60,
      status: 'GRADED',
      score: '95/100',
      mentorComments: 'Excellent use of Bootstrap flexbox and responsive offcanvas drawer. Clean code formatting.',
      repoUrl: 'https://github.com/ethiroli/assignment-nav-drawer',
      liveUrl: 'https://preview-asg1.ethiroli.net',
      objectives: 'Build a mobile-first offcanvas sidebar drawer with responsive breakpoints and ARIA accessibility.',
      checklist: [
        'Responsive on mobile, tablet, and desktop',
        'ARIA expanded/controls attributes',
        'Vite build passes with 0 warnings'
      ]
    },
    {
      id: 'asg-2',
      title: 'Assignment 2: Advanced JavaScript Async/Await & REST API Integration',
      course: 'Core Programming',
      dueDate: 'Sep 10, 2026',
      maxMarks: 100,
      passMarks: 60,
      status: 'GRADED',
      score: '92/100',
      mentorComments: 'Great async error handling with try/catch. Improve accessibility with ARIA labels on dynamic tables.',
      repoUrl: 'https://github.com/ethiroli/assignment-async-fetch',
      liveUrl: 'https://preview-asg2.ethiroli.net',
      objectives: 'Implement HTTP client with retry logic, error interceptors, and data caching.',
      checklist: [
        'Axios client with base URL configuration',
        'Token injection in Authorization headers',
        'Error toast display on 4xx and 5xx'
      ]
    },
    {
      id: 'asg-3',
      title: 'Assignment 3: PostgreSQL Relational Schema & Foreign Key Constraints',
      course: 'Relational Database Systems',
      dueDate: 'Tomorrow, 11:59 PM',
      maxMarks: 100,
      passMarks: 60,
      status: 'UNDER_REVIEW',
      score: 'Pending Review',
      mentorComments: 'Under review by mentor Arun Kumar',
      repoUrl: 'https://github.com/ethiroli/assignment-db-schema',
      liveUrl: '',
      objectives: 'Design normalized 3NF relational schemas for courses, users, and progress tracking.',
      checklist: [
        'Foreign key cascade constraints',
        'Indexes on high-frequency lookup fields',
        'SQL seeder scripts with mock data'
      ]
    },
    {
      id: 'asg-4',
      title: 'Assignment 4: Build a Responsive E-Commerce Product Catalog Page',
      course: 'Full Stack Web Development',
      dueDate: 'Friday, 11:59 PM',
      maxMarks: 100,
      passMarks: 60,
      status: 'PENDING',
      score: 'Not Submitted',
      mentorComments: '',
      repoUrl: '',
      liveUrl: '',
      objectives: 'Construct an interactive product catalog with search filters, category pills, sorting, and cart modal.',
      checklist: [
        'Instant search bar with debounce',
        'Multi-category filtering and price range slider',
        'Shopping cart state managed via Redux Toolkit'
      ]
    },
    {
      id: 'asg-5',
      title: 'Assignment 5: Real-Time Event Notification Gateway via Socket.IO',
      course: 'Event-Driven Systems',
      dueDate: 'Next Monday, 6:00 PM',
      maxMarks: 100,
      passMarks: 60,
      status: 'PENDING',
      score: 'Not Submitted',
      mentorComments: '',
      repoUrl: '',
      liveUrl: '',
      objectives: 'Set up bi-directional Socket.IO channels for instant mentor feedback and task updates.',
      checklist: [
        'Socket connection authentication via JWT handshake',
        'Room-based broadcast for intern cohort',
        'Graceful reconnection handling on disconnect'
      ]
    }
  ]);

  const handleOpenSubmit = (asg) => {
    setSelectedAsg(asg);
    setSubmissionForm({
      repoUrl: asg.repoUrl || '',
      liveUrl: asg.liveUrl || '',
      notes: '',
      zipName: ''
    });
    setShowModal(true);
  };

  const handleSaveSubmission = (e) => {
    e.preventDefault();
    if (!submissionForm.repoUrl) {
      setAlert({ type: 'danger', text: 'Please provide a valid GitHub repository URL.' });
      return;
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAsg.id
          ? {
              ...a,
              status: 'SUBMITTED',
              repoUrl: submissionForm.repoUrl,
              liveUrl: submissionForm.liveUrl,
              mentorComments: 'Awaiting mentor evaluation'
            }
          : a
      )
    );

    setShowModal(false);
    setAlert({ type: 'success', text: `Assignment "${selectedAsg.title}" submitted successfully!` });
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'PENDING') return a.status === 'PENDING';
    if (activeTab === 'SUBMITTED') return a.status === 'SUBMITTED';
    if (activeTab === 'UNDER_REVIEW') return a.status === 'UNDER_REVIEW';
    if (activeTab === 'GRADED') return a.status === 'GRADED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'GRADED':
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Graded</span>;
      case 'UNDER_REVIEW':
        return <span className="badge bg-info-subtle text-info border border-info-subtle">Under Review</span>;
      case 'SUBMITTED':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Submitted</span>;
      default:
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span>;
    }
  };

  return (
    <AdminPage
      title="Assignments & Practical Exercises"
      subtitle="Coursework deliverables, requirements checklists, code submission links, and mentor evaluations"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="d-flex gap-2 flex-wrap mb-2">
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Assignments ({assignments.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'PENDING' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('PENDING')}
          >
            Pending ({assignments.filter((a) => a.status === 'PENDING').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'SUBMITTED' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('SUBMITTED')}
          >
            Submitted ({assignments.filter((a) => a.status === 'SUBMITTED').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'UNDER_REVIEW' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('UNDER_REVIEW')}
          >
            Under Review ({assignments.filter((a) => a.status === 'UNDER_REVIEW').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'GRADED' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('GRADED')}
          >
            Graded ({assignments.filter((a) => a.status === 'GRADED').length})
          </button>
        </div>

        {/* Assignments Grid */}
        <div className="row g-4">
          {filteredAssignments.map((asg) => (
            <div key={asg.id} className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-secondary border small">{asg.course}</span>
                    {getStatusBadge(asg.status)}
                  </div>

                  <h5 className="fw-bold mb-2 text-dark">{asg.title}</h5>
                  <p className="text-muted small mb-3">{asg.objectives}</p>

                  <div className="d-flex align-items-center justify-content-between text-muted small mb-3">
                    <span><i className="bi bi-calendar-event me-1"></i><strong>Due:</strong> {asg.dueDate}</span>
                    <span><strong>Max Marks:</strong> {asg.maxMarks} (Pass: {asg.passMarks})</span>
                  </div>

                  {/* Requirements Checklist Preview */}
                  <div className="p-3 bg-light rounded-3 border mb-3">
                    <strong className="d-block small text-dark mb-1">Key Requirements:</strong>
                    <ul className="mb-0 ps-3 small text-muted">
                      {asg.checklist.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {asg.repoUrl && (
                    <div className="p-2 mb-3 bg-light rounded-2 border small d-flex align-items-center justify-content-between">
                      <div className="text-truncate me-2">
                        <i className="bi bi-github me-1"></i>
                        <a href={asg.repoUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                          {asg.repoUrl}
                        </a>
                      </div>
                      {asg.liveUrl && (
                        <a href={asg.liveUrl} target="_blank" rel="noreferrer" className="badge bg-primary text-white text-decoration-none">
                          Live Demo
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mt-auto border-top pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <small className="text-muted d-block">Score / Grade:</small>
                        <span className="fw-bold text-primary fs-6">{asg.score}</span>
                      </div>
                      {asg.mentorComments && (
                        <div className="text-end" style={{ maxWidth: '60%' }}>
                          <small className="text-muted d-block">Mentor Feedback:</small>
                          <span className="small text-dark fst-italic text-truncate d-block">
                            "{asg.mentorComments}"
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      className={`btn w-100 ${
                        asg.status === 'GRADED'
                          ? 'btn-outline-secondary'
                          : asg.status === 'PENDING'
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => handleOpenSubmit(asg)}
                    >
                      <i className={`bi bi-${asg.status === 'PENDING' ? 'upload' : 'pencil-square'} me-2`}></i>
                      {asg.status === 'PENDING' ? 'Submit Assignment' : 'Update Submission / View Details'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assignment Submission Modal */}
        {showModal && selectedAsg && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <div>
                    <span className="badge bg-light text-primary border me-2 small">{selectedAsg.course}</span>
                    <h5 className="modal-title fw-bold mt-1 text-dark">{selectedAsg.title}</h5>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveSubmission}>
                  <div className="modal-body">
                    <p className="text-muted small mb-3">{selectedAsg.objectives}</p>

                    <div className="mb-3">
                      <h6 className="fw-bold small text-dark mb-1">Checklist to Complete</h6>
                      <ul className="list-group list-group-flush border rounded-3 p-2 bg-light small">
                        {selectedAsg.checklist.map((item, idx) => (
                          <li key={idx} className="list-group-item bg-transparent border-0 px-2 py-1">
                            <i className="bi bi-check2-circle text-primary me-2"></i>{item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        GitHub / Git Solution Repository URL <span className="text-danger">*</span>
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
                      <label className="form-label small fw-semibold">Live Deployment / Staging URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://your-demo-app.vercel.app"
                        value={submissionForm.liveUrl}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, liveUrl: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Upload ZIP Archive (Optional)</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".zip,.tar.gz"
                        onChange={(e) => setSubmissionForm({ ...submissionForm, zipName: e.target.files[0]?.name || '' })}
                      />
                      {submissionForm.zipName && (
                        <small className="text-success mt-1 d-block">
                          <i className="bi bi-file-earmark-zip me-1"></i>Attached: {submissionForm.zipName}
                        </small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Comments / Notes for Mentor</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Highlight any special implementations, challenges solved, or testing instructions..."
                        value={submissionForm.notes}
                        onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light btn-sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Confirm & Submit Solution
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
