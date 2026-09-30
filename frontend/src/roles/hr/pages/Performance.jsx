import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listPerformance, updatePerformance } from '../../../../services/api/hrApi.standardized.js';

const EMPLOYEE_TEMPLATES = ['30 Day Review', '60 Day Review', '90 Day Review', 'Annual Review'];
const INTERN_TEMPLATES = ['15 Day Review', '30 Day Review', '45 Day Review', '60 Day Review', 'Final Evaluation'];

const INITIAL_REVIEWS_MOCK = [
  {
    id: 'REV-101',
    person_name: 'Priyadharshini Kumar',
    role_type: 'EMPLOYEE',
    designation: 'Senior Full Stack Engineer',
    review_template: 'Annual Review',
    period: 'FY 2025-26',
    overall_rating: 4.8,
    status: 'COMPLETED',
    evaluation: {
      technical_skills: 5,
      task_completion: 5,
      attendance: 5,
      communication: 4,
      teamwork: 5,
      problem_solving: 5,
      project_performance: 5
    },
    mentor_feedback: 'Demonstrated outstanding ownership in architectural scalability and cloud microservices.',
    manager_feedback: 'Exemplary performance, strong peer mentoring and timely feature deliveries.',
    hr_comments: 'Promoted to Senior Full Stack Engineer. Eligible for annual performance bonus.'
  },
  {
    id: 'REV-102',
    person_name: 'Vikas Sundaram',
    role_type: 'INTERN',
    designation: 'React & Node.js Intern',
    review_template: '30 Day Review',
    period: 'Month 1 Milestone',
    overall_rating: 4.6,
    status: 'COMPLETED',
    evaluation: {
      technical_skills: 4,
      task_completion: 5,
      attendance: 5,
      communication: 4,
      teamwork: 5,
      problem_solving: 4,
      project_performance: 5
    },
    mentor_feedback: 'Quick learner, completed all Phase 2 coding assignments ahead of sprint due dates.',
    manager_feedback: 'Good discipline in daily standups and Git pull requests.',
    hr_comments: 'Onboarding Phase 2 cleared. Transitioning to Live Project sprint.'
  },
  {
    id: 'REV-103',
    person_name: 'Rithwik Sridhar',
    role_type: 'INTERN',
    designation: 'AI / Machine Learning Intern',
    review_template: 'Final Evaluation',
    period: 'Internship Completion',
    overall_rating: 4.9,
    status: 'COMPLETED',
    evaluation: {
      technical_skills: 5,
      task_completion: 5,
      attendance: 5,
      communication: 5,
      teamwork: 5,
      problem_solving: 5,
      project_performance: 5
    },
    mentor_feedback: 'Engineered high-accuracy assessment recommendation algorithms.',
    manager_feedback: 'Highly recommended for Pre-Placement Offer (PPO).',
    hr_comments: 'Internship Completion Certificate issued. Full-time offer extended.'
  },
  {
    id: 'REV-104',
    person_name: 'Arunmozhi Varman',
    role_type: 'EMPLOYEE',
    designation: 'Product Manager',
    review_template: '60 Day Review',
    period: 'Mid-Probation Check',
    overall_rating: 4.5,
    status: 'PENDING_REVIEW',
    evaluation: {
      technical_skills: 4,
      task_completion: 5,
      attendance: 5,
      communication: 5,
      teamwork: 4,
      problem_solving: 4,
      project_performance: 4
    },
    mentor_feedback: 'Good domain grasp over course analytics roadmap.',
    manager_feedback: 'Review meeting scheduled for upcoming Friday.',
    hr_comments: 'Pending leadership signoff.'
  }
];

