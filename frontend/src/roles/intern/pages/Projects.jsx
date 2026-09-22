import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 'proj-1',
      name: 'Ethiroli Web Portal v2',
      role: 'Frontend Developer (Lead Intern)',
      progress: 80,
      deadline: 'June 25, 2026',
      status: 'ACTIVE',
      techStack: ['React 19', 'Vite', 'Redux Toolkit', 'Bootstrap 5', 'REST APIs'],
      team: [
        { name: 'Arun Kumar', role: 'Project Lead & Senior Mentor', avatar: 'AK' },
        { name: 'Jeevananthan V', role: 'Frontend Engineer (You)', avatar: 'JV' },
        { name: 'Priya Sharma', role: 'Backend Engineer (Intern)', avatar: 'PS' }
      ],
      objectives: 'Revamp the central Ethiroli portal into a modern modular enterprise management platform with role-based access for Superadmins, Admins, Mentors, and Interns.',
      deliverables: [
        { title: 'UI Design & Responsive Bootstrap Layout conversion', done: true },
        { title: 'Authentication integration (JWT & Route Guards)', done: true },
        { title: 'Intern LMS & Task Management Module', done: true },
        { title: 'Payment gateway integration (Razorpay)', done: false },
        { title: 'Comprehensive Unit & E2E Testing', done: false },
        { title: 'Cloud Staging Deployment & Lighthouse audit', done: false }
      ],
      myTasks: [
        { title: 'Build Responsive Offcanvas Drawer & Top Navbar', status: 'COMPLETED' },
        { title: 'Implement Intern Dashboard Command Center', status: 'COMPLETED' },
        { title: 'Integrate Live Duration Timer in Attendance Tracker', status: 'IN_PROGRESS' },
        { title: 'Connect Razorpay Checkout Modal', status: 'TO_DO' }
      ],
      links: {
        github: 'https://github.com/ethiroli/ethiroli-web-portal',
        demo: 'https://staging.ethiroli.net',
        figma: 'https://figma.com/file/ethiroli-portal-designs'
      }
    },
    {
      id: 'proj-2',
      name: 'Ethiroli Automated Branding Engine',
      role: 'Full Stack Collaborator',
      progress: 50,
      deadline: 'July 10, 2026',
      status: 'ACTIVE',
      techStack: ['Node.js', 'Express', 'MySQL', 'Puppeteer', 'Cloudflare Workers'],
      team: [
        { name: 'Karthik Raja', role: 'Technical Director', avatar: 'KR' },
        { name: 'Jeevananthan V', role: 'Full Stack Intern', avatar: 'JV' },
        { name: 'Manoj K', role: 'DevOps Intern', avatar: 'MK' }
      ],
      objectives: 'Automated social media asset generation and brand collateral compilation using headless browser rendering engines.',
      deliverables: [
        { title: 'Puppeteer SVG to PNG batch conversion pipeline', done: true },
        { title: 'Template customization API with Node.js', done: true },
        { title: 'Cloudflare Workers edge caching', done: false },
        { title: 'Admin preview gallery dashboard', done: false }
      ],
      myTasks: [
        { title: 'Create REST endpoints for template parameters', status: 'COMPLETED' },
        { title: 'Build batch render queue worker', status: 'IN_PROGRESS' }
      ],
      links: {
        github: 'https://github.com/ethiroli/branding-automation-engine',
        demo: 'https://demo-branding.ethiroli.net',
        figma: 'https://figma.com/file/branding-engine-ui'
      }
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const toggleDeliverable = (projId, idx) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projId) return p;
        const updated = [...p.deliverables];
        updated[idx].done = !updated[idx].done;
        const doneCount = updated.filter((d) => d.done).length;
        const newProgress = Math.round((doneCount / updated.length) * 100);
        return { ...p, deliverables: updated, progress: newProgress };
      })
    );

    setSelectedProject((prev) => {
      if (prev.id !== projId) return prev;
      const updated = [...prev.deliverables];
      updated[idx].done = !updated[idx].done;
      const doneCount = updated.filter((d) => d.done).length;
      return { ...prev, deliverables: updated, progress: Math.round((doneCount / updated.length) * 100) };
    });
  };

  return (
    <AdminPage
      title="Assigned Projects & Capstone Deliverables"
      subtitle="Team collaboration workspace, tech stack architecture, sprint deliverables, and GitHub repository links"
    >
      <div className="container-fluid px-0">
        {/* Project Selector Cards */}
        <div className="row g-4 mb-4">
          {projects.map((proj) => (
            <div key={proj.id} className="col-lg-6">
              <div
                className={`card shadow-sm h-100 cursor-pointer ${
                  selectedProject.id === proj.id ? 'border-primary border-2' : 'border-0'
                }`}
                onClick={() => setSelectedProject(proj)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary border">{proj.role}</span>
                    <span className="badge bg-success-subtle text-success">{proj.status}</span>
                  </div>

                  <h5 className="fw-bold mb-1 text-dark">{proj.name}</h5>
                  <p className="text-muted small mb-3">{proj.objectives}</p>

                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="badge bg-light text-secondary border small">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto border-top pt-3">
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span><strong>Deadline:</strong> {proj.deadline}</span>
                      <span className="fw-bold text-primary">{proj.progress}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Project Full Detail View */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <span className="badge bg-light text-primary border me-2">{selectedProject.role}</span>
              <h5 className="fw-bold d-inline mb-0 text-dark">{selectedProject.name} — Workspace</h5>
            </div>
            {/* Action Links: GitHub, Demo, Figma */}
            <div className="d-flex gap-2">
              <a
                href={selectedProject.links.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-dark btn-sm"
              >
                <i className="bi bi-github me-1"></i> GitHub Repo
              </a>
              <a
                href={selectedProject.links.demo}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="bi bi-box-arrow-up-right me-1"></i> Live Staging
              </a>
              <a
                href={selectedProject.links.figma}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="bi bi-palette me-1"></i> Figma
              </a>
            </div>
          </div>

          <div className="card-body p-4 pt-0">
            <div className="row g-4">
              {/* Deliverables Checklist */}
              <div className="col-lg-7">
                <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-check2-all text-primary"></i> Deliverables & Sprint Checklist
                </h6>
                <div className="list-group list-group-flush border rounded-3 p-2 bg-light mb-4">
                  {selectedProject.deliverables.map((d, idx) => (
                    <div
                      key={idx}
                      className="list-group-item bg-transparent border-0 px-2 py-2 d-flex align-items-center justify-content-between"
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={d.done}
                          onChange={() => toggleDeliverable(selectedProject.id, idx)}
                          id={`del-${idx}`}
                        />
                        <label
                          htmlFor={`del-${idx}`}
                          className={`form-check-label ms-2 small ${
                            d.done ? 'text-decoration-line-through text-muted' : 'fw-medium text-dark'
                          }`}
                        >
                          {d.title}
                        </label>
                      </div>
                      <span className={`badge small ${d.done ? 'bg-success' : 'bg-secondary'}`}>
                        {d.done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* My Tasks in this Project */}
                <h6 className="fw-bold mb-2 text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-person-check text-info"></i> Tasks Assigned to You
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Task</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.myTasks.map((t, idx) => (
                        <tr key={idx}>
                          <td className="small fw-semibold">{t.title}</td>
                          <td>
                            <span
                              className={`badge small ${
                                t.status === 'COMPLETED'
                                  ? 'bg-success'
                                  : t.status === 'IN_PROGRESS'
                                  ? 'bg-primary'
                                  : 'bg-secondary'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Members & Architecture */}
              <div className="col-lg-5">
                <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-people-fill text-primary"></i> Team Members & Roles
                </h6>
                <div className="d-flex flex-column gap-2 mb-4">
                  {selectedProject.team.map((member) => (
                    <div key={member.name} className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
                      <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: '40px', height: '40px' }}>
                        {member.avatar}
                      </div>
                      <div>
                        <strong className="d-block text-dark small">{member.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 small">
                  <strong className="text-primary d-block mb-1">
                    <i className="bi bi-info-circle me-1"></i> Capstone Requirement
                  </strong>
                  <p className="text-muted mb-0">
                    To receive final certification, all assigned project deliverables must achieve approved PR status and meet Lighthouse performance benchmarks (&gt;85 score).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
