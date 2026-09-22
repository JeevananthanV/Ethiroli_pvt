import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function WorkLog() {
  const [formData, setFormData] = useState({
    logDate: new Date().toISOString().slice(0, 10),
    hoursSpent: '8.0',
    tasksCompleted: '',
    blockers: '',
    planTomorrow: '',
  });

  const [submittedLogs, setSubmittedLogs] = useState([
    {
      id: '1',
      date: '2026-09-09',
      hours: '8.5',
      tasks: 'Implemented responsive navigation offcanvas drawer; fixed ESLint warnings on hero slider.',
      blockers: 'None',
      plan: 'Integrate API endpoints for intern attendance tracking.',
      status: 'APPROVED',
      mentorFeedback: 'Great progress on the mobile drawer. Clean code formatting.',
      reviewedBy: 'Senior Mentor'
    },
    {
      id: '2',
      date: '2026-09-08',
      hours: '8.0',
      tasks: 'Configured Vite build optimizations, investigated code-splitting chunks.',
      blockers: 'Encountered duplicate import warning in react-router bundle.',
      plan: 'Refactor router elements into modular lazy chunks.',
      status: 'APPROVED',
      mentorFeedback: 'Resolved properly.',
      reviewedBy: 'Senior Mentor'
    },
    {
      id: '3',
      date: '2026-09-07',
      hours: '8.0',
      tasks: 'Created Figma to Bootstrap layout conversion for candidate apply form.',
      blockers: 'Waiting for schema alignment on resume attachment URL.',
      plan: 'Proceed with frontend validation schema.',
      status: 'NEEDS_REVISION',
      mentorFeedback: 'Please ensure validation covers maximum file size limit (5MB).',
      reviewedBy: 'Senior Mentor'
    }
  ]);

  const [alert, setAlert] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tasksCompleted.trim()) {
      setAlert({ type: 'danger', text: 'Please fill in the tasks completed for today.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now().toString(),
        date: formData.logDate,
        hours: formData.hoursSpent,
        tasks: formData.tasksCompleted,
        blockers: formData.blockers || 'None',
        plan: formData.planTomorrow || 'Continue sprint assignments.',
        status: 'PENDING',
        mentorFeedback: 'Pending mentor review',
        reviewedBy: 'Pending'
      };

      setSubmittedLogs([newEntry, ...submittedLogs]);
      setFormData({
        logDate: new Date().toISOString().slice(0, 10),
        hoursSpent: '8.0',
        tasksCompleted: '',
        blockers: '',
        planTomorrow: '',
      });
      setIsSubmitting(false);
      setAlert({ type: 'success', text: 'Your Daily Work Log has been successfully submitted for mentor review!' });
    }, 400);
  };

  return (
    <AdminPage
      title="Daily Work Log (Standup)"
      subtitle="Submit your daily activities, blockers, and progress for mentor supervision"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${alert.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2`}></i>
            {alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row g-4 mb-4">
          {/* Submission Form */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-pencil-square me-2"></i>Submit Today's Log
                </h5>
              </div>
              <div className="card-body p-4 pt-0">
                <form onSubmit={handleSubmit}>
                  <div className="row g-2 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Log Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.logDate}
                        onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-semibold">Hours Logged</label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="16"
                        className="form-control"
                        value={formData.hoursSpent}
                        onChange={(e) => setFormData({ ...formData, hoursSpent: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      What tasks did you complete today? <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Bullet points or concise overview of achievements..."
                      value={formData.tasksCompleted}
                      onChange={(e) => setFormData({ ...formData, tasksCompleted: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Any Blockers or Challenges?</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Mention any technical bugs, pending dependencies, or questions..."
                      value={formData.blockers}
                      onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Plan for Tomorrow</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="What is scheduled for your next working session?"
                      value={formData.planTomorrow}
                      onChange={(e) => setFormData({ ...formData, planTomorrow: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-send-check me-2"></i>
                    {isSubmitting ? 'Submitting...' : 'Submit Daily Log'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Work Log History */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Recent Work Log Submissions</h5>
                <span className="badge bg-light text-muted border">{submittedLogs.length} Total Logs</span>
              </div>
              <div className="card-body p-3 overflow-auto" style={{ maxHeight: '680px' }}>
                <div className="d-flex flex-column gap-3">
                  {submittedLogs.map((item) => (
                    <div key={item.id} className="card border p-3 rounded-3 shadow-none bg-light-subtle">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="fw-bold fs-6 me-2">{item.date}</span>
                          <span className="badge bg-secondary-subtle text-dark">
                            <i className="bi bi-clock me-1"></i>{item.hours} hrs
                          </span>
                        </div>
                        <span className={`badge px-2 py-1 ${
                          item.status === 'APPROVED' ? 'bg-success' :
                          item.status === 'NEEDS_REVISION' ? 'bg-warning text-dark' : 'bg-primary'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="mb-2">
                        <strong className="text-secondary small d-block">Completed Tasks:</strong>
                        <p className="mb-1 text-dark small">{item.tasks}</p>
                      </div>

                      {item.blockers && item.blockers !== 'None' && (
                        <div className="mb-2">
                          <strong className="text-danger small d-block">Blockers:</strong>
                          <p className="mb-1 text-dark small">{item.blockers}</p>
                        </div>
                      )}

                      <div className="border-top pt-2 mt-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted fst-italic">
                            <i className="bi bi-chat-left-quote me-1"></i>
                            <strong>Mentor:</strong> {item.mentorFeedback}
                          </small>
                          <small className="text-muted">{item.reviewedBy}</small>
                        </div>
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
