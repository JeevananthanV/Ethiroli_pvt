import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function TrainingPlan() {
  const [milestones, setMilestones] = useState([
    {
      id: 'phase1',
      title: 'Phase 1: Induction & Engineering Foundations',
      duration: 'Weeks 1–3',
      status: 'COMPLETED',
      progress: 100,
      topics: [
        { id: 't1', name: 'Environment Setup, Git Workflow & Branching Strategy', done: true },
        { id: 't2', name: 'Frontend Architecture: React 19, Vite & Bootstrap 5 Structure', done: true },
        { id: 't3', name: 'RESTful API principles & Axios client configuration', done: true },
        { id: 't4', name: 'Code Quality, ESLint configs, and Clean Code standards', done: true }
      ]
    },
    {
      id: 'phase2',
      title: 'Phase 2: Core Frontend Feature Engineering & UI Systems',
      duration: 'Weeks 4–6',
      status: 'IN_PROGRESS',
      progress: 65,
      topics: [
        { id: 't5', name: 'Building Responsive Bootstrap 5 Portals with Offcanvas Navigation', done: true },
        { id: 't6', name: 'State Management with Redux Toolkit & Context API', done: true },
        { id: 't7', name: 'Role-Based Access Control (RBAC) & Private Route Guards', done: true },
        { id: 't8', name: 'Connecting Real-Time Socket.IO Channels for Live Updates', done: false }
      ]
    },
    {
      id: 'phase3',
      title: 'Phase 3: Full-Stack Integration, Microservices & Data Integrity',
      duration: 'Weeks 7–9',
      status: 'UPCOMING',
      progress: 0,
      topics: [
        { id: 't9', name: 'PostgreSQL Relational Schemas & Foreign Key Constraints', done: false },
        { id: 't10', name: 'JWT Refresh Rotation, Session Invalidation & Redis Caching', done: false },
        { id: 't11', name: 'File Storage Pipelines via Cloud Object Storage', done: false },
        { id: 't12', name: 'Form Validation, Error Boundaries & Resilient Network Retries', done: false }
      ]
    },
    {
      id: 'phase4',
      title: 'Phase 4: Capstone Project Deployment & Final Certification',
      duration: 'Weeks 10–12',
      status: 'UPCOMING',
      progress: 0,
      topics: [
        { id: 't13', name: 'Building End-to-End Production Capstone Module', done: false },
        { id: 't14', name: 'Automated Unit & E2E Testing with Vitest and Playwright', done: false },
        { id: 't15', name: 'Containerization with Docker & Nginx Reverse Proxy Setup', done: false },
        { id: 't16', name: 'Final 360 Mentor Evaluation & Certificate Verification Issuance', done: false }
      ]
    }
  ]);

  const toggleTopic = (phaseId, topicId) => {
    setMilestones((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const updatedTopics = phase.topics.map((t) => (t.id === topicId ? { ...t, done: !t.done } : t));
        const doneCount = updatedTopics.filter((t) => t.done).length;
        const newProgress = Math.round((doneCount / updatedTopics.length) * 100);
        const newStatus = newProgress === 100 ? 'COMPLETED' : newProgress > 0 ? 'IN_PROGRESS' : 'UPCOMING';
        return { ...phase, topics: updatedTopics, progress: newProgress, status: newStatus };
      })
    );
  };

  const totalTopics = milestones.reduce((sum, p) => sum + p.topics.length, 0);
  const completedTopics = milestones.reduce((sum, p) => sum + p.topics.filter((t) => t.done).length, 0);
  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <AdminPage
      title="Personalized Training Plan"
      subtitle="Track your curriculum progress, learning milestones, and core competency roadmap"
    >
      <div className="container-fluid px-0">
        {/* Overall Curriculum Progress Bar */}
        <div className="card shadow-sm border-0 mb-4 bg-primary text-white p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-white text-primary mb-2 fw-bold">12-Week Internship Curriculum</span>
              <h3 className="fw-bold mb-1">Full-Stack Web Engineering Roadmap</h3>
              <p className="mb-0 text-white-50 small">
                {completedTopics} of {totalTopics} syllabus competencies mastered ({overallProgress}% complete)
              </p>
            </div>
            <div className="text-md-end">
              <h2 className="display-6 fw-bold mb-0">{overallProgress}%</h2>
              <small className="text-white-50">On Track for Distinction</small>
            </div>
          </div>
          <div className="progress mt-3 bg-white bg-opacity-25" style={{ height: '10px' }}>
            <div
              className="progress-bar bg-white"
              role="progressbar"
              style={{ width: `${overallProgress}%` }}
              aria-valuenow={overallProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Milestone Phases */}
        <div className="row g-4">
          {milestones.map((phase, idx) => (
            <div key={phase.id} className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                  <div>
                    <span className="badge bg-secondary-subtle text-dark me-2">Step {idx + 1}</span>
                    <span className="fw-bold fs-6 text-dark">{phase.title}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small fw-medium">{phase.duration}</span>
                    <span className={`badge px-2 py-1 ${
                      phase.status === 'COMPLETED' ? 'bg-success' :
                      phase.status === 'IN_PROGRESS' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                </div>

                <div className="card-body p-4 pt-0">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="progress flex-grow-1" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar ${phase.status === 'COMPLETED' ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                    <span className="small fw-semibold text-muted">{phase.progress}%</span>
                  </div>

                  <div className="list-group list-group-flush">
                    {phase.topics.map((t) => (
                      <div
                        key={t.id}
                        className="list-group-item px-0 py-2 d-flex align-items-center justify-content-between border-0"
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={t.id}
                            checked={t.done}
                            onChange={() => toggleTopic(phase.id, t.id)}
                          />
                          <label
                            className={`form-check-label ms-2 ${t.done ? 'text-decoration-line-through text-muted' : 'fw-medium text-dark'}`}
                            htmlFor={t.id}
                          >
                            {t.name}
                          </label>
                        </div>
                        {t.done ? (
                          <span className="text-success small fw-semibold">
                            <i className="bi bi-check2-circle me-1"></i>Mastered
                          </span>
                        ) : (
                          <span className="badge bg-light text-muted border small">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
