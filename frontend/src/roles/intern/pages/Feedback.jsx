import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Feedback() {
  const [activeTab, setActiveTab] = useState('evaluation'); // 'evaluation' | 'intern-feedback'
  const [alert, setAlert] = useState({ type: '', text: '' });

  // Evaluation Scorecard from Mentor
  const evaluation = {
    period: 'Week 2 Comprehensive Evaluation (Sep 14, 2026)',
    overallScore: 8.1,
    scores: [
      { category: 'Technical Skills', score: 8.0, max: 10, percent: 80, color: 'primary' },
      { category: 'Communication & Collaboration', score: 7.0, max: 10, percent: 70, color: 'info' },
      { category: 'Task Completion & Sprint Velocity', score: 9.0, max: 10, percent: 90, color: 'success' },
      { category: 'Punctuality & Engineering Discipline', score: 8.5, max: 10, percent: 85, color: 'warning' }
    ],
    mentorNotes: 'Good understanding of React hooks and state management. Need to improve code documentation and Git commit message conventions.',
    strengths: ['Quick learner', 'Proactive problem solver', 'Positive team collaboration', 'High attendance consistency'],
    areasToImprove: ['Unit testing coverage', 'CSS cross-browser precision', 'Realistic task time estimation']
  };

  // Intern Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({
    weekRating: 5,
    mentorRating: 5,
    trainingRating: 5,
    workload: 'JUST_RIGHT', // 'TOO_LIGHT' | 'JUST_RIGHT' | 'TOO_HEAVY'
    concerns: ''
  });

  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([
    {
      id: 'fb-1',
      date: '2026-09-12',
      period: 'Week 2 Review',
      weekRating: 5,
      mentorRating: 5,
      trainingRating: 5,
      workload: 'Just Right',
      concerns: 'Training pace is great. Looking forward to database integration.',
      status: 'ACKNOWLEDGED'
    }
  ]);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      period: 'Week 3 Review',
      weekRating: feedbackForm.weekRating,
      mentorRating: feedbackForm.mentorRating,
      trainingRating: feedbackForm.trainingRating,
      workload: feedbackForm.workload === 'JUST_RIGHT' ? 'Just Right' : feedbackForm.workload === 'TOO_LIGHT' ? 'Too Light' : 'Too Heavy',
      concerns: feedbackForm.concerns || 'Everything is running smoothly.',
      status: 'SUBMITTED'
    };

    setSubmittedFeedbacks([newEntry, ...submittedFeedbacks]);
    setAlert({ type: 'success', text: 'Thank you! Your weekly feedback has been submitted to the internship directorate.' });
    setFeedbackForm({
      weekRating: 5,
      mentorRating: 5,
      trainingRating: 5,
      workload: 'JUST_RIGHT',
      concerns: ''
    });
  };

  return (
    <AdminPage
      title="360° Feedback & Performance Evaluations"
      subtitle="Two-way feedback system: mentor performance scorecards and intern weekly feedback"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-2`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="card shadow-sm border-0 mb-2">
          <div className="card-header bg-white border-0 pt-3 pb-0">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'evaluation' ? 'active fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab('evaluation')}
                >
                  <i className="bi bi-award me-1"></i> Mentor's Evaluation of You
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'intern-feedback' ? 'active fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab('intern-feedback')}
                >
                  <i className="bi bi-chat-heart me-1"></i> Your Feedback on Internship
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-3">
            {/* Tab 1: Mentor's Evaluation */}
            {activeTab === 'evaluation' && (
              <div>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-2 p-3 bg-light rounded-3 border">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">{evaluation.period}</h5>
                    <p className="text-muted small mb-0">Evaluated by Mentor Arun Kumar</p>
                  </div>
                  <div className="text-md-end">
                    <span className="display-6 fw-bold text-primary">{evaluation.overallScore}</span>
                    <span className="text-muted fs-5"> / 10</span>
                    <span className="badge bg-success-subtle text-success ms-2 d-block">Overall: Distinction</span>
                  </div>
                </div>

                {/* Scorecard Bars */}
                <h6 className="fw-bold text-dark mb-3">Weekly Performance Scorecard</h6>
                <div className="row g-3 mb-2">
                  {evaluation.scores.map((sc) => (
                    <div key={sc.category} className="col-md-6">
                      <div className="p-3 bg-white border rounded-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark small">{sc.category}</strong>
                          <span className="fw-bold text-primary small">{sc.score} / {sc.max}</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar bg-${sc.color}`}
                            style={{ width: `${sc.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mentor Notes */}
                <div className="p-3 bg-light rounded-3 border mb-2">
                  <h6 className="fw-bold text-primary small mb-1">
                    <i className="bi bi-chat-quote-fill me-1"></i>Mentor Notes:
                  </h6>
                  <p className="text-dark small mb-0 fst-italic">"{evaluation.mentorNotes}"</p>
                </div>

                {/* Strengths & Areas to Improve */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 h-100">
                      <h6 className="fw-bold text-success small mb-2">
                        <i className="bi bi-check-circle-fill me-1"></i>Strengths
                      </h6>
                      <ul className="mb-0 ps-3 small text-dark">
                        {evaluation.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-danger-subtle border border-danger-subtle rounded-3 h-100">
                      <h6 className="fw-bold text-danger small mb-2">
                        <i className="bi bi-exclamation-circle-fill me-1"></i>Areas to Improve
                      </h6>
                      <ul className="mb-0 ps-3 small text-dark">
                        {evaluation.areasToImprove.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Intern's Feedback */}
            {activeTab === 'intern-feedback' && (
              <div className="row g-4">
                <div className="col-lg-6">
                  <h6 className="fw-bold text-dark mb-3">Submit Weekly Feedback</h6>
                  <form onSubmit={handleSubmitFeedback}>
                    <div className="mb-3">
                      <label htmlFor="how-was-your-week" className="form-label small fw-semibold d-block">
                        How was your week overall? (1–5 Stars)
                      </label>
                      <select id="how-was-your-week"
                        className="form-select form-select-sm"
                        value={feedbackForm.weekRating}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, weekRating: Number(e.target.value) })}
                      >
                        <option value="5">★★★★★ — Productive & Rewarding</option>
                        <option value="4">★★★★☆ — Good learning experience</option>
                        <option value="3">★★★☆☆ — Average</option>
                        <option value="2">★★☆☆☆ — Struggled with tasks</option>
                        <option value="1">★☆☆☆☆ — Demotivating</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mentor-support-guidance-15" className="form-label small fw-semibold d-block">
                        Mentor Support & Guidance (1–5 Stars)
                      </label>
                      <select id="mentor-support-guidance-15"
                        className="form-select form-select-sm"
                        value={feedbackForm.mentorRating}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, mentorRating: Number(e.target.value) })}
                      >
                        <option value="5">★★★★★ — Always helpful and responsive</option>
                        <option value="4">★★★★☆ — Helpful when available</option>
                        <option value="3">★★★☆☆ — Adequate</option>
                        <option value="2">★★☆☆☆ — Hard to reach</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="training-curriculum-quality-15" className="form-label small fw-semibold d-block">
                        Training & Curriculum Quality (1–5 Stars)
                      </label>
                      <select id="training-curriculum-quality-15"
                        className="form-select form-select-sm"
                        value={feedbackForm.trainingRating}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, trainingRating: Number(e.target.value) })}
                      >
                        <option value="5">★★★★★ — High industry relevance</option>
                        <option value="4">★★★★☆ — Good material</option>
                        <option value="3">★★★☆☆ — Moderate</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="workload-assessment" className="form-label small fw-semibold d-block">Workload Assessment</label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input id="workload-assessment"
                            className="form-check-input"
                            type="radio"
                            name="workloadRadio"
                            id="wlLight"
                            checked={feedbackForm.workload === 'TOO_LIGHT'}
                            onChange={() => setFeedbackForm({ ...feedbackForm, workload: 'TOO_LIGHT' })}
                          />
                          <label className="form-check-label small" htmlFor="wlLight">Too Light</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="workloadRadio"
                            id="wlRight"
                            checked={feedbackForm.workload === 'JUST_RIGHT'}
                            onChange={() => setFeedbackForm({ ...feedbackForm, workload: 'JUST_RIGHT' })}
                          />
                          <label className="form-check-label small text-success fw-semibold" htmlFor="wlRight">Just Right</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="workloadRadio"
                            id="wlHeavy"
                            checked={feedbackForm.workload === 'TOO_HEAVY'}
                            onChange={() => setFeedbackForm({ ...feedbackForm, workload: 'TOO_HEAVY' })}
                          />
                          <label className="form-check-label small text-danger" htmlFor="wlHeavy">Too Heavy</label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="any-concerns-or-suggestions" className="form-label small fw-semibold">Any concerns or suggestions?</label>
                      <textarea id="any-concerns-or-suggestions"
                        className="form-control form-control-sm"
                        rows="3"
                        placeholder="Share any suggestions to improve your learning experience..."
                        value={feedbackForm.concerns}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, concerns: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm px-4 fw-semibold">
                      Submit Feedback
                    </button>
                  </form>
                </div>

                <div className="col-lg-6">
                  <h6 className="fw-bold text-dark mb-3">Your Feedback Submissions</h6>
                  <div className="d-flex flex-column gap-3">
                    {submittedFeedbacks.map((fb) => (
                      <div key={fb.id} className="card border p-3 rounded-3 bg-light-subtle">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark small">{fb.period}</strong>
                          <span className="badge bg-success-subtle text-success small">{fb.status}</span>
                        </div>
                        <div className="text-warning small mb-2">
                          {'★'.repeat(fb.weekRating)}{'☆'.repeat(5 - fb.weekRating)}
                          <span className="text-muted ms-2">({fb.date})</span>
                        </div>
                        <p className="text-muted small mb-1">
                          <strong>Workload:</strong> {fb.workload}
                        </p>
                        <p className="text-dark small mb-0">
                          <strong>Notes:</strong> {fb.concerns}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
