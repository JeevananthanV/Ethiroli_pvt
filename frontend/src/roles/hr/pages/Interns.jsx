import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listInterns, createIntern, updateIntern, deleteIntern } from '../../../../services/api/hrApi.standardized.js';

const INTERNSHIP_STATUSES = [
  'ALL',
  'Applied',
  'Interview',
  'Selected',
  'Offer',
  'Onboarding',
  'Training',
  'Project',
  'Evaluation',
  'Completed'
];

const INITIAL_INTERNS_MOCK = [
  {
    id: 'INT-2026-01',
    name: 'Vikas Sundaram',
    email: 'vikas.sundaram@gmail.com',
    phone: '+91 98402 11223',
    college: 'PSG College of Technology, Coimbatore',
    degree: 'B.Tech Information Technology (Final Year)',
    department: 'Engineering',
    role: 'React & Node.js Intern',
    mentor: 'Vigneshwaran P.',
    pm: 'Arunmozhi Varman',
    start_date: '2026-08-01',
    end_date: '2026-10-31',
    duration: '3 Months',
    plan_name: '60-Day Advanced Internship Plan',
    attendance: 96,
    training_progress: 85,
    project_assigned: 'Ethiroli Student Analytics Microservice',
    performance_score: '4.8 / 5.0 (Excellent)',
    certificate_status: 'Eligible (Post Evaluation)',
    status: 'Project'
  },
  {
    id: 'INT-2026-02',
    name: 'Dharani Velu',
    email: 'dharani.velu@outlook.com',
    phone: '+91 97901 33445',
    college: 'SSN College of Engineering, Chennai',
    degree: 'B.E. Computer Science & Engineering',
    department: 'Design',
    role: 'UI/UX Design Intern',
    mentor: 'Soundarya Raman',
    pm: 'Arunmozhi Varman',
    start_date: '2026-09-01',
    end_date: '2026-11-30',
    duration: '3 Months',
    plan_name: '30-Day Intern Onboarding Plan',
    attendance: 100,
    training_progress: 60,
    project_assigned: 'Enterprise Dashboard Glassmorphism Redesign',
    performance_score: '4.6 / 5.0 (Very Good)',
    certificate_status: 'In Progress',
    status: 'Training'
  },
  {
    id: 'INT-2026-03',
    name: 'Rithwik Sridhar',
    email: 'rithwik.s@gmail.com',
    phone: '+91 94440 99881',
    college: 'Thiagarajar College of Engineering, Madurai',
    degree: 'B.Tech AI & Data Science',
    department: 'Engineering',
    role: 'AI / Machine Learning Intern',
    mentor: 'Karthik Subramanian',
    pm: 'Arunmozhi Varman',
    start_date: '2026-07-01',
    end_date: '2026-09-30',
    duration: '3 Months',
    plan_name: '60-Day Advanced Internship Plan',
    attendance: 98,
    training_progress: 100,
    project_assigned: 'AI Curriculum Assessment Engine',
    performance_score: '4.9 / 5.0 (Outstanding PPO Candidate)',
    certificate_status: 'Issued & Verified',
    status: 'Completed'
  },
  {
    id: 'INT-2026-04',
    name: 'Kavitha Ramachandran',
    email: 'kavitha.r@gmail.com',
    phone: '+91 98841 55667',
    college: 'MIT Campus, Anna University',
    degree: 'M.Sc Computer Science',
    department: 'Engineering',
    role: 'Full Stack Web Intern',
    mentor: 'Priyadharshini Kumar',
    pm: 'Arunmozhi Varman',
    start_date: '2026-10-01',
    end_date: '2026-12-31',
    duration: '3 Months',
    plan_name: '30-Day Intern Onboarding Plan',
    attendance: 0,
    training_progress: 0,
    project_assigned: 'Pending Allocation',
    performance_score: 'Not Assessed Yet',
    certificate_status: 'Pending',
    status: 'Offer'
  }
];

