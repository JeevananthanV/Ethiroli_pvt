import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listStudents, createStudent, updateStudent } from '../../../../services/api/hrApi.standardized.js';

const STUDENT_STATUSES = [
  'ALL',
  'Lead',
  'Enquiry',
  'Registered',
  'Payment',
  'Enrolled',
  'Training',
  'Completed',
  'Certificate'
];

const PAYMENT_STATUSES = ['ALL', 'PAID', 'PARTIAL', 'PENDING', 'OVERDUE'];

const DEFAULT_COURSES = [
  'Full Stack Web Development (MERN)',
  'Python Data Science & AI',
  'Cloud DevOps & AWS Architect',
  'UI/UX Design Masterclass',
  'Java Spring Boot Microservices',
  'Digital Marketing & Growth Strategy'
];

const INITIAL_STUDENTS_MOCK = [
  {
    id: 'STU-101',
    name: 'Aishwarya Rajesh',
    email: 'aishwarya.r@ethiroli.edu',
    phone: '+91 98401 23456',
    course: 'Full Stack Web Development (MERN)',
    enrolled_date: '2026-08-15',
    duration: '6 Months',
    payment_status: 'PAID',
    progress_percentage: 82,
    attendance_rate: 94,
    tutor: 'Karthik Subramanian',
    certificate_status: 'In Progress',
    status: 'Training'
  },
  {
    id: 'STU-102',
    name: 'Gowtham Chandran',
    email: 'gowtham.c@ethiroli.edu',
    phone: '+91 97902 34567',
    course: 'Python Data Science & AI',
    enrolled_date: '2026-07-01',
    duration: '4 Months',
    payment_status: 'PAID',
    progress_percentage: 100,
    attendance_rate: 98,
    tutor: 'Dr. Meenakshi Sundaram',
    certificate_status: 'Issued',
    status: 'Certificate'
  },
  {
    id: 'STU-103',
    name: 'Sneha Mohan',
    email: 'sneha.m@ethiroli.edu',
    phone: '+91 94443 89012',
    course: 'Cloud DevOps & AWS Architect',
    enrolled_date: '2026-09-10',
    duration: '6 Months',
    payment_status: 'PARTIAL',
    progress_percentage: 35,
    attendance_rate: 88,
    tutor: 'Vigneshwaran P.',
    certificate_status: 'Pending',
    status: 'Training'
  },
  {
    id: 'STU-104',
    name: 'Balaji Venkatesh',
    email: 'balaji.v@gmail.com',
    phone: '+91 98845 67890',
    course: 'UI/UX Design Masterclass',
    enrolled_date: '2026-09-22',
    duration: '3 Months',
    payment_status: 'PENDING',
    progress_percentage: 0,
    attendance_rate: 0,
    tutor: 'Pooja Krishnan',
    certificate_status: 'Not Eligible',
    status: 'Payment'
  },
  {
    id: 'STU-105',
    name: 'Deepika Senthil',
    email: 'deepika.s@outlook.com',
    phone: '+91 96001 12233',
    course: 'Java Spring Boot Microservices',
    enrolled_date: '2026-09-28',
    duration: '5 Months',
    payment_status: 'PAID',
    progress_percentage: 12,
    attendance_rate: 100,
    tutor: 'Senthil Nathan',
    certificate_status: 'In Progress',
    status: 'Enrolled'
  },
  {
    id: 'STU-106',
    name: 'Hariharan Natarajan',
    email: 'hariharan.n@gmail.com',
    phone: '+91 98410 99887',
    course: 'Full Stack Web Development (MERN)',
    enrolled_date: '2026-06-15',
    duration: '6 Months',
    payment_status: 'PAID',
    progress_percentage: 100,
    attendance_rate: 96,
    tutor: 'Karthik Subramanian',
    certificate_status: 'Verified & Issued',
    status: 'Completed'
  }
];

