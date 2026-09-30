import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { getMyEnrollments } from '../../../services/api/enrollmentApi.js';
import lmsApi from '../../../services/api/lmsApi.js';

const INITIAL_LEARNING_PATH_DATA = {
  courseName: 'Full Stack + AI Web Developer Masterclass',
  overallProgress: 68,
  currentPhase: 2,
  currentModule: 'MOD-04',
  currentDay: 18,
  totalDays: 32,
  phases: [
    {
      id: 'PHASE-1',
      number: 1,
      title: 'Phase 1 — Web Fundamentals & Core Programming',
      status: 'completed',
      duration: '8 Days',
      modules: [
        {
          id: 'MOD-01',
          name: 'Semantic HTML5 & Modern Accessibility',
          days: 'Days 1-2',
          status: 'completed',
          score: '96%',
          topics: ['Document Structure', 'Forms & Validation', 'ARIA Roles', 'SEO Best Practices'],
        },
        {
          id: 'MOD-02',
          name: 'Modern CSS3, Flexbox & Responsive Grid',
          days: 'Days 3-5',
          status: 'completed',
          score: '92%',
          topics: ['Box Model & Reset', 'Flexbox Alignment', 'CSS Grid Layouts', 'Media Queries & Animation'],
        },
        {
          id: 'MOD-03',
          name: 'Core JavaScript & ES6+ Mastery',
          days: 'Days 6-8',
          status: 'completed',
          score: '88%',
          topics: ['Data Types & Closures', 'Prototypes & Classes', 'Async/Await & Promises', 'DOM Manipulation'],
        },
      ],
    },
    {
      id: 'PHASE-2',
      number: 2,
      title: 'Phase 2 — Advanced Frontend Engineering (React.js)',
      status: 'current',
      duration: '10 Days',
      modules: [
        {
          id: 'MOD-04',
          name: 'React Core Architecture & Hooks',
          days: 'Days 9-13',
          status: 'current',
          currentDay: 18,
          score: '85%',
          topics: ['JSX & Virtual DOM', 'useState & useEffect', 'Custom Hooks', 'useReducer & useContext'],
        },
        {
          id: 'MOD-05',
          name: 'State Management (Redux Toolkit & Zustand)',
          days: 'Days 14-16',
          status: 'upcoming',
          score: '—',
          topics: ['Global State', 'Async Thunks', 'Selectors & Middleware'],
        },
        {
          id: 'MOD-06',
          name: 'React Routing, Forms & Performance Optimization',
          days: 'Days 17-18',
          status: 'upcoming',
          score: '—',
          topics: ['React Router v6', 'Formik / React Hook Form', 'Code Splitting & Lazy Loading'],
        },
      ],
    },
    {
      id: 'PHASE-3',
      number: 3,
      title: 'Phase 3 — Server-Side Architecture & API Design',
      status: 'locked',
      duration: '8 Days',
      modules: [
        {
          id: 'MOD-07',
          name: 'Node.js Runtime & Express.js REST APIs',
          days: 'Days 19-22',
          status: 'locked',
          topics: ['Event Loop & Streams', 'Express Middleware', 'JWT Authentication', 'Error Handling'],
        },
        {
          id: 'MOD-08',
          name: 'Database Engineering (MongoDB & PostgreSQL)',
          days: 'Days 23-26',
          status: 'locked',
          topics: ['Schema Design', 'Mongoose ODM', 'SQL Queries & Joins', 'Indexing & Aggregations'],
        },
      ],
    },
    {
      id: 'PHASE-4',
      number: 4,
      title: 'Phase 4 — Real-World Capstone & AI Integration',
      status: 'locked',
      duration: '6 Days',
      modules: [
        {
          id: 'MOD-09',
          name: 'AI Integration & LLM APIs (Gemini & OpenAI)',
          days: 'Days 27-29',
          status: 'locked',
          topics: ['Prompt Engineering', 'Streaming Responses', 'Function Calling', 'Vector Embeddings'],
        },
        {
          id: 'MOD-10',
          name: 'Capstone Full-Stack Production Deployment & CI/CD',
          days: 'Days 30-32',
          status: 'locked',
          topics: ['Docker Containerization', 'AWS / Vercel Cloud Deploy', 'Security & Certificate Clearance'],
        },
      ],
    },
  ],
};

