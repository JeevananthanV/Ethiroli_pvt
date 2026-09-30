import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function TrainingPlan() {
  const [milestones, setMilestones] = useState([
    {
      id: 'm1',
      dayRange: 'Day 1–5',
      title: 'Web Engineering Foundations & Version Control',
      status: 'COMPLETED',
      progress: 100,
      score: 'Quiz: 94% • Assignment: 90%',
      mentorTip: 'Great grasp of git interactive rebase and semantic HTML structure.',
      topics: [
        { id: 't1', name: 'Git & GitHub workflows (Branching, PRs, Merge Conflicts)', done: true },
        { id: 't2', name: 'Linux Terminal essentials & Node/NPM package management', done: true },
        { id: 't3', name: 'HTML5 Semantic Elements, Web Accessibility & SEO best practices', done: true },
        { id: 't4', name: 'Modern CSS3, Flexbox, CSS Grid & Mobile-First Responsive layouts', done: true }
      ]
    },
    {
      id: 'm2',
      dayRange: 'Day 6–10',
      title: 'Advanced Modern JavaScript (ES6+) & Async Programming',
      status: 'COMPLETED',
      progress: 100,
      score: 'Quiz: 92% • Assignment: 88%',
      mentorTip: 'Solid understanding of Promises, event loop, and array methods.',
      topics: [
        { id: 't5', name: 'ES6+ Features: Destructuring, Spread/Rest, Modules, Closures', done: true },
        { id: 't6', name: 'DOM Manipulation, Event Bubbling & Delegation', done: true },
        { id: 't7', name: 'Asynchronous JavaScript: Promises, async/await & Fetch API', done: true },
        { id: 't8', name: 'Error handling with try/catch and HTTP status code interpretation', done: true }
      ]
    },
    {
      id: 'm3',
      dayRange: 'Day 11–18',
      title: 'React.js Component Architecture & State Management (In Progress)',
      status: 'IN_PROGRESS',
      progress: 75,
      score: 'Quiz: 90% • Assignment: Under Review',
      mentorTip: 'Focus on useEffect cleanup functions and Redux Toolkit slices.',
      topics: [
        { id: 't9', name: 'React 19 fundamentals: JSX, Props, Component composition', done: true },
        { id: 't10', name: 'Hooks in depth: useState, useEffect, useMemo, useCallback, useRef', done: true },
        { id: 't11', name: 'Global State: Redux Toolkit, createSlice, async thunks', done: true },
        { id: 't12', name: 'React Router v7: Nested routes, loader guards, protected routes', done: false }
      ]
    },
    {
      id: 'm4',
      dayRange: 'Day 19–25',
      title: 'Backend Engineering with Node.js, Express & REST APIs',
      status: 'UPCOMING',
      progress: 0,
      score: 'Assessment Pending',
      mentorTip: 'Prepare by reviewing HTTP verbs, middleware chaining, and JWT concepts.',
      topics: [
        { id: 't13', name: 'Node.js runtime, Event Loop, Buffer, File System (fs)', done: false },
        { id: 't14', name: 'Express.js application server, Router, Error middlewares', done: false },
        { id: 't15', name: 'JWT Authentication, Refresh token rotation, bcrypt password hashing', done: false },
        { id: 't16', name: 'RESTful API Design guidelines, input validation (Joi/Zod)', done: false }
      ]
    },
    {
      id: 'm5',
      dayRange: 'Day 26–32',
      title: 'Relational Database Architecture & MySQL Integration',
      status: 'UPCOMING',
      progress: 0,
      score: 'Assessment Pending',
      mentorTip: 'Practice writing complex JOIN queries and indexing foreign keys.',
      topics: [
        { id: 't17', name: 'Relational Database Design, Normalization (1NF, 2NF, 3NF)', done: false },
        { id: 't18', name: 'MySQL CRUD operations, Joins, Aggregations, Transactions', done: false },
        { id: 't19', name: 'Database Migrations, Seeders & Connection Pooling in Node', done: false },
        { id: 't20', name: 'Query Optimization, Indexing, and SQL Injection prevention', done: false }
      ]
    },
    {
      id: 'm6',
      dayRange: 'Day 33–40',
      title: 'Full Stack Capstone Development & Microservices',
      status: 'UPCOMING',
      progress: 0,
      score: 'Assessment Pending',
      mentorTip: 'You will build the core Ethiroli Web Portal v2 features with your team.',
      topics: [
        { id: 't21', name: 'Full-Stack Integration: Frontend + Backend + Database', done: false },
        { id: 't22', name: 'Payment gateway integration & webhook handling', done: false },
        { id: 't23', name: 'Automated testing: Unit tests (Vitest) & Integration tests (Supertest)', done: false },
        { id: 't24', name: 'Containerization with Docker and CI/CD pipelines', done: false }
      ]
    },
    {
      id: 'm7',
      dayRange: 'Day 41–45',
      title: 'Final Project Review, Presentation & Certification',
      status: 'UPCOMING',
      progress: 0,
      score: 'Assessment Pending',
      mentorTip: 'Prepare your 15-minute capstone demo and portfolio presentation.',
      topics: [
        { id: 't25', name: 'Code audit, Lighthouse performance optimization & security review', done: false },
        { id: 't26', name: 'Live production deployment to Hostinger Cloud infrastructure', done: false },
        { id: 't27', name: 'Final 360° Mentor & Directorate Project Presentation', done: false },
        { id: 't28', name: 'Cryptographic Certificate verification and exit clearance', done: false }
      ]
    }
  ]);

  const toggleTopic = (milestoneId, topicId) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        const updatedTopics = m.topics.map((t) => (t.id === topicId ? { ...t, done: !t.done } : t));
        const doneCount = updatedTopics.filter((t) => t.done).length;
        const newProgress = Math.round((doneCount / updatedTopics.length) * 100);
        const newStatus = newProgress === 100 ? 'COMPLETED' : newProgress > 0 ? 'IN_PROGRESS' : 'UPCOMING';
        return { ...m, topics: updatedTopics, progress: newProgress, status: newStatus };
      })
    );
  };

  const totalTopics = milestones.reduce((sum, m) => sum + m.topics.length, 0);
  const completedTopics = milestones.reduce((sum, m) => sum + m.topics.filter((t) => t.done).length, 0);
  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <AdminPage
      title="My Training Plan & Curriculum Roadmap"
      subtitle="45-Day Full-Stack Web Development curriculum roadmap, daily milestones, and mentor feedback"
    >
      <div className="container-fluid px-0">
        {/* Header Info Card */}
        <div className="card shadow-sm border-0 mb-2 bg-primary text-white p-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="badge bg-white text-primary fw-bold">Track: Full Stack Web Development (MERN)</span>
                <span className="badge bg-white bg-opacity-25 text-white">May 15, 2026 – June 30, 2026</span>
              </div>
              <h3 className="fw-bold mb-1">45-Day Engineering Competency Roadmap</h3>
              <p className="mb-0 text-white-50 small">
                Day 18 of 45 • {completedTopics} of {totalTopics} topics mastered ({overallProgress}% complete)
              </p>
            </div>
            <div className="text-md-end">
              <h2 className="display-6 fw-bold mb-0">{overallProgress}%</h2>
              <small className="text-white-50">On Track for Distinction Certificate</small>
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

        {/* Roadmap Timeline Cards */}
        <div className="row g-4">
          {milestones.map((m, idx) => (
            <div key={m.id} className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 border-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                      {m.dayRange}
                    </span>
                    <span className="fw-bold fs-6 text-dark">{m.title}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small fw-medium">{m.score}</span>
                    <span
                      className={`badge px-2 py-1 ${
                        m.status === 'COMPLETED' ? 'bg-success' :
                        m.status === 'IN_PROGRESS' ? 'bg-primary' : 'bg-secondary'
                      }`}
                    >
                      {m.status === 'IN_PROGRESS' ? 'IN PROGRESS (DAY 18)' : m.status}
                    </span>
                  </div>
                </div>

                <div className="card-body p-3 pt-0">
                  {/* Progress Bar */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="progress flex-grow-1" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar ${m.status === 'COMPLETED' ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${m.progress}%` }}
                      ></div>
                    </div>
                    <span className="small fw-semibold text-muted">{m.progress}%</span>
                  </div>

                  {/* Mentor Tip Box */}
                  <div className="p-3 bg-light rounded-3 border mb-3 small d-flex align-items-start gap-2">
                    <i className="bi bi-lightbulb-fill text-warning fs-6 mt-1"></i>
                    <div>
                      <strong className="text-dark">Mentor Tip: </strong>
                      <span className="text-muted">{m.mentorTip}</span>
                    </div>
                  </div>

                  {/* Topics Checklist */}
                  <div className="list-group list-group-flush mb-3">
                    {m.topics.map((t) => (
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
                            onChange={() => toggleTopic(m.id, t.id)}
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
                            <i className="bi bi-check-circle-fill me-1"></i>Mastered
                          </span>
                        ) : (
                          <span className="badge bg-light text-muted border small">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-2 border-top pt-3">
                    <Link to="/app/intern/courses" className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-journal-text me-1"></i> View Course Notes
                    </Link>
                    <Link to="/app/intern/courses" className="btn btn-primary btn-sm">
                      <i className="bi bi-play-circle me-1"></i> Continue Learning
                    </Link>
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
