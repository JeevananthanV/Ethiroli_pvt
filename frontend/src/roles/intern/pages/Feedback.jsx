import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Feedback() {
  const [feedbackForm, setFeedbackForm] = useState({
    mentorRating: 5,
    curriculumRating: 5,
    toolsRating: 5,
    positiveNotes: '',
    improvements: '',
    sentiment: 'EXCELLENT'
  });

  const [alert, setAlert] = useState({ type: '', text: '' });
  const [pastFeedback, setPastFeedback] = useState([
    {
      id: 'fb-1',
      date: '2026-09-01',
      period: 'Month 1 Review',
      mentorRating: 5,
      curriculumRating: 4,
      toolsRating: 5,
      positiveNotes: 'Mentor explained React 19 architecture clearly and offered prompt PR reviews.',
      improvements: 'More hands-on examples for Socket.IO edge cases would be appreciated.',
      status: 'ACKNOWLEDGED'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      period: 'Bi-Weekly Review',
      mentorRating: feedbackForm.mentorRating,
      curriculumRating: feedbackForm.curriculumRating,
      toolsRating: feedbackForm.toolsRating,
      positiveNotes: feedbackForm.positiveNotes || 'All aspects are progressing well.',
      improvements: feedbackForm.improvements || 'None at this time.',
      status: 'SUBMITTED'
    };

    setPastFeedback([newEntry, ...pastFeedback]);
    setAlert({ type: 'success', text: 'Thank you! Your feedback has been submitted to the internship directorate.' });
    setFeedbackForm({
      mentorRating: 5,
      curriculumRating: 5,
      toolsRating: 5,
      positiveNotes: '',
      improvements: '',
      sentiment: 'EXCELLENT'
    });
  };

  return (
    <AdminPage
      title="360° Feedback & Evaluation"
      subtitle="Provide constructive feedback regarding your mentorship, curriculum quality, and learning environment"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className="bi bi-check-circle me-2"></i>
            {alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-star-half me-2"></i>Submit Weekly Feedback
                </h5>
              </div>
              <div className="card-body p-4 pt-0">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold d-block">
                      Mentor Guidance & Accessibility Rating (1–5 Stars)
                    </label>
                    <select
                      className="form-select"
                      value={feedbackForm.mentorRating}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, mentorRating: Number(e.target.value) })}
                    >
                      <option value="5">★★★★★ — Exceptional (Always supportive and responsive)</option>
                      <option value="4">★★★★☆ — Great (Helpful and approachable)</option>
                      <option value="3">★★★☆☆ — Satisfactory (Adequate guidance provided)</option>
                      <option value="2">★★☆☆☆ — Needs Improvement</option>
                      <option value="1">★☆☆☆☆ — Poor</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold d-block">
                      Curriculum & Training Plan Relevance (1–5 Stars)
                    </label>
                    <select
                      className="form-select"
                      value={feedbackForm.curriculumRating}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, curriculumRating: Number(e.target.value) })}
                    >
                      <option value="5">★★★★★ — Very High Industry Relevance</option>
                      <option value="4">★★★★☆ — High Relevance</option>
                      <option value="3">★★★☆☆ — Moderate Relevance</option>
                      <option value="2">★★☆☆☆ — Outdated / Low Relevance</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      What went well this week? (Highlights & Achievements)
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Share what you enjoyed or learned..."
                      value={feedbackForm.positiveNotes}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, positiveNotes: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Suggestions for Improvement / Blockers
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Any concerns, pace issues, or tools you need assistance with..."
                      value={feedbackForm.improvements}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, improvements: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                    <i className="bi bi-send-fill me-2"></i>Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Feedback History */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Feedback History</h5>
                <span className="badge bg-light text-muted border">{pastFeedback.length} Submissions</span>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3">
                  {pastFeedback.map((fb) => (
                    <div key={fb.id} className="card border p-3 rounded-3 shadow-none bg-light-subtle">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{fb.period}</span>
                        <span className="badge bg-success-subtle text-success">{fb.status}</span>
                      </div>
                      <div className="text-warning small mb-2">
                        {'★'.repeat(fb.mentorRating)}{'☆'.repeat(5 - fb.mentorRating)}
                        <span className="text-muted ms-2">({fb.date})</span>
                      </div>
                      <p className="small mb-1 text-dark">
                        <strong>Highlights:</strong> {fb.positiveNotes}
                      </p>
                      {fb.improvements && (
                        <p className="small mb-0 text-muted">
                          <strong>Suggestions:</strong> {fb.improvements}
                        </p>
                      )}
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
