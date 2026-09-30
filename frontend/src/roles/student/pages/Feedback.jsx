import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';

const PAST_FEEDBACK = [
  {
    id: 'FDB-01',
    course: 'Full Stack + AI Web Developer Masterclass',
    module: 'Phase 1: Web Fundamentals & JavaScript ES6+',
    date: '2026-09-15',
    ratings: {
      content: 5,
      tutor: 5,
      assignments: 4,
      liveClasses: 5,
    },
    comments: 'Excellent explanation of closures and promises by the instructor. Very practical coding exercises.',
    status: 'Reviewed by Academics',
  },
];

export default function Feedback() {
  const [courseContentRating, setCourseContentRating] = useState(5);
  const [tutorSupportRating, setTutorSupportRating] = useState(5);
  const [assignmentsRating, setAssignmentsRating] = useState(4);
  const [liveClassesRating, setLiveClassesRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pastList, setPastList] = useState(PAST_FEEDBACK);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please provide a short feedback comment or suggestion.');
      return;
    }
    const newEntry = {
      id: `FDB-0${pastList.length + 1}`,
      course: 'Full Stack + AI Web Developer Masterclass',
      module: 'Phase 2: React.js & Frontend Architecture',
      date: new Date().toISOString().split('T')[0],
      ratings: {
        content: courseContentRating,
        tutor: tutorSupportRating,
        assignments: assignmentsRating,
        liveClasses: liveClassesRating,
      },
      comments: comments.trim(),
      status: 'Submitted',
    };
    setPastList([newEntry, ...pastList]);
    setSubmitted(true);
    setComments('');
  };

  const renderStars = (rating, setRating = null) => {
    return (
      <div className="d-flex gap-1 align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
            style={{ fontSize: setRating ? 24 : 16, cursor: setRating ? 'pointer' : 'default' }}
            onClick={() => setRating && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminPage
      title="Student Training Feedback & Evaluation"
      subtitle="Help us continuously enhance your learning experience. Your feedback directly shapes curriculum and tutor mentoring."
    >
      <div className="row g-4">
        {/* Feedback Submission Form */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-star-half text-warning me-2" /> Rate Your Current Module Experience
              </h5>
              <small className="text-muted">
                Course: Full Stack + AI Web Developer · Module 4: React Architecture
              </small>
            </div>

            <div className="card-body p-4">
              {submitted && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-check-circle-fill fs-5" />
                  <div>
                    <strong>Thank you!</strong> Your feedback has been received and routed to the Academic Review Committee.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="d-block text-dark">Course Curriculum & Learning Materials</strong>
                    <small className="text-muted">Clarity of lessons, slides, and code examples</small>
                  </div>
                  {renderStars(courseContentRating, setCourseContentRating)}
                </div>

                <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="d-block text-dark">Faculty & Tutor Support</strong>
                    <small className="text-muted">Doubt resolution, mentorship, and code reviews</small>
                  </div>
                  {renderStars(tutorSupportRating, setTutorSupportRating)}
                </div>

                <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="d-block text-dark">Practical Assignments & Projects</strong>
                    <small className="text-muted">Real-world relevance, sandboxes, and problem difficulty</small>
                  </div>
                  {renderStars(assignmentsRating, setAssignmentsRating)}
                </div>

                <div className="mb-4 p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="d-block text-dark">Live Interactive Classes</strong>
                    <small className="text-muted">Class engagement, audio/video clarity, and pace</small>
                  </div>
                  {renderStars(liveClassesRating, setLiveClassesRating)}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-dark">
                    Detailed Comments & Suggestions for Improvement
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Tell us what you loved, what could be improved, or any topics you'd like more practice on..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
                  <i className="bi bi-send-fill me-2" /> Submit Academic Feedback
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Previous Feedback History */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-clock-history text-primary me-2" /> Past Feedback History
              </h5>
            </div>
            <div className="card-body p-3">
              {pastList.map((fb) => (
                <div key={fb.id} className="card border mb-3 p-3 bg-light">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary">{fb.module}</span>
                    <span className="badge bg-success-subtle text-success">{fb.status}</span>
                  </div>
                  <div className="small text-muted mb-2">{fb.date}</div>
                  <p className="small text-dark mb-3 fst-italic">"{fb.comments}"</p>
                  <div className="d-flex justify-content-between small border-top pt-2 text-muted">
                    <span>Content: {renderStars(fb.ratings.content)}</span>
                    <span>Tutor: {renderStars(fb.ratings.tutor)}</span>
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
