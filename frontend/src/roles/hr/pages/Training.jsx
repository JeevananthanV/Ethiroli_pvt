import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listTrainings, createTraining, updateTraining } from '../../../../services/api/hrApi.standardized.js';

const INITIAL_TRAININGS_MOCK = [
  {
    id: 'TRN-101',
    title: 'Full Stack MERN Bootcamp Track',
    target_role: 'STUDENT',
    assigned_to: 'Aishwarya Rajesh (STU-101)',
    assigned_tutor_or_mentor: 'Karthik Subramanian (Tutor)',
    start_date: '2026-08-15',
    target_completion: '2027-02-15',
    progress: 82,
    status: 'IN_PROGRESS',
    lms_sync_status: 'Active (Module 8 of 10)'
  },
  {
    id: 'TRN-102',
    title: 'Advanced React Architecture & Microservices',
    target_role: 'INTERN',
    assigned_to: 'Vikas Sundaram (INT-2026-01)',
    assigned_tutor_or_mentor: 'Vigneshwaran P. (Mentor)',
    start_date: '2026-08-01',
    target_completion: '2026-10-31',
    progress: 85,
    status: 'IN_PROGRESS',
    lms_sync_status: 'Active (Sprint Project)'
  },
  {
    id: 'TRN-103',
    title: 'Enterprise Cloud Security & AWS Compliance SOP',
    target_role: 'EMPLOYEE',
    assigned_to: 'Arunmozhi Varman (Product Manager)',
    assigned_tutor_or_mentor: 'Karthik Subramanian (VP Eng)',
    start_date: '2026-09-01',
    target_completion: '2026-10-15',
    progress: 100,
    status: 'COMPLETED',
    lms_sync_status: 'Certified (Score 98%)'
  },
  {
    id: 'TRN-104',
    title: 'Python Data Science & BigQuery Analytics',
    target_role: 'STUDENT',
    assigned_to: 'Gowtham Chandran (STU-102)',
    assigned_tutor_or_mentor: 'Dr. Meenakshi Sundaram (Tutor)',
    start_date: '2026-07-01',
    target_completion: '2026-10-30',
    progress: 100,
    status: 'COMPLETED',
    lms_sync_status: 'Completed (Final Capstone Evaluated)'
  },
  {
    id: 'TRN-105',
    title: 'Figma Design Tokens & Glassmorphism Design System',
    target_role: 'INTERN',
    assigned_to: 'Dharani Velu (INT-2026-02)',
    assigned_tutor_or_mentor: 'Soundarya Raman (Lead Designer)',
    start_date: '2026-09-01',
    target_completion: '2026-11-30',
    progress: 60,
    status: 'IN_PROGRESS',
    lms_sync_status: 'Active (Hands-on Wireframing)'
  }
];

