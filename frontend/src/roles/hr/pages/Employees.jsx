import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../../../services/api/hrApi.standardized.js';

const EMPLOYEE_STATUSES = [
  'ALL',
  'Candidate',
  'Selected',
  'Offer Sent',
  'Offer Accepted',
  'Onboarding',
  'Active',
  'Notice Period',
  'Exited'
];

const INITIAL_EMPLOYEES_MOCK = [
  {
    id: 'ETH-EMP-001',
    full_name: 'Karthik Subramanian',
    email: 'karthik.s@ethiroli.net',
    phone: '+91 98400 11223',
    department: 'Engineering',
    designation: 'Principal Architect & VP Engineering',
    manager: 'Jeevananthan V (CEO)',
    joining_date: '2024-01-10',
    work_mode: 'Hybrid',
    ctc: '₹ 28,00,000 PA',
    bank_name: 'HDFC Bank (A/C: ****5432)',
    attendance_rate: 98,
    leaves_balance: 14,
    training_status: 'Completed (Cloud & Security SOP)',
    performance_rating: '4.9 / 5.0 (Exceeds Expectations)',
    assets_assigned: 'MacBook Pro M3 Max, 4K Display, Security Token',
    onboarding_plan: 'Completed (90-Day Enterprise)',
    status: 'Active'
  },
  {
    id: 'ETH-EMP-002',
    full_name: 'Priyadharshini Kumar',
    email: 'priya.k@ethiroli.net',
    phone: '+91 98401 55667',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
    manager: 'Karthik Subramanian',
    joining_date: '2025-03-15',
    work_mode: 'On-site',
    ctc: '₹ 14,50,000 PA',
    bank_name: 'ICICI Bank (A/C: ****8812)',
    attendance_rate: 96,
    leaves_balance: 18,
    training_status: 'Completed (Microservices & Docker)',
    performance_rating: '4.7 / 5.0 (Strong Performer)',
    assets_assigned: 'Dell XPS 15, Multi-port Dock',
    onboarding_plan: 'Completed (30-Day Standard)',
    status: 'Active'
  },
  {
    id: 'ETH-EMP-003',
    full_name: 'Arunmozhi Varman',
    email: 'arun.v@ethiroli.net',
    phone: '+91 97900 88990',
    department: 'Product',
    designation: 'Product Manager',
    manager: 'Jeevananthan V (CEO)',
    joining_date: '2026-08-01',
    work_mode: 'Hybrid',
    ctc: '₹ 16,00,000 PA',
    bank_name: 'Axis Bank (A/C: ****2341)',
    attendance_rate: 94,
    leaves_balance: 20,
    training_status: 'In Progress (EdTech Analytics SOP)',
    performance_rating: '4.5 / 5.0 (On Track)',
    assets_assigned: 'ThinkPad X1 Carbon',
    onboarding_plan: 'Phase 3 - Production Ownership (60-Day)',
    status: 'Onboarding'
  },
  {
    id: 'ETH-EMP-004',
    full_name: 'Soundarya Raman',
    email: 'soundarya.r@gmail.com',
    phone: '+91 94441 33445',
    department: 'Design',
    designation: 'Lead UI/UX Designer',
    manager: 'Arunmozhi Varman',
    joining_date: '2026-10-15',
    work_mode: 'Hybrid',
    ctc: '₹ 12,00,000 PA',
    bank_name: 'Pending Verification',
    attendance_rate: 0,
    leaves_balance: 24,
    training_status: 'Scheduled',
    performance_rating: 'Pre-joining',
    assets_assigned: 'Pending Allocation',
    onboarding_plan: 'Assigned (30-Day Employee Plan)',
    status: 'Offer Accepted'
  },
  {
    id: 'ETH-EMP-005',
    full_name: 'Vigneshwaran P.',
    email: 'vignesh.p@ethiroli.net',
    phone: '+91 96000 77889',
    department: 'Engineering',
    designation: 'DevOps & Cloud Engineer',
    manager: 'Karthik Subramanian',
    joining_date: '2024-06-01',
    work_mode: 'Remote',
    ctc: '₹ 11,50,000 PA',
    bank_name: 'HDFC Bank (A/C: ****9012)',
    attendance_rate: 99,
    leaves_balance: 8,
    training_status: 'Completed (AWS Security)',
    performance_rating: '4.8 / 5.0 (Outstanding)',
    assets_assigned: 'MacBook Air M2',
    onboarding_plan: 'Completed',
    status: 'Active'
  }
];

