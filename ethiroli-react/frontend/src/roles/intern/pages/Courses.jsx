import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Courses() {
  const [courses] = useState([
    {
      id: 'c1',
      title: 'Modern Full-Stack Web Development with React & Node',
      domain: 'Engineering',
      modulesCount: 8,
      completedModules: 6,
      progress: 75,
      description: 'Master React 19, Vite, Express, and PostgreSQL with real-world enterprise architectures.',
      instructor: 'Karthik Raja'
    },
    {
      id: 'c2',
      title: 'Enterprise RBAC, JWT Authentication & Security Hardening',
      domain: 'Security & DevOps',
      modulesCount: 5,
      completedModules: 4,
      progress: 80,
      description: 'Granular permissions, HTTP-only cookies, token rotation, and vulnerability mitigation.',
      instructor: 'Senior Security Architect'
    },
    {
      id: 'c3',
      title: 'Real-Time Event Architecture with WebSockets & Redis',
      domain: 'System Design',
      modulesCount: 6,
      completedModules: 2,
      progress: 33,
      description: 'Build low-latency messaging, notifications, and presence engines using Socket.IO and Redis pub/sub.',
      instructor: 'Systems Lead'
    },
    {
      id: 'c4',
      title: 'Performance Optimization & Mobile-First UI Systems',
      domain: 'UI / UX',
      modulesCount: 4,
      completedModules: 4,
      progress: 100,
      description: 'Lighthouse audits, responsive Bootstrap offcanvas navigation, and asset lazy loading.',
      instructor: 'Design Systems Lead'
    }
  ]);

  return (
    <AdminPage
      title="Learning Management System (LMS)"
      subtitle="Access accredited training courses, video lectures, and technical curriculums"
    >
      <div className="container-fluid px-0">
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary-subtle text-primary border">{course.domain}</span>
                    <span className={`badge ${course.progress === 100 ? 'bg-success' : 'bg-secondary'}`}>
                      {course.progress === 100 ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2 text-dark">{course.title}</h5>
                  <p className="text-muted small mb-3">{course.description}</p>

                  <div className="mt-auto border-top pt-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>{course.completedModules} of {course.modulesCount} Modules Completed</span>
                      <span className="fw-bold text-primary">{course.progress}%</span>
                    </div>
                    <div className="progress mb-3" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar ${course.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Instructor: {course.instructor}</small>
                      <button className="btn btn-primary btn-sm px-3">
                        <i className="bi bi-play-circle me-1"></i> Continue Course
                      </button>
                    </div>
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
