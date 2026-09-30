import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listCareerApplications, convertCandidateToEmployee, convertCandidateToIntern } from '../../../../services/api/hrApi.standardized.js';

const CANDIDATE_STAGES = ['ALL', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Offer', 'Converted'];

const INITIAL_APPLICATIONS_MOCK = [
  {
    id: 'APP-2026-01',
    candidate_name: 'Harish Kumar',
    email: 'harish.k@gmail.com',
    phone: '+91 98409 12345',
    position: 'Full Stack React & Node Developer',
    experience: '3.5 Years',
    current_company: 'Infosys',
    applied_at: '2026-09-27',
    status: 'Selected',
    resume_summary: 'Experienced in React, TypeScript, Express, PostgreSQL, and AWS deployment.',
    type_preference: 'EMPLOYEE'
  },
  {
    id: 'APP-2026-02',
    candidate_name: 'Meghana Reddy',
    email: 'meghana.reddy@outlook.com',
    phone: '+91 97902 44556',
    position: 'UI/UX & Product Design',
    experience: 'Fresher / Final Year',
    current_company: 'Vellore Institute of Technology (VIT)',
    applied_at: '2026-09-28',
    status: 'Selected',
    resume_summary: 'Strong portfolio in Figma, design systems, mobile app wireframing, and micro-interactions.',
    type_preference: 'INTERN'
  },
  {
    id: 'APP-2026-03',
    candidate_name: 'Sanjay Manikandan',
    email: 'sanjay.m@gmail.com',
    phone: '+91 94443 66778',
    position: 'DevOps & Cloud Engineer',
    experience: '2 Years',
    current_company: 'Zoho Corporation',
    applied_at: '2026-09-25',
    status: 'Interview',
    resume_summary: 'Hands-on experience with Docker, Kubernetes, Terraform, and CI/CD pipelines.',
    type_preference: 'EMPLOYEE'
  },
  {
    id: 'APP-2026-04',
    candidate_name: 'Archana Venkataraman',
    email: 'archana.v@gmail.com',
    phone: '+91 98840 88990',
    position: 'Python Data Science Intern',
    experience: 'Student',
    current_company: 'CEG Anna University',
    applied_at: '2026-09-29',
    status: 'Shortlisted',
    resume_summary: 'Knowledge of Pandas, Scikit-learn, BigQuery, and statistical data visualization.',
    type_preference: 'INTERN'
  }
];

export default function HRCareerApplications() {
  const {
    data: applications,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listCareerApplications,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localApps, setLocalApps] = useState(INITIAL_APPLICATIONS_MOCK);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Conversion Modals
  const [showConvertEmpModal, setShowConvertEmpModal] = useState(false);
  const [showConvertInternModal, setShowConvertInternModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Conversion Form States
  const [empForm, setEmpForm] = useState({
    designation: '',
    department: 'Engineering',
    manager: 'Karthik Subramanian',
    joining_date: new Date().toISOString().split('T')[0],
    ctc: '₹ 8,50,000 PA'
  });

  const [internForm, setInternForm] = useState({
    college: '',
    degree: '',
    department: 'Engineering',
    role: '',
    mentor: 'Vigneshwaran P.',
    duration: '3 Months',
    start_date: new Date().toISOString().split('T')[0]
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const appList = useMemo(() => {
    if (Array.isArray(applications) && applications.length > 0) {
      return applications;
    }
    return localApps;
  }, [applications, localApps]);

  const filteredApplications = useMemo(() => {
    return appList.filter((app) => {
      const name = (app.candidate_name || app.name || '').toLowerCase();
      const pos = (app.position || '').toLowerCase();
      const q = (search || '').toLowerCase();
      const matchSearch = name.includes(q) || pos.includes(q) || (app.email || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [appList, search, statusFilter]);

  const handleOpenConvertEmployee = (app) => {
    setSelectedApplication(app);
    setEmpForm({
      designation: app.position || 'Software Engineer',
      department: 'Engineering',
      manager: 'Karthik Subramanian',
      joining_date: new Date().toISOString().split('T')[0],
      ctc: '₹ 8,50,000 PA'
    });
    setShowConvertEmpModal(true);
  };

  const handleOpenConvertIntern = (app) => {
    setSelectedApplication(app);
    setInternForm({
      college: app.current_company || 'Anna University',
      degree: 'B.Tech / B.E. Final Year',
      department: 'Engineering',
      role: app.position || 'Software Intern',
      mentor: 'Vigneshwaran P.',
      duration: '3 Months',
      start_date: new Date().toISOString().split('T')[0]
    });
    setShowConvertInternModal(true);
  };

  const handleExecuteConvertEmp = async (e) => {
    e.preventDefault();
    await convertCandidateToEmployee(selectedApplication.id, empForm);
    setLocalApps(prev => prev.map(a => a.id === selectedApplication.id ? { ...a, status: 'Converted' } : a));
    setShowConvertEmpModal(false);
    showToast(`🎉 ${selectedApplication.candidate_name || selectedApplication.name} successfully converted to Employee profile!`);
  };

  const handleExecuteConvertIntern = async (e) => {
    e.preventDefault();
    await convertCandidateToIntern(selectedApplication.id, internForm);
    setLocalApps(prev => prev.map(a => a.id === selectedApplication.id ? { ...a, status: 'Converted' } : a));
    setShowConvertInternModal(false);
    showToast(`🎉 ${selectedApplication.candidate_name || selectedApplication.name} successfully converted to Intern profile!`);
  };

  const handleStatusChange = (appId, newStatus) => {
    setLocalApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Application status updated to ${newStatus}`);
  };

  return (
    <AdminPage
      title="Career Applications & Candidate Conversion"
      subtitle="Recruitment pipeline: Review applicants, progress interviews, and convert candidates directly into Employee or Intern profiles"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary">
            <i className="bi bi-briefcase me-1" /> Open Jobs Board
          </Button>
        </div>
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

        {/* Recruitment Pipeline Stages */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Candidate Hiring & Conversion Pipeline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {CANDIDATE_STAGES.filter(s => s !== 'ALL').map((stage, idx, arr) => (
                <React.Fragment key={stage}>
                  <div
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: statusFilter === stage ? '#6366f1' : '#ffffff',
                      color: statusFilter === stage ? '#ffffff' : '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => setStatusFilter(statusFilter === stage ? 'ALL' : stage)}
                  >
                    {idx + 1}. {stage}
                  </div>
                  {idx < arr.length - 1 && <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.75rem' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search candidate by name, role, email, or experience..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            {CANDIDATE_STAGES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Application Stages' : s}</option>)}
          </select>
        </div>

        {/* Applications Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Candidates & Applicants ({filteredApplications.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredApplications.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-person-lines-fill" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No job applications found</h4>
                <p style={{ color: '#64748b' }}>No candidates match the current filter criteria.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Applied Role</th>
                      <th>Experience / Institute</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Convert & Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{app.candidate_name || app.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{app.email} • {app.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{app.position}</div>
                        </td>
                        <td>{app.experience || app.current_company || '—'}</td>
                        <td>{app.applied_at || '—'}</td>
                        <td>
                          <span className={`badge ${
                            app.status === 'Converted' ? 'bg-success' :
                            app.status === 'Selected' ? 'bg-primary' :
                            app.status === 'Interview' ? 'bg-info text-dark' :
                            'bg-secondary'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowDetailModal(true);
                              }}
                            >
                              <i className="bi bi-eye me-1" /> View
                            </button>

                            {app.status !== 'Converted' && (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleOpenConvertEmployee(app)}
                                  title="Convert Candidate to Employee"
                                >
                                  <i className="bi bi-person-check-fill me-1" /> To Employee
                                </button>
                                <button
                                  className="btn btn-sm btn-info text-dark"
                                  onClick={() => handleOpenConvertIntern(app)}
                                  title="Convert Candidate to Intern"
                                >
                                  <i className="bi bi-mortarboard-fill me-1" /> To Intern
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Candidate Profile — ${selectedApplication?.candidate_name || selectedApplication?.name}`}
        >
          {selectedApplication && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h4 className="mb-0 fw-bold">{selectedApplication.candidate_name || selectedApplication.name}</h4>
                  <small className="text-muted">{selectedApplication.position}</small>
                </div>
                <div>
                  <span className="badge bg-primary">{selectedApplication.status}</span>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <small className="text-muted d-block">Contact Coordinates</small>
                  <div>{selectedApplication.email}</div>
                  <div>{selectedApplication.phone}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Experience / Background</small>
                  <div>{selectedApplication.experience} ({selectedApplication.current_company})</div>
                </div>
              </div>

              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '0.85rem' }}>
                  <div className="small fw-bold text-muted mb-1">RESUME / SKILLS SUMMARY:</div>
                  <div>{selectedApplication.resume_summary || selectedApplication.resume_text || 'Profile details submitted via careers portal.'}</div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="mb-3">
                <div className="small fw-bold text-muted mb-2">UPDATE APPLICATION STAGE:</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {CANDIDATE_STAGES.filter(s => s !== 'ALL').map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedApplication.status === st ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleStatusChange(selectedApplication.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Convert to Employee Modal */}
        <Modal
          isOpen={showConvertEmpModal}
          onClose={() => setShowConvertEmpModal(false)}
          title={`Convert ${selectedApplication?.candidate_name || selectedApplication?.name} → Employee`}
        >
          <form onSubmit={handleExecuteConvertEmp}>
            <div className="alert alert-info py-2 small mb-3">
              <i className="bi bi-info-circle me-1" />
              This will automatically generate a formal Employee Profile and trigger the 30-Day Onboarding journey.
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Assigned Designation *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={empForm.designation}
                  onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={empForm.department}
                  onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Reporting Manager</label>
                <input
                  type="text"
                  className="form-control"
                  value={empForm.manager}
                  onChange={(e) => setEmpForm({ ...empForm, manager: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={empForm.joining_date}
                  onChange={(e) => setEmpForm({ ...empForm, joining_date: e.target.value })}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Agreed Compensation (CTC)</label>
                <input
                  type="text"
                  className="form-control"
                  value={empForm.ctc}
                  onChange={(e) => setEmpForm({ ...empForm, ctc: e.target.value })}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowConvertEmpModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-success">Confirm Employee Conversion</button>
            </div>
          </form>
        </Modal>

        {/* Convert to Intern Modal */}
        <Modal
          isOpen={showConvertInternModal}
          onClose={() => setShowConvertInternModal(false)}
          title={`Convert ${selectedApplication?.candidate_name || selectedApplication?.name} → Intern`}
        >
          <form onSubmit={handleExecuteConvertIntern}>
            <div className="alert alert-info py-2 small mb-3">
              <i className="bi bi-info-circle me-1" />
              This will create a structured Internship Profile with assigned mentor and start tracking curriculum progress.
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">College / University *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={internForm.college}
                  onChange={(e) => setInternForm({ ...internForm, college: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Degree & Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={internForm.degree}
                  onChange={(e) => setInternForm({ ...internForm, degree: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Internship Track / Role *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={internForm.role}
                  onChange={(e) => setInternForm({ ...internForm, role: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Assigned Mentor</label>
                <input
                  type="text"
                  className="form-control"
                  value={internForm.mentor}
                  onChange={(e) => setInternForm({ ...internForm, mentor: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Duration</label>
                <select
                  className="form-select"
                  value={internForm.duration}
                  onChange={(e) => setInternForm({ ...internForm, duration: e.target.value })}
                >
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={internForm.start_date}
                  onChange={(e) => setInternForm({ ...internForm, start_date: e.target.value })}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowConvertInternModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-info text-dark fw-bold">Confirm Intern Conversion</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}