import React, { useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listExitRequests, createExitRequest, updateExitRequest } from '../../../../services/api/hrApi.standardized.js';

const EXIT_STATUSES = ['ALL', 'INITIATED', 'HANDOVER_IN_PROGRESS', 'NO_DUES_PENDING', 'APPROVED', 'COMPLETED'];

const INITIAL_EXITS_MOCK = [
  {
    id: 'EXIT-2026-01',
    person_name: 'Rajesh Kannan',
    role_type: 'EMPLOYEE',
    designation: 'Senior Backend Engineer',
    department: 'Engineering',
    resignation_date: '2026-09-01',
    last_working_day: '2026-10-15',
    reason: 'Higher Studies abroad (MS in Computer Science)',
    status: 'NO_DUES_PENDING',
    clearances: {
      it_assets_returned: true,
      it_access_revoked: true,
      finance_no_dues: true,
      manager_kt_complete: true,
      hr_exit_interview: false
    },
    exit_interview_notes: 'Expressed gratitude for high learning curve at Ethiroli. Recommends more knowledge-sharing sessions.',
    relieving_letter_issued: false
  },
  {
    id: 'EXIT-2026-02',
    person_name: 'Rithwik Sridhar',
    role_type: 'INTERN',
    designation: 'AI / Machine Learning Intern',
    department: 'Engineering',
    resignation_date: '2026-09-15',
    last_working_day: '2026-09-30',
    reason: 'Internship Tenure Completion (3 Months)',
    status: 'COMPLETED',
    clearances: {
      it_assets_returned: true,
      it_access_revoked: true,
      finance_no_dues: true,
      manager_kt_complete: true,
      hr_exit_interview: true
    },
    exit_interview_notes: 'Delivered Capstone AI project with 4.9 rating. Accepted PPO offer.',
    relieving_letter_issued: true
  },
  {
    id: 'EXIT-2026-03',
    person_name: 'Pavithra Natarajan',
    role_type: 'EMPLOYEE',
    designation: 'QA Automation Engineer',
    department: 'Engineering',
    resignation_date: '2026-09-20',
    last_working_day: '2026-10-30',
    reason: 'Relocation to hometown due to personal reasons',
    status: 'HANDOVER_IN_PROGRESS',
    clearances: {
      it_assets_returned: false,
      it_access_revoked: false,
      finance_no_dues: false,
      manager_kt_complete: false,
      hr_exit_interview: false
    },
    exit_interview_notes: 'Handover scheduled with QA junior team.',
    relieving_letter_issued: false
  }
];

