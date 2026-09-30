import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

const SKILLS_DATA = [
  { name: 'HTML5 & Accessibility', rating: 90, level: 'Advanced' },
  { name: 'CSS3 & Responsive Grid', rating: 85, level: 'Advanced' },
  { name: 'Core JavaScript (ES6+)', rating: 75, level: 'Proficient' },
  { name: 'React.js & State Management', rating: 65, level: 'Intermediate' },
  { name: 'Node.js & Express REST APIs', rating: 50, level: 'In Training' },
  { name: 'SQL & Database Design', rating: 70, level: 'Proficient' },
];

const JOB_OPENINGS = [
  {
    id: 'JOB-01',
    role: 'Junior Full Stack Developer',
    company: 'Ethiroli Digital Solutions Pvt Ltd',
    location: 'Chennai / Hybrid',
    salary: '₹4.5 - 6.0 LPA',
    type: 'Full-Time',
    status: 'HIRING_NOW',
    deadline: '2026-10-15',
    requirements: 'React.js, Node.js, MongoDB/PostgreSQL, Git, Problem Solving.',
  },
  {
    id: 'JOB-02',
    role: 'Frontend React.js Engineer Intern',
    company: 'Fintech Neo Technologies',
    location: 'Bangalore / Remote',
    salary: '₹25,000 / month Stipend',
    type: 'Internship (6 Mos)',
    status: 'APPLIED',
    deadline: '2026-10-10',
    requirements: 'Strong HTML/CSS, React Hooks, Redux Toolkit, Responsive design.',
  },
  {
    id: 'JOB-03',
    role: 'Software Engineer Trainee',
    company: 'Cognitive Cloud Labs',
    location: 'Coimbatore / Onsite',
    salary: '₹4.0 - 5.5 LPA',
    type: 'Full-Time',
    status: 'HIRING_NOW',
    deadline: '2026-10-20',
    requirements: 'JavaScript, Python or Java fundamentals, REST APIs, CS foundations.',
  },
];

const INTERVIEW_PREP_TOPICS = [
  {
    topic: 'React Virtual DOM & Reconciliation',
    question: 'How does React diffing algorithm work with keys in lists?',
    tip: 'Mention O(n) heuristic, stable keys, and why index as keys can cause re-rendering bugs.',
  },
  {
    topic: 'JavaScript Event Loop & Microtasks',
    question: 'What is the execution priority between setTimeout, Promise.then, and process.nextTick?',
    tip: 'Microtasks (Promises, queueMicrotask) execute before Macrotasks (setTimeout, setInterval).',
  },
  {
    topic: 'Database Indexing & ACID Properties',
    question: 'How does a B-Tree index speed up SELECT queries, and what is its write penalty?',
    tip: 'B-Trees reduce I/O lookups to O(log n), but insert/update operations incur tree rebalancing costs.',
  },
];