export default function HRInterns() {
  const {
    data: fetchedInterns,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listInterns,
    undefined,
    async (id, data) => {
      await updateIntern(id, data);
      await refresh();
    },
    async (id) => {
      await deleteIntern(id);
      await refresh();
    },
    undefined
  );

  const [localInterns, setLocalInterns] = useState(INITIAL_INTERNS_MOCK);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    department: 'Engineering',
    role: '',
    mentor: 'Vigneshwaran P.',
    pm: 'Arunmozhi Varman',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    duration: '3 Months',
    plan_name: '30-Day Intern Onboarding Plan',
    status: 'Onboarding'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const internList = useMemo(() => {
    if (Array.isArray(fetchedInterns) && fetchedInterns.length > 0) {
      return fetchedInterns;
    }
    return localInterns;
  }, [fetchedInterns, localInterns]);

  const filteredInterns = useMemo(() => {
    return internList.filter((intern) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (intern.name || '').toLowerCase().includes(q) ||
        (intern.college || '').toLowerCase().includes(q) ||
        (intern.role || '').toLowerCase().includes(q) ||
        (intern.id || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || intern.status === statusFilter;
      const matchDept = deptFilter === 'ALL' || intern.department === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [internList, search, statusFilter, deptFilter]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `INT-2026-${Math.floor(10 + Math.random() * 90)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      degree: formData.degree,
      department: formData.department,
      role: formData.role,
      mentor: formData.mentor,
      pm: formData.pm,
      start_date: formData.start_date,
      end_date: formData.end_date,
      duration: formData.duration,
      plan_name: formData.plan_name,
      attendance: 100,
      training_progress: 0,
      project_assigned: 'Assigned during Phase 2',
      performance_score: 'New Intern',
      certificate_status: 'Pending',
      status: formData.status
    };

    setLocalInterns([created, ...localInterns]);
    setShowAddModal(false);
    showToast(`Intern record for ${formData.name} created successfully!`);
    setFormData({
      name: '',
      email: '',
      phone: '',
      college: '',
      degree: '',
      department: 'Engineering',
      role: '',
      mentor: 'Vigneshwaran P.',
      pm: 'Arunmozhi Varman',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      duration: '3 Months',
      plan_name: '30-Day Intern Onboarding Plan',
      status: 'Onboarding'
    });
  };

  const handleStatusTransition = (internId, newStatus) => {
    setLocalInterns(prev =>
      prev.map(i => (i.id === internId ? { ...i, status: newStatus } : i))
    );
    if (selectedIntern && selectedIntern.id === internId) {
      setSelectedIntern(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Internship status updated to ${newStatus}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge bg-success">Completed</span>;
      case 'Project':
      case 'Training':
      case 'Evaluation':
        return <span className="badge bg-primary">{status}</span>;
      case 'Onboarding':
      case 'Offer':
      case 'Selected':
        return <span className="badge bg-info text-dark">{status}</span>;
      case 'Applied':
      case 'Interview':
        return <span className="badge bg-secondary">{status}</span>;
      default:
        return <span className="badge bg-light text-dark">{status || '—'}</span>;
    }
  };

  return (
    <AdminPage
      title="Interns & Mentorship Hub"
      subtitle="Complete internship lifecycle: College admission → Mentor assignment → Training → Live Project → Certificate"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-1" /> Add Intern
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

        {/* Internship Lifecycle Ribbon */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Internship Lifecycle Stages (Ethiroli Workflow)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {INTERNSHIP_STATUSES.filter(s => s !== 'ALL').map((stage, idx, arr) => (
                <React.Fragment key={stage}>
                  <div
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: statusFilter === stage ? '#0284c7' : '#ffffff',
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

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by intern name, college, role, or ID..."
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
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {INTERNSHIP_STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Internship Stages' : s}</option>)}
          </select>
        </div>

        {/* Interns Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Active Interns ({filteredInterns.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredInterns.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-mortarboard" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No interns found</h4>
                <p style={{ color: '#64748b' }}>Try changing filters or onboarding a new intern.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Intern ID</th>
                      <th>Intern Name & College</th>
                      <th>Track / Role</th>
                      <th>Assigned Mentor</th>
                      <th>Duration</th>
                      <th>Training Progress</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterns.map((intern) => (
                      <tr key={intern.id}>
                        <td><span className="badge bg-light text-dark font-monospace">{intern.id}</span></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{intern.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{intern.college}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{intern.role}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{intern.department}</div>
                        </td>
                        <td>{intern.mentor}</td>
                        <td>{intern.duration} ({intern.start_date})</td>
                        <td style={{ minWidth: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                            <span>Modules</span>
                            <span>{intern.training_progress || 0}%</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-info"
                              role="progressbar"
                              style={{ width: `${intern.training_progress || 0}%` }}
                            />
                          </div>
                        </td>
                        <td>{getStatusBadge(intern.status)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedIntern(intern);
                              setShowDetailModal(true);
                            }}
                          >
                            <i className="bi bi-eye me-1" /> View Profile
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

        {/* Detailed Intern Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Internship Profile — ${selectedIntern?.name}`}
        >
          {selectedIntern && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h4 className="mb-0 fw-bold">{selectedIntern.name}</h4>
                  <small className="text-muted">{selectedIntern.role} • <span className="font-monospace">{selectedIntern.id}</span></small>
                </div>
                <div>{getStatusBadge(selectedIntern.status)}</div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <small className="text-muted d-block">College & Degree</small>
                  <strong>{selectedIntern.college}</strong>
                  <div className="text-secondary small">{selectedIntern.degree}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Contact Info</small>
                  <div>{selectedIntern.email}</div>
                  <div>{selectedIntern.phone}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Assigned Mentor & PM</small>
                  <div>Mentor: <strong>{selectedIntern.mentor}</strong></div>
                  <div>PM: <strong>{selectedIntern.pm}</strong></div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block">Internship Duration</small>
                  <div>{selectedIntern.duration} ({selectedIntern.start_date} to {selectedIntern.end_date || 'Present'})</div>
                </div>
              </div>

              {/* Progress & Project card */}
              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '0.85rem' }}>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Assigned Live Project</small>
                      <strong className="text-primary">{selectedIntern.project_assigned}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Evaluation & Rating</small>
                      <strong className="text-success">{selectedIntern.performance_score}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Onboarding Plan</small>
                      <div>{selectedIntern.plan_name}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Certificate Status</small>
                      <div>{selectedIntern.certificate_status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transition Lifecycle */}
              <div className="mb-3">
                <div className="small fw-bold text-muted mb-2">UPDATE INTERNSHIP STAGE:</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {INTERNSHIP_STATUSES.filter(s => s !== 'ALL').map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedIntern.status === st ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary'}`}
                      onClick={() => handleStatusTransition(selectedIntern.id, st)}
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

        {/* Add Intern Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Intern (Mentorship & Program Setup)"
        >
          <form onSubmit={handleCreateSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Vikas Sundaram"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="vikas@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  placeholder="+91 98400 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">College / Institute *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. PSG College of Tech"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Degree & Stream</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. B.Tech IT Final Year"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Internship Track / Role *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. React & Node.js Intern"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Assigned Tech Mentor</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.mentor}
                  onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Project Manager</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pm}
                  onChange={(e) => setFormData({ ...formData, pm: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Duration</label>
                <select
                  className="form-select"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Onboarding Plan</label>
                <select
                  className="form-select"
                  value={formData.plan_name}
                  onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                >
                  <option value="30-Day Intern Onboarding Plan">30-Day Intern Plan</option>
                  <option value="60-Day Advanced Internship Plan">60-Day Advanced Plan</option>
                </select>
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Enroll Intern</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}