export default function HROffboarding() {
  const {
    data: fetchedExits,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listExitRequests,
    undefined,
    undefined,
    undefined,
    undefined
  );

  const [localExits, setLocalExits] = useState(INITIAL_EXITS_MOCK);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [selectedExit, setSelectedExit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [newExitForm, setNewExitForm] = useState({
    person_name: '',
    role_type: 'EMPLOYEE',
    designation: '',
    department: 'Engineering',
    resignation_date: new Date().toISOString().split('T')[0],
    last_working_day: '',
    reason: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const exitList = useMemo(() => {
    if (Array.isArray(fetchedExits) && fetchedExits.length > 0) {
      return fetchedExits;
    }
    return localExits;
  }, [fetchedExits, localExits]);

  const filteredExits = useMemo(() => {
    return exitList.filter((ex) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (ex.person_name || '').toLowerCase().includes(q) ||
        (ex.designation || '').toLowerCase().includes(q) ||
        (ex.department || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || ex.status === statusFilter;
      const matchRole = roleFilter === 'ALL' || ex.role_type === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [exitList, search, statusFilter, roleFilter]);

  const handleToggleClearance = (exitId, clearanceKey) => {
    setLocalExits(prev =>
      prev.map(e => {
        if (e.id !== exitId) return e;
        const updatedClearances = { ...e.clearances, [clearanceKey]: !e.clearances[clearanceKey] };
        const allDone = Object.values(updatedClearances).every(Boolean);
        const updatedExit = {
          ...e,
          clearances: updatedClearances,
          status: allDone ? 'COMPLETED' : 'NO_DUES_PENDING',
          relieving_letter_issued: allDone ? true : e.relieving_letter_issued
        };
        if (selectedExit && selectedExit.id === exitId) {
          setSelectedExit(updatedExit);
        }
        return updatedExit;
      })
    );
    showToast('Department clearance checklist updated!');
  };

  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `EXIT-2026-${Math.floor(10 + Math.random() * 90)}`,
      person_name: newExitForm.person_name,
      role_type: newExitForm.role_type,
      designation: newExitForm.designation,
      department: newExitForm.department,
      resignation_date: newExitForm.resignation_date,
      last_working_day: newExitForm.last_working_day || '30 Days Notice',
      reason: newExitForm.reason,
      status: 'INITIATED',
      clearances: {
        it_assets_returned: false,
        it_access_revoked: false,
        finance_no_dues: false,
        manager_kt_complete: false,
        hr_exit_interview: false
      },
      exit_interview_notes: 'Exit interview scheduled during final week.',
      relieving_letter_issued: false
    };

    setLocalExits([created, ...localExits]);
    setShowInitiateModal(false);
    showToast(`Exit workflow initiated for ${newExitForm.person_name}!`);
    setNewExitForm({
      person_name: '',
      role_type: 'EMPLOYEE',
      designation: '',
      department: 'Engineering',
      resignation_date: new Date().toISOString().split('T')[0],
      last_working_day: '',
      reason: ''
    });
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'COMPLETED':
        return <span className="badge bg-success">RELIEVED / COMPLETED</span>;
      case 'APPROVED':
        return <span className="badge bg-primary">APPROVED</span>;
      case 'NO_DUES_PENDING':
        return <span className="badge bg-warning text-dark">NO DUES CLEARANCE</span>;
      case 'HANDOVER_IN_PROGRESS':
        return <span className="badge bg-info text-dark">HANDOVER & KT</span>;
      default:
        return <span className="badge bg-secondary">INITIATED</span>;
    }
  };

  return (
    <AdminPage
      title="Offboarding & Exit Clearance Hub"
      subtitle="Complete offboarding workflow: Resignation → KT Handover → 4-Tier No-Dues Clearance → Exit Interview → Relieving Letter"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowInitiateModal(true)}>
          <i className="bi bi-box-arrow-right me-1" /> Initiate Exit
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

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by employee/intern name, designation, or department..."
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
            {EXIT_STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Exit Stages' : s}</option>)}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="ALL">All Cohorts</option>
            <option value="EMPLOYEE">Employees</option>
            <option value="INTERN">Interns</option>
          </select>
        </div>

        {/* Exit Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Active Offboarding Requests ({filteredExits.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredExits.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-person-x" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No active offboarding processes</h4>
                <p style={{ color: '#64748b' }}>All team members are active in their respective roles.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Employee / Intern</th>
                      <th>Cohort</th>
                      <th>Resignation Date</th>
                      <th>Last Working Day</th>
                      <th>Clearance Progress</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExits.map((ex) => {
                      const doneCount = Object.values(ex.clearances || {}).filter(Boolean).length;
                      const totalCount = Object.keys(ex.clearances || {}).length || 5;
                      const progressPct = Math.round((doneCount / totalCount) * 100);

                      return (
                        <tr key={ex.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{ex.person_name}</div>
                            <small className="text-muted">{ex.designation} • {ex.department}</small>
                          </td>
                          <td>
                            <span className={`badge ${ex.role_type === 'INTERN' ? 'bg-info text-dark' : 'bg-primary'}`}>
                              {ex.role_type}
                            </span>
                          </td>
                          <td>{ex.resignation_date}</td>
                          <td><strong>{ex.last_working_day}</strong></td>
                          <td style={{ minWidth: '140px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                              <span>{doneCount}/{totalCount} Cleared</span>
                              <span style={{ fontWeight: 700 }}>{progressPct}%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className={`progress-bar ${progressPct === 100 ? 'bg-success' : 'bg-warning'}`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </td>
                          <td>{getStatusBadge(ex.status)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedExit(ex);
                                setShowDetailModal(true);
                              }}
                            >
                              <i className="bi bi-shield-check me-1" /> Clearances
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Clearances Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Exit & No-Dues Clearance — ${selectedExit?.person_name}`}
        >
          {selectedExit && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="mb-0 fw-bold">{selectedExit.person_name} ({selectedExit.role_type})</h5>
                  <small className="text-muted">{selectedExit.designation} • Last Day: {selectedExit.last_working_day}</small>
                </div>
                <div>{getStatusBadge(selectedExit.status)}</div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Reason for Leaving</small>
                <div className="p-2 bg-light rounded border small">{selectedExit.reason}</div>
              </div>

              <div className="card mb-3">
                <div className="cardHeader" style={{ background: '#f8fafc', padding: '0.6rem 1rem' }}>
                  <strong>4-Tier No-Dues Clearance Checklist</strong>
                </div>
                <div className="cardBody" style={{ padding: '0.75rem 1rem' }}>
                  {[
                    ['it_assets_returned', '1. IT Assets & Laptop Returned to Operations'],
                    ['it_access_revoked', '2. System Credentials & VPN/Slack Revocation'],
                    ['manager_kt_complete', '3. Knowledge Transfer & Codebase Handover'],
                    ['finance_no_dues', '4. Finance No-Dues & Travel Expense Settlement'],
                    ['hr_exit_interview', '5. HR Exit Interview Conducted & Feedback Recorded']
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedExit.clearances && selectedExit.clearances[key])}
                          onChange={() => handleToggleClearance(selectedExit.id, key)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>{label}</span>
                      </div>
                      <span className={`badge ${selectedExit.clearances && selectedExit.clearances[key] ? 'bg-success' : 'bg-secondary'}`}>
                        {selectedExit.clearances && selectedExit.clearances[key] ? 'CLEARED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block fw-bold">Exit Interview & HR Feedback</small>
                <div className="p-2 bg-light rounded border small">{selectedExit.exit_interview_notes}</div>
              </div>

              <div className="text-end mt-4">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Initiate Modal */}
        <Modal
          isOpen={showInitiateModal}
          onClose={() => setShowInitiateModal(false)}
          title="Initiate Offboarding / Resignation"
        >
          <form onSubmit={handleInitiateSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Rajesh Kannan"
                  value={newExitForm.person_name}
                  onChange={(e) => setNewExitForm({ ...newExitForm, person_name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cohort *</label>
                <select
                  className="form-select"
                  value={newExitForm.role_type}
                  onChange={(e) => setNewExitForm({ ...newExitForm, role_type: e.target.value })}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Backend Engineer"
                  value={newExitForm.designation}
                  onChange={(e) => setNewExitForm({ ...newExitForm, designation: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={newExitForm.department}
                  onChange={(e) => setNewExitForm({ ...newExitForm, department: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Resignation Date *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={newExitForm.resignation_date}
                  onChange={(e) => setNewExitForm({ ...newExitForm, resignation_date: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Working Day *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={newExitForm.last_working_day}
                  onChange={(e) => setNewExitForm({ ...newExitForm, last_working_day: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Reason for Leaving *</label>
              <textarea
                required
                className="form-control"
                rows="3"
                placeholder="State the reason or tenure completion details..."
                value={newExitForm.reason}
                onChange={(e) => setNewExitForm({ ...newExitForm, reason: e.target.value })}
              />
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowInitiateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Start Offboarding Journey</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}