export default function HREmployees() {
  const {
    data: fetchedEmployees,
    loading,
    error,
    search,
    setSearch,
    refresh,
  } = useHrData(
    listEmployees,
    undefined,
    async (id, data) => {
      await updateEmployee(id, data);
      await refresh();
    },
    async (id) => {
      await deleteEmployee(id);
      await refresh();
    },
    undefined
  );

  const [localEmployees, setLocalEmployees] = useState(INITIAL_EMPLOYEES_MOCK);
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('Overview');
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    manager: 'Karthik Subramanian',
    joining_date: new Date().toISOString().split('T')[0],
    work_mode: 'Hybrid',
    ctc: '₹ 8,00,000 PA',
    status: 'Offer Accepted'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const employeeList = useMemo(() => {
    if (Array.isArray(fetchedEmployees) && fetchedEmployees.length > 0) {
      return fetchedEmployees;
    }
    return localEmployees;
  }, [fetchedEmployees, localEmployees]);

  const departments = useMemo(() => {
    const set = new Set(employeeList.map(e => e.department).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [employeeList]);

  const filteredEmployees = useMemo(() => {
    return employeeList.filter((emp) => {
      const name = (emp.full_name || emp.name || '').toLowerCase();
      const desig = (emp.designation || emp.job_title || '').toLowerCase();
      const q = (search || '').toLowerCase();
      const matchesSearch = name.includes(q) || desig.includes(q) || (emp.id || '').toLowerCase().includes(q);
      const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
      const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employeeList, search, deptFilter, statusFilter]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newEmp = {
      id: `ETH-EMP-${Math.floor(100 + Math.random() * 900)}`,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      manager: formData.manager,
      joining_date: formData.joining_date,
      work_mode: formData.work_mode,
      ctc: formData.ctc,
      bank_name: 'Pending Submission',
      attendance_rate: 100,
      leaves_balance: 24,
      training_status: 'Onboarding Track Assigned',
      performance_rating: 'New Hire',
      assets_assigned: 'Requested',
      onboarding_plan: '30-Day Employee Plan',
      status: formData.status
    };

    setLocalEmployees([newEmp, ...localEmployees]);
    setShowAddModal(false);
    showToast(`Employee record for ${formData.full_name} created successfully!`);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: '',
      manager: 'Karthik Subramanian',
      joining_date: new Date().toISOString().split('T')[0],
      work_mode: 'Hybrid',
      ctc: '₹ 8,00,000 PA',
      status: 'Offer Accepted'
    });
  };

  const handleStatusTransition = (empId, newStatus) => {
    setLocalEmployees(prev =>
      prev.map(e => (e.id === empId ? { ...e, status: newStatus } : e))
    );
    if (selectedEmp && selectedEmp.id === empId) {
      setSelectedEmp(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Employee status updated to ${newStatus}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge bg-success">Active</span>;
      case 'Onboarding':
        return <span className="badge bg-primary">Onboarding</span>;
      case 'Offer Accepted':
      case 'Offer Sent':
      case 'Selected':
        return <span className="badge bg-info text-dark">{status}</span>;
      case 'Candidate':
        return <span className="badge bg-secondary">Candidate</span>;
      case 'Notice Period':
        return <span className="badge bg-warning text-dark">Notice Period</span>;
      case 'Exited':
        return <span className="badge bg-danger">Exited</span>;
      default:
        return <span className="badge bg-light text-dark">{status || '—'}</span>;
    }
  };

  const PROFILE_TABS = [
    'Overview',
    'Personal & Employment',
    'Attendance & Leaves',
    'Payroll & Compensation',
    'Training & Performance',
    'Assets & Requests',
    'Onboarding & Exit'
  ];

  return (
    <AdminPage
      title="Employee Lifecycle Directory"
      subtitle="Complete lifecycle management: Candidate → Onboarding → Active → Exit with comprehensive 360° HR profiles"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-1" /> Add Employee
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

        {/* Lifecycle Flow Navigator */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Employee Lifecycle Progression (Ethiroli HR Standard)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {EMPLOYEE_STATUSES.filter(s => s !== 'ALL').map((stage, idx, arr) => (
                <React.Fragment key={stage}>
                  <div
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: statusFilter === stage ? '#1e293b' : '#ffffff',
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
              placeholder="Search by employee name, ID, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {departments.map(d => <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {EMPLOYEE_STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Lifecycle Stages' : s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Employees Directory ({filteredEmployees.length})</h3>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredEmployees.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-people" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No employees found</h4>
                <p style={{ color: '#64748b' }}>Try changing the search keywords or filters.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name & Designation</th>
                      <th>Department</th>
                      <th>Reporting Manager</th>
                      <th>Joining Date</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td><span className="badge bg-light text-dark font-monospace">{emp.id}</span></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{emp.full_name || emp.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{emp.designation || emp.job_title}</div>
                        </td>
                        <td>{emp.department}</td>
                        <td>{emp.manager || 'Leadership'}</td>
                        <td>{emp.joining_date}</td>
                        <td><span className="badge bg-light text-dark border">{emp.work_mode || 'Hybrid'}</span></td>
                        <td>{getStatusBadge(emp.status)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedEmp(emp);
                              setActiveProfileTab('Overview');
                              setShowDetailModal(true);
                            }}
                          >
                            <i className="bi bi-person-badge me-1" /> View 360° Profile
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

        {/* 360° Employee Profile Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Employee 360° Profile — ${selectedEmp?.full_name || selectedEmp?.name}`}
        >
          {selectedEmp && (
            <div>
              {/* Header card */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                  <h4 className="mb-1 fw-bold">{selectedEmp.full_name || selectedEmp.name}</h4>
                  <div className="text-muted small">
                    {selectedEmp.designation} • {selectedEmp.department} • <span className="font-monospace">{selectedEmp.id}</span>
                  </div>
                </div>
                <div>{getStatusBadge(selectedEmp.status)}</div>
              </div>

              {/* Tabs */}
              <div className="nav nav-pills mb-3 gap-1" style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px' }}>
                {PROFILE_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`btn btn-sm ${activeProfileTab === tab ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => setActiveProfileTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-3 bg-light rounded border mb-3">
                {activeProfileTab === 'Overview' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Work Email</small>
                      <strong>{selectedEmp.email}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Phone Number</small>
                      <strong>{selectedEmp.phone}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Reporting Manager</small>
                      <strong>{selectedEmp.manager}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Compensation (Annual CTC)</small>
                      <strong className="text-success">{selectedEmp.ctc}</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Attendance Track</small>
                      <strong>{selectedEmp.attendance_rate}% Present</strong>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Performance Rating</small>
                      <strong>{selectedEmp.performance_rating}</strong>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'Personal & Employment' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Department</small>
                      <div>{selectedEmp.department}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Designation</small>
                      <div>{selectedEmp.designation}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Joining Date</small>
                      <div>{selectedEmp.joining_date}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Work Mode</small>
                      <div>{selectedEmp.work_mode}</div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'Attendance & Leaves' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Monthly Attendance Score</small>
                      <h5 className="text-success mt-1">{selectedEmp.attendance_rate}%</h5>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Available Leave Balance</small>
                      <h5 className="text-primary mt-1">{selectedEmp.leaves_balance} Days</h5>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'Payroll & Compensation' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Cost to Company (CTC)</small>
                      <h5 className="text-success mt-1">{selectedEmp.ctc}</h5>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Salary Credit Account</small>
                      <div className="mt-1">{selectedEmp.bank_name}</div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'Training & Performance' && (
                  <div className="row g-3">
                    <div className="col-md-12">
                      <small className="text-muted d-block">Assigned HR Training</small>
                      <div>{selectedEmp.training_status}</div>
                    </div>
                    <div className="col-md-12">
                      <small className="text-muted d-block">Latest Review Evaluation</small>
                      <div className="fw-bold text-primary">{selectedEmp.performance_rating}</div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'Assets & Requests' && (
                  <div className="row g-3">
                    <div className="col-md-12">
                      <small className="text-muted d-block">Allocated Hardware / Assets</small>
                      <div>{selectedEmp.assets_assigned}</div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'Onboarding & Exit' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Onboarding Plan</small>
                      <div>{selectedEmp.onboarding_plan}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Exit Status</small>
                      <div>{selectedEmp.status === 'Notice Period' || selectedEmp.status === 'Exited' ? selectedEmp.status : 'Active Employee (No Exit Request)'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Transition Bar */}
              <div className="mb-3">
                <div className="small fw-bold text-muted mb-2">TRANSITION LIFECYCLE STATUS:</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {EMPLOYEE_STATUSES.filter(s => s !== 'ALL').map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedEmp.status === st ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => handleStatusTransition(selectedEmp.id, st)}
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

        {/* Add Employee Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Employee (Full Lifecycle Record)"
        >
          <form onSubmit={handleCreateSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Arunmozhi Varman"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="arun@ethiroli.net"
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
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Reporting Manager</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.joining_date}
                  onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Work Mode</label>
                <select
                  className="form-select"
                  value={formData.work_mode}
                  onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Annual CTC</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ₹ 12,00,000 PA"
                  value={formData.ctc}
                  onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Employee Record</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}