export default function HRStudents() {
  const {
    data: fetchedStudents,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    listStudents,
    undefined,
    async (id, data) => {
      await updateStudent(id, data);
      await refresh();
    },
    undefined,
    undefined
  );

  const [localStudents, setLocalStudents] = useState(INITIAL_STUDENTS_MOCK);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: DEFAULT_COURSES[0],
    duration: '6 Months',
    payment_status: 'PAID',
    tutor: 'Karthik Subramanian',
    status: 'Enrolled',
    enrolled_date: new Date().toISOString().split('T')[0]
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const studentList = useMemo(() => {
    if (Array.isArray(fetchedStudents) && fetchedStudents.length > 0) {
      return fetchedStudents;
    }
    return localStudents;
  }, [fetchedStudents, localStudents]);

  const filteredStudents = useMemo(() => {
    return studentList.filter((stu) => {
      const q = (search || '').toLowerCase();
      const matchSearch =
        (stu.name || '').toLowerCase().includes(q) ||
        (stu.email || '').toLowerCase().includes(q) ||
        (stu.id || '').toLowerCase().includes(q) ||
        (stu.course || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || (stu.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchPayment = paymentFilter === 'ALL' || (stu.payment_status || '').toUpperCase() === paymentFilter.toUpperCase();
      const matchCourse = selectedCourse === 'ALL' || stu.course === selectedCourse;

      return matchSearch && matchStatus && matchPayment && matchCourse;
    });
  }, [studentList, search, statusFilter, paymentFilter, selectedCourse]);

  const handleCreateStudentSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      id: `STU-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      enrolled_date: formData.enrolled_date,
      duration: formData.duration,
      payment_status: formData.payment_status,
      progress_percentage: 0,
      attendance_rate: 100,
      tutor: formData.tutor,
      certificate_status: 'Pending',
      status: formData.status
    };

    setLocalStudents(prev => [newStudent, ...prev]);
    setShowAddModal(false);
    showToast(`Student ${formData.name} enrolled successfully!`);
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: DEFAULT_COURSES[0],
      duration: '6 Months',
      payment_status: 'PAID',
      tutor: 'Karthik Subramanian',
      status: 'Enrolled',
      enrolled_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleStatusProgress = (studentId, nextStatus) => {
    setLocalStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: nextStatus } : s))
    );
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(prev => ({ ...prev, status: nextStatus }));
    }
    showToast(`Status updated to ${nextStatus}`);
  };

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'certificate':
      case 'completed':
        return 'badge bg-success';
      case 'training':
      case 'enrolled':
        return 'badge bg-primary';
      case 'payment':
      case 'registered':
        return 'badge bg-warning text-dark';
      case 'lead':
      case 'enquiry':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark';
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch ((paymentStatus || '').toUpperCase()) {
      case 'PAID':
        return <span className="badge bg-success">PAID</span>;
      case 'PARTIAL':
        return <span className="badge bg-info text-dark">PARTIAL</span>;
      case 'PENDING':
        return <span className="badge bg-warning text-dark">PENDING</span>;
      case 'OVERDUE':
        return <span className="badge bg-danger">OVERDUE</span>;
      default:
        return <span className="badge bg-secondary">{paymentStatus || '—'}</span>;
    }
  };

  return (
    <AdminPage
      title="Student Operations & Course Enrollees"
      subtitle="HR oversight for student lifecycles, admission verification, payment status, and certification"
      loading={loading}
      error={error}
      onRetry={refresh}
      actions={
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-person-plus me-1" /> Enroll Student
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div
            style={{
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        {/* Workflow Lifecycle Ribbon */}
        <div className="card mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="cardBody" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Student Lifecycle Flow (HR Admissions & Certification Pipeline)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['Lead', 'Enquiry', 'Registered', 'Payment', 'Enrolled', 'Training', 'Completed', 'Certificate'].map((step, idx, arr) => (
                <React.Fragment key={step}>
                  <div
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: statusFilter === step ? '#4338ca' : '#ffffff',
                      color: statusFilter === step ? '#ffffff' : '#334155',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => setStatusFilter(statusFilter === step ? 'ALL' : step)}
                  >
                    {idx + 1}. {step}
                  </div>
                  {idx < arr.length - 1 && <i className="bi bi-arrow-right text-muted" style={{ fontSize: '0.8rem' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by student name, ID, course, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ borderRadius: '0.5rem', border: '1px solid #cbd5e1', padding: '0.55rem 0.85rem' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px', borderRadius: '0.5rem' }}
          >
            {STUDENT_STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Lifecycle Stages' : s}</option>)}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px', borderRadius: '0.5rem' }}
          >
            {PAYMENT_STATUSES.map(p => <option key={p} value={p}>{p === 'ALL' ? 'All Payment Statuses' : p}</option>)}
          </select>
        </div>

        {/* Students Table */}
        <div className="card">
          <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="cardTitle">Enrolled Students ({filteredStudents.length})</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Note: HR tracks lifecycle & certification; LMS portal handles curriculum delivery.
            </span>
          </div>
          <div className="cardBody" style={{ padding: 0 }}>
            {filteredStudents.length === 0 ? (
              <div className="emptyState" style={{ padding: '3rem', textAlign: 'center' }}>
                <i className="bi bi-mortarboard" style={{ fontSize: '2.5rem', color: '#94a3b8' }} />
                <h4 style={{ marginTop: '1rem' }}>No students found</h4>
                <p style={{ color: '#64748b' }}>Try clearing filters or enrolling a new student into a course.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name & Contact</th>
                      <th>Course Enrolled</th>
                      <th>Duration</th>
                      <th>Payment</th>
                      <th>Progress</th>
                      <th>Attendance</th>
                      <th>Assigned Tutor</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((stu) => (
                      <tr key={stu.id}>
                        <td><span className="badge bg-light text-dark font-monospace">{stu.id}</span></td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{stu.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{stu.email} • {stu.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{stu.course}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Enrolled: {stu.enrolled_date}</div>
                        </td>
                        <td>{stu.duration}</td>
                        <td>{getPaymentBadge(stu.payment_status)}</td>
                        <td style={{ minWidth: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                            <span>LMS Sync</span>
                            <span>{stu.progress_percentage || 0}%</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${stu.progress_percentage || 0}%` }}
                            />
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: stu.attendance_rate >= 85 ? '#16a34a' : '#d97706' }}>
                            {stu.attendance_rate}%
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{stu.tutor || 'Unassigned'}</div>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(stu.status)}>{stu.status}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="View Full Student Profile"
                              onClick={() => {
                                setSelectedStudent(stu);
                                setShowDetailModal(true);
                              }}
                            >
                              <i className="bi bi-eye" /> Profile
                            </button>
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

        {/* Enroll Student Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Enroll New Student (HR Course Admission)"
        >
          <form onSubmit={handleCreateStudentSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Priyadharshini K."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="priya@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number *</label>
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
                <label className="form-label">Course Enrolled *</label>
                <select
                  className="form-select"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  {DEFAULT_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Duration</label>
                <select
                  className="form-select"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  <option value="3 Months">3 Months</option>
                  <option value="4 Months">4 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Payment Status</label>
                <select
                  className="form-select"
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                >
                  <option value="PAID">PAID</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Assigned Tutor</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tutor}
                  onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Initial Lifecycle Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Registered">Registered</option>
                  <option value="Payment">Payment</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Training">Training</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Enrollment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.enrolled_date}
                  onChange={(e) => setFormData({ ...formData, enrolled_date: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Complete Enrollment</button>
            </div>
          </form>
        </Modal>

        {/* Student Profile & Lifecycle Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Student Profile — ${selectedStudent?.name || 'Student'}`}
        >
          {selectedStudent && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>{selectedStudent.name}</h4>
                  <span className="badge bg-secondary font-monospace">{selectedStudent.id}</span>
                </div>
                <div>
                  {getPaymentBadge(selectedStudent.payment_status)}
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Course</div>
                  <div style={{ fontWeight: 600 }}>{selectedStudent.course}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned Tutor</div>
                  <div style={{ fontWeight: 600 }}>{selectedStudent.tutor || 'Unassigned'}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Contact Details</div>
                  <div>{selectedStudent.email}</div>
                  <div>{selectedStudent.phone}</div>
                </div>
                <div className="col-md-6">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Course Duration & Start</div>
                  <div>{selectedStudent.duration} (Started {selectedStudent.enrolled_date})</div>
                </div>
              </div>

              {/* Progress & Certification */}
              <div className="card mb-4" style={{ background: '#f8fafc' }}>
                <div className="cardBody" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>LMS Curriculum Completion</span>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>{selectedStudent.progress_percentage}%</span>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${selectedStudent.progress_percentage}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                    <span>Attendance: <strong>{selectedStudent.attendance_rate}%</strong></span>
                    <span>Certificate Status: <strong>{selectedStudent.certificate_status}</strong></span>
                  </div>
                </div>
              </div>

              {/* Lifecycle Stage Controller */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Update Lifecycle Stage:</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['Lead', 'Enquiry', 'Registered', 'Payment', 'Enrolled', 'Training', 'Completed', 'Certificate'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedStudent.status === st ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleStatusProgress(selectedStudent.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminPage>
  );
}