export default function HRPerformance() {
  const {
    data: fetchedReviews,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listPerformance,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localReviews, setLocalReviews] = useState(INITIAL_REVIEWS_MOCK);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [newReview, setNewReview] = useState({
    person_name: '',
    role_type: 'EMPLOYEE',
    designation: '',
    review_template: '30 Day Review',
    period: 'Q3 2026',
    technical_skills: 5,
    task_completion: 5,
    attendance: 5,
    communication: 5,
    teamwork: 5,
    problem_solving: 5,
    project_performance: 5,
    mentor_feedback: '',
    manager_feedback: '',
    hr_comments: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const reviewList = useMemo(() => {
    if (Array.isArray(fetchedReviews) && fetchedReviews.length > 0) {
      return fetchedReviews;
    }
    return localReviews;
  }, [fetchedReviews, localReviews]);

  const filtered = useMemo(() => {
    return reviewList.filter((rev) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (rev.person_name || '').toLowerCase().includes(q) ||
        (rev.review_template || '').toLowerCase().includes(q) ||
        (rev.designation || '').toLowerCase().includes(q);

      const matchRole = roleFilter === 'ALL' || rev.role_type === roleFilter;
      return matchSearch && matchRole;
    });
  }, [reviewList, search, roleFilter]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const scores = [
      Number(newReview.technical_skills),
      Number(newReview.task_completion),
      Number(newReview.attendance),
      Number(newReview.communication),
      Number(newReview.teamwork),
      Number(newReview.problem_solving),
      Number(newReview.project_performance)
    ];
    const avgRating = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));

    const created = {
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      person_name: newReview.person_name,
      role_type: newReview.role_type,
      designation: newReview.designation,
      review_template: newReview.review_template,
      period: newReview.period,
      overall_rating: avgRating,
      status: 'COMPLETED',
      evaluation: {
        technical_skills: Number(newReview.technical_skills),
        task_completion: Number(newReview.task_completion),
        attendance: Number(newReview.attendance),
        communication: Number(newReview.communication),
        teamwork: Number(newReview.teamwork),
        problem_solving: Number(newReview.problem_solving),
        project_performance: Number(newReview.project_performance)
      },
      mentor_feedback: newReview.mentor_feedback,
      manager_feedback: newReview.manager_feedback,
      hr_comments: newReview.hr_comments
    };

    setLocalReviews([created, ...localReviews]);
    setShowCreateModal(false);
    showToast(`Performance review for ${newReview.person_name} saved!`);
  };

  const getRatingStars = (rating) => {
    return (
      <span className="text-warning fw-bold">
        <i className="bi bi-star-fill me-1" />
        {rating} / 5.0
      </span>
    );
  };

  return (
    <AdminPage
      title="Performance Reviews & Evaluations"
      subtitle="Structured 30/60/90-Day & Annual Employee Reviews alongside 15/30/45/60-Day Intern Milestone Evaluations"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-1" /> Conduct Review
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Cohort Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {['ALL', 'EMPLOYEE', 'INTERN'].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'ALL' ? 'All Performance Reviews' : `${r} Evaluations`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search review by employee/intern name, designation, or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ borderRadius: '0.5rem' }}
          />
        </div>

        {/* Reviews Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Evaluation Records ({filtered.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filtered.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-graph-up-arrow" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No evaluations found</h4>
                <p style={{ color: '#64748b' }}>Conduct a review using the templates above.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Employee / Intern</th>
                      <th>Cohort</th>
                      <th>Review Template</th>
                      <th>Period</th>
                      <th>Rating Score</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Scorecard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((rev) => (
                      <tr key={rev.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{rev.person_name}</div>
                          <small className="text-muted">{rev.designation}</small>
                        </td>
                        <td>
                          <span className={`badge ${rev.role_type === 'INTERN' ? 'bg-info text-dark' : 'bg-primary'}`}>
                            {rev.role_type}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{rev.review_template}</span>
                        </td>
                        <td>{rev.period}</td>
                        <td>{getRatingStars(rev.overall_rating)}</td>
                        <td>
                          <span className={`badge ${rev.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {rev.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedReview(rev);
                              setShowDetailModal(true);
                            }}
                          >
                            <i className="bi bi-file-earmark-bar-graph me-1" /> View Scorecard
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Scorecard Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Performance Scorecard — ${selectedReview?.person_name}`}
        >
          {selectedReview && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h4 className="mb-0 fw-bold">{selectedReview.person_name}</h4>
                  <small className="text-muted">{selectedReview.designation} • {selectedReview.review_template} ({selectedReview.period})</small>
                </div>
                <div className="fs-5">{getRatingStars(selectedReview.overall_rating)}</div>
              </div>

              {/* Matrix Evaluation Scores */}
              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <div className="small fw-bold text-muted mb-2">EVALUATION METRICS & RATINGS (1 - 5 Scale)</div>
                  <div className="row g-2">
                    {selectedReview.evaluation && Object.entries(selectedReview.evaluation).map(([k, v]) => (
                      <div className="col-md-6" key={k}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                          <span className="fw-bold text-primary">{v} / 5</span>
                        </div>
                        <div className="progress" style={{ height: '5px', marginTop: '2px' }}>
                          <div className="progress-bar bg-primary" style={{ width: `${(v / 5) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Qualitative Feedback */}
              <div className="mb-2">
                <small className="text-muted d-block fw-bold">Mentor / Supervisor Feedback</small>
                <div className="p-2 bg-light rounded border small">{selectedReview.mentor_feedback || 'Satisfactory performance across key deliverables.'}</div>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block fw-bold">Manager Feedback</small>
                <div className="p-2 bg-light rounded border small">{selectedReview.manager_feedback || 'Consistent contribution and team communication.'}</div>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block fw-bold">HR Comments & Action Decision</small>
                <div className="p-2 bg-light rounded border small">{selectedReview.hr_comments || 'Milestone cleared.'}</div>
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Conduct Review Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Conduct Performance Review"
        >
          <form onSubmit={handleCreateSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Reviewee Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Vikas Sundaram"
                  value={newReview.person_name}
                  onChange={(e) => setNewReview({ ...newReview, person_name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cohort *</label>
                <select
                  className="form-select"
                  value={newReview.role_type}
                  onChange={(e) => {
                    const r = e.target.value;
                    setNewReview({
                      ...newReview,
                      role_type: r,
                      review_template: r === 'INTERN' ? INTERN_TEMPLATES[0] : EMPLOYEE_TEMPLATES[0]
                    });
                  }}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Review Template *</label>
                <select
                  className="form-select"
                  value={newReview.review_template}
                  onChange={(e) => setNewReview({ ...newReview, review_template: e.target.value })}
                >
                  {(newReview.role_type === 'INTERN' ? INTERN_TEMPLATES : EMPLOYEE_TEMPLATES).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Software Engineer"
                  value={newReview.designation}
                  onChange={(e) => setNewReview({ ...newReview, designation: e.target.value })}
                />
              </div>
            </div>

            <div className="card mb-3 p-3 bg-light">
              <div className="fw-bold small mb-2">SCORE CRITERIA (Rate 1 to 5):</div>
              <div className="row g-2">
                {[
                  ['technical_skills', 'Technical Skills'],
                  ['task_completion', 'Task Completion'],
                  ['attendance', 'Attendance & Punctuality'],
                  ['communication', 'Communication'],
                  ['teamwork', 'Teamwork & Collaboration'],
                  ['problem_solving', 'Problem Solving'],
                  ['project_performance', 'Project Performance']
                ].map(([key, label]) => (
                  <div className="col-md-6" key={key}>
                    <label className="form-label small mb-1">{label}</label>
                    <select
                      className="form-select form-select-sm"
                      value={newReview[key]}
                      onChange={(e) => setNewReview({ ...newReview, [key]: Number(e.target.value) })}
                    >
                      <option value="5">5 - Outstanding</option>
                      <option value="4">4 - Exceeds Expectations</option>
                      <option value="3">3 - Meets Expectations</option>
                      <option value="2">2 - Needs Improvement</option>
                      <option value="1">1 - Unsatisfactory</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label small">Mentor / Manager Feedback</label>
              <textarea
                className="form-control form-control-sm"
                rows="2"
                value={newReview.manager_feedback}
                onChange={(e) => setNewReview({ ...newReview, manager_feedback: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small">HR Comments & Decision</label>
              <textarea
                className="form-control form-control-sm"
                rows="2"
                value={newReview.hr_comments}
                onChange={(e) => setNewReview({ ...newReview, hr_comments: e.target.value })}
              />
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Evaluation</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}