import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Courses() {
  const [courses, setCourses] = useState([
    {
      id: 'c1',
      title: 'Full Stack Development - Complete Course',
      domain: 'Full Stack Track',
      modulesCount: 8,
      completedModules: 5,
      progress: 65,
      instructor: 'Arun Kumar & Karthik Raja',
      description: 'Master full-stack web engineering from frontend to database and cloud deployment.',
      modules: [
        { id: 'm1', title: 'Module 1: Git, Linux & Architecture Foundations', completed: true, duration: '4h 15m' },
        { id: 'm2', title: 'Module 2: HTML5, CSS3, Flexbox & Responsive Layouts', completed: true, duration: '6h 30m' },
        { id: 'm3', title: 'Module 3: Advanced JavaScript (ES6+) & Async/Await', completed: true, duration: '8h 00m' },
        { id: 'm4', title: 'Module 4: React 19 Core & Hooks Mastery', completed: true, duration: '10h 30m' },
        { id: 'm5', title: 'Module 5: Global State Management with Redux Toolkit', completed: true, duration: '7h 45m' },
        { id: 'm6', title: 'Module 6: Node.js, Express & RESTful APIs', completed: false, duration: '8h 20m' },
        { id: 'm7', title: 'Module 7: Relational Database Design with MySQL', completed: false, duration: '6h 50m' },
        { id: 'm8', title: 'Module 8: Full Stack Deployment & CI/CD', completed: false, duration: '5h 10m' }
      ]
    },
    {
      id: 'c2',
      title: 'JavaScript Deep Dive & Engineering Patterns',
      domain: 'Core Programming',
      modulesCount: 6,
      completedModules: 6,
      progress: 100,
      instructor: 'Senior Frontend Architect',
      description: 'Execution context, closures, event loop, prototypical inheritance, and clean code principles.',
      modules: [
        { id: 'm21', title: 'Execution Context & Call Stack', completed: true, duration: '3h' },
        { id: 'm22', title: 'Closures & Scope Chain', completed: true, duration: '3h 30m' },
        { id: 'm23', title: 'Prototypes & Object-Oriented JS', completed: true, duration: '4h' },
        { id: 'm24', title: 'Event Loop, Microtasks & Macrotasks', completed: true, duration: '4h 30m' },
        { id: 'm25', title: 'Promises, Async/Await & Error Handling', completed: true, duration: '5h' },
        { id: 'm26', title: 'Functional Programming & Currying', completed: true, duration: '3h 30m' }
      ]
    },
    {
      id: 'c3',
      title: 'React.js from Scratch to Production',
      domain: 'Frontend Engineering',
      modulesCount: 5,
      completedModules: 4,
      progress: 80,
      instructor: 'Arun Kumar',
      description: 'Modern React patterns, Custom Hooks, Redux Toolkit, Context API, and Vite tooling.',
      modules: [
        { id: 'm31', title: 'JSX & Component Lifecycle', completed: true, duration: '4h' },
        { id: 'm32', title: 'useState, useEffect & Performance Hooks', completed: true, duration: '5h' },
        { id: 'm33', title: 'Custom Hooks & Reusable Logic', completed: true, duration: '4h 30m' },
        { id: 'm34', title: 'State Management with Redux Toolkit', completed: true, duration: '6h' },
        { id: 'm35', title: 'Routing with React Router v7 & Lazy Loading', completed: false, duration: '4h' }
      ]
    },
    {
      id: 'c4',
      title: 'Node.js & Express API Development',
      domain: 'Backend Engineering',
      modulesCount: 6,
      completedModules: 0,
      progress: 0,
      instructor: 'Backend Lead',
      description: 'Building secure, scalable RESTful APIs with Node.js, Express, JWT, and MySQL.',
      modules: [
        { id: 'm41', title: 'Node.js Core & Event-Driven Architecture', completed: false, duration: '4h' },
        { id: 'm42', title: 'Building Express.js Web Servers & Routers', completed: false, duration: '5h' },
        { id: 'm43', title: 'Middleware Architecture & Error Handling', completed: false, duration: '4h' },
        { id: 'm44', title: 'Authentication with JWT & Refresh Tokens', completed: false, duration: '5h 30m' },
        { id: 'm45', title: 'Database Integration with MySQL & Connection Pooling', completed: false, duration: '6h' },
        { id: 'm46', title: 'Testing REST APIs with Supertest & Vitest', completed: false, duration: '4h' }
      ]
    }
  ]);

  const [activeCourse, setActiveCourse] = useState(courses[0]);
  const [activeModule, setActiveModule] = useState(courses[0].modules[3]);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'resources' | 'quiz' | 'doubts'
  const [quizScore, setQuizScore] = useState(null);

  const handleSelectCourse = (course) => {
    setActiveCourse(course);
    setActiveModule(course.modules[0]);
    setQuizScore(null);
  };

  const handleToggleModuleComplete = (moduleId) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== activeCourse.id) return c;
        const updatedModules = c.modules.map((m) =>
          m.id === moduleId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedModules.filter((m) => m.completed).length;
        const newProgress = Math.round((completedCount / updatedModules.length) * 100);
        return {
          ...c,
          modules: updatedModules,
          completedModules: completedCount,
          progress: newProgress
        };
      })
    );

    setActiveCourse((prev) => {
      const updatedModules = prev.modules.map((m) =>
        m.id === moduleId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedModules.filter((m) => m.completed).length;
      return {
        ...prev,
        modules: updatedModules,
        completedModules: completedCount,
        progress: Math.round((completedCount / updatedModules.length) * 100)
      };
    });

    setActiveModule((prev) => (prev.id === moduleId ? { ...prev, completed: !prev.completed } : prev));
  };

  return (
    <AdminPage
      title="LMS Courses & Video Lectures"
      subtitle="Accredited video curriculum, hands-on coding lessons, interactive quizzes, and downloadable resources"
    >
      <div className="container-fluid px-0">
        {/* Course Selection Cards */}
        <div className="row g-3 mb-4">
          {courses.map((c) => (
            <div key={c.id} className="col-12 col-sm-6 col-lg-3">
              <div
                className={`card shadow-sm h-100 cursor-pointer ${
                  activeCourse.id === c.id ? 'border-primary border-2' : 'border-0'
                }`}
                onClick={() => handleSelectCourse(c)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              >
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-light text-primary border small">{c.domain}</span>
                    <span
                      className={`badge small ${
                        c.progress === 100
                          ? 'bg-success'
                          : c.progress > 0
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    >
                      {c.progress === 100 ? 'Completed' : c.progress > 0 ? `${c.progress}%` : 'Not Started'}
                    </span>
                  </div>
                  <h6 className="fw-bold mb-1 text-dark text-truncate" title={c.title}>
                    {c.title}
                  </h6>
                  <small className="text-muted mb-2">
                    {c.completedModules}/{c.modulesCount} Modules
                  </small>
                  <div className="progress mt-auto" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar ${c.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detail & Lesson Player Interface */}
        <div className="row g-4">
          {/* Left Sidebar: Module List */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white py-3 border-0">
                <h6 className="fw-bold mb-0 text-dark">Course Curriculum Modules</h6>
                <small className="text-muted">{activeCourse.title}</small>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {activeCourse.modules.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`list-group-item list-group-item-action p-3 text-start border-bottom d-flex align-items-center justify-content-between ${
                        activeModule.id === m.id ? 'bg-primary-subtle border-primary text-primary fw-bold' : ''
                      }`}
                      onClick={() => setActiveModule(m)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <i
                          className={`bi ${
                            m.completed
                              ? 'bi-check-circle-fill text-success'
                              : 'bi-play-circle text-muted'
                          } fs-5`}
                        ></i>
                        <div>
                          <span className="d-block small text-dark">{m.title}</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            <i className="bi bi-clock me-1"></i>{m.duration}
                          </span>
                        </div>
                      </div>
                      <i className="bi bi-chevron-right text-muted small"></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Area: Video Player / Lesson Viewer */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 h-100">
              {/* Fake Video Player Screen */}
              <div
                className="bg-dark text-white p-5 text-center d-flex flex-column align-items-center justify-content-center position-relative rounded-top"
                style={{ minHeight: '320px' }}
              >
                <div
                  className="bg-primary bg-opacity-75 text-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow"
                  style={{ width: '64px', height: '64px', cursor: 'pointer' }}
                  onClick={() => alert('Starting video lecture playback...')}
                >
                  <i className="bi bi-play-fill fs-1 ms-1"></i>
                </div>
                <h5 className="fw-bold mb-1">{activeModule.title}</h5>
                <p className="text-white-50 small mb-0">
                  Instructor: {activeCourse.instructor} • Duration: {activeModule.duration}
                </p>
                <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient bg-dark d-flex justify-content-between align-items-center">
                  <span className="badge bg-danger">LIVE RECORDING</span>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${
                        activeModule.completed ? 'btn-success' : 'btn-outline-light'
                      }`}
                      onClick={() => handleToggleModuleComplete(activeModule.id)}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      {activeModule.completed ? 'Completed' : 'Mark as Completed'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Tabs: Lesson Notes | Resources | Quiz | Doubts */}
              <div className="card-header bg-white border-0 pt-3 pb-0">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'lesson' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('lesson')}
                    >
                      <i className="bi bi-file-text me-1"></i> Lesson Notes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'resources' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('resources')}
                    >
                      <i className="bi bi-folder-symlink me-1"></i> Resources & Code
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'quiz' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('quiz')}
                    >
                      <i className="bi bi-patch-question me-1"></i> Module Quiz
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'doubts' ? 'active fw-bold' : 'text-muted'}`}
                      onClick={() => setActiveTab('doubts')}
                    >
                      <i className="bi bi-chat-left-dots me-1"></i> Lesson Doubts
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {activeTab === 'lesson' && (
                  <div>
                    <h6 className="fw-bold mb-2">Lesson Overview & Key Takeaways</h6>
                    <p className="text-muted small mb-3">
                      In this lesson, we cover architectural principles, state normalization, lifecycle management, and practical code patterns used across Ethiroli's web platforms.
                    </p>
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <h6 className="fw-bold text-dark small mb-1">Code Example: Custom Hook Pattern</h6>
                      <pre className="mb-0 bg-white p-2 rounded border small text-dark">
                        <code>{`// useFetchData.js
import { useState, useEffect } from 'react';

export function useFetchData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(endpoint)
      .then(res => res.json())
      .then(d => { if (isMounted) { setData(d); setLoading(false); } });
    return () => { isMounted = false; };
  }, [endpoint]);

  return { data, loading };
}`}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 border">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-code text-primary fs-5"></i>
                        <div>
                          <strong className="d-block small">starter-template.zip</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>GitHub starter repository assets • 1.2 MB</span>
                        </div>
                      </div>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => alert('Downloading starter-template.zip')}>
                        <i className="bi bi-download"></i> Download
                      </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 border">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-pdf text-danger fs-5"></i>
                        <div>
                          <strong className="d-block small">module-lecture-slides.pdf</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Official lecture presentation slides • 4.8 MB</span>
                        </div>
                      </div>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => alert('Downloading module-lecture-slides.pdf')}>
                        <i className="bi bi-download"></i> Download
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    <h6 className="fw-bold mb-2">Module Knowledge Check</h6>
                    <p className="text-muted small mb-3">
                      Answer the questions below to validate your understanding. You need 80% to pass this module.
                    </p>
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <p className="fw-semibold text-dark small mb-2">
                        1. What is the main purpose of the cleanup function returned inside a React useEffect hook?
                      </p>
                      <div className="d-flex flex-column gap-2">
                        <label className="d-flex align-items-center gap-2 small">
                          <input type="radio" name="q1" value="a" /> To reset the component's state to initial values
                        </label>
                        <label className="d-flex align-items-center gap-2 small">
                          <input type="radio" name="q1" value="b" defaultChecked /> To cancel subscriptions, timers, or abort fetch requests before unmount
                        </label>
                        <label className="d-flex align-items-center gap-2 small">
                          <input type="radio" name="q1" value="c" /> To trigger an immediate re-render
                        </label>
                      </div>
                    </div>
                    {quizScore && (
                      <div className="alert alert-success small py-2 mb-3">
                        <i className="bi bi-check-circle-fill me-1"></i> {quizScore}
                      </div>
                    )}
                    <button
                      className="btn btn-primary btn-sm px-4"
                      onClick={() => setQuizScore('Quiz Passed! Score: 100% (5/5 correct). Marked as complete.')}
                    >
                      Submit Quiz Answers
                    </button>
                  </div>
                )}

                {activeTab === 'doubts' && (
                  <div>
                    <h6 className="fw-bold mb-2">Lesson Discussion & Doubts</h6>
                    <p className="text-muted small mb-3">
                      Have a question regarding this specific module? Post here for peer and mentor replies.
                    </p>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ask a question about this lesson..."
                      />
                      <button className="btn btn-primary" onClick={() => alert('Doubt submitted to lesson thread!')}>
                        Post Doubt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