export default function Career() {
  const [jobs, setJobs] = useState(JOB_OPENINGS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const applyJob = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'APPLIED' } : j))
    );
    setSelectedJob(null);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  return (
    <AdminPage
      title="Career Readiness & Placement Portal"
      subtitle="Track your technical skill matrix, apply for Ethiroli corporate partner job openings, and practice technical interview questions."
    >
      {appliedNotice && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-5" />
          <div>
            <strong>Application Submitted!</strong> Your candidate profile and LMS transcript have been forwarded to the hiring team.
          </div>
        </div>
      )}

      {/* Profile & Skills Matrix Section */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-graph-up-arrow text-primary me-2" /> Technical Skills Matrix
              </h5>
              <span className="badge bg-primary-subtle text-primary">Based on Quizzes & Sandbox Labs</span>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {SKILLS_DATA.map((skill) => (
                  <div key={skill.name} className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-dark small">{skill.name}</span>
                      <span className="small text-muted">
                        <strong className="text-primary">{skill.rating}%</strong> ({skill.level})
                      </span>
                    </div>
                    <div className="progressTrack" style={{ height: 8 }}>
                      <div
                        className="progressFill"
                        style={{
                          width: `${skill.rating}%`,
                          backgroundColor:
                            skill.rating >= 80
                              ? 'var(--color-success, #198754)'
                              : skill.rating >= 60
                              ? 'var(--color-primary, #0d6efd)'
                              : 'var(--color-warning, #ffc107)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold text-dark">
                <i className="bi bi-person-badge text-success me-2" /> Placement Dossier
              </h5>
            </div>
            <div className="card-body p-3">
              <div className="p-3 bg-light rounded mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-dark small">Verified Resume (PDF)</strong>
                  <span className="badge bg-success">Uploaded</span>
                </div>
                <small className="text-muted d-block mb-2">Jeeva_Karthik_FullStack_2026.pdf</small>
                <button className="btn btn-sm btn-outline-primary me-2">
                  <i className="bi bi-eye me-1" /> View
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-upload me-1" /> Re-upload
                </button>
              </div>

              <div className="p-3 bg-light rounded mb-3">
                <strong className="text-dark small d-block mb-1">Portfolio & Project Links</strong>
                <div className="small text-muted mb-1">
                  <i className="bi bi-github me-1" /> github.com/jeeva-dev
                </div>
                <div className="small text-muted mb-1">
                  <i className="bi bi-globe me-1" /> jeevakarthik.dev
                </div>
                <div className="small text-muted">
                  <i className="bi bi-linkedin me-1" /> linkedin.com/in/jeevakarthik
                </div>
              </div>

              <div className="p-2 border rounded text-center">
                <small className="text-muted d-block mb-1">Placement Eligibility Status</small>
                <span className="badge bg-success-subtle text-success fs-6 py-2 px-3">
                  <i className="bi bi-patch-check-fill me-1" /> Verified for Interviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Opportunities */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">
            <i className="bi bi-briefcase-fill text-primary me-2" /> Curated Partner Job & Internship Openings
          </h5>
        </div>
        <div className="card-body p-3">
          <div className="row g-3">
            {jobs.map((job) => (
              <div key={job.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-secondary-subtle text-secondary">{job.type}</span>
                    {job.status === 'APPLIED' ? (
                      <span className="badge bg-success text-white">Applied</span>
                    ) : (
                      <span className="badge bg-primary text-white">Hiring Now</span>
                    )}
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{job.role}</h6>
                  <div className="small text-primary fw-semibold mb-1">{job.company}</div>
                  <div className="small text-muted mb-2">
                    <i className="bi bi-geo-alt me-1" /> {job.location} · <strong>{job.salary}</strong>
                  </div>
                  <p className="small text-muted mb-3 flex-grow-1">
                    <strong>Req:</strong> {job.requirements}
                  </p>
                  <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                    <small className="text-muted">Deadline: {job.deadline}</small>
                    {job.status === 'APPLIED' ? (
                      <button className="btn btn-sm btn-outline-success disabled" disabled>
                        <i className="bi bi-check2 me-1" /> Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="btn btn-sm btn-primary"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Interview Prep */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">
            <i className="bi bi-question-diamond-fill text-warning me-2" /> Technical Interview Practice Cards
          </h5>
        </div>
        <div className="card-body p-3">
          <div className="row g-3">
            {INTERVIEW_PREP_TOPICS.map((item, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="card h-100 border p-3 bg-light">
                  <span className="badge bg-primary-subtle text-primary align-self-start mb-2">
                    {item.topic}
                  </span>
                  <h6 className="small fw-bold text-dark mb-2">{item.question}</h6>
                  <div className="small text-muted mt-auto pt-2 border-top">
                    <strong>💡 Model Answer Key:</strong> {item.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <Modal
          title={`Confirm Application: ${selectedJob.role}`}
          onClose={() => setSelectedJob(null)}
        >
          <div className="p-3">
            <h6 className="fw-bold text-dark">{selectedJob.company}</h6>
            <p className="text-muted small mb-2">
              <i className="bi bi-geo-alt me-1" /> {selectedJob.location} · <strong>{selectedJob.salary}</strong>
            </p>
            <div className="p-3 bg-light rounded mb-3">
              <small className="text-muted d-block mb-1">Candidate Profile to Submit:</small>
              <ul className="small text-muted ps-3 mb-0">
                <li>Jeeva Karthik · Full Stack Web Developer (68% Course Progress)</li>
                <li>Quiz Average: 82% · Attendance: 94%</li>
                <li>Resume: Jeeva_Karthik_FullStack_2026.pdf</li>
              </ul>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedJob(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => applyJob(selectedJob.id)}>
                <i className="bi bi-send-fill me-1" /> Confirm & Submit Application
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