export default function HRTraining() {
  const {
    data: fetchedTrainings,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listTrainings,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localTrainings, setLocalTrainings] = useState(INITIAL_TRAININGS_MOCK);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [newTraining, setNewTraining] = useState({
    title: '',
    target_role: 'INTERN',
    assigned_to: '',
    assigned_tutor_or_mentor: 'Karthik Subramanian',
    start_date: new Date().toISOString().split('T')[0],
    target_completion: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const trainingList = useMemo(() => {
    if (Array.isArray(fetchedTrainings) && fetchedTrainings.length > 0) {
      return fetchedTrainings;
    }
    return localTrainings;
  }, [fetchedTrainings, localTrainings]);

  const filtered = useMemo(() => {
    return trainingList.filter((trn) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (trn.title || '').toLowerCase().includes(q) ||
        (trn.assigned_to || '').toLowerCase().includes(q) ||
        (trn.assigned_tutor_or_mentor || '').toLowerCase().includes(q);

      const matchRole = roleFilter === 'ALL' || trn.target_role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || trn.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [trainingList, search, roleFilter, statusFilter]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
      title: newTraining.title,
      target_role: newTraining.target_role,
      assigned_to: newTraining.assigned_to,
      assigned_tutor_or_mentor: newTraining.assigned_tutor_or_mentor,
      start_date: newTraining.start_date,
      target_completion: newTraining.target_completion || '3 Months',
      progress: 0,
      status: 'IN_PROGRESS',
      lms_sync_status: 'Assigned (LMS Sync Initiated)'
    };
    setLocalTrainings([created, ...localTrainings]);
    setShowAddModal(false);
    showToast('Training assigned successfully!');
    setNewTraining({
      title: '',
      target_role: 'INTERN',
      assigned_to: '',
      assigned_tutor_or_mentor: 'Karthik Subramanian',
      start_date: new Date().toISOString().split('T')[0],
      target_completion: ''
    });
  };

  return (
    <AdminPage
      title="Training & LMS Integration Oversight"
      subtitle="HR creates & assigns training pathways to students, interns, and employees while the Tutor/LMS portal delivers course content"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-mortarboard me-1" /> Assign Training Pathway
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

        {/* Architecture Separation Notice */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '1rem' }}>
            <div className="row align-items-center">
              <div className="col-md-6 border-end">
                <div className="small fw-bold text-primary mb-1">HR PORTAL RESPONSIBILITY:</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Assign training tracks → Assign student / intern / employee → Pair tutor / mentor → Monitor completion % & certifications.
                </div>
              </div>
              <div className="col-md-6">
                <div className="small fw-bold text-success mb-1">LMS & TUTOR PORTAL RESPONSIBILITY:</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Video player, interactive lessons, code playgrounds, daily tasks, quizzes & project evaluation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search training title, assignee, or mentor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="ALL">All Cohorts</option>
            <option value="STUDENT">Students</option>
            <option value="INTERN">Interns</option>
            <option value="EMPLOYEE">Employees</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Training Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Assigned Training Programs ({filtered.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filtered.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-book" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No training programs found</h4>
                <p style={{ color: '#64748b' }}>Assign a new training track to begin monitoring.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Training Program</th>
                      <th>Cohort</th>
                      <th>Assigned Learner</th>
                      <th>Assigned Tutor / Mentor</th>
                      <th>LMS Sync Progress</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((trn) => (
                      <tr key={trn.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{trn.title}</div>
                          <small className="text-muted">Start: {trn.start_date}</small>
                        </td>
                        <td>
                          <span className={`badge ${
                            trn.target_role === 'STUDENT' ? 'bg-success' :
                            trn.target_role === 'INTERN' ? 'bg-info text-dark' :
                            'bg-primary'
                          }`}>
                            {trn.target_role}
                          </span>
                        </td>
                        <td>{trn.assigned_to}</td>
                        <td>{trn.assigned_tutor_or_mentor}</td>
                        <td style={{ minWidth: '150px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                            <span>{trn.lms_sync_status}</span>
                            <span style={{ fontWeight: 700 }}>{trn.progress}%</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${trn.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                              style={{ width: `${trn.progress}%` }}
                            />
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${trn.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {trn.status === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedTraining(trn);
                              setShowDetailModal(true);
                            }}
                          >
                            <i className="bi bi-eye me-1" /> View LMS Log
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

        {/* View Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Training Details — ${selectedTraining?.title}`}
        >
          {selectedTraining && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0">{selectedTraining.title}</h5>
                  <small className="text-muted">Target: {selectedTraining.target_role} • {selectedTraining.assigned_to}</small>
                </div>
                <span className="badge bg-primary">{selectedTraining.status}</span>
              </div>

              <div className="card mb-3" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Tutor / Mentor In-Charge</small>
                      <strong>{selectedTraining.assigned_tutor_or_mentor}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">LMS Completion Rate</small>
                      <strong className="text-success">{selectedTraining.progress}% Complete</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Start Date</small>
                      <div>{selectedTraining.start_date}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Target Completion</small>
                      <div>{selectedTraining.target_completion}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info py-2 small mb-3">
                <i className="bi bi-arrow-repeat me-1" />
                Live sync active with Tutor LMS engine. Daily exercises & quiz scores are populated automatically.
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Assign Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Assign Training Pathway"
        >
          <form onSubmit={handleCreateSubmit}>
            <div className="mb-3">
              <label className="form-label">Training Track Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Full Stack MERN Microservices Track"
                value={newTraining.title}
                onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Cohort / Role Type *</label>
                <select
                  className="form-select"
                  value={newTraining.target_role}
                  onChange={(e) => setNewTraining({ ...newTraining, target_role: e.target.value })}
                >
                  <option value="STUDENT">Student Enrollee</option>
                  <option value="INTERN">Intern</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Assigned Learner Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Vikas Sundaram"
                  value={newTraining.assigned_to}
                  onChange={(e) => setNewTraining({ ...newTraining, assigned_to: e.target.value })}
                />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Assigned Tutor / Mentor *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={newTraining.assigned_tutor_or_mentor}
                  onChange={(e) => setNewTraining({ ...newTraining, assigned_tutor_or_mentor: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Target Completion Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newTraining.target_completion}
                  onChange={(e) => setNewTraining({ ...newTraining, target_completion: e.target.value })}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Assign Pathway</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}