export default function LearningPath() {
  const [path, setPath] = useState(INITIAL_LEARNING_PATH_DATA);
  const [selectedPhase, setSelectedPhase] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLearningPath = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [enrollments, lmsOverview] = await Promise.all([
        getMyEnrollments().catch(() => []),
        lmsApi.getLMSOverview().catch(() => null),
      ]);

      if (Array.isArray(enrollments) && enrollments.length > 0) {
        const activeCourse = enrollments[0];
        const progress = Number(activeCourse.progress_percentage || activeCourse.progress || 68);
        const currentDay = Math.max(1, Math.round((progress / 100) * 32));
        const computedPhase = progress > 75 ? 3 : progress > 30 ? 2 : 1;

        setPath((prev) => ({
          ...prev,
          courseName: activeCourse.course_name || activeCourse.course?.name || prev.courseName,
          overallProgress: progress,
          currentDay: currentDay,
          currentPhase: computedPhase,
        }));
        setSelectedPhase(computedPhase);
      }
    } catch (err) {
      console.warn('Learning path data loaded with fallback defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLearningPath();
  }, [fetchLearningPath]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="statusTag success"><i className="bi bi-check-circle-fill me-1" /> Completed</span>;
      case 'current':
        return <span className="statusTag warning"><i className="bi bi-play-circle-fill me-1" /> In Progress (Day {path.currentDay})</span>;
      case 'upcoming':
        return <span className="statusTag info"><i className="bi bi-clock me-1" /> Upcoming</span>;
      case 'locked':
      default:
        return <span className="statusTag pending" style={{ opacity: 0.7 }}><i className="bi bi-lock-fill me-1" /> Locked</span>;
    }
  };

  return (
    <AdminPage
      title="Interactive Learning Path & Roadmap"
      subtitle={`Milestone-driven roadmap for ${path.courseName}. Complete prerequisites to unlock advanced phases.`}
      loading={loading}
      error={error}
      onRetry={fetchLearningPath}
    >
      {/* Progress Header Card */}
      <div className="lmsCard mb-4">
        <div className="lmsCardBody p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-2">
                <i className="bi bi-compass me-1" /> Dynamic Learning Roadmap
              </span>
              <h3 className="h4 mb-1 fw-bold text-dark">{path.courseName}</h3>
              <p className="text-muted small mb-0">
                You are currently in <strong>Phase {path.currentPhase} · Day {path.currentDay} of {path.totalDays}</strong>
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="text-muted small">Roadmap Completion</div>
                <div className="h3 fw-bold text-primary mb-0">{path.overallProgress}%</div>
              </div>
              <Link to="/app/student/course-player" className="btn primary d-inline-flex align-items-center gap-2">
                <i className="bi bi-play-circle-fill" /> Resume Day {path.currentDay}
              </Link>
            </div>
          </div>

          <div className="progressTrack mt-3" style={{ height: 10 }}>
            <div className="progressFill" style={{ width: `${path.overallProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Stepper */}
      <div className="lmsCard mb-4">
        <div className="lmsCardHead">
          <h3><i className="bi bi-diagram-3-fill me-2" /> Curriculum Phases</h3>
        </div>
        <div className="lmsCardBody">
          <div className="d-flex flex-wrap justify-content-between gap-3 p-2">
            {path.phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.number)}
                className={`btn text-start p-3 rounded-3 flex-grow-1 ${
                  selectedPhase === phase.number
                    ? 'btn-primary shadow-sm text-white'
                    : phase.status === 'completed'
                    ? 'btn-light border-success-subtle text-dark'
                    : 'btn-light border text-muted'
                }`}
                style={{ minWidth: 200 }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-dark bg-opacity-25 rounded-pill">Phase {phase.number}</span>
                  {phase.status === 'completed' && <i className="bi bi-check-circle-fill text-success" />}
                  {phase.status === 'current' && <i className="bi bi-play-circle-fill text-warning" />}
                  {phase.status === 'locked' && <i className="bi bi-lock-fill opacity-50" />}
                </div>
                <div className="fw-bold small text-truncate">{phase.title.split('—')[1] || phase.title}</div>
                <div className="small opacity-75">{phase.duration} · {phase.modules.length} Modules</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Details & Module Cards */}
      {path.phases
        .filter((p) => p.number === selectedPhase)
        .map((phase) => (
          <div key={phase.id} className="lmsCard">
            <div className="lmsCardHead d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{phase.title}</h3>
                <small className="text-muted">{phase.duration} intensive coursework</small>
              </div>
              {getStatusBadge(phase.status)}
            </div>

            <div className="lmsCardBody p-3">
              <div className="row g-3">
                {phase.modules.map((mod) => (
                  <div key={mod.id} className="col-12 col-lg-4">
                    <div
                      className={`card h-100 border ${
                        mod.status === 'current'
                          ? 'border-primary shadow-sm bg-primary-subtle bg-opacity-10'
                          : mod.status === 'completed'
                          ? 'border-success-subtle'
                          : 'border-light-subtle opacity-75'
                      }`}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-secondary-subtle text-secondary">{mod.days}</span>
                          {getStatusBadge(mod.status)}
                        </div>
                        <h5 className="card-title fw-bold text-dark h6 mb-2">{mod.name}</h5>

                        <div className="my-2">
                          <span className="text-muted small fw-semibold">Key Topics:</span>
                          <ul className="small text-muted ps-3 mb-3">
                            {mod.topics.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                          <span className="small text-muted">
                            {mod.score !== '—' ? (
                              <span>Quiz Score: <strong className="text-success">{mod.score}</strong></span>
                            ) : (
                              <span>Status: <em>{mod.status}</em></span>
                            )}
                          </span>
                          {mod.status !== 'locked' ? (
                            <Link
                              to={`/app/student/course-player?module=${mod.id}`}
                              className={`btn btn-sm ${mod.status === 'current' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            >
                              {mod.status === 'current' ? 'Learn Now' : 'Review'}
                            </Link>
                          ) : (
                            <button className="btn btn-sm btn-light disabled" disabled>
                              <i className="bi bi-lock-fill me-1" /> Locked
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </AdminPage>
  